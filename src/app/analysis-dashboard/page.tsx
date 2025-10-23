"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Trash2, 
  Eye, 
  Calendar,
  Zap,
  Brain,
  Activity,
  Target,
  FileText,
  Share2,
  Clock,
  Star,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info
} from "lucide-react";
import { loadAnalysisResults, type AnalysisRecord } from "~/lib/analysis-storage";

interface MetricBoxProps {
  title: string;
  value: string | number;
  subtitle?: string;
  severity: 'excellent' | 'good' | 'moderate' | 'poor' | 'severe';
  description: string;
  trend?: 'up' | 'down' | 'stable';
  icon?: React.ReactNode;
  chart?: React.ReactNode;
}

const MetricBox = ({ title, value, subtitle, severity, description, trend, icon, chart }: MetricBoxProps) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'excellent': return 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50';
      case 'good': return 'border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50';
      case 'moderate': return 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50';
      case 'poor': return 'border-orange-200 bg-gradient-to-br from-orange-50 to-red-50';
      case 'severe': return 'border-red-200 bg-gradient-to-br from-red-50 to-rose-50';
      default: return 'border-gray-200 bg-gradient-to-br from-gray-50 to-slate-50';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'excellent': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'good': return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case 'moderate': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'poor': return <XCircle className="w-5 h-5 text-orange-600" />;
      case 'severe': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      case 'stable': return <Activity className="w-4 h-4 text-gray-500" />;
      default: return null;
    }
  };

  return (
    <Card className={`border-l-4 ${getSeverityColor(severity)} shadow-sm hover:shadow-md transition-shadow`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {icon}
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
              {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getSeverityIcon(severity)}
            {trend && getTrendIcon(trend)}
          </div>
        </div>
        
        <div className="text-3xl font-bold text-gray-900 mb-3">{value}</div>
        
        <p className="text-sm text-gray-700 leading-relaxed mb-4">{description}</p>
        
        {chart && (
          <div className="mt-4">
            {chart}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const SimpleChart = ({ data, type = 'bar' }: { data: { label: string; value: number; color?: string }[], type?: 'bar' | 'line' }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="space-y-2">
      {data.map((item, index) => (
        <div key={index} className="flex items-center gap-3">
          <div className="w-16 text-xs text-gray-600 truncate">{item.label}</div>
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-500"
              style={{ 
                width: `${(item.value / maxValue) * 100}%`,
                backgroundColor: item.color || '#3b82f6'
              }}
            />
          </div>
          <div className="w-8 text-xs text-gray-600 text-right">{item.value}</div>
        </div>
      ))}
    </div>
  );
};

const AnalysisVisualization = ({ analysis }: { analysis: AnalysisRecord }) => {
  if (analysis.analysisType === 'zyla') {
    const skinData = analysis.data.rawData || analysis.data;
    
    return (
      <div className="space-y-6">
        {/* Overall Score Card */}
        {analysis.data.overallScore && (
          <Card className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="text-6xl font-bold text-blue-600 mb-2">
                {analysis.data.overallScore}
                <span className="text-3xl text-gray-500">/100</span>
              </div>
              <p className="text-lg text-gray-700 italic">{analysis.data.overallSummary}</p>
              <div className="mt-4 flex justify-center">
                <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-sm">
                  Overall Skin Health Score
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Acne Analysis */}
          {skinData.lesions && (
            <MetricBox
              title="Acne & Lesions"
              value={skinData.lesions.count}
              subtitle={`${skinData.lesions.severity_percentage * 100}% affected area`}
              severity={skinData.lesions.severity === 'mild' ? 'good' : skinData.lesions.severity === 'moderate' ? 'moderate' : 'severe'}
              description={`${skinData.lesions.severity} acne severity detected with ${skinData.lesions.confidence * 100}% confidence`}
              icon={<Target className="w-5 h-5 text-red-500" />}
              chart={
                <SimpleChart 
                  data={[
                    { label: 'Count', value: skinData.lesions.count, color: '#ef4444' },
                    { label: 'Severity', value: skinData.lesions.severity_percentage * 100, color: '#f97316' },
                    { label: 'Confidence', value: skinData.lesions.confidence * 100, color: '#22c55e' }
                  ]}
                />
              }
            />
          )}

          {/* Wrinkles Analysis */}
          {skinData.wrinkles && (
            <MetricBox
              title="Wrinkles Analysis"
              value={`${Object.values(skinData.wrinkles).reduce((acc: number, region: any) => acc + region.wrinkle_score, 0) / Object.keys(skinData.wrinkles).length}`}
              subtitle="Average wrinkle score"
              severity={Object.values(skinData.wrinkles).some((region: any) => region.severity === 'severe') ? 'severe' : 
                      Object.values(skinData.wrinkles).some((region: any) => region.severity === 'moderate') ? 'moderate' : 'good'}
              description="Wrinkle analysis across facial regions with confidence scores"
              icon={<Clock className="w-5 h-5 text-purple-500" />}
              chart={
                <SimpleChart 
                  data={Object.entries(skinData.wrinkles).map(([region, data]: [string, any]) => ({
                    label: region.replace('_', ' '),
                    value: data.wrinkle_score * 100,
                    color: data.severity === 'severe' ? '#ef4444' : data.severity === 'moderate' ? '#f97316' : '#22c55e'
                  }))}
                />
              }
            />
          )}

          {/* Pores Analysis */}
          {skinData.pores && (
            <MetricBox
              title="Pore Analysis"
              value={`${Object.values(skinData.pores).reduce((acc: number, region: any) => acc + region.count, 0)}`}
              subtitle="Total pores detected"
              severity={Object.values(skinData.pores).some((region: any) => region.severity === 'high') ? 'poor' : 'good'}
              description="Pore density analysis across facial regions"
              icon={<Eye className="w-5 h-5 text-blue-500" />}
              chart={
                <SimpleChart 
                  data={Object.entries(skinData.pores).map(([region, data]: [string, any]) => ({
                    label: region.replace('_', ' '),
                    value: data.density,
                    color: data.severity === 'high' ? '#ef4444' : data.severity === 'moderate' ? '#f97316' : '#22c55e'
                  }))}
                />
              }
            />
          )}

          {/* Pigmentation Analysis */}
          {skinData.pigmentation && (
            <MetricBox
              title="Pigmentation"
              value={`${Object.values(skinData.pigmentation).reduce((acc: number, region: any) => acc + region.spot_count, 0)}`}
              subtitle="Dark spots detected"
              severity={Object.values(skinData.pigmentation).some((region: any) => region.severity !== 'none') ? 'moderate' : 'excellent'}
              description="Pigmentation analysis across facial regions"
              icon={<Star className="w-5 h-5 text-yellow-500" />}
              chart={
                <SimpleChart 
                  data={Object.entries(skinData.pigmentation).map(([region, data]: [string, any]) => ({
                    label: region.replace('_', ' '),
                    value: data.density,
                    color: data.severity === 'none' ? '#22c55e' : '#f97316'
                  }))}
                />
              }
            />
          )}

          {/* Skin Type */}
          {skinData.skin_type && (
            <MetricBox
              title="Skin Type"
              value={skinData.skin_type.label}
              subtitle={`${skinData.skin_type.confidence * 100}% confidence`}
              severity="good"
              description={`Detected skin type with texture score of ${skinData.skin_type.texture_score}`}
              icon={<Activity className="w-5 h-5 text-green-500" />}
            />
          )}

          {/* Overall Severity */}
          {skinData.severity && (
            <MetricBox
              title="Overall Severity"
              value={skinData.severity.overall}
              subtitle={`${skinData.severity.confidence * 100}% confidence`}
              severity={skinData.severity.overall === 'mild' ? 'good' : skinData.severity.overall === 'moderate' ? 'moderate' : 'severe'}
              description={`Weighted score: ${skinData.severity.total_weighted_score} using ${skinData.severity.weighting_system}`}
              icon={<Target className="w-5 h-5 text-indigo-500" />}
              chart={
                <SimpleChart 
                  data={Object.entries(skinData.severity.component_scores).map(([component, score]: [string, any]) => ({
                    label: component.replace('_', ' '),
                    value: score * 100,
                    color: score > 0.6 ? '#ef4444' : score > 0.3 ? '#f97316' : '#22c55e'
                  }))}
                />
              }
            />
          )}
        </div>

        {/* Image Quality Warning */}
        {skinData.quality && skinData.quality.overall_quality === 'poor' && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-orange-800 mb-1">Image Quality Warning</h4>
                  <p className="text-sm text-orange-700 mb-2">
                    Quality Score: {skinData.quality.quality_score}/1.0 - Analysis may be less reliable
                  </p>
                  <ul className="text-xs text-orange-600 space-y-1">
                    {skinData.quality.warnings?.map((warning: string, index: number) => (
                      <li key={index}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  if (analysis.analysisType === 'openrouter') {
    return (
      <div className="space-y-6">
        {/* GPT-5 Analysis Categories */}
        {analysis.data.analysis && typeof analysis.data.analysis === 'object' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(analysis.data.analysis).map(([category, content]) => (
              <Card key={category} className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Brain className="w-5 h-5 text-purple-600" />
                    {category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-700 leading-relaxed">
                    {typeof content === 'string' ? (
                      <p className="whitespace-pre-wrap text-sm">{content}</p>
                    ) : (
                      <div className="space-y-2">
                        {Object.entries(content as any).map(([key, value]: [string, any]) => (
                          <div key={key} className="border-l-2 border-purple-200 pl-3">
                            <h4 className="font-medium text-sm text-gray-800">{key}</h4>
                            <p className="text-xs text-gray-600 mt-1">{typeof value === 'string' ? value : JSON.stringify(value)}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {analysis.data.analysis}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Model Information */}
        {analysis.data.model && (
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Brain className="w-4 h-4" />
                GPT-5 Model Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-purple-800">Model:</span>
                  <p className="text-purple-700">{analysis.data.model}</p>
                </div>
                {analysis.data.usage && (
                  <>
                    <div>
                      <span className="font-medium text-purple-800">Prompt Tokens:</span>
                      <p className="text-purple-700">{analysis.data.usage.prompt_tokens}</p>
                    </div>
                    <div>
                      <span className="font-medium text-purple-800">Completion Tokens:</span>
                      <p className="text-purple-700">{analysis.data.usage.completion_tokens}</p>
                    </div>
                    <div>
                      <span className="font-medium text-purple-800">Total Tokens:</span>
                      <p className="text-purple-700">{analysis.data.usage.total_tokens}</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return null;
};

export default function AnalysisDashboard() {
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisRecord | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'detailed' | 'comparison'>('overview');

  // Load analyses from localStorage on component mount
  useEffect(() => {
    const savedAnalyses = loadAnalysisResults();
    setAnalyses(savedAnalyses);
    if (savedAnalyses.length > 0) {
      setSelectedAnalysis(savedAnalyses[0]);
    }
  }, []);

  const deleteAnalysis = (id: string) => {
    const updated = analyses.filter(a => a.id !== id);
    setAnalyses(updated);
    if (selectedAnalysis?.id === id) {
      setSelectedAnalysis(updated.length > 0 ? updated[0] : null);
    }
    localStorage.setItem('facial-analyses', JSON.stringify(updated));
  };

  const exportAnalysis = (analysis: AnalysisRecord) => {
    const dataStr = JSON.stringify(analysis, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analysis-${analysis.id}-${analysis.timestamp}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportAllAnalyses = () => {
    const dataStr = JSON.stringify(analyses, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `all-analyses-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getAnalysisTypeIcon = (type: string) => {
    return type === 'zyla' ? <Zap className="w-4 h-4" /> : <Brain className="w-4 h-4" />;
  };

  const getAnalysisTypeColor = (type: string) => {
    return type === 'zyla' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Facial Analysis Dashboard
            </h1>
            <p className="text-lg text-gray-600">
              Visualize and manage your skin and facial analysis results
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={exportAllAnalyses} variant="outline" disabled={analyses.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
            <Button onClick={() => window.open('/zyla-test', '_blank')} variant="outline">
              <Zap className="w-4 h-4 mr-2" />
              Zyla Test
            </Button>
            <Button onClick={() => window.open('/openrouter-test', '_blank')} variant="outline">
              <Brain className="w-4 h-4 mr-2" />
              GPT-5 Test
            </Button>
          </div>
        </div>

        {analyses.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Analysis Data Yet</h3>
              <p className="text-gray-500 mb-6">
                Run some analyses using the Zyla or GPT-5 test pages to see your results here.
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => window.open('/zyla-test', '_blank')}>
                  <Zap className="w-4 h-4 mr-2" />
                  Start Zyla Analysis
                </Button>
                <Button onClick={() => window.open('/openrouter-test', '_blank')} variant="outline">
                  <Brain className="w-4 h-4 mr-2" />
                  Start GPT-5 Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar - Analysis List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Analysis History
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-96 overflow-y-auto">
                    {analyses.map((analysis) => (
                      <div
                        key={analysis.id}
                        className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedAnalysis?.id === analysis.id ? 'bg-blue-50 border-blue-200' : ''
                        }`}
                        onClick={() => setSelectedAnalysis(analysis)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getAnalysisTypeIcon(analysis.analysisType)}
                            <Badge className={getAnalysisTypeColor(analysis.analysisType)}>
                              {analysis.analysisType.toUpperCase()}
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteAnalysis(analysis.id);
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="text-sm text-gray-600">
                          {new Date(analysis.timestamp).toLocaleString()}
                        </div>
                        {analysis.summary.overallScore && (
                          <div className="text-lg font-semibold text-blue-600 mt-1">
                            {analysis.summary.overallScore}/100
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {selectedAnalysis && (
                <div className="space-y-6">
                  {/* Analysis Header */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getAnalysisTypeIcon(selectedAnalysis.analysisType)}
                          <div>
                            <CardTitle className="text-xl">
                              {selectedAnalysis.analysisType === 'zyla' ? 'Zyla Skin Analysis' : 'GPT-5 Facial Analysis'}
                            </CardTitle>
                            <p className="text-sm text-gray-600">
                              {new Date(selectedAnalysis.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => exportAnalysis(selectedAnalysis)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Export
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(selectedAnalysis.imageUrl, '_blank')}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Image
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>

                  {/* Analysis Content */}
                  <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
                      <TabsTrigger value="comparison">Comparison</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                      <AnalysisVisualization analysis={selectedAnalysis} />
                    </TabsContent>

                    <TabsContent value="detailed" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Raw Analysis Data</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <pre className="text-xs bg-gray-50 p-4 rounded-lg overflow-auto max-h-96">
                            {JSON.stringify(selectedAnalysis.data, null, 2)}
                          </pre>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="comparison" className="space-y-4">
                      <Card>
                        <CardContent className="p-6">
                          <div className="text-center text-gray-500">
                            <Target className="w-12 h-12 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Comparison View</h3>
                            <p>Compare multiple analyses to track progress over time.</p>
                            <p className="text-sm mt-2">
                              Run more analyses to enable comparison features.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}