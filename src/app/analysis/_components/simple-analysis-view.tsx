"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { analyzeAndPrepare, drawOverlays, type AnalysisResultRow } from "~/lib/parallellabs-runner";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";

type AnalysisResult = AnalysisResultRow;

interface SimpleAnalysisViewProps {
  frontImageUrl: string;
}

export function SimpleAnalysisView({ frontImageUrl }: SimpleAnalysisViewProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [summaryCounts, setSummaryCounts] = useState<{ strengths: number; concerns: number } | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [preparedData, setPreparedData] = useState<{ image: HTMLImageElement; criteria: any; points: any } | null>(null);
  const [overlayGroup, setOverlayGroup] = useState<'all'|'eyes'|'nose'|'jaw'>('all');
  const [overlayAccent, setOverlayAccent] = useState<string>('#0ea5e9');
  const [overlayOpacity, setOverlayOpacity] = useState<number>(0.9);
  const [overlayScheme, setOverlayScheme] = useState<{ eyes: string; nose: string; jaw: string; other: string }>({ eyes: '#f59e0b', nose: '#111827', jaw: '#0ea5e9', other: '#94a3b8' });
  const [errorMsg, setErrorMsg] = useState<string>("");

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

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Redraw overlays on control changes or resize
  useEffect(() => {
    const redraw = () => {
      if (showOverlay && canvasRef.current && preparedData) {
        drawOverlays(canvasRef.current, preparedData, { group: overlayGroup, accent: overlayAccent, opacity: overlayOpacity, scheme: overlayScheme });
      }
    };
    redraw();
    window.addEventListener('resize', redraw);
    return () => window.removeEventListener('resize', redraw);
  }, [showOverlay, preparedData, overlayGroup, overlayAccent, overlayOpacity, overlayScheme]);

  const analyzeFace = async () => {
    if (!frontImageUrl) return;

    setIsAnalyzing(true);
    try {
      const { rows, prepared } = await analyzeAndPrepare(frontImageUrl);
      // rows may carry __summary with counts
      const summary = (rows as any).__summary as {
        counts: {
          perfect: number;
          deviation0: number;
          deviation1: number;
          deviation2: number;
          deviation3: number;
          deviation4: number;
        };
      } | undefined;

      setErrorMsg("");
      setAnalysisResults(rows as AnalysisResult[]);
      if (summary) {
        const strengths = summary.counts.perfect + summary.counts.deviation0;
        const concerns = summary.counts.deviation1 + summary.counts.deviation2 + summary.counts.deviation3 + summary.counts.deviation4;
        setSummaryCounts({ strengths, concerns });
      } else {
        setSummaryCounts(null);
      }

      // Store prepared and draw overlays with styling
      setPreparedData(prepared);
      setShowOverlay(true);

      // Draw overlays
      if (canvasRef.current) {
        requestAnimationFrame(() => {
          if (!canvasRef.current) return;
          drawOverlays(canvasRef.current!, prepared, { group: overlayGroup, accent: overlayAccent, opacity: overlayOpacity, scheme: overlayScheme });
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg bg-white p-4 sm:p-5 lg:px-8">
        <h2 className="mb-2 text-xl font-medium text-gray-900 sm:text-2xl">
          Simple Analysis
        </h2>
        <p className="text-xs leading-relaxed text-[#A0A0A0] sm:text-sm">
          Key facial measurements and ratios computed from your front-facing photo. 
          Click "Analyze" to run the analysis and see detailed metrics.
        </p>
      </div>

      {/* Image and Controls */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Image Preview */}
        <div className="space-y-4">
          <div className="relative">
            {!showOverlay ? (
              <img 
                src={frontImageUrl} 
                alt="Front face" 
                className="w-full rounded-lg object-cover h-80" 
              />
            ) : (
              <canvas ref={canvasRef} className="w-full rounded-lg object-cover h-80" />
            )}
          </div>
          
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-white/90 px-3 py-2">
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
              <Button onClick={analyzeFace} disabled={isAnalyzing} size="sm">
                {isAnalyzing ? "Analyzing…" : showOverlay ? "Re-run" : "Analyze"}
              </Button>
              {showOverlay && (
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
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {errorMsg && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              {errorMsg}
            </div>
          )}

          {analysisResults.length > 0 && (
            <>
              <Card className="border-0 bg-gradient-to-r from-amber-50 to-rose-50 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-center sm:text-left">
                      <div className="text-sm uppercase tracking-wide text-amber-700">Overview</div>
                      <div className="text-sm font-medium text-amber-900">
                        {summaryCounts ? (
                          <>Strengths {summaryCounts.strengths} · Items to monitor {summaryCounts.concerns}</>
                        ) : (
                          <>Summary available once measurements load</>
                        )}
                      </div>
                    </div>
                    <div className="rounded-lg border border-amber-200 bg-white px-4 py-2 text-sm text-amber-900 shadow-sm">
                      Landmarks detected and visual overlay applied
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 gap-3">
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

          {analysisResults.length === 0 && !isAnalyzing && (
            <Card className="border-2 border-dashed border-gray-300">
              <CardContent className="p-8 text-center">
                <p className="text-sm text-gray-500">
                  Click "Analyze" to run facial analysis on your front-facing photo
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
