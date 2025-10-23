"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Eye, Droplets, Scissors, ArrowRight, Bone, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { BeforeAfterSlider } from "~/components/before-after-slider";

interface GlowUpProtocolViewProps {
  analysisId: string;
  frontPhotoUrl: string;
  morphUrl: string | null;
  // NEW: per-section morphs
  morphs?: { overall?: string | null; eyes?: string | null; skin?: string | null; jawline?: string | null; hair?: string | null };
  aestheticsScore: number;
  recommendations?: {
    aestheticsScore: number;
    eyesRecommendations: any[];
    skinRecommendations: any[];
    hairRecommendations: any[];
    jawlineRecommendations: any[];
    detectedConditions: string[];
    overallAnalysis: string;
  } | null;
  activeSubtab: string;
  onSubtabChange: (subtab: string) => void;
  userName?: string;
}

type SectionKey = "eyes" | "skin" | "hair" | "frame";

const sections: Array<{
  key: SectionKey;
  label: string;
  icon: React.ComponentType<any>;
  disabled?: boolean;
}> = [
  { key: "eyes", label: "Eyes", icon: Eye },
  { key: "frame", label: "Frame", icon: Bone },
  { key: "skin", label: "Skin", icon: Droplets },
  { key: "hair", label: "Hair", icon: Scissors },
];


// Recommendation steps data for each category
const recommendationSteps: Record<SectionKey, { title: string; steps: string[] }> = {
  eyes: {
    title: "Make eyebrows darker",
    steps: [
      "Use a tinted brow gel to add natural color and shape while keeping brows in place.",
      "Apply a brow pencil or powder in small strokes to fill in sparse areas.",
      "Consider castor oil or brow serums to promote natural brow growth over time.",
      "Choose a shade slightly darker than your natural brow color for a more defined look.",
    ],
  },
  frame: {
    title: "Optimize facial structure",
    steps: [
      "Reduce overall body fat percentage to reveal underlying bone structure.",
      "Build lean muscle mass to enhance facial definition and symmetry.",
      "Maintain proper posture to naturally improve facial appearance.",
      "Consider targeted exercises and proper nutrition for optimal facial composition.",
    ],
  },
  skin: {
    title: "Improve skin texture & tone",
    steps: [
      "Establish a consistent skincare routine with cleanser, moisturizer, and SPF.",
      "Incorporate vitamin C serum in the morning for brightening and protection.",
      "Use retinol or tretinoin at night to improve texture and reduce fine lines.",
      "Stay hydrated and maintain a diet rich in antioxidants for healthy skin.",
    ],
  },
  hair: {
    title: "Optimize hair density",
    steps: [
      "Use DHT-blocking ingredients to prevent hair follicle miniaturization.",
      "Apply minoxidil topically to stimulate hair growth at the scalp.",
      "Ensure adequate protein intake and biotin for hair health.",
      "Avoid harsh styling and heat damage; use heat protectant when necessary.",
    ],
  },
};

// Always-expanded recommendation card component  
function RecommendationCard({
  title,
  badge,
  category,
  recommendationLevel,
  riskLevel,
  maintenanceRequirement,
  whyRecommendation,
  products,
  isExpanded,
  onToggle,
  onProductClick,
}: {
  title: string;
  badge?: string;
  category: string;
  recommendationLevel: string;
  riskLevel: string;
  maintenanceRequirement: string;
  whyRecommendation: string;
  products: Array<{ slug: string; name: string; price: string; description: string; imageSrc: string }>;
  isExpanded: boolean;
  onToggle: () => void;
  onProductClick: (slug: string) => void;
}) {
  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg hover:border-[#9AAEB5]/30 transition-all duration-300 font-inter">
      {/* Header - Always visible */}
      <div className="p-5 bg-gradient-to-r from-white to-[#9AAEB5]/5">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          {badge && (
            <span className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-full border border-blue-100">
              {badge}
            </span>
          )}
        </div>
      </div>

      {/* Content - Always shown */}
      <div className="px-5 pb-5 space-y-4">
        {/* Why this recommendation? */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Why this recommendation?</h4>
          <p className="text-sm text-gray-600 leading-relaxed font-normal">
            {whyRecommendation}
          </p>
        </div>

        {/* Category and levels */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#9AAEB5]/5 rounded-xl p-3 border border-[#9AAEB5]/10">
            <p className="text-xs text-[#9AAEB5] uppercase tracking-wide mb-1.5 font-medium">Category</p>
            <p className="text-sm font-medium text-gray-900">{category}</p>
          </div>
          <div className="bg-[#9AAEB5]/5 rounded-xl p-3 border border-[#9AAEB5]/10">
            <p className="text-xs text-[#9AAEB5] uppercase tracking-wide mb-1.5 font-medium">Recommendation Level</p>
            <p className="text-sm font-medium text-gray-900">{recommendationLevel}</p>
          </div>
          <div className="bg-[#9AAEB5]/5 rounded-xl p-3 border border-[#9AAEB5]/10">
            <p className="text-xs text-[#9AAEB5] uppercase tracking-wide mb-1.5 font-medium">Risk Level</p>
            <p className="text-sm font-medium text-gray-900">{riskLevel}</p>
          </div>
          <div className="bg-[#9AAEB5]/5 rounded-xl p-3 border border-[#9AAEB5]/10">
            <p className="text-xs text-[#9AAEB5] uppercase tracking-wide mb-1.5 font-medium">Maintenance</p>
            <p className="text-sm font-medium text-gray-900">{maintenanceRequirement}</p>
          </div>
        </div>

        {/* Products */}
        <div>
          <p className="text-xs text-[#9AAEB5] uppercase tracking-wider mb-3 font-medium">Products Recommended</p>
          <div className="space-y-2.5">
            {products.map((product) => (
              <button
                key={product.slug}
                onClick={() => onProductClick(product.slug)}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-200 hover:border-[#9AAEB5]/40 hover:shadow-md hover:bg-[#9AAEB5]/5 transition-all duration-200 group"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[#9AAEB5]/10 to-[#9AAEB5]/20">
                  <Image
                    src={product.imageSrc}
                    alt={product.name}
                    fill
                    sizes="64px"
                    className="object-contain p-2"
                  />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-sm text-gray-900">{product.name}</p>
                    <span className="text-sm font-medium text-[#9AAEB5] shrink-0">{product.price}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2 font-normal">{product.description}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-[#9AAEB5] shrink-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Product image mapping
const PRODUCT_IMAGE_MAP: Record<string, string> = {
  "Latisse": "/Latisse.png",
  "GHK-Cu": "/GHK-CU.png", 
  "GHK-CU": "/GHK-CU.png",
  "Tretinoin 0.025%": "/Tretinoin New.png",
  "Tretinoin": "/Tretinoin New.png",
  "Azelaic Acid 15% (topical)": "/Azalaec_acid.png",
  "Azelaic Acid": "/Azalaec_acid.png",
  "BPC-157": "/BPC157.png",
  "Topical Minoxidil": "/Minoxodil.png",
  "Minoxidil": "/Minoxodil.png",
  "Oral Dutasteride": "/newdutasteride.png",
  "Dutasteride": "/newdutasteride.png",
  "RU 58841 Topical": "/RU-58841.png",
  "RU 58841": "/RU-58841.png",
  "Retatrutide": "/Retatutride.png",
  "TRT": "/TRT.png",
  "Enclomiphene": "/Enclomephine.png",
};

// Product descriptions for better user experience
const PRODUCT_DESCRIPTIONS: Record<string, string> = {
  "Latisse": "FDA-approved prescription treatment for longer, thicker, darker eyelashes",
  "GHK-Cu": "Copper peptide that promotes collagen synthesis and skin regeneration",
  "Tretinoin 0.025%": "Prescription retinoid that improves skin texture and reduces signs of aging",
  "Tretinoin": "Prescription retinoid that improves skin texture and reduces signs of aging",
  "Azelaic Acid 15% (topical)": "Prescription treatment that reduces acne and improves skin tone",
  "Azelaic Acid": "Prescription treatment that reduces acne and improves skin tone",
  "BPC-157": "Healing peptide that supports tissue repair and reduces inflammation",
  "Topical Minoxidil": "FDA-approved topical treatment for hair regrowth and density",
  "Minoxidil": "FDA-approved topical treatment for hair regrowth and density",
  "Oral Dutasteride": "Prescription medication that blocks DHT to prevent hair loss",
  "Dutasteride": "Prescription medication that blocks DHT to prevent hair loss",
  "RU 58841 Topical": "Topical anti-androgen that blocks DHT at the hair follicle level",
  "RU 58841": "Topical anti-androgen that blocks DHT at the hair follicle level",
  "Retatrutide": "GLP-1 receptor agonist that promotes weight loss and fat reduction",
  "TRT": "Testosterone replacement therapy for hormone optimization and body composition",
  "Enclomiphene": "Selective estrogen receptor modulator that boosts natural testosterone production",
};

// Recommendation data for each category
type RecommendationData = {
  title: string;
  badge?: string;
  category: string;
  recommendationLevel: string;
  riskLevel: string;
  maintenanceRequirement: string;
  whyRecommendation: string;
  products: Array<{ slug: string; name: string; price: string; description: string; imageSrc: string }>;
};

const recommendationData: Record<SectionKey, RecommendationData> = {
  eyes: {
    title: "Eyebrow tinting",
    badge: "Best & Most Sustainable",
    category: "Cosmetic",
    recommendationLevel: "#1",
    riskLevel: "Low",
    maintenanceRequirement: "Daily",
    whyRecommendation: "Darker eyebrows enhance facial definition, create a balanced appearance, and frame the eyes for a more youthful and expressive look. Well-defined brows can also improve facial symmetry and highlight your natural features.",
    products: [
      { slug: "latisse", name: "Eyebrow Tinting Kit", price: "$10", description: "A complete kit for tinting eyebrows with long-lasting results.", imageSrc: "/Latisse.png" },
      { slug: "ghk-cu", name: "Gorgeous Eyebrow Dye", price: "$12", description: "An easy-to-use kit that lasts up to two weeks and is gentle on the skin.", imageSrc: "/GHK-CU.png" },
      { slug: "tretinoin", name: "Instant Eyebrow Color", price: "$15", description: "A quick and effective eyebrow tinting kit that delivers natural-looking color.", imageSrc: "/Tretinoin New.png" },
    ],
  },
  hair: {
    title: "Hair density optimization",
    badge: "Most Effective",
    category: "Medical",
    recommendationLevel: "#1",
    riskLevel: "Low",
    maintenanceRequirement: "Daily",
    whyRecommendation: "Optimizing hair density creates a more youthful appearance and frames the face naturally. Fuller hair improves facial proportions, enhances confidence, and signals vitality. Medical treatments address the root causes of thinning to deliver sustainable, natural-looking results.",
    products: [
      { slug: "minoxidil", name: "Minoxidil", price: "$25", description: "Stimulates follicles to thicken strands and improve coverage.", imageSrc: "/Minoxodil.png" },
      { slug: "dutasteride", name: "Dutasteride", price: "$45", description: "Blocks DHT more broadly than finasteride to slow shedding and preserve density.", imageSrc: "/newdutasteride.png" },
      { slug: "finasteride", name: "Finasteride", price: "$30", description: "Reduces DHT to slow shedding and preserve hairline density.", imageSrc: "/finasteride.png" },
    ],
  },
  frame: {
    title: "Facial structure optimization",
    badge: "Advanced",
    category: "Hormonal & Metabolic",
    recommendationLevel: "#1",
    riskLevel: "Medium",
    maintenanceRequirement: "Weekly",
    whyRecommendation: "Optimizing your facial frame reveals strong bone structure and creates a more defined, balanced appearance. Reducing facial fat and enhancing underlying features signals health, vitality, and attractiveness. Strategic optimization can dramatically improve overall facial aesthetics and presence.",
    products: [
      { slug: "retatutride", name: "Retatutride", price: "$120", description: "Helps reduce facial and overall fat to reveal cleaner contours.", imageSrc: "/Retatutride.png" },
      { slug: "trt", name: "TRT (Testosterone)", price: "$150", description: "Direct testosterone restoration to drive fat loss and add lean mass.", imageSrc: "/TRT.png" },
      { slug: "enclomiphene", name: "Enclomiphene", price: "$80", description: "Supports natural testosterone to enhance facial structure visibility.", imageSrc: "/Enclomephine.png" },
    ],
  },
  skin: {
    title: "Skin texture & tone",
    badge: "Best & Most Sustainable",
    category: "Dermatological",
    recommendationLevel: "#1",
    riskLevel: "Low",
    maintenanceRequirement: "Daily",
    whyRecommendation: "Smooth, even skin tone is foundational to facial attractiveness. Clear skin signals health, youth, and vitality while enhancing all other facial features. Consistent dermatological care delivers visible, lasting improvements without invasive procedures.",
    products: [
      { slug: "tretinoin", name: "Tretinoin", price: "$40", description: "Speeds cell turnover to clear acne, smooth texture, and even tone.", imageSrc: "/Tretinoin New.png" },
      { slug: "azelaic-acid", name: "Azelaic Acid 15%", price: "$35", description: "Clears acne-causing bacteria, calms redness, and evens tone.", imageSrc: "/Azalaec_acid.png" },
      { slug: "ghk-cu", name: "GHK-Cu", price: "$55", description: "Supports collagen, tightens texture, and softens fine lines.", imageSrc: "/GHK-CU.png" },
    ],
  },
};

export function GlowUpProtocolView({
  analysisId,
  frontPhotoUrl,
  morphUrl,
  morphs,
  aestheticsScore,
  recommendations,
  activeSubtab,
  onSubtabChange,
  userName,
}: GlowUpProtocolViewProps) {
  const router = useRouter();
  const [localActiveTab, setLocalActiveTab] = useState(activeSubtab);
  const [expandedMobileFeature, setExpandedMobileFeature] = useState<string | null>(null);

  // Update local state immediately when prop changes
  useEffect(() => {
    setLocalActiveTab(activeSubtab);
  }, [activeSubtab]);

  // Function to get all dynamic recommendations for a section
  const getDynamicRecommendations = (sectionKey: SectionKey) => {
    if (!recommendations) {
      return [recommendationData[sectionKey]];
    }

    // Map section keys to recommendation arrays
    const recommendationMap = {
      eyes: recommendations.eyesRecommendations,
      skin: recommendations.skinRecommendations,
      hair: recommendations.hairRecommendations,
      frame: recommendations.jawlineRecommendations, // frame uses jawline recommendations
    };

    const dynamicRecs = recommendationMap[sectionKey];
    
    // If we have dynamic recommendations, convert all of them to our format
    if (dynamicRecs && dynamicRecs.length > 0) {
      return dynamicRecs.map((rec: any, index: number) => ({
        title: rec.title,
        badge: index === 0 ? "Best Recommendation" : undefined, // Only show badge on first item
        category: rec.category,
        recommendationLevel: rec.recommendationLevel,
        riskLevel: rec.riskLevel,
        maintenanceRequirement: rec.maintenance,
        whyRecommendation: rec.whyRecommendation,
        products: rec.products.map((product: string) => ({
          slug: product.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, ''),
          name: product,
          price: "Contact for pricing",
          description: PRODUCT_DESCRIPTIONS[product] || `Professional treatment for ${product.toLowerCase()}`,
          imageSrc: PRODUCT_IMAGE_MAP[product] || "/placeholder-product.png"
        })),
      }));
    }

    // Fallback to static data
    return [recommendationData[sectionKey]];
  };

  // Determine which morph to show for the right side (static, not a slider)
  const sectionKey = (localActiveTab as SectionKey);
  const morphForSection = sectionKey === "frame" ? (morphs?.jawline ?? morphUrl) : (morphs?.[sectionKey] ?? morphUrl);
  const currentRecommendations = getDynamicRecommendations(sectionKey);

  // Debug logging for morph URLs
  useEffect(() => {
    console.log("🔍 [Debug] GlowUpProtocolView props:", {
      morphUrl,
      morphs,
      sectionKey,
      morphForSection,
      localActiveTab
    });
  }, [morphUrl, morphs, sectionKey, morphForSection, localActiveTab]);

  return (
    <div className="h-screen overflow-hidden bg-white font-inter">
      {/* Desktop Layout */}
      <div className="hidden lg:block h-full">
        {/* Header with protocol name and customization button */}
        <div className="bg-white px-12 py-5 border-b border-[#9AAEB5]/20">
          <div className="flex items-center justify-between max-w-[1800px]">
            <div>
              <h1 className="text-3xl font-medium text-gray-900">
                {userName}'s <span className="text-[#9AAEB5]">Protocol</span>
              </h1>
              <p className="text-sm mt-1 font-normal">
                <span className="text-gray-900">Here's what the </span>
                <span className="font-medium text-gray-900">best-looking version of yourself</span>
                <span className="text-gray-400"> could look like.</span>
              </p>
            </div>
          </div>
        </div>

        {/* Main content area - Fixed height with no scroll */}
        <div className="h-[calc(100vh-88px)] overflow-hidden">
          <div className="grid grid-cols-[1fr_650px] gap-0 h-full max-w-[1800px]">
            {/* Left side - User photo with before/after slider only (overall) */}
            <div className="flex items-center justify-center pl-12 pr-6 py-8 bg-gradient-to-br from-gray-50 to-white">
              {/* Before/After Slider or Regular Photo */}
              <div className="relative w-full max-w-md shadow-2xl" style={{ aspectRatio: "3/4", maxHeight: "calc(85vh - 64px)" }}>
                {morphUrl ? (
                  <BeforeAfterSlider
                    beforeImage={frontPhotoUrl}
                    afterImage={morphUrl}
                    altBefore={`${userName}'s photo`}
                    altAfter={`${userName}'s potential`}
                  />
                ) : (
                  <div className="relative rounded-[2rem] overflow-hidden h-full">
                    <Image
                      src={frontPhotoUrl}
                      alt={`${userName}'s photo`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right side - Score + Static per-section morph + Recommendations */}
            <div className="flex flex-col h-full overflow-y-auto bg-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <div className="pl-6 pr-12 py-8 space-y-6">
                {/* Aesthetics Score */}
                <div className="pb-4">
                  <div className="flex items-end justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">Aesthetic Score</h3>
                    <span className="text-5xl font-bold text-[#9AAEB5]">{aestheticsScore}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">Your score is higher than {Math.min(95, Math.max(45, Math.round(aestheticsScore * 0.8 + 20)))}% of your age group.</p>
                  {/* Progress bar */}
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#9AAEB5] to-[#7b93a0] rounded-full transition-all duration-500"
                      style={{ width: `${aestheticsScore}%` }}
                    ></div>
                  </div>
                </div>

                {/* Side-by-side Comparison */}
                <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm">
                  <div className="p-4 bg-gradient-to-r from-white to-[#9AAEB5]/5">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Your Transformation ({localActiveTab})</h3>
                    <div className="flex items-center justify-center gap-6">
                      {/* Uploaded Photo */}
                      <div className="relative w-48 h-60 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={frontPhotoUrl}
                          alt={`${userName}'s uploaded photo`}
                          fill
                          sizes="192px"
                          className="object-cover"
                          priority
                        />
                      </div>
                      
                      {/* Arrow */}
                      <div className="flex items-center justify-center">
                        <ArrowRight className="w-10 h-10 text-gray-400" />
                      </div>
                      
                      {/* Section Morph */}
                      <div className="relative w-48 h-60 rounded-lg overflow-hidden bg-gray-100">
                        {morphForSection ? (
                          <Image
                            src={morphForSection}
                            alt={`${userName}'s ${localActiveTab} morph`}
                            fill
                            sizes="192px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <Image
                              src={frontPhotoUrl}
                              alt={`${userName}'s photo`}
                              fill
                              sizes="192px"
                              className="object-cover opacity-50"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* The Solutions We Offer section */}
                <div className="pb-4 border-b border-[#9AAEB5]/10">
                  <h2 className="text-2xl font-medium text-gray-900 mb-2">
                    The <span className="text-[#9AAEB5]">Solutions</span> We Offer
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed font-normal">
                    We focus on facial balance, healthy skin, and long-lasting results—no surgery.
                  </p>
                </div>

                {/* All recommendation cards - Always expanded */}
                <div className="space-y-4 pb-8">
                  {currentRecommendations.map((recommendation, index) => (
                    <RecommendationCard
                      key={`${sectionKey}-${index}`}
                      title={recommendation.title}
                      badge={recommendation.badge}
                      category={recommendation.category}
                      recommendationLevel={recommendation.recommendationLevel}
                      riskLevel={recommendation.riskLevel}
                      maintenanceRequirement={recommendation.maintenanceRequirement}
                      whyRecommendation={recommendation.whyRecommendation}
                      products={recommendation.products}
                      isExpanded={true}
                      onToggle={() => {}}
                      onProductClick={(slug) => router.push(`/products/${slug}`)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden h-full flex flex-col bg-white">
        {/* Section Slider at Top */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {sections.map((section) => {
              const IconComponent = section.icon;
              return (
                <button
                  key={section.key}
                  onClick={() => onSubtabChange(section.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    localActiveTab === section.key
                      ? 'bg-[#9AAEB5] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-sm font-medium">{section.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Content Area */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Header Section */}
          <div className="px-4 py-6">
            <h1 className="text-2xl font-medium text-gray-900 mb-2">
              {userName}'s <span className="text-[#9AAEB5]">Protocol</span>
            </h1>
            <p className="text-sm text-gray-600 mb-6">
              Here's what the <span className="font-medium text-gray-900">best-looking version of yourself</span> could look like.
            </p>
            
            {/* Aesthetic Score Bar */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">Aesthetic Score</span>
                <span className="text-3xl font-bold text-[#9AAEB5]">{aestheticsScore}</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">Your score is higher than {Math.min(95, Math.max(45, Math.round(aestheticsScore * 0.8 + 20)))}% of your age group.</p>
              {/* Progress bar */}
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#9AAEB5] to-[#7b93a0] rounded-full transition-all duration-500"
                  style={{ width: `${aestheticsScore}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Photo/Morph Slider - Takes up most space */}
          <div className="px-4 mb-6 flex-1 flex items-center justify-center">
            <div className="relative w-full max-w-sm shadow-2xl" style={{ aspectRatio: "3/4" }}>
              {morphUrl ? (
                <BeforeAfterSlider
                  beforeImage={frontPhotoUrl}
                  afterImage={morphUrl}
                  altBefore={`${userName}'s photo`}
                  altAfter={`${userName}'s potential`}
                />
              ) : (
                <div className="relative rounded-[2rem] overflow-hidden h-full">
                  <Image
                    src={frontPhotoUrl}
                    alt={`${userName}'s photo`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                </div>
              )}
            </div>
          </div>

          {/* Recommendations Section */}
          <div className="px-4 pb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              The <span className="text-[#9AAEB5]">Solutions</span> We Offer
            </h2>
            <div className="space-y-4">
              {currentRecommendations.map((recommendation, index) => (
                <RecommendationCard
                  key={`${sectionKey}-${index}`}
                  title={recommendation.title}
                  badge={recommendation.badge}
                  category={recommendation.category}
                  recommendationLevel={recommendation.recommendationLevel}
                  riskLevel={recommendation.riskLevel}
                  maintenanceRequirement={recommendation.maintenanceRequirement}
                  whyRecommendation={recommendation.whyRecommendation}
                  products={recommendation.products}
                  isExpanded={true}
                  onToggle={() => {}}
                  onProductClick={(slug) => router.push(`/products/${slug}`)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
