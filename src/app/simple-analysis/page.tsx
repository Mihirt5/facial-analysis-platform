"use client";

import { useRef, useState, useEffect } from "react";
import { TwoColumnLayout } from "~/components/two-column-layout";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { analyzeAndPrepare, drawOverlays, drawProfileOverlays, computeProfileMetrics, type AnalysisResultRow } from "~/lib/parallellabs-runner";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";

interface FacialAnalysis {
  midfaceRatio: number;
  facialWidthToHeightRatio: number;
  chinToPhiltrumRatio: number;
  canthalTilt: { left: number; right: number };
  mouthToNoseRatio: number;
  bigonialWidth: number;
  lipRatio: number;
  eyeSeparationRatio: number;
  eyeToMouthAngle: number;
  lowerThirdHeight: number;
  palpebralFissureLength: { left: number; right: number };
}

type AnalysisResult = AnalysisResultRow;

export default function SimpleAnalysisPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [overallScore, setOverallScore] = useState<string>("");
  const [breakdown, setBreakdown] = useState<{
    perfect: number;
    slight: number;
    noticeable: number;
    significant: number;
    horrible: number;
    extreme: number;
  } | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [preparedData, setPreparedData] = useState<{ image: HTMLImageElement; criteria: any; points: any } | null>(null);
  const [overlayGroup, setOverlayGroup] = useState<'all'|'eyes'|'nose'|'jaw'>('all');
  const [overlayAccent, setOverlayAccent] = useState<string>('#0ea5e9');
  const [overlayOpacity, setOverlayOpacity] = useState<number>(0.9);
  const [overlayScheme, setOverlayScheme] = useState<{ eyes: string; nose: string; jaw: string; other: string }>({ eyes: '#f59e0b', nose: '#111827', jaw: '#0ea5e9', other: '#94a3b8' });
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [viewMode, setViewMode] = useState<'frontal' | 'profile'>("frontal");
  const [profileMetrics, setProfileMetrics] = useState<ReturnType<typeof computeProfileMetrics> | null>(null);

  // Display-only overrides for ideals/units and simple info text
  const IDEAL_OVERRIDES: Record<string, { display?: string; units?: string; info?: string }> = {
    'Facial width to height ratio': { display: '2.0 – 2.2 (ratio)', info: 'Face width divided by face height; values around ~2 look balanced.' },
    'Lip ratio': { display: '1.55 – 1.65 (ratio)', info: 'Lower lip height divided by upper lip height along the vertical midline.' },
    'Lower third height': { display: '1.20 – 1.45 (ratio)', info: 'Lower face height compared to midface height. Slightly tighter range for symmetry.' },
    'Canthal tilt': { units: '°', info: 'Angle formed by inner and outer eye corners; a subtle upward tilt is typical.' },
    'Eye to mouth angle': { units: '°', info: 'Angle between lines from each eye to mouth center; mid‑40°s is common.' },
    'Midface ratio': { info: 'Iris distance vs. distance to Cupid’s bow line; near ~1.0–1.05 indicates balance.' },
    'Chin to philtrum ratio': { info: 'Vertical chin length divided by philtrum; ~2.0–2.25 is a common reference.' },
    'Mouth to nose ratio': { info: 'Mouth width divided by nasal base width; moderate values suggest harmony.' },
    'Bigonial width': { info: 'Cheekbone width relative to jaw width; frames lower face breadth.' },
    'Eye separation ratio': { info: 'Iris separation divided by cheekbone width; reflects inter‑eye spacing.' },
    'Palpebral fissure length': { info: 'Horizontal eye opening relative to vertical aperture; larger values mean more exposure.' },
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setAnalysisResults([]);
        setOverallScore("");
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Redraw overlays on control changes or resize
  useEffect(() => {
    const redraw = () => {
      if (showOverlay && canvasRef.current && preparedData) {
        if (viewMode === 'profile' && profileMetrics) {
          drawProfileOverlays(canvasRef.current, preparedData.image, profileMetrics, { accent: overlayAccent, opacity: overlayOpacity });
        } else {
          drawOverlays(canvasRef.current, preparedData, { group: overlayGroup, accent: overlayAccent, opacity: overlayOpacity, scheme: overlayScheme });
        }
      }
    };
    redraw();
    window.addEventListener('resize', redraw);
    return () => window.removeEventListener('resize', redraw);
  }, [showOverlay, preparedData, overlayGroup, overlayAccent, overlayOpacity, overlayScheme, viewMode, profileMetrics]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const analyzeFace = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    try {
      const { rows, prepared } = await analyzeAndPrepare(selectedImage);
      // rows carries __summary with counts and PSL
      const summary = (rows as any).__summary as {
        counts: {
          perfect: number;
          deviation0: number;
          deviation1: number;
          deviation2: number;
          deviation3: number;
          deviation4: number;
        };
        psl: string;
      } | undefined;

      setErrorMsg("");
      setAnalysisResults(rows as AnalysisResult[]);
      if (summary) {
        setOverallScore(summary.psl);
        setBreakdown({
          perfect: summary.counts.perfect,
          slight: summary.counts.deviation0,
          noticeable: summary.counts.deviation1,
          significant: summary.counts.deviation2,
          horrible: summary.counts.deviation3,
          extreme: summary.counts.deviation4,
        });
      } else {
        setOverallScore("");
        setBreakdown(null);
      }

      // Store prepared and draw overlays with styling
      setPreparedData(prepared);
      setShowOverlay(true);

      // Compute profile metrics
      const face: any = (prepared as any).criteria?.midfaceRatio?.face;
      const pm = face ? computeProfileMetrics(face) : null;
      setProfileMetrics(pm);

      // Draw based on view mode
      if (canvasRef.current) {
        requestAnimationFrame(() => {
          if (!canvasRef.current) return;
          if (viewMode === 'profile' && pm) {
            drawProfileOverlays(canvasRef.current!, prepared.image, pm, { accent: overlayAccent, opacity: overlayOpacity });
          } else {
            drawOverlays(canvasRef.current!, prepared, { group: overlayGroup, accent: overlayAccent, opacity: overlayOpacity, scheme: overlayScheme });
          }
        });
      }
    } catch (err: any) {
      const msg = err?.message || 'Failed to analyze image';
      setErrorMsg(msg === 'No face detected' ? 'No face detected. Try a front-facing, well-lit photo with your face centered.' : msg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'perfect': return 'text-green-600 bg-green-50';
      case 'slight': return 'text-yellow-600 bg-yellow-50';
      case 'noticeable': return 'text-orange-600 bg-orange-50';
      case 'significant': return 'text-red-600 bg-red-50';
      case 'horrible': return 'text-red-800 bg-red-100';
      case 'extreme': return 'text-red-900 bg-red-200';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const rightPanel = (
    <div className="flex h-full w-full flex-col">
      <div className="relative flex-1">
        {!showOverlay ? (
          selectedImage ? (
            <img src={selectedImage} alt="Uploaded" className="absolute inset-0 block h-full w-full object-contain" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400">Upload a photo to preview</div>
          )
        ) : (
          <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full object-contain" />
        )}
      </div>
      {selectedImage && (
        <div className="flex flex-wrap items-center gap-2 border-t border-gray-200 bg-white/90 px-3 py-2">
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-gray-500">view</span>
            <button
              className={`rounded-full px-2 py-0.5 text-xs ${viewMode==='frontal' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setViewMode('frontal')}
              type="button"
            >Frontal</button>
            <button
              className={`rounded-full px-2 py-0.5 text-xs ${viewMode==='profile' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setViewMode('profile')}
              type="button"
            >Profile</button>
          </div>
          {(['all','eyes','nose','jaw'] as const).map(g => (
            <button
              key={g}
              className={`rounded-full px-2 py-0.5 text-xs ${overlayGroup===g ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setOverlayGroup(g)}
              type="button"
            >{g}</button>
          ))}
          <div className="ml-2 flex items-center gap-1">
            {[{n:'Classic',v:{eyes:'#f59e0b',nose:'#111827',jaw:'#0ea5e9',other:'#94a3b8'}},
              {n:'Ocean',v:{eyes:'#0ea5e9',nose:'#6366f1',jaw:'#10b981',other:'#64748b'}},
              {n:'Mono',v:{eyes:'#111827',nose:'#1f2937',jaw:'#374151',other:'#6b7280'}},
              {n:'Sunset',v:{eyes:'#f59e0b',nose:'#ef4444',jaw:'#8b5cf6',other:'#fb7185'}}].map(s => (
              <button
                key={s.n}
                className={`rounded-full px-2 py-0.5 text-xs ${overlayScheme.eyes===s.v.eyes && overlayScheme.nose===s.v.nose && overlayScheme.jaw===s.v.jaw ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setOverlayScheme(s.v)}
                type="button"
              >{s.n}</button>
            ))}
          </div>
          <div className="ml-2 flex items-center gap-2">
            <span className="text-[10px] text-gray-500">opacity</span>
            <input
              type="range"
              min={0.4}
              max={1}
              step={0.05}
              value={overlayOpacity}
              onChange={(e)=>setOverlayOpacity(parseFloat(e.target.value))}
              className="h-1 w-24 accent-gray-900"
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => { setSelectedImage(null); setAnalysisResults([]); setShowOverlay(false); setOverallScore(""); setBreakdown(null); setPreparedData(null); setProfileMetrics(null); setViewMode('frontal'); }}
              size="sm"
            >Change</Button>
            <Button onClick={analyzeFace} disabled={isAnalyzing} size="sm">
              {isAnalyzing ? "Analyzing…" : showOverlay ? "Re-run" : "Analyze"}
            </Button>
            <Button
              onClick={() => {
                if (!canvasRef.current) return;
                const a = document.createElement('a');
                a.href = canvasRef.current.toDataURL('image/png');
                a.download = 'analysis.png';
                a.click();
              }}
              variant="outline"
              size="sm"
            >Export</Button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <TwoColumnLayout rightPanelTitle="Preview" rightPanelContent={rightPanel}>
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-6 rounded-xl border bg-gradient-to-br from-indigo-50 to-purple-50 p-5">
          <h3 className="mb-1 text-xl font-semibold text-indigo-900">Single Photo Analysis</h3>
          <p className="text-sm text-indigo-700">
            Upload a clear, front-facing photo. We’ll detect landmarks, compute key facial metrics, and overlay visual guides.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {errorMsg}
          </div>
        )}

        {!selectedImage ? (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Upload Your Photo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="cursor-pointer inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Choose Photo
                </label>
                <p className="mt-2 text-sm text-gray-500">
                  JPG, PNG, DNG, HEIC supported. Look directly at the camera with a neutral expression.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {analysisResults.length > 0 && (
              <>
                <Card className="border-0 bg-gradient-to-r from-amber-50 to-rose-50 shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                      <div>
                        <div className="text-sm uppercase tracking-wide text-amber-700">Overall</div>
                        <div className="text-3xl font-bold text-amber-900">{overallScore}</div>
                        {breakdown && (
                          <div className="mt-1 text-xs text-amber-700">
                            Perfect {breakdown.perfect} · Slight {breakdown.slight} · Noticeable {breakdown.noticeable} · Significant {breakdown.significant} · Horrible {breakdown.horrible} · Extreme {breakdown.extreme}
                          </div>
                        )}
                      </div>
                      <div className="rounded-lg border border-amber-200 bg-white px-4 py-2 text-sm text-amber-900 shadow-sm">
                        Landmarks detected and visual overlay applied
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {viewMode === 'profile' && profileMetrics && (
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle>Profile Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                        <div>
                          <div className="text-gray-500">Nasolabial angle</div>
                          <div className="text-xl font-semibold text-gray-900">{profileMetrics.nasolabialAngle} °</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Mentolabial angle</div>
                          <div className="text-xl font-semibold text-gray-900">{profileMetrics.mentolabialAngle} °</div>
                        </div>
                        <div>
                          <div className="text-gray-500">E-line upper lip</div>
                          <div className="text-xl font-semibold text-gray-900">{profileMetrics.eLineUpperLip} px</div>
                        </div>
                        <div>
                          <div className="text-gray-500">E-line lower lip</div>
                          <div className="text-xl font-semibold text-gray-900">{profileMetrics.eLineLowerLip} px</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Jawline angle</div>
                          <div className="text-xl font-semibold text-gray-900">{profileMetrics.jawlineAngle} °</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Facial convexity</div>
                          <div className="text-xl font-semibold text-gray-900">{profileMetrics.convexityAngle} °</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {analysisResults.map((r, i) => (
                    <Card key={i} className="shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                              <span>{r.feature}</span>
                              {IDEAL_OVERRIDES[r.feature]?.info && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="inline-flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-gray-900 text-[10px] text-white">i</span>
                                  </TooltipTrigger>
                                  <TooltipContent sideOffset={6} className="bg-gray-900 text-white">
                                    {IDEAL_OVERRIDES[r.feature]?.info}
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                            <div className="mt-1 text-xs text-gray-500">Ideal: {IDEAL_OVERRIDES[r.feature]?.display || r.ideal}</div>
                          </div>
                          <span className={`rounded-full px-2 py-0.5 text-xs ${getStatusColor(r.status)}`}>{r.rating}</span>
                        </div>
                        <div className="mt-3 text-2xl font-semibold text-gray-900">
                          {(() => {
                            const unit = IDEAL_OVERRIDES[r.feature]?.units || '';
                            const m = String(r.measurement);
                            if (!unit) return m;
                            return m.includes(unit) ? m : `${m} ${unit}`;
                          })()}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </TwoColumnLayout>
  );
}
