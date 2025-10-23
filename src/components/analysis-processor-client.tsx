"use client";

import { useState } from 'react';
import { analyzeAndPrepare } from '~/lib/parallellabs-runner';
import { ANALYSIS_STRUCTURE } from '~/lib/analysis-structure';
import { api } from '~/trpc/react';
import { type FacialAnalysis } from '~/lib/mediapipe-client';

interface AnalysisProcessorClientProps {
  analysisId: string;
  images: {
    front: string;
    left: string;
    right: string;
    leftSide: string;
    rightSide: string;
  };
  onComplete?: () => void;
}

export function AnalysisProcessorClient({ 
  analysisId, 
  images, 
  onComplete 
}: AnalysisProcessorClientProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState('Initializing...');
  const [error, setError] = useState<string | null>(null);

  const markReady = api.review.markAnalysisReady.useMutation({
    onSuccess: () => {
      setCurrentStep('Analysis processed. Mark Complete to publish.');
      onComplete?.();
    },
    onError: (error) => {
      setError(error.message);
      setIsProcessing(false);
    }
  });

  const generateExplanation = (sectionKey: string, value: number): string => {
    const explanations: Record<string, (value: number) => string> = {
      // Eye Area
      eye_area_canthal_tilt: (val) => {
        if (val > 0.7) return "Your canthal tilt shows excellent upward positioning, creating a youthful and alert appearance. The angle between your inner and outer eye corners is well-balanced, contributing to an attractive eye shape.";
        if (val > 0.4) return "Your canthal tilt demonstrates good positioning with a slight upward angle. This creates a pleasant, balanced appearance that enhances your natural eye shape.";
        return "Your canthal tilt shows a more horizontal positioning. While this is perfectly natural, a slightly more upward angle could create a more lifted appearance.";
      },
      
      eye_area_upper_eyelid_exposure: (val) => {
        if (val > 0.7) return "Your upper eyelid exposure is well-balanced, showing just the right amount of lid visibility. This creates an open, alert appearance while maintaining natural proportions.";
        if (val > 0.4) return "Your upper eyelid exposure shows good balance with moderate lid visibility. This creates a natural, proportional look that frames your eyes effectively.";
        return "Your upper eyelid exposure is minimal, which can create a more hooded appearance. This is a natural variation and can be quite attractive, giving depth to your eye area.";
      },
      
      eye_area_spacing_symmetry: (val) => {
        if (val > 0.7) return "Your eye spacing and symmetry are excellent, with well-proportioned distance between your eyes and good bilateral symmetry. This creates a harmonious, balanced facial appearance.";
        if (val > 0.4) return "Your eye spacing and symmetry show good proportions with minor asymmetries that are within normal ranges. These subtle differences add character to your unique features.";
        return "Your eye spacing shows some asymmetry, which is completely normal and often adds character to facial features. The spacing appears proportional to your overall facial structure.";
      },
      
      eye_area_periorbital_support: (val) => {
        if (val > 0.7) return "Your periorbital support is excellent, with strong structural support around your eyes. This creates a youthful, well-supported appearance with minimal signs of aging.";
        if (val > 0.4) return "Your periorbital support shows good structural integrity around the eye area. This provides adequate support and contributes to a balanced facial appearance.";
        return "Your periorbital support shows some areas that could benefit from additional support. This is common and can be addressed through various cosmetic approaches if desired.";
      },

      // Nose
      nose_dorsal_profile: (val) => {
        if (val > 0.7) return "Your nasal dorsal profile displays excellent curvature and definition. The bridge flows smoothly from radix to tip, creating an elegant and well-proportioned side profile.";
        if (val > 0.4) return "Your nasal dorsal profile shows good definition with a natural curve. The bridge maintains good proportions and creates a balanced profile view.";
        return "Your nasal dorsal profile shows a more subtle curve. This creates a softer, more natural appearance that complements your overall facial structure.";
      },
      
      nose_tip_rotation: (val) => {
        if (val > 0.7) return "Your nasal tip rotation is well-positioned, creating an optimal angle that enhances your profile. The tip definition is refined and proportional to your other facial features.";
        if (val > 0.4) return "Your nasal tip rotation shows good positioning with a natural angle. The tip appears well-defined and balanced with your overall nasal structure.";
        return "Your nasal tip rotation shows a more conservative angle. This creates a natural, understated appearance that maintains good facial harmony.";
      },
      
      nose_nostril_exposure: (val) => {
        if (val > 0.7) return "Your nostril exposure is well-balanced, showing appropriate visibility that creates natural, proportional nasal aesthetics. The nostrils appear symmetrical and well-defined.";
        if (val > 0.4) return "Your nostril exposure shows good balance with moderate visibility. The nostrils appear symmetrical and proportional to your nasal structure.";
        return "Your nostril exposure is minimal, creating a more refined nasal appearance. This often results in a more elegant profile and can be quite attractive.";
      },
      
      nose_skin_thickness: (val) => {
        if (val > 0.7) return "Your nasal skin thickness appears optimal, providing good definition while maintaining natural flexibility. This creates a refined nasal appearance with good structural support.";
        if (val > 0.4) return "Your nasal skin thickness shows good balance, providing adequate definition while maintaining natural characteristics. This creates a proportional nasal appearance.";
        return "Your nasal skin thickness is on the thinner side, which can create more refined definition but may require careful consideration for any structural changes.";
      },

      // Jaw
      jaw_chin_projection: (val) => {
        if (val > 0.7) return "Your chin projection is excellent, creating strong forward positioning that enhances your profile and jawline definition. This contributes to a well-balanced, attractive facial structure.";
        if (val > 0.4) return "Your chin projection shows good forward positioning that creates a balanced profile. The chin appears proportional to your other facial features.";
        return "Your chin projection is more conservative, creating a softer profile. This can be quite attractive and may complement your overall facial harmony.";
      },
      
      jaw_gonial_angle: (val) => {
        if (val > 0.7) return "Your gonial angle is well-defined, creating an attractive jawline that enhances your facial structure. The angle provides good definition and contributes to a strong, balanced appearance.";
        if (val > 0.4) return "Your gonial angle shows good definition with a natural angle. This creates a balanced jawline that complements your overall facial structure.";
        return "Your gonial angle is more rounded, creating a softer jawline appearance. This can be quite attractive and may provide a more gentle, approachable look.";
      },
      
      jaw_jawline_definition: (val) => {
        if (val > 0.7) return "Your jawline definition is excellent, with clear demarcation between the jaw and neck area. This creates a strong, well-defined facial structure that enhances your overall appearance.";
        if (val > 0.4) return "Your jawline definition shows good clarity with well-defined borders. This creates a balanced facial structure that complements your other features.";
        return "Your jawline definition is more subtle, creating a softer facial contour. This can be quite attractive and may provide a more gentle, approachable appearance.";
      },
      
      jaw_lower_third_prominence: (val) => {
        if (val > 0.7) return "Your lower third prominence is well-balanced, creating excellent facial harmony. The proportion between your lower face and midface is optimal, contributing to an attractive overall structure.";
        if (val > 0.4) return "Your lower third prominence shows good balance with the rest of your facial features. This creates a harmonious appearance with proportional facial thirds.";
        return "Your lower third prominence is more subtle, creating a softer lower facial appearance. This can be quite attractive and may provide a more gentle, approachable look.";
      },

      // Skin
      skin_elasticity: (val) => {
        if (val > 0.7) return "Your skin elasticity is excellent, showing good resilience and bounce-back properties. This indicates healthy skin with good collagen support and minimal signs of aging.";
        if (val > 0.4) return "Your skin elasticity shows good health with moderate resilience. This suggests well-maintained skin with adequate collagen support.";
        return "Your skin elasticity shows some areas that could benefit from additional support. This is common with aging and can be addressed through various skincare approaches.";
      },
      
      skin_damage: (val) => {
        if (val > 0.7) return "Your skin shows minimal damage with excellent overall health. The skin appears well-protected with good texture and minimal signs of environmental stress.";
        if (val > 0.4) return "Your skin shows moderate health with some minor damage. This is normal and can be addressed through proper skincare and protection.";
        return "Your skin shows some signs of damage that could benefit from targeted treatment. This is common and can be improved through various skincare approaches.";
      },
      
      skin_hydration_texture: (val) => {
        if (val > 0.7) return "Your skin hydration and texture are excellent, showing good moisture balance and smooth surface quality. This indicates a healthy skin barrier and good skincare habits.";
        if (val > 0.4) return "Your skin hydration and texture show good health with adequate moisture levels. The surface appears smooth with minor texture variations.";
        return "Your skin hydration and texture could benefit from additional moisture and care. This is common and can be improved through proper skincare routines.";
      },
      
      skin_fine_lines: (val) => {
        if (val > 0.7) return "Your skin shows minimal fine lines with excellent smoothness. This indicates good skin health and effective aging prevention strategies.";
        if (val > 0.4) return "Your skin shows some fine lines that are within normal ranges for your age. These are natural and can be managed through proper skincare.";
        return "Your skin shows more prominent fine lines that could benefit from targeted treatment. This is common and can be addressed through various cosmetic approaches.";
      }
    };

    return explanations[sectionKey]?.(value) || "Analysis data is being processed for this section.";
  };

  const generateAdditionalFeatures = (subtabKey: string, analysis: FacialAnalysis): string => {
    const features: Record<string, (analysis: FacialAnalysis) => string> = {
      eye_area: (analysis) => {
        const { canthalTilt, upperEyelidExposure, spacingSymmetry, periorbitalSupport } = analysis.eyeArea;
        const avgScore = (canthalTilt + upperEyelidExposure + spacingSymmetry + periorbitalSupport) / 4;
        
        if (avgScore > 0.7) {
          return "Your eye area demonstrates excellent structural balance with well-defined features that contribute to an alert and youthful appearance. The combination of your canthal tilt, eyelid exposure, and periorbital support creates a harmonious look that enhances your natural beauty. These features work together to frame your eyes effectively and contribute to overall facial symmetry.";
        } else if (avgScore > 0.4) {
          return "Your eye area shows good structural balance with well-proportioned features. The combination of your eye positioning, lid exposure, and support structures creates an attractive appearance that enhances your natural features. These elements work together to create a balanced and harmonious look.";
        } else {
          return "Your eye area shows unique characteristics that contribute to your individual appearance. While some features may be more subtle, they work together to create a distinctive look that reflects your natural beauty. Each person's eye area is unique and contributes to their overall facial harmony.";
        }
      },
      
      nose: (analysis) => {
        const { dorsalProfile, tipRotation, nostrilExposure, skinThickness } = analysis.nose;
        const avgScore = (dorsalProfile + tipRotation + nostrilExposure + skinThickness) / 4;
        
        if (avgScore > 0.7) {
          return "Your nasal features show excellent proportion and balance, contributing significantly to your facial harmony. The combination of your dorsal profile, tip rotation, and nostril exposure creates a refined appearance that complements your other facial features. The skin thickness and overall nasal structure demonstrate good genetic foundation and natural aging resistance.";
        } else if (avgScore > 0.4) {
          return "Your nasal features show good proportion and balance, contributing well to your overall facial harmony. The combination of your nasal characteristics creates a natural and attractive appearance that complements your other facial features.";
        } else {
          return "Your nasal features show unique characteristics that contribute to your individual appearance. While some features may be more subtle, they work together to create a distinctive look that reflects your natural beauty and facial harmony.";
        }
      },
      
      jaw: (analysis) => {
        const { chinProjection, gonialAngle, jawlineDefinition, lowerThirdProminence } = analysis.jaw;
        const avgScore = (chinProjection + gonialAngle + jawlineDefinition + lowerThirdProminence) / 4;
        
        if (avgScore > 0.7) {
          return "Your jawline demonstrates strong structural definition with excellent proportional balance. The combination of your chin projection, gonial angle, and jawline definition creates a masculine/feminine (as appropriate) appearance that enhances your facial structure. The lower third prominence provides excellent facial balance and contributes to an overall harmonious profile.";
        } else if (avgScore > 0.4) {
          return "Your jawline shows good structural definition with well-balanced proportions. The combination of your jaw characteristics creates an attractive appearance that enhances your facial structure and contributes to overall facial harmony.";
        } else {
          return "Your jawline shows unique characteristics that contribute to your individual appearance. While some features may be more subtle, they work together to create a distinctive look that reflects your natural beauty and facial structure.";
        }
      },
      
      skin: (analysis) => {
        const { elasticity, damage, hydrationTexture, fineLines } = analysis.skin;
        const avgScore = (elasticity + (1 - damage) + hydrationTexture + (1 - fineLines)) / 4;
        
        if (avgScore > 0.7) {
          return "Your skin quality demonstrates excellent health and vitality across multiple parameters. The combination of good elasticity, minimal damage, proper hydration, and fine line management indicates excellent skincare habits and genetic advantages. These factors work together to create a youthful, healthy appearance that enhances your overall facial aesthetics.";
        } else if (avgScore > 0.4) {
          return "Your skin quality shows good health with some areas that could benefit from additional care. The combination of your skin characteristics creates a generally healthy appearance that can be enhanced through proper skincare routines and lifestyle choices.";
        } else {
          return "Your skin shows unique characteristics that reflect your individual journey. While some areas may benefit from targeted care, your skin tells the story of your experiences and can be improved through various skincare approaches and lifestyle modifications.";
        }
      }
    };

    return features[subtabKey]?.(analysis) || "Additional analysis features are being processed for this area.";
  };

  // No per-section values needed now; we only run TF and mark the analysis ready.

  const processAnalysis = async () => {
    setIsProcessing(true);
    setError(null);
    setCurrentStep('Loading TensorFlow…');

    try {
      // Run the original TF analysis (client-side) to validate inputs/landmarks.
      await analyzeAndPrepare(images.front);
      setCurrentStep('Marking analysis ready…');

      // Mark server record as ready (no content written here).
      await markReady.mutateAsync({ analysisId });

    } catch (err) {
      console.error('Error processing analysis:', err);
      setError(err instanceof Error ? err.message : 'Failed to process analysis');
      setIsProcessing(false);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-900">
            Analysis Failed
          </h3>
          <p className="text-sm text-red-700 mt-1">
            {error}
          </p>
          <button 
            onClick={() => {
              setError(null);
              processAnalysis();
            }}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-8">
        <div className="relative">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900"></div>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Processing Your Analysis
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {currentStep}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            This may take a few moments...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Ready to Process Analysis
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Click below to run TensorFlow and mark this analysis ready. Then press “Mark Complete” to publish to the user.
        </p>
        <button 
          onClick={processAnalysis}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Start Analysis
        </button>
      </div>
    </div>
  );
}
