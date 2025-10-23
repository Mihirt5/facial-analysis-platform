"use client";

// Adapter to run the Parallel Labs analysis.js with a simple React UI.
// - Uses centralized TensorFlow loader to prevent multiple loadings
// - Loads /parallellabs/analysis.js (served from public)
// - Estimates landmarks, builds Criteria via analyseCriteria(), and maps to table rows

import { ensureTensorFlow, ensureFaceLandmarksDetection, ensureAnalysisScript } from './tensorflow-loader';

export type StatusLevel =
  | "perfect"
  | "slight"
  | "noticeable"
  | "significant"
  | "horrible"
  | "extreme";

export interface AnalysisResultRow {
  feature: string;
  rating: string;
  measurement: string;
  ideal: string;
  status: StatusLevel;
}

declare global {
  interface Window {
    tf?: any;
    faceLandmarksDetection?: any;
    analyseCriteria?: any;
    database?: any;
    facemesh?: any;
  }
}

async function ensureDeps(): Promise<void> {
  // Use centralized loader to prevent multiple TensorFlow loadings
  await ensureTensorFlow({ backend: 'cpu', preferLocal: true });
  await ensureFaceLandmarksDetection();
  await ensureAnalysisScript();
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    console.log("Loading image from URL:", url);
    
    // Validate URL
    if (!url || typeof url !== 'string') {
      reject(new Error(`Invalid image URL: ${url}`));
      return;
    }
    
    // Check if URL is accessible
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('data:') && !url.startsWith('blob:')) {
      console.warn("URL doesn't start with expected protocol:", url);
    }
    
    // For blob URLs, check if they're still valid
    if (url.startsWith('blob:')) {
      console.log("Loading blob URL:", url);
      // Test if the blob URL is still valid by creating a test image
      const testImg = new Image();
      testImg.onload = () => {
        console.log("Blob URL is valid, proceeding with main image load");
        testImg.src = ''; // Clear test image
        loadMainImage();
      };
      testImg.onerror = () => {
        console.error("Blob URL is invalid or expired:", url);
        reject(new Error(`Blob URL is invalid or expired: ${url}`));
      };
      testImg.src = url;
      return;
    }
    
    loadMainImage();
    
    function loadMainImage() {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        console.log("Image loaded successfully:", url);
        resolve(img);
      };
      img.onerror = (error) => {
        console.error("Failed to load image:", url, error);
        reject(new Error(`Failed to load image: ${url}`));
      };
      img.src = url;
    }
  });
}

function stripHtml(html: string): string {
  const div = document.createElement("div");
  div.innerHTML = html || "";
  return (div.textContent || div.innerText || "").trim();
}

function statusFromAssessment(html: string): { status: StatusLevel; rating: string } {
  const text = stripHtml(html);
  if (/perfect/.test(html)) {
    return { status: "perfect", rating: text };
  }
  const match = html.match(/deviation-(\d)/);
  if (match && match[1]) {
    const n = parseInt(match[1], 10);
    const map: Record<number, StatusLevel> = {
      0: "slight",
      1: "noticeable",
      2: "significant",
      3: "horrible",
      4: "extreme",
    };
    return { status: map[n] ?? "noticeable", rating: text };
  }
  return { status: "noticeable", rating: text || "needs review" };
}

const FEATURE_LABELS: Record<string, string> = {
  midfaceRatio: "Midface ratio",
  facialWidthToHeightRatio: "Facial width to height ratio",
  chinToPhiltrumRatio: "Chin to philtrum ratio",
  canthalTilt: "Canthal tilt",
  mouthToNoseRatio: "Mouth to nose ratio",
  bigonialWidth: "Bigonial width",
  lipRatio: "Lip ratio",
  eyeSeparationRatio: "Eye separation ratio",
  eyeToMouthAngle: "Eye to mouth angle",
  lowerThirdHeight: "Lower third height",
  palpebralFissureLength: "Palpebral fissure length",
  eyeColor: "Eye color",
};

const orderedKeys = [
  "midfaceRatio",
  "facialWidthToHeightRatio",
  "chinToPhiltrumRatio",
  "canthalTilt",
  "mouthToNoseRatio",
  "bigonialWidth",
  "lipRatio",
  "eyeSeparationRatio",
  "eyeToMouthAngle",
  "lowerThirdHeight",
  "palpebralFissureLength",
];

function buildRowsFromCriteria(criteria: any): AnalysisResultRow[] {
  const rows: AnalysisResultRow[] = [];
  const STRICT: Record<string, { min?: number; max?: number }> = {
    'Facial width to height ratio': { min: 2.0, max: 2.2 },
    'Lower third height': { min: 1.2, max: 1.45 },
    'Lip ratio': { min: 1.55, max: 1.65 },
  };
  for (const key of orderedKeys) {
    const metric = (criteria as any)[key];
    if (!metric) continue;
    try {
      metric.calculate();
      const measurement = String(metric.render());
      const ideal = String(metric.ideal());
      const assessmentHtml = String(metric.assess());
      const { status, rating } = statusFromAssessment(assessmentHtml);
      let row: AnalysisResultRow = {
        feature: FEATURE_LABELS[key] || key,
        rating,
        measurement,
        ideal,
        status,
      };

      // Apply stricter caps for selected features (display + summary only)
      const override = STRICT[row.feature];
      if (override) {
        const m = parseFloat((row.measurement || '').toString().replace(/[^0-9.+-]/g, ''));
        if (!isNaN(m)) {
          if (override.min !== undefined && override.max !== undefined) {
            if (m >= override.min && m <= override.max) {
              row.status = 'perfect';
              row.rating = 'perfect';
            } else if (m < override.min) {
              row.status = 'noticeable';
              row.rating = 'below ideal';
            } else if (m > override.max) {
              row.status = 'noticeable';
              row.rating = 'above ideal';
            }
          } else if (override.min !== undefined) {
            if (m >= override.min) {
              row.status = 'perfect';
              row.rating = 'perfect';
            } else {
              row.status = 'noticeable';
              row.rating = 'below ideal';
            }
          } else if (override.max !== undefined) {
            if (m <= override.max) {
              row.status = 'perfect';
              row.rating = 'perfect';
            } else {
              row.status = 'noticeable';
              row.rating = 'above ideal';
            }
          }
        }
      }

      rows.push(row);
    } catch (e) {
      rows.push({
        feature: FEATURE_LABELS[key] || key,
        rating: "not available",
        measurement: "-",
        ideal: "-",
        status: "noticeable",
      });
    }
  }
  return rows;
}

function summarizeRows(rows: AnalysisResultRow[]) {
  const counts = rows.reduce(
    (acc, r) => {
      if (r.status === "perfect") acc.perfect++;
      else if (r.status === "slight") acc.deviation0++;
      else if (r.status === "noticeable") acc.deviation1++;
      else if (r.status === "significant") acc.deviation2++;
      else if (r.status === "horrible") acc.deviation3++;
      else if (r.status === "extreme") acc.deviation4++;
      return acc;
    },
    { perfect: 0, deviation0: 0, deviation1: 0, deviation2: 0, deviation3: 0, deviation4: 0 }
  );
  const weights = { perfect: 1, deviation0: 0, deviation1: -1, deviation2: -2, deviation3: -3, deviation4: -4 } as const;
  const totalScore =
    counts.perfect * weights.perfect +
    counts.deviation0 * weights.deviation0 +
    counts.deviation1 * weights.deviation1 +
    counts.deviation2 * weights.deviation2 +
    counts.deviation3 * weights.deviation3 +
    counts.deviation4 * weights.deviation4;
  const maxScore = Math.max(1, rows.length * weights.perfect);
  const normalized = Math.max(0, Math.min(8, Math.round((totalScore / maxScore) * 9)));
  const psl = `PSL${normalized}`;
  return { counts, psl };
}

export async function analyzeAndPrepare(imageUrl: string): Promise<{ rows: (AnalysisResultRow[] & { __summary?: any }); prepared: { image: HTMLImageElement; criteria: any; points: any } }> {
  console.log("analyzeAndPrepare called with imageUrl:", imageUrl);
  await ensureDeps();
  const fld = window.faceLandmarksDetection;
  if (!fld) {
    throw new Error("face-landmarks-detection failed to load. Check network or local /parallellabs/face-landmarks-detection.js");
  }
  let model: any = null;
  if (typeof (fld as any).load === "function") {
    const pkg = (
      (fld as any).SupportedPackages?.mediapipeFacemesh ||
      (fld as any).SupportedPackages && Object.values((fld as any).SupportedPackages)[0] ||
      (fld as any).SupportedModels?.MediaPipeFaceMesh ||
      (fld as any).SupportedModels && Object.values((fld as any).SupportedModels)[0]
    );
    if (!pkg) {
      throw new Error("face-landmarks-detection: package enum not found (SupportedPackages/SupportedModels)");
    }
    model = await (fld as any).load(pkg, { maxFaces: 1 });
  } else if (typeof (fld as any).createDetector === "function") {
    const mdl = (
      (fld as any).SupportedModels?.MediaPipeFaceMesh ||
      (fld as any).SupportedModels && Object.values((fld as any).SupportedModels)[0]
    );
    if (!mdl) {
      throw new Error("face-landmarks-detection: SupportedModels not available for createDetector");
    }
    model = await (fld as any).createDetector(mdl, { runtime: 'tfjs', maxFaces: 1 } as any);
  } else if ((window as any).facemesh?.load) {
    const fm = await (window as any).facemesh.load();
    model = {
      estimateFaces: ({ input }: { input: HTMLImageElement | HTMLCanvasElement }) => fm.estimateFaces(input),
    };
    console.warn("Using legacy @tensorflow-models/facemesh fallback API");
  } else {
    throw new Error("face-landmarks-detection API not recognized (no load/createDetector). Check that the correct UMD is loaded.");
  }
  const img = await loadImage(imageUrl);
  let predictions: any = null;
  try {
    predictions = await (model as any).estimateFaces({ input: img });
  } catch (e1) {
    try {
      predictions = await (model as any).estimateFaces(img);
    } catch (e2) {
      throw e1;
    }
  }
  if (!Array.isArray(predictions) || predictions.length === 0) throw new Error("No face detected");
  const face = predictions[0];
  const [points, criteria] = (window as any).analyseCriteria(face);
  const rows = buildRowsFromCriteria(criteria) as AnalysisResultRow[] & { __summary?: any };
  rows.__summary = summarizeRows(rows);
  return { rows, prepared: { image: img, criteria, points } };
}

export async function analyzeSingleImage(imageUrl: string): Promise<AnalysisResultRow[] & { __summary?: any }> {
  const { rows } = await analyzeAndPrepare(imageUrl);
  return rows;
}

export function drawOverlays(
  canvas: HTMLCanvasElement,
  prepared: { image: HTMLImageElement; criteria: any },
  opts?: {
    group?: 'all' | 'eyes' | 'nose' | 'jaw';
    accent?: string;
    opacity?: number;
    scheme?: { eyes: string; nose: string; jaw: string; other: string };
  }
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const img = prepared.image;
  canvas.width = img.width;
  canvas.height = img.height;
  // Base image
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);

  // Dynamic stroke width and marker radius
  const area = img.width * img.height;
  const lineW = Math.max(1, Math.sqrt(area / 100000));

  // Offscreen buffer for overlay drawing
  const overlay = document.createElement('canvas');
  overlay.width = canvas.width;
  overlay.height = canvas.height;
  const octx = overlay.getContext('2d');
  if (!octx) return;
  (octx as any).lineWidth = lineW;
  (octx as any).arcRadius = lineW;

  // analysis.js uses global `canvas` in its draw(); point it at the overlay
  const prevCanvas = (window as any).canvas;
  (window as any).canvas = overlay;

  const group = opts?.group || 'all';
  const accent = opts?.accent || '#0ea5e9';
  const opacity = typeof opts?.opacity === 'number' ? opts!.opacity! : 0.9;
  const scheme = opts?.scheme || { eyes: '#f59e0b', nose: '#111827', jaw: '#0ea5e9', other: '#94a3b8' };

  const inGroup = (key: string) => {
    if (group === 'all') return true;
    const k = key.toLowerCase();
    if (group === 'eyes') return /eye|canthal|palpebral/.test(k);
    if (group === 'nose') return /nose|mouth|lip/.test(k);
    if (group === 'jaw') return /chin|jaw|bigonial|lower third/.test(k);
    return true;
  };

  // Helper to map metric key to group bucket
  const keyToGroup = (key: string): 'eyes'|'nose'|'jaw'|'other' => {
    const k = key.toLowerCase();
    if (/eye|canthal|palpebral/.test(k)) return 'eyes';
    if (/nose|mouth|lip/.test(k)) return 'nose';
    if (/chin|jaw|bigonial|lower third/.test(k)) return 'jaw';
    return 'other';
  };

  const groups: Array<'eyes'|'nose'|'jaw'|'other'> = ['eyes','nose','jaw','other'];
  for (const g of groups) {
    if (group !== 'all' && group !== g) continue;
    // draw this group's metrics into buffer
    octx.clearRect(0, 0, overlay.width, overlay.height);
    for (const key of orderedKeys) {
      if (keyToGroup(key) !== g) continue;
      const metric = prepared.criteria[key];
      if (metric && typeof metric.draw === 'function') {
        try { metric.draw(octx); } catch {}
      }
    }
    // tint and composite
    octx.globalCompositeOperation = 'source-in';
    octx.fillStyle = (scheme as any)[g] || accent;
    octx.globalAlpha = opacity;
    octx.fillRect(0, 0, overlay.width, overlay.height);
    octx.globalAlpha = 1;
    octx.globalCompositeOperation = 'source-over';
    ctx.drawImage(overlay, 0, 0);
  }
  (window as any).canvas = prevCanvas;
}

// --- Side-profile metric helpers ---
type Point = [number, number];
function toPt(p: any): Point { return [p[0], p[1]] as Point; }
function vSub(a: Point, b: Point): Point { return [a[0]-b[0], a[1]-b[1]]; }
function vLen(a: Point): number { return Math.hypot(a[0], a[1]); }
function vDot(a: Point, b: Point): number { return a[0]*b[0] + a[1]*b[1]; }
function angleBetween(a: Point, b: Point): number {
  const la = vLen(a), lb = vLen(b); if (!la||!lb) return 0;
  const cos = Math.min(1, Math.max(-1, vDot(a,b)/(la*lb)));
  return (Math.acos(cos) * 180) / Math.PI;
}
function lineThrough(a: Point, b: Point) { return { a, b }; }
function signedDistToLine(p: Point, line: {a:Point,b:Point}): number {
  const [x0,y0]=p, [x1,y1]=line.a, [x2,y2]=line.b;
  const num = (y2 - y1)*x0 - (x2 - x1)*y0 + x2*y1 - y2*x1;
  const den = Math.hypot(y2 - y1, x2 - x1) || 1;
  return num/den;
}
export function computeProfileMetrics(face: any) {
  const pronasale = toPt(face.annotations.noseTip?.[0] || face.annotations.noseBottom?.[0]);
  const subnasale = toPt(face.annotations.noseBottom?.[0] || face.annotations.noseTip?.[0]);
  const upperLipMid = toPt(face.annotations.lipsUpperOuter?.[5] || face.annotations.lipsUpperInner?.[5]);
  const lowerLipMid = toPt(face.annotations.lipsLowerOuter?.[4] || face.annotations.lipsLowerInner?.[5]);
  const chinTip = toPt(face.annotations.silhouette?.[18] || face.annotations.silhouette?.[17] || face.annotations.silhouette?.[19]);
  const gonial = toPt(face.annotations.silhouette?.[24] || face.annotations.silhouette?.[12] || chinTip);
  const glabella = toPt(face.annotations.midwayBetweenEyes?.[0] || upperLipMid);

  const colVec = vSub(pronasale, subnasale);
  const ulVec = vSub(upperLipMid, subnasale);
  const nasolabialAngle = angleBetween(colVec, ulVec);

  const toLip = vSub(upperLipMid, lowerLipMid);
  const toChin = vSub(chinTip, lowerLipMid);
  const mentolabialAngle = angleBetween(toLip, toChin);

  const eLine = lineThrough(pronasale, chinTip);
  const eUL = signedDistToLine(upperLipMid, eLine);
  const eLL = signedDistToLine(lowerLipMid, eLine);

  const jawLine = vSub(chinTip, gonial);
  const jawlineAngle = Math.abs(Math.atan2(jawLine[1], jawLine[0]) * 180/Math.PI);

  const a = vSub(glabella, subnasale);
  const b = vSub(chinTip, subnasale);
  const convexityAngle = angleBetween(a,b);

  return {
    nasolabialAngle: Math.round(nasolabialAngle),
    mentolabialAngle: Math.round(mentolabialAngle),
    eLineUpperLip: Math.round(eUL),
    eLineLowerLip: Math.round(eLL),
    jawlineAngle: Math.round(jawlineAngle),
    convexityAngle: Math.round(convexityAngle),
    keypoints: { pronasale, subnasale, upperLipMid, lowerLipMid, chinTip, gonial },
  };
}

export function drawProfileOverlays(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  pm: ReturnType<typeof computeProfileMetrics>,
  opts?: { accent?: string; opacity?: number }
) {
  const ctx = canvas.getContext('2d'); if (!ctx) return;
  canvas.width = image.width; canvas.height = image.height;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.drawImage(image, 0, 0);
  const area = image.width*image.height; const lineW = Math.max(1, Math.sqrt(area/100000));
  ctx.lineWidth = lineW; ctx.globalAlpha = typeof opts?.opacity==='number'? opts!.opacity!: 0.9;
  ctx.strokeStyle = opts?.accent || '#0ea5e9'; ctx.fillStyle = ctx.strokeStyle;

  // E-line
  ctx.beginPath(); ctx.moveTo(pm.keypoints.pronasale[0], pm.keypoints.pronasale[1]);
  ctx.lineTo(pm.keypoints.chinTip[0], pm.keypoints.chinTip[1]); ctx.stroke();

  // Nasolabial angle arc at subnasale
  const sn = pm.keypoints.subnasale;
  const v1 = Math.atan2(pm.keypoints.pronasale[1]-sn[1], pm.keypoints.pronasale[0]-sn[0]);
  const v2 = Math.atan2(pm.keypoints.upperLipMid[1]-sn[1], pm.keypoints.upperLipMid[0]-sn[0]);
  ctx.beginPath(); ctx.arc(sn[0], sn[1], 25*lineW, Math.min(v1,v2), Math.max(v1,v2)); ctx.stroke();

  // Jawline
  ctx.beginPath(); ctx.moveTo(pm.keypoints.gonial[0], pm.keypoints.gonial[1]);
  ctx.lineTo(pm.keypoints.chinTip[0], pm.keypoints.chinTip[1]); ctx.stroke();

  // Mentolabial angle arc at lower lip mid
  const lm = pm.keypoints.lowerLipMid;
  const m1 = Math.atan2(pm.keypoints.upperLipMid[1]-lm[1], pm.keypoints.upperLipMid[0]-lm[0]);
  const m2 = Math.atan2(pm.keypoints.chinTip[1]-lm[1], pm.keypoints.chinTip[0]-lm[0]);
  ctx.beginPath(); ctx.arc(lm[0], lm[1], 20*lineW, Math.min(m1,m2), Math.max(m1,m2)); ctx.stroke();

  // Keypoints markers
  const pts = [pm.keypoints.pronasale, sn, pm.keypoints.upperLipMid, pm.keypoints.lowerLipMid, pm.keypoints.chinTip, pm.keypoints.gonial];
  for (const p of pts) { ctx.beginPath(); ctx.arc(p[0], p[1], 2.2*lineW, 0, Math.PI*2); ctx.fill(); }
  ctx.globalAlpha = 1;
}
