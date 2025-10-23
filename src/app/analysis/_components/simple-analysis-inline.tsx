"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { analyzeAndPrepare, drawOverlays, type AnalysisResultRow } from "~/lib/parallellabs-runner";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";

type AnalysisResult = AnalysisResultRow;

export function SimpleAnalysisInline({ frontImageUrl }: { frontImageUrl: string }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  // Remove PSL/score; we only generate a qualitative summary
  const [summaryCounts, setSummaryCounts] = useState<{
    strengths: number;
    concerns: number;
  } | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [preparedData, setPreparedData] = useState<{ image: HTMLImageElement; criteria: any; points: any } | null>(null);
  const [overlayGroup, setOverlayGroup] = useState<'all'|'eyes'|'nose'|'jaw'>('all');
  const [overlayAccent, setOverlayAccent] = useState<string>('#0ea5e9');
  const [overlayOpacity, setOverlayOpacity] = useState<number>(0.9);
  const [overlayScheme, setOverlayScheme] = useState<{ eyes: string; nose: string; jaw: string; other: string }>({ eyes: '#f59e0b', nose: '#111827', jaw: '#0ea5e9', other: '#94a3b8' });
  const [errorMsg, setErrorMsg] = useState<string>("");

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

  // Auto-run analysis when front image is available or changes
  useEffect(() => {
    if (frontImageUrl) {
      void analyzeFace();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frontImageUrl]);

  const analyzeFace = async () => {
    if (!frontImageUrl) return;
    setIsAnalyzing(true);
    
    // Check if we should use OpenRouter Claude or the traditional analysis
    const useOpenRouter = process.env.NEXT_PUBLIC_USE_OPENROUTER === 'true';
    
    try {
      if (useOpenRouter) {
        // Use OpenRouter Claude 4.5 for analysis
        const response = await fetch('/api/analyze-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageUrl: frontImageUrl }),
        });

        if (!response.ok) {
          throw new Error('Failed to analyze image with Claude');
        }

        const { data } = await response.json();
        
        setErrorMsg("");
        setAnalysisResults(data.analysisResults);
        setSummaryCounts(data.summaryCounts);
        
        // Claude doesn't provide landmark data, so skip overlay
        setShowOverlay(false);
        setPreparedData(null);
        
      } else {
        // Use traditional MediaPipe analysis
        const { rows, prepared } = await analyzeAndPrepare(frontImageUrl);
        const summary = (rows as any).__summary as {
          counts: { perfect: number; deviation0: number; deviation1: number; deviation2: number; deviation3: number; deviation4: number };
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

        setPreparedData(prepared);
        setShowOverlay(true);

        if (canvasRef.current) {
          requestAnimationFrame(() => {
            if (!canvasRef.current) return;
            drawOverlays(canvasRef.current!, prepared, { group: overlayGroup, accent: overlayAccent, opacity: overlayOpacity, scheme: overlayScheme });
          });
        }
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

  // Generate qualitative descriptions based on analysis results
  const generateQualitativeAnalysis = (result: AnalysisResult) => {
    const { feature, measurement, status, ideal } = result;
    const value = typeof measurement === 'number' ? measurement : parseFloat(String(measurement));
    
    switch (feature) {
      case 'Facial width to height ratio':
        if (status === 'perfect') return "Your facial proportions are exceptionally well-balanced. The width-to-height ratio creates a harmonious, symmetrical appearance that's considered ideal in facial aesthetics. This balanced proportion contributes to an overall attractive and proportional face shape.";
        if (value < 1.8) return "Your face has a more elongated, oval shape. While this can create an elegant, sophisticated appearance, it may make your face appear longer than ideal. This can sometimes make your features appear more spread out vertically.";
        if (value > 2.4) return "Your face has a wider, more square appearance. This creates a strong, masculine look but may make your face appear broader than the ideal proportion. This can sometimes make your features appear compressed horizontally.";
        return "Your facial width-to-height ratio is within a reasonable range but could be more balanced. This proportion significantly impacts your overall facial harmony and attractiveness.";

      case 'Canthal tilt':
        if (status === 'perfect') return "Your eye tilt is perfectly positioned, creating an alert, youthful appearance. The slight upward angle of your eyes gives you an attractive, engaging look that's often associated with beauty and vitality.";
        if (value < -5) return "Your eyes have a downward tilt, which can create a tired or sad appearance. This downward angle can make you look older than you are and may give the impression of fatigue or melancholy.";
        if (value > 10) return "Your eyes have a very pronounced upward tilt, which can create an overly alert or surprised appearance. While some upward tilt is attractive, too much can look unnatural or exaggerated.";
        return "Your eye tilt is within a normal range but could be more optimal. The angle of your eyes significantly impacts your overall facial expression and perceived attractiveness.";

      case 'Midface ratio':
        if (status === 'perfect') return "Your midface proportions are perfectly balanced, creating an ideal facial harmony. This balanced ratio contributes to an overall attractive and proportional appearance that's considered optimal in facial aesthetics.";
        if (value < 0.9) return "Your midface appears slightly compressed, which can make your features look crowded together. This can create a less harmonious appearance and may make your face look shorter than ideal.";
        if (value > 1.2) return "Your midface appears elongated, which can make your features look more spread out. This can create a less balanced appearance and may make your face look longer than ideal.";
        return "Your midface proportions are within a reasonable range but could be more balanced. This ratio significantly impacts your overall facial harmony and attractiveness.";

      case 'Chin to philtrum ratio':
        if (status === 'perfect') return "Your chin-to-philtrum ratio is perfectly balanced, creating ideal lower facial proportions. This balanced ratio contributes to a harmonious, attractive profile and overall facial symmetry.";
        if (value < 1.8) return "Your chin appears relatively small compared to your philtrum, which can create an unbalanced lower face. This can make your chin look weak or underdeveloped, affecting your overall facial harmony.";
        if (value > 2.5) return "Your chin appears relatively large compared to your philtrum, which can create an overly prominent lower face. This can make your chin look too strong or dominant, affecting your overall facial balance.";
        return "Your chin-to-philtrum ratio is within a reasonable range but could be more balanced. This proportion significantly impacts your lower facial harmony and overall attractiveness.";

      case 'Lip ratio':
        if (status === 'perfect') return "Your lip proportions are perfectly balanced, creating an ideal and attractive mouth shape. This balanced ratio contributes to facial harmony and is often associated with beauty and youthfulness.";
        if (value < 1.4) return "Your upper lip appears relatively thin compared to your lower lip, which can create an unbalanced mouth appearance. This can make your smile look less full and may affect your overall facial attractiveness.";
        if (value > 1.8) return "Your upper lip appears relatively thick compared to your lower lip, which can create an unbalanced mouth appearance. This can make your mouth look disproportionate and may affect your overall facial harmony.";
        return "Your lip proportions are within a reasonable range but could be more balanced. This ratio significantly impacts your mouth's appearance and overall facial attractiveness.";

      case 'Eye separation ratio':
        if (status === 'perfect') return "Your eye spacing is perfectly proportioned, creating an ideal and balanced appearance. This optimal spacing contributes to facial harmony and is often associated with beauty and attractiveness.";
        if (value < 0.8) return "Your eyes appear relatively close together, which can create a crowded or intense look. This close spacing can make your face appear narrower and may affect your overall facial balance.";
        if (value > 1.2) return "Your eyes appear relatively far apart, which can create a wide or spaced-out look. This wide spacing can make your face appear broader and may affect your overall facial harmony.";
        return "Your eye spacing is within a reasonable range but could be more optimal. This ratio significantly impacts your overall facial balance and attractiveness.";

      case 'Mouth to nose ratio':
        if (status === 'perfect') return "Your mouth-to-nose proportions are perfectly balanced, creating ideal facial harmony. This balanced ratio contributes to an overall attractive and proportional appearance.";
        if (value < 0.8) return "Your mouth appears relatively narrow compared to your nose, which can create an unbalanced lower face. This can make your mouth look small and may affect your overall facial proportions.";
        if (value > 1.4) return "Your mouth appears relatively wide compared to your nose, which can create an unbalanced appearance. This can make your mouth look too prominent and may affect your overall facial harmony.";
        return "Your mouth-to-nose ratio is within a reasonable range but could be more balanced. This proportion significantly impacts your overall facial harmony and attractiveness.";

      case 'Bigonial width':
        if (status === 'perfect') return "Your jaw width is perfectly proportioned, creating an ideal and balanced lower face. This optimal jaw width contributes to facial harmony and is often associated with strength and attractiveness.";
        if (value < 0.8) return "Your jaw appears relatively narrow, which can create a weak or underdeveloped lower face. This can make your face look less defined and may affect your overall facial strength and attractiveness.";
        if (value > 1.2) return "Your jaw appears relatively wide, which can create an overly prominent lower face. This can make your face look too square or masculine and may affect your overall facial balance.";
        return "Your jaw width is within a reasonable range but could be more optimal. This measurement significantly impacts your lower facial definition and overall attractiveness.";

      case 'Lower third height':
        if (status === 'perfect') return "Your lower facial height is perfectly proportioned, creating ideal facial balance. This optimal ratio contributes to overall facial harmony and is often associated with beauty and youthfulness.";
        if (value < 1.1) return "Your lower face appears relatively short, which can create a compressed or crowded appearance. This can make your features look too close together and may affect your overall facial balance.";
        if (value > 1.5) return "Your lower face appears relatively long, which can create an elongated or stretched appearance. This can make your face look longer than ideal and may affect your overall facial proportions.";
        return "Your lower facial height is within a reasonable range but could be more balanced. This ratio significantly impacts your overall facial proportions and attractiveness.";

      case 'Eye to mouth angle':
        if (status === 'perfect') return "Your eye-to-mouth angle is perfectly positioned, creating an ideal facial triangle. This optimal angle contributes to facial harmony and is often associated with beauty and attractiveness.";
        if (value < 35) return "Your eye-to-mouth angle is relatively acute, which can create a compressed or crowded appearance. This can make your features look too close together and may affect your overall facial balance.";
        if (value > 55) return "Your eye-to-mouth angle is relatively obtuse, which can create a stretched or elongated appearance. This can make your face look longer than ideal and may affect your overall facial proportions.";
        return "Your eye-to-mouth angle is within a reasonable range but could be more optimal. This angle significantly impacts your overall facial triangle and attractiveness.";

      case 'Palpebral fissure length':
        if (status === 'perfect') return "Your eye opening is perfectly proportioned, creating an ideal and attractive eye shape. This optimal length contributes to facial harmony and is often associated with beauty and expressiveness.";
        if (value < 0.8) return "Your eyes appear relatively narrow, which can create a sleepy or less expressive appearance. This can make your eyes look smaller and may affect your overall facial attractiveness and expressiveness.";
        if (value > 1.3) return "Your eyes appear relatively wide, which can create an overly alert or surprised appearance. This can make your eyes look too prominent and may affect your overall facial balance.";
        return "Your eye opening is within a reasonable range but could be more optimal. This measurement significantly impacts your eye appearance and overall facial attractiveness.";

      default:
        return `Your ${feature.toLowerCase()} measurement of ${measurement} indicates ${status} proportions. This aspect of your facial structure contributes to your overall appearance and attractiveness.`;
    }
  };

  // Generate overall summary paragraph
  const generateOverallSummary = () => {
    if (!analysisResults.length) return "";
    const GOOD = new Set(["perfect","slight","noticeable"] as const);
    const BAD = new Set(["significant","horrible","extreme"] as const);
    
    // Type guard to check if status is in GOOD set
    const isGoodStatus = (status: string): status is "perfect" | "slight" | "noticeable" => {
      return GOOD.has(status as any);
    };
    
    // Type guard to check if status is in BAD set
    const isBadStatus = (status: string): status is "significant" | "horrible" | "extreme" => {
      return BAD.has(status as any);
    };

    const byCat: Record<string, AnalysisResult[]> = {
      Eyes: analysisResults.filter(r => [
        'Canthal tilt','Palpebral fissure length','Eye separation ratio','Eye to mouth angle'
      ].includes(r.feature)),
      Proportions: analysisResults.filter(r => [
        'Midface ratio','Facial width to height ratio','Lower third height'
      ].includes(r.feature)),
      LowerFace: analysisResults.filter(r => [
        'Chin to philtrum ratio','Bigonial width','Lip ratio'
      ].includes(r.feature)),
      NoseMouth: analysisResults.filter(r => [
        'Mouth to nose ratio'
      ].includes(r.feature)),
    };

    const lines: string[] = [];
    const mk = (name: string, arr: AnalysisResult[]) => {
      if (!arr.length) return;
      const pos = arr.filter(r => isGoodStatus(r.status)).map(r => r.feature);
      const neg = arr.filter(r => isBadStatus(r.status)).map(r => r.feature);
      const posText = pos.length ? `${name} strengths: ${pos.slice(0,3).join(', ')}${pos.length>3?', …':''}.` : '';
      const negText = neg.length ? `${name} to watch: ${neg.slice(0,3).join(', ')}${neg.length>3?', …':''}.` : '';
      const text = [posText, negText].filter(Boolean).join(' ');
      if (text) lines.push(text);
    };
    mk('Eye area', byCat.Eyes || []);
    mk('Proportions', byCat.Proportions || []);
    mk('Lower face', byCat.LowerFace || []);
    mk('Nose/mouth', byCat.NoseMouth || []);

    const headline = summaryCounts ? `Quick view — strengths ${summaryCounts.strengths}, items to monitor ${summaryCounts.concerns}.` : '';
    const tail = 'These observations come from a single photo; lighting and pose can shift results.';
    return [headline, ...lines, tail].filter(Boolean).join(' ');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-4 sm:p-5 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="mb-1 text-xl font-medium text-gray-900 sm:text-2xl">
              {analysisResults.length > 0 ? "Your analysis is ready" : "Preparing your analysis"}
            </h2>
            <p className="text-xs leading-relaxed text-[#6B7280] sm:text-sm">
              We detect facial landmarks, compute key ratios and angles, and compare them to reference ranges. Results depend on photo quality, lighting, and pose; treat them as directional guidance.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left side - Metrics */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24 max-h-[calc(100vh-140px)] overflow-y-auto pr-2 space-y-4">
          {errorMsg && (<div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{errorMsg}</div>)}

          {analysisResults.length > 0 && (<>
            <Card className="border-0 bg-gradient-to-r from-amber-50 to-rose-50 shadow-sm">
              <CardContent className="p-5">
                <div className="text-center">
                  <div className="text-sm uppercase tracking-wide text-amber-700">Overview</div>
                  <div className="text-sm font-medium text-amber-900">
                    {summaryCounts ? (
                      <>Strengths {summaryCounts.strengths} · Items to monitor {summaryCounts.concerns}</>
                    ) : (
                      <>Summary available once measurements load</>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              {analysisResults.map((r, i) => (
                <Card key={i} className="shadow-sm">
                  <CardContent className="p-4">
                    <div className="mb-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                        <span>{r.feature}</span>
                        <span className={`rounded-full px-2 py-0.5 text-xs ${getStatusColor(r.status)}`}>{r.rating}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-700 leading-relaxed">
                      {generateQualitativeAnalysis(r)}
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div>
                        <span className="font-medium text-gray-800">Measured:</span>{" "}
                        {(() => {
                          const unit = IDEAL_OVERRIDES[r.feature]?.units || "";
                          const m = String(r.measurement);
                          return unit && !m.includes(unit) ? `${m} ${unit}` : m;
                        })()}
                      </div>
                      <div>
                        <span className="font-medium text-gray-800">Ideal:</span>{" "}
                        {IDEAL_OVERRIDES[r.feature]?.display || r.ideal}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>)}

          {analysisResults.length === 0 && !isAnalyzing && (
            <Card className="border-2 border-dashed border-gray-300">
              <CardContent className="p-8 text-center">
                <p className="text-sm text-gray-500">Analysis in progress...</p>
              </CardContent>
            </Card>
          )}
          </div>
        </div>

        {/* Center right - Image Preview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            {!showOverlay ? (
              <img src={frontImageUrl} alt="Front face" className="w-full rounded-lg object-contain min-h-[420px] h-[70vh] max-h-[720px]" />
            ) : (
              <canvas ref={canvasRef} className="w-full rounded-lg object-contain min-h-[420px] h-[70vh] max-h-[720px]" />
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-white/90 px-3 py-2">
            {(['all','eyes','nose','jaw'] as const).map(g => (
              <button key={g} className={`rounded-full px-2 py-0.5 text-xs ${overlayGroup===g ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`} onClick={() => setOverlayGroup(g)} type="button">{g}</button>
            ))}
            <div className="ml-2 flex items-center gap-1">
              {[{n:'Classic',v:{eyes:'#f59e0b',nose:'#111827',jaw:'#0ea5e9',other:'#94a3b8'}}, {n:'Ocean',v:{eyes:'#0ea5e9',nose:'#6366f1',jaw:'#10b981',other:'#64748b'}}, {n:'Mono',v:{eyes:'#111827',nose:'#1f2937',jaw:'#374151',other:'#6b7280'}}, {n:'Sunset',v:{eyes:'#f59e0b',nose:'#ef4444',jaw:'#8b5cf6',other:'#fb7185'}}].map(s => (
                <button key={s.n} className={`rounded-full px-2 py-0.5 text-xs ${overlayScheme.eyes===s.v.eyes && overlayScheme.nose===s.v.nose && overlayScheme.jaw===s.v.jaw ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`} onClick={() => setOverlayScheme(s.v)} type="button">{s.n}</button>
              ))}
            </div>
            <div className="ml-2 flex items-center gap-2">
              <span className="text-[10px] text-gray-500">opacity</span>
              <input type="range" min={0.4} max={1} step={0.05} value={overlayOpacity} onChange={(e)=>setOverlayOpacity(parseFloat(e.target.value))} className="h-1 w-24 accent-gray-900" />
            </div>
            <div className="ml-auto flex items-center gap-2">
              {showOverlay && (
                <Button onClick={() => { if (!canvasRef.current) return; const a = document.createElement('a'); a.href = canvasRef.current.toDataURL('image/png'); a.download = 'analysis.png'; a.click(); }} variant="outline" size="sm">Export</Button>
              )}
            </div>
          </div>

          {/* Overall summary below image */}
          {analysisResults.length > 0 && (
            <Card className="shadow-sm">
              <CardContent className="p-5">
                <div className="mb-2 text-sm font-semibold text-gray-900">Overall summary</div>
                <p className="text-sm leading-relaxed text-gray-700">{generateOverallSummary()}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Bottom - Side Profile Coming Soon */}
      <div className="mt-8 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Side Profile Analysis Coming Soon</h3>
          <p className="text-sm text-blue-700">
            We're working on advanced side profile analysis features that will provide detailed insights into your facial profile, 
            including jawline definition, nose profile, and overall facial harmony from the side view. Stay tuned for this exciting update!
          </p>
        </div>
      </div>
    </div>
  );
}

