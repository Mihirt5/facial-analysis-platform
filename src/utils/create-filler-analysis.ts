import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { analysisSectionContent } from "~/server/db/schema";
import {
  getAllSectionKeys,
  ANALYSIS_STRUCTURE,
} from "~/lib/analysis-structure";

// Filler content for each section type
const FILLER_CONTENT = {
  // Eye Area sections
  eye_area_canthal_tilt: {
    image:
      "https://images.unsplash.com/photo-1559582930-2b0c8c4b5b3b?w=400&h=300&fit=crop",
    explanation:
      "Your canthal tilt shows a neutral to slightly positive angle, which is considered aesthetically pleasing. The outer corners of your eyes are positioned at approximately the same level as the inner corners, creating a balanced and harmonious appearance. This feature contributes to an alert and youthful look.",
  },
  eye_area_upper_eyelid_exposure: {
    image:
      "https://images.unsplash.com/photo-1559582930-2b0c8c4b5b3b?w=400&h=300&fit=crop",
    explanation:
      "Your upper eyelid exposure is within the ideal range. There is a subtle amount of eyelid space visible when your eyes are open, which creates depth and dimension. This balanced exposure enhances your natural eye shape without appearing hooded or overly prominent.",
  },
  eye_area_spacing_symmetry: {
    image:
      "https://images.unsplash.com/photo-1559582930-2b0c8c4b5b3b?w=400&h=300&fit=crop",
    explanation:
      "The spacing between your eyes follows the golden ratio proportions, with approximately one eye-width between your eyes. Both eyes appear symmetrical in size and positioning, contributing to facial harmony. Minor asymmetries are natural and add character to your unique features.",
  },
  eye_area_periorbital_support: {
    image:
      "https://images.unsplash.com/photo-1559582930-2b0c8c4b5b3b?w=400&h=300&fit=crop",
    explanation:
      "Your periorbital area shows good structural support with well-defined cheekbones that provide a strong foundation for your eyes. The under-eye area appears smooth with minimal hollowing, indicating good volume distribution and youthful appearance.",
  },

  // Nose sections
  nose_dorsal_profile: {
    image:
      "https://images.unsplash.com/photo-1506634572416-48cdfe530110?w=400&h=300&fit=crop",
    explanation:
      "Your nasal dorsal profile displays a gentle, natural curve that complements your facial structure. The bridge flows smoothly from the radix to the tip, creating an elegant silhouette in profile view. This refined profile enhances your overall facial harmony.",
  },
  nose_tip_rotation: {
    image:
      "https://images.unsplash.com/photo-1506634572416-48cdfe530110?w=400&h=300&fit=crop",
    explanation:
      "The rotation of your nasal tip is well-balanced, positioned at an optimal angle that provides good projection without appearing over-rotated. The tip definition is refined, creating a natural and proportionate appearance that suits your facial features.",
  },
  nose_nostril_exposure: {
    image:
      "https://images.unsplash.com/photo-1506634572416-48cdfe530110?w=400&h=300&fit=crop",
    explanation:
      "Your nostril exposure is minimal and aesthetically pleasing when viewed from the front. The nostrils are symmetrical and proportionate to your nasal base width, contributing to a refined and balanced nasal appearance.",
  },
  nose_skin_thickness: {
    image:
      "https://images.unsplash.com/photo-1506634572416-48cdfe530110?w=400&h=300&fit=crop",
    explanation:
      "Your nasal skin thickness appears to be in the medium range, which allows for good tip definition while maintaining a natural appearance. This skin quality provides an ideal balance between refinement and natural texture.",
  },

  // Jaw sections
  jaw_chin_projection: {
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop",
    explanation:
      "Your chin projection demonstrates excellent forward positioning that creates a strong, defined jawline. The projection is proportionate to your other facial features, contributing to a balanced profile and enhancing your overall facial structure.",
  },
  jaw_gonial_angle: {
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop",
    explanation:
      "The gonial angle of your jaw shows optimal angulation, creating a well-defined jawline without appearing overly sharp or soft. This angle contributes to a masculine/feminine (as appropriate) appearance while maintaining natural proportions.",
  },
  jaw_jawline_definition: {
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop",
    explanation:
      "Your jawline definition is excellent, with clear demarcation between the jaw and neck area. The mandibular border is well-defined, creating an attractive silhouette that enhances your facial structure and provides a strong foundation for your features.",
  },
  jaw_lower_third_prominence: {
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop",
    explanation:
      "The prominence of your lower third is well-balanced with your mid and upper facial thirds. This proportional relationship creates facial harmony and ensures that no single area dominates your appearance, resulting in a naturally attractive facial structure.",
  },

  // Skin sections
  skin_elasticity: {
    image:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&h=300&fit=crop",
    explanation:
      "Your skin demonstrates good elasticity with minimal signs of laxity. The skin appears firm and resilient, indicating healthy collagen and elastin levels. This elasticity contributes to a youthful appearance and suggests good skin health overall.",
  },
  skin_damage: {
    image:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&h=300&fit=crop",
    explanation:
      "Your skin shows minimal signs of photodamage or environmental stress. Any minor imperfections are within normal ranges and do not significantly impact your overall skin quality. Maintaining good sun protection will help preserve this healthy appearance.",
  },
  skin_hydration_texture: {
    image:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&h=300&fit=crop",
    explanation:
      "Your skin texture appears smooth and well-hydrated with good moisture retention. The surface quality is even with minimal visible pores or texture irregularities. This indicates a good skincare routine and healthy skin barrier function.",
  },
  skin_fine_lines: {
    image:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&h=300&fit=crop",
    explanation:
      "Fine lines are minimal and appropriate for your age, primarily appearing in natural expression areas. These subtle lines add character without significantly aging your appearance. The overall skin quality suggests good care and natural aging patterns.",
  },
};

// Filler additional features content for each subtab
const ADDITIONAL_FEATURES_CONTENT = {
  eye_area:
    "Your eye area demonstrates excellent structural balance with well-defined features that contribute to an alert and youthful appearance. The combination of your canthal tilt, eyelid exposure, and periorbital support creates a harmonious look that enhances your natural beauty. These features work together to frame your eyes effectively and contribute to overall facial symmetry.",
  nose: "Your nasal features show excellent proportion and balance, contributing significantly to your facial harmony. The combination of your dorsal profile, tip rotation, and nostril exposure creates a refined appearance that complements your other facial features. The skin thickness and overall nasal structure demonstrate good genetic foundation and natural aging resistance.",
  jaw: "Your jawline demonstrates strong structural definition with excellent proportional balance. The combination of chin projection, gonial angle, and jawline definition creates a masculine/feminine (as appropriate) appearance that enhances your facial structure. The lower third prominence provides excellent facial balance and contributes to an overall harmonious profile.",
  skin: "Your skin quality demonstrates excellent health and vitality across multiple parameters. The combination of good elasticity, minimal damage, proper hydration, and fine line management indicates excellent skincare habits and genetic advantages. These factors work together to create a youthful, healthy appearance that enhances your overall facial aesthetics.",
};

/**
 * Creates filler analysis content for all sections of a given analysis
 * This is useful for testing and development purposes
 */
export async function createFillerAnalysisContent(analysisId: string) {
  try {
    const allSectionKeys = getAllSectionKeys();
    const allSubtabKeys = ANALYSIS_STRUCTURE.map((subtab) => subtab.key);

    // Check which sections already have content
    const existingContent = await db.query.analysisSectionContent.findMany({
      where: (content, { eq }) => eq(content.analysisId, analysisId),
    });

    const existingSectionKeys = existingContent.map(
      (content) => content.sectionKey,
    );

    // Find missing sections
    const missingSectionKeys = allSectionKeys.filter(
      (key) => !existingSectionKeys.includes(key),
    );

    // Find missing additional features (subtabs without additional features)
    const existingAdditionalFeaturesKeys = existingContent
      .filter(
        (content) =>
          content.additionalFeatures &&
          content.additionalFeatures.trim() !== "",
      )
      .map((content) => content.sectionKey);

    const missingAdditionalFeaturesKeys = allSubtabKeys.filter(
      (key) => !existingAdditionalFeaturesKeys.includes(key),
    );

    console.log(
      `Creating filler content for ${missingSectionKeys.length} missing sections and ${missingAdditionalFeaturesKeys.length} missing additional features...`,
    );

    const contentToInsert = [];

    // Create content for missing sections
    const sectionContentToInsert = missingSectionKeys
      .map((sectionKey) => {
        const fillerData =
          FILLER_CONTENT[sectionKey as keyof typeof FILLER_CONTENT];

        if (!fillerData) {
          console.warn(`No filler data found for section: ${sectionKey}`);
          return null;
        }

        return {
          id: `content_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          analysisId,
          sectionKey,
          image: fillerData.image,
          explanation: fillerData.explanation,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    // Create additional features content for missing subtabs
    const additionalFeaturesContentToInsert = missingAdditionalFeaturesKeys
      .map((subtabKey) => {
        const additionalFeaturesText =
          ADDITIONAL_FEATURES_CONTENT[
            subtabKey as keyof typeof ADDITIONAL_FEATURES_CONTENT
          ];

        if (!additionalFeaturesText) {
          console.warn(
            `No additional features data found for subtab: ${subtabKey}`,
          );
          return null;
        }

        // Check if this subtab already has a record (but without additional features)
        const existingRecord = existingContent.find(
          (content) => content.sectionKey === subtabKey,
        );

        if (existingRecord) {
          // Update existing record with additional features
          return {
            id: existingRecord.id,
            analysisId,
            sectionKey: subtabKey,
            image: existingRecord.image,
            explanation: existingRecord.explanation,
            additionalFeatures: additionalFeaturesText,
            isUpdate: true,
          };
        } else {
          // Create new record for additional features only
          return {
            id: `content_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            analysisId,
            sectionKey: subtabKey,
            additionalFeatures: additionalFeaturesText,
          };
        }
      })
      .filter(Boolean);

    contentToInsert.push(...sectionContentToInsert);

    // Handle updates and inserts for additional features
    // First filter out null values, then separate updates from inserts
    const validAdditionalFeatures = additionalFeaturesContentToInsert.filter(
      (item) => item !== null,
    );
    const updatesToPerform = validAdditionalFeatures.filter(
      (item) => item.isUpdate,
    );
    const insertsToPerform = validAdditionalFeatures.filter(
      (item) => !item.isUpdate,
    );

    let totalCreated = 0;

    // Insert new section content
    if (sectionContentToInsert.length > 0) {
      await db.insert(analysisSectionContent).values(sectionContentToInsert);
      totalCreated += sectionContentToInsert.length;
      console.log(
        `Successfully created ${sectionContentToInsert.length} section content entries`,
      );
    }

    // Insert new additional features content
    if (insertsToPerform.length > 0) {
      const cleanedInserts = insertsToPerform.map(({ ...item }) => item);
      await db.insert(analysisSectionContent).values(cleanedInserts);
      totalCreated += insertsToPerform.length;
      console.log(
        `Successfully created ${insertsToPerform.length} additional features entries`,
      );
    }

    // Update existing records with additional features
    if (updatesToPerform.length > 0) {
      for (const update of updatesToPerform) {
        if (update?.id) {
          await db
            .update(analysisSectionContent)
            .set({ additionalFeatures: update.additionalFeatures })
            .where(eq(analysisSectionContent.id, update.id));
        }
      }
      totalCreated += updatesToPerform.length;
      console.log(
        `Successfully updated ${updatesToPerform.length} records with additional features`,
      );
    }

    if (totalCreated === 0) {
      console.log(
        "No missing sections or additional features found - analysis already complete",
      );
    }

    return {
      success: true,
      created: totalCreated,
      total: allSectionKeys.length + allSubtabKeys.length,
      message: `Created/updated ${totalCreated} content entries (${sectionContentToInsert.length} sections, ${additionalFeaturesContentToInsert.length} additional features)`,
    };
  } catch (error) {
    console.error("Error creating filler analysis content:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Creates filler content for a specific section
 */
export async function createFillerSectionContent(
  analysisId: string,
  sectionKey: string,
) {
  try {
    const fillerData =
      FILLER_CONTENT[sectionKey as keyof typeof FILLER_CONTENT];

    if (!fillerData) {
      throw new Error(`No filler data found for section: ${sectionKey}`);
    }

    // Check if content already exists
    const existingContent = await db.query.analysisSectionContent.findFirst({
      where: (content, { eq, and }) =>
        and(
          eq(content.analysisId, analysisId),
          eq(content.sectionKey, sectionKey),
        ),
    });

    if (existingContent) {
      return {
        success: false,
        message: "Content already exists for this section",
      };
    }

    const contentId = `content_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    await db.insert(analysisSectionContent).values({
      id: contentId,
      analysisId,
      sectionKey,
      image: fillerData.image,
      explanation: fillerData.explanation,
    });

    return {
      success: true,
      message: `Created filler content for section: ${sectionKey}`,
    };
  } catch (error) {
    console.error("Error creating filler section content:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
