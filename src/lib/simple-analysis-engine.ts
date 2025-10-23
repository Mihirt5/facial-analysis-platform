"use client";

// Lightweight client-side engine to analyze a single face photo.
// Implements the same geometric measurements used in TestAnalysis/analysis.js
// but packaged for use inside the Next.js page without external local assets.

import { ensureTensorFlow, ensureFaceLandmarksDetection } from './tensorflow-loader';

declare global {
  interface Window {
    tf?: any;
    faceLandmarksDetection?: any;
  }
}

export type StatusLevel =
  | "perfect"
  | "slight"
  | "noticeable"
  | "significant"
  | "horrible"
  | "extreme";

export interface AnalysisResultRow {
  feature: string;
  rating: string; // human text like "slightly too ..." or "perfect"
  measurement: string; // display string
  ideal: string; // display string
  status: StatusLevel;
}

// Simple loader for TFJS and the Face Landmarks Detection model (UMD via CDN)
async function loadScripts(): Promise<void> {
  // Use centralized loader to prevent multiple TensorFlow loadings
  await ensureTensorFlow({ backend: 'cpu', preferLocal: false });
  await ensureFaceLandmarksDetection();
}

async function loadModel(): Promise<any> {
  await loadScripts();
  const fld = window.faceLandmarksDetection;
  if (!fld) throw new Error("faceLandmarksDetection not available");
  return await fld.load(fld.SupportedPackages.mediapipeFacemesh, { maxFaces: 1 });
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = url;
  });
}

// Geometry utils (ported from TestAnalysis/analysis.js)
function distance(a: [number, number], b: [number, number]) {
  return Math.hypot(a[0] - b[0], a[1] - b[1]);
}

class Fn {
  // y = ax + b
  a: number;
  b: number;
  constructor(a: number, b: number) {
    this.a = a;
    this.b = b;
  }
  static fromTwoPoints([ax, ay]: [number, number], [bx, by]: [number, number]) {
    // y - ay = m (x - ax) => y = m x + (ay - m ax)
    const m = (ay - by) / (ax - bx);
    return new Fn(m, ay - m * ax);
  }
  static fromOffset(a: number, x: number, y: number) {
    return new Fn(a, y - a * x);
  }
  getY(x: number) {
    return this.a * x + this.b;
  }
  perpendicular([x, y]: [number, number]) {
    if (this.a === 0) return Fn.fromOffset(Number.POSITIVE_INFINITY, x, y);
    const a = -1 / this.a;
    return Fn.fromOffset(a, x, y);
  }
  parallel([x, y]: [number, number]) {
    return Fn.fromOffset(this.a, x, y);
  }
  intersect(other: Fn): [number, number] {
    if (this.a === other.a) return [Number.NaN, Number.NaN];
    const x = (other.b - this.b) / (this.a - other.a);
    return [x, this.getY(x)];
  }
}

// Rating helper inspired by TestAnalysis assess()
interface IdealRule {
  idealLower?: number;
  idealUpper?: number;
  deviation: number; // step size for levels
  deviatingLow: string; // text when value below lower bound
  deviatingHigh: string; // text when value above upper bound
}

function assess(value: number, rule: IdealRule): { status: StatusLevel; rating: string } {
  const { idealLower, idealUpper, deviation, deviatingLow, deviatingHigh } = rule;

  const within = () => {
    if (
      idealLower !== undefined && idealUpper !== undefined &&
      value <= idealUpper && value >= idealLower
    )
      return true;
    if (idealLower !== undefined && idealUpper === undefined && value >= idealLower)
      return true;
    if (idealUpper !== undefined && idealLower === undefined && value <= idealUpper)
      return true;
    return false;
  };

  if (within()) return { status: "perfect", rating: "perfect" };

  const clampLevel = (n: number) => Math.min(n, 4);

  if (idealLower !== undefined && value < idealLower) {
    let steps = 0;
    let temp = value;
    while (temp < idealLower) {
      temp += deviation;
      steps++;
      if (steps > 10) break;
    }
    const level = clampLevel(steps - 1);
    const word = ["slightly", "noticeably", "significantly", "horribly", "extremely"][
      Math.min(steps - 1, 4)
    ];
    return {
      status: (["slight", "noticeable", "significant", "horrible", "extreme"][
        Math.min(level, 4)
      ] || "noticeable") as StatusLevel,
      rating: `${word} too ${deviatingLow}`,
    };
  }

  if (idealUpper !== undefined && value > idealUpper) {
    let steps = 0;
    let temp = value;
    while (temp > idealUpper) {
      temp -= deviation;
      steps++;
      if (steps > 10) break;
    }
    const level = clampLevel(steps - 1);
    const word = ["slightly", "noticeably", "significantly", "horribly", "extremely"][
      Math.min(steps - 1, 4)
    ];
    return {
      status: (["slight", "noticeable", "significant", "horrible", "extreme"][
        Math.min(level, 4)
      ] || "noticeable") as StatusLevel,
      rating: `${word} too ${deviatingHigh}`,
    };
  }

  return { status: "noticeable", rating: "needs review" };
}

// Ideal ranges and wording for table rows (compact subset adapted for the simple page)
const IDEALS: Record<string, IdealRule & { idealDisplay: string }> = {
  midfaceRatio: {
    idealLower: 1.0,
    idealUpper: 1.05,
    deviation: 0.03,
    deviatingLow: "short midface",
    deviatingHigh: "elongated midface",
    idealDisplay: "1.0 to 1.05",
  },
  facialWidthToHeightRatio: {
    idealLower: 2.0,
    deviation: 0.1,
    deviatingLow: "narrow face",
    deviatingHigh: "wide face",
    idealDisplay: "more than 2",
  },
  chinToPhiltrumRatio: {
    idealLower: 2.0,
    idealUpper: 2.25,
    deviation: 0.05,
    deviatingLow: "short chin",
    deviatingHigh: "long chin",
    idealDisplay: "2.0 to 2.25",
  },
  canthalTilt: {
    idealLower: 4,
    deviation: 1,
    deviatingLow: "flat canthal tilt",
    deviatingHigh: "exaggerated canthal tilt",
    idealDisplay: "more than 4°",
  },
  mouthToNoseRatio: {
    idealLower: 1.5,
    idealUpper: 1.62,
    deviation: 0.05,
    deviatingLow: "narrow mouth",
    deviatingHigh: "wide mouth",
    idealDisplay: "1.5 to 1.62",
  },
  bigonialWidth: {
    idealLower: 1.1,
    idealUpper: 1.15,
    deviation: 0.05,
    deviatingLow: "wide jaw (gonial)",
    deviatingHigh: "narrow jaw (gonial)",
    idealDisplay: "1.1 to 1.15",
  },
  lipRatio: {
    idealLower: 1.55,
    idealUpper: 1.65,
    deviation: 0.05,
    deviatingLow: "thin lower lip",
    deviatingHigh: "full lower lip",
    idealDisplay: "1.55 to 1.65",
  },
  eyeSeparationRatio: {
    idealLower: 0.45,
    idealUpper: 0.49,
    deviation: 0.02,
    deviatingLow: "close-set eyes",
    deviatingHigh: "wide-set eyes",
    idealDisplay: "0.45 to 0.49",
  },
  eyeToMouthAngle: {
    idealLower: 45,
    idealUpper: 49,
    deviation: 1,
    deviatingLow: "low angle",
    deviatingHigh: "high angle",
    idealDisplay: "45° to 49°",
  },
  lowerThirdHeight: {
    idealLower: 1.25,
    deviation: 0.05,
    deviatingLow: "short lower third",
    deviatingHigh: "long lower third",
    idealDisplay: "more than 1.25",
  },
  palpebralFissureLength: {
    idealLower: 3.5,
    deviation: 0.2,
    deviatingLow: "short fissure",
    deviatingHigh: "long fissure",
    idealDisplay: "more than 3.5",
  },
};

// Compute PSL-like score and breakdown from statuses
function summarizeStatuses(statuses: StatusLevel[]) {
  const counts = {
    perfect: 0,
    deviation0: 0,
    deviation1: 0,
    deviation2: 0,
    deviation3: 0,
    deviation4: 0,
  };
  for (const s of statuses) {
    if (s === "perfect") counts.perfect++;
    else if (s === "slight") counts.deviation0++;
    else if (s === "noticeable") counts.deviation1++;
    else if (s === "significant") counts.deviation2++;
    else if (s === "horrible") counts.deviation3++;
    else if (s === "extreme") counts.deviation4++;
  }
  const weights = { perfect: 2, deviation0: 1, deviation1: 0, deviation2: -1, deviation3: -2, deviation4: -2 } as const;
  const totalScore =
    counts.perfect * weights.perfect +
    counts.deviation0 * weights.deviation0 +
    counts.deviation1 * weights.deviation1 +
    counts.deviation2 * weights.deviation2 +
    counts.deviation3 * weights.deviation3 +
    counts.deviation4 * weights.deviation4;
  const maxScore = 22; // matches TestAnalysis scale
  const normalized = Math.max(0, Math.min(8, Math.round((totalScore / maxScore) * 9)));
  return { counts, totalScore, psl: `PSL${normalized}` };
}

export async function analyzeSingleImage(url: string): Promise<AnalysisResultRow[] & { toString?: never } & any> {
  const model = await loadModel();
  const image = await loadImage(url);
  const preds = await model.estimateFaces({ input: image });
  if (!preds || preds.length === 0) throw new Error("No face detected");
  const face = preds[0];

  // Pull commonly used annotation points (pixel coordinates)
  const A = face.annotations;
  if (!A) throw new Error("Model annotations not available");

  const points = {
    leftIris: A.rightEyeIris[0] as [number, number],
    rightIris: A.leftEyeIris[0] as [number, number],
    leftLateralCanthus: A.rightEyeLower1[0] as [number, number],
    leftMedialCanthus: A.rightEyeLower1[7] as [number, number],
    rightLateralCanthus: A.leftEyeLower1[0] as [number, number],
    rightMedialCanthus: A.leftEyeLower1[7] as [number, number],
    leftEyeUpper: A.rightEyeUpper0[4] as [number, number],
    leftEyeLower: A.rightEyeLower0[4] as [number, number],
    rightEyeUpper: A.leftEyeUpper0[4] as [number, number],
    rightEyeLower: A.leftEyeLower0[4] as [number, number],
    leftEyebrow: A.rightEyebrowUpper[6] as [number, number],
    rightEyebrow: A.leftEyebrowUpper[6] as [number, number],
    leftZygo: A.silhouette[28] as [number, number],
    rightZygo: A.silhouette[8] as [number, number],
    noseBottom: A.noseBottom[0] as [number, number],
    leftNoseCorner: A.noseRightCorner[0] as [number, number],
    rightNoseCorner: A.noseLeftCorner[0] as [number, number],
    leftCupidBow: A.lipsUpperOuter[4] as [number, number],
    lipSeparation: A.lipsUpperInner[5] as [number, number],
    rightCupidBow: A.lipsUpperOuter[6] as [number, number],
    leftLipCorner: A.lipsUpperOuter[0] as [number, number],
    rightLipCorner: A.lipsUpperOuter[10] as [number, number],
    lowerLip: A.lipsLowerOuter[4] as [number, number],
    upperLip: A.lipsUpperOuter[5] as [number, number],
    leftGonial: A.silhouette[24] as [number, number],
    rightGonial: A.silhouette[12] as [number, number],
    chinLeft: A.silhouette[19] as [number, number],
    chinTip: A.silhouette[18] as [number, number],
    chinRight: A.silhouette[17] as [number, number],
  };

  // Midface Ratio
  const bottomLine = Fn.fromTwoPoints(points.leftCupidBow, points.rightCupidBow);
  const leftLine = bottomLine.perpendicular(points.leftIris);
  const rightLine = bottomLine.perpendicular(points.rightIris);
  const bottomLeftMidface = bottomLine.intersect(leftLine);
  const bottomRightMidface = bottomLine.intersect(rightLine);
  const midfaceRatio =
    (distance(points.leftIris, points.rightIris) / distance(points.leftIris, bottomLeftMidface) +
      distance(points.leftIris, points.rightIris) / distance(points.rightIris, bottomRightMidface)) /
    2;

  // Facial width:height ratio (using eye and lip lines + zygo verticals)
  const topLine = Fn.fromTwoPoints(points.leftEyeUpper, points.rightEyeUpper);
  const bottomLineFH = Fn.fromTwoPoints(points.leftCupidBow, points.rightCupidBow);
  const leftVL = topLine.perpendicular(points.leftZygo);
  const rightVL = topLine.perpendicular(points.rightZygo);
  const topLeft = leftVL.intersect(topLine);
  const topRight = rightVL.intersect(topLine);
  const bottomLeft = leftVL.intersect(bottomLineFH);
  const bottomRight = rightVL.intersect(bottomLineFH);
  const facialWidthToHeightRatio =
    (distance(topLeft, topRight) / distance(topLeft, bottomLeft) +
      distance(bottomLeft, bottomRight) / distance(topRight, bottomRight)) /
    2;

  // Chin : Philtrum
  const chinToPhiltrumRatio = distance(points.chinTip, points.lowerLip) / distance(points.upperLip, points.noseBottom);

  // Canthal Tilt (left/right)
  const base = [points.rightZygo[0] - points.leftZygo[0], points.rightZygo[1] - points.leftZygo[1]] as [
    number,
    number,
  ];
  const baseFn = Fn.fromTwoPoints(points.rightZygo, points.leftZygo);
  const leftVec = [
    points.leftLateralCanthus[0] - points.leftMedialCanthus[0],
    points.leftLateralCanthus[1] - points.leftMedialCanthus[1],
  ] as [number, number];
  const rightVec = [
    points.rightLateralCanthus[0] - points.rightMedialCanthus[0],
    points.rightLateralCanthus[1] - points.rightMedialCanthus[1],
  ] as [number, number];
  const dot = (u: [number, number], v: [number, number]) => u[0] * v[0] + u[1] * v[1];
  const mag = (u: [number, number]) => Math.hypot(u[0], u[1]);
  const acosd = (x: number) => (Math.acos(Math.max(-1, Math.min(1, x))) * 180) / Math.PI;
  const pointOnLeftLine = baseFn.getY(points.leftMedialCanthus[0]) + leftVec[1];
  const pointOnRightLine = baseFn.getY(points.rightMedialCanthus[0]) + rightVec[1];
  const leftAngle =
    acosd(Math.abs((-1) * (dot(base, leftVec))) / (mag(base) * mag(leftVec))) *
    (baseFn.getY(points.leftLateralCanthus[0]) - pointOnLeftLine > 0 ? 1 : -1);
  const rightAngle =
    acosd(Math.abs(dot(base, rightVec)) / (mag(base) * mag(rightVec))) *
    (baseFn.getY(points.rightLateralCanthus[0]) - pointOnRightLine > 0 ? 1 : -1);

  // Mouth : Nose
  const mouthToNoseRatio =
    distance(points.leftLipCorner, points.rightLipCorner) /
    distance(points.leftNoseCorner, points.rightNoseCorner);

  // Bigonial Width (zygo:gonial)
  const bigonialWidth = distance(points.leftZygo, points.rightZygo) / distance(points.leftGonial, points.rightGonial);

  // Lip Ratio (lower height : upper height)
  const topLipFn = Fn.fromTwoPoints(points.leftCupidBow, points.rightCupidBow);
  const lowerLipFn = topLipFn.parallel(points.lowerLip);
  const upperLipEnd = topLipFn.intersect(topLipFn.perpendicular(points.lipSeparation));
  const lowerLipEnd = lowerLipFn.intersect(lowerLipFn.perpendicular(points.lipSeparation));
  const lipRatio = distance(lowerLipEnd, points.lipSeparation) / distance(upperLipEnd, points.lipSeparation);

  // Eye separation ratio (iris center distance : zygomatic width)
  const eyeSeparationRatio = distance(points.leftIris, points.rightIris) / distance(points.leftZygo, points.rightZygo);

  // Eye to Mouth Angle (angle between vectors from mouth center to each iris)
  const a = [points.leftIris[0] - points.lipSeparation[0], points.leftIris[1] - points.lipSeparation[1]] as [
    number,
    number,
  ];
  const b = [points.rightIris[0] - points.lipSeparation[0], points.rightIris[1] - points.lipSeparation[1]] as [
    number,
    number,
  ];
  const eyeToMouthAngle = acosd(dot(a, b) / (mag(a) * mag(b)));

  // Lower third height ratio
  const midPoint: [number, number] = [
    points.leftNoseCorner[0] + 0.5 * (points.rightNoseCorner[0] - points.leftNoseCorner[0]),
    points.leftNoseCorner[1] + 0.5 * (points.rightNoseCorner[1] - points.leftNoseCorner[1]),
  ];
  const midLine = Fn.fromTwoPoints(points.leftNoseCorner, points.rightNoseCorner).perpendicular(midPoint);
  const topPoint = midLine.intersect(Fn.fromTwoPoints(points.leftEyebrow, points.rightEyebrow));
  const bottomPoint = midLine.intersect(Fn.fromTwoPoints(points.chinLeft, points.chinRight));
  const lowerThirdHeight = distance(bottomPoint, midPoint) / distance(midPoint, topPoint);

  // Palpebral fissure length ratio (horizontal fissure length / vertical aperture)
  const leftPFL =
    distance(points.leftLateralCanthus, points.leftMedialCanthus) /
    distance(points.leftEyeUpper, points.leftEyeLower);
  const rightPFL =
    distance(points.rightLateralCanthus, points.rightMedialCanthus) /
    distance(points.rightEyeUpper, points.rightEyeLower);

  // Build rows with ratings
  const rows: AnalysisResultRow[] = [];
  const push = (
    key: keyof typeof IDEALS,
    feature: string,
    numeric: number,
    fmt?: (n: number) => string,
  ) => {
    const rule = IDEALS[key];
    if (!rule) {
      console.warn(`No rule found for key: ${key}`);
      return;
    }
    const { status, rating } = assess(numeric, rule);
    rows.push({
      feature,
      rating,
      measurement: fmt ? fmt(numeric) : numeric.toFixed(2),
      ideal: rule.idealDisplay,
      status,
    });
  };

  push("midfaceRatio", "Midface ratio", midfaceRatio, (n) => n.toFixed(2));
  push(
    "facialWidthToHeightRatio",
    "Facial width to height ratio",
    facialWidthToHeightRatio,
    (n) => n.toFixed(2),
  );
  push("chinToPhiltrumRatio", "Chin to philtrum ratio", chinToPhiltrumRatio, (n) => n.toFixed(2));
  // Canthal tilt: average of signed left and right angles; show both in measurement
  const avgTilt = (leftAngle + rightAngle) / 2;
  {
    const rule = IDEALS.canthalTilt;
    if (!rule) {
      console.warn('No rule found for canthalTilt');
      return rows;
    }
    const { status, rating } = assess(avgTilt, rule);
    rows.push({
      feature: "Canthal tilt",
      rating,
      measurement: `left ${Math.round(rightAngle)}°, right ${Math.round(leftAngle)}°`,
      ideal: rule.idealDisplay,
      status,
    });
  }
  push("mouthToNoseRatio", "Mouth to nose ratio", mouthToNoseRatio, (n) => n.toFixed(2));
  push("bigonialWidth", "Bigonial width", bigonialWidth, (n) => n.toFixed(2));
  push("lipRatio", "Lip ratio", lipRatio, (n) => n.toFixed(2));
  push("eyeSeparationRatio", "Eye separation ratio", eyeSeparationRatio, (n) => n.toFixed(2));
  push("eyeToMouthAngle", "Eye to mouth angle", eyeToMouthAngle, (n) => `${Math.round(n)}°`);
  push("lowerThirdHeight", "Lower third height", lowerThirdHeight, (n) => n.toFixed(2));
  // Palpebral fissure: use average but display both
  const pflAvg = (leftPFL + rightPFL) / 2;
  {
    const rule = IDEALS.palpebralFissureLength;
    if (!rule) {
      console.warn('No rule found for palpebralFissureLength');
      return rows;
    }
    const { status, rating } = assess(pflAvg, rule);
    rows.push({
      feature: "Palpebral fissure length",
      rating,
      measurement: `left ${leftPFL.toFixed(2)}, right ${rightPFL.toFixed(2)}`,
      ideal: rule.idealDisplay,
      status,
    });
  }

  // Attach summary for convenience
  const summary = summarizeStatuses(rows.map((r) => r.status));
  (rows as any).__summary = summary;
  return rows as any;
}
