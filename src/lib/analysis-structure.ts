// Predefined analysis structure - these are static and should not be changed
export interface AnalysisSection {
  key: string;
  name: string;
  displayOrder: number;
  description: string;
}

export interface AnalysisSubtab {
  key: string;
  name: string;
  displayOrder: number;
  sections: AnalysisSection[];
}

export const ANALYSIS_STRUCTURE: AnalysisSubtab[] = [
  // 1. Overview
  {
    key: "overview",
    name: "Overview",
    displayOrder: 1,
    sections: [
      {
        key: "overview_facial_harmony",
        name: "Facial Harmony",
        displayOrder: 1,
        description: "Overall balance and proportion of facial features",
      },
      {
        key: "overview_symmetry",
        name: "Facial Symmetry",
        displayOrder: 2,
        description: "Left-right balance and mirror symmetry",
      },
      {
        key: "overview_masculinity_femininity",
        name: "Masculinity/Femininity",
        displayOrder: 3,
        description: "Gender-typical features and dimorphism",
      },
      {
        key: "overview_youthfulness",
        name: "Youthfulness",
        displayOrder: 4,
        description: "Age-related features and aging signs",
      },
      {
        key: "overview_face_shape",
        name: "Face Shape",
        displayOrder: 5,
        description: "Overall face shape classification and suitability",
      },
      {
        key: "overview_attractiveness",
        name: "Overall Attractiveness",
        displayOrder: 6,
        description: "Holistic aesthetic appeal and presence",
      },
    ],
  },
  
  // 2. Brow & Eye Area
  {
    key: "brow_eye",
    name: "Brow & Eye Area",
    displayOrder: 2,
    sections: [
      {
        key: "brow_shape_structure",
        name: "Brow Shape & Structure",
        displayOrder: 1,
        description: "Shape, thickness, definition, and arch",
      },
      {
        key: "brow_positioning",
        name: "Brow Positioning",
        displayOrder: 2,
        description: "Lift, tilt, start/end points, tail length",
      },
      {
        key: "eye_shape_size",
        name: "Eye Shape & Size",
        displayOrder: 3,
        description: "Shape, symmetry, width, height, depth",
      },
      {
        key: "eye_canthal_tilt",
        name: "Canthal Tilt",
        displayOrder: 4,
        description: "Angle between inner and outer eye corners",
      },
      {
        key: "eyelids_corners",
        name: "Eyelids & Corners",
        displayOrder: 5,
        description: "Exposure, corner shape, scleral show, hooding",
      },
      {
        key: "undereye_area",
        name: "Under-Eye Area",
        displayOrder: 6,
        description: "Pigmentation, puffiness, hollowness, support",
      },
      {
        key: "eye_other_metrics",
        name: "Other Eye Metrics",
        displayOrder: 7,
        description: "Iris color, limbal ring, epicanthic fold, spacing",
      },
    ],
  },
  
  // 3. Nose
  {
    key: "nose",
    name: "Nose",
    displayOrder: 3,
    sections: [
      {
        key: "nose_bridge_dorsal",
        name: "Bridge & Dorsal Profile",
        displayOrder: 1,
        description: "Bridge width, shape, dorsal line",
      },
      {
        key: "nose_tip_rotation",
        name: "Tip & Rotation",
        displayOrder: 2,
        description: "Tip definition, rotation, projection",
      },
      {
        key: "nose_symmetry_alignment",
        name: "Symmetry & Alignment",
        displayOrder: 3,
        description: "Columella, septum, deviation",
      },
      {
        key: "nose_nostril_details",
        name: "Nostril Details",
        displayOrder: 4,
        description: "Shape, flare, exposure, balance",
      },
      {
        key: "nose_angles",
        name: "Angles & Relationships",
        displayOrder: 5,
        description: "Nasofrontal, nasolabial, supratip break",
      },
    ],
  },
  
  // 4. Lips & Mouth
  {
    key: "lips_mouth",
    name: "Lips & Mouth",
    displayOrder: 4,
    sections: [
      {
        key: "lip_shape_proportion",
        name: "Lip Shape & Proportion",
        displayOrder: 1,
        description: "Fullness, ratios, Cupid's bow",
      },
      {
        key: "lip_definition_surface",
        name: "Definition & Surface",
        displayOrder: 2,
        description: "Vermilion border, smoothness, lip lines",
      },
      {
        key: "lip_color_contrast",
        name: "Color & Contrast",
        displayOrder: 3,
        description: "Natural lip color, contrast with skin",
      },
      {
        key: "smile_dynamics",
        name: "Smile Dynamics",
        displayOrder: 4,
        description: "Tooth show, symmetry, gum visibility",
      },
      {
        key: "mouth_additional",
        name: "Additional Metrics",
        displayOrder: 5,
        description: "Buccal corridors, Duchenne activation, philtrum",
      },
    ],
  },
  
  // 5. Cheeks & Midface
  {
    key: "cheeks_midface",
    name: "Cheeks & Midface",
    displayOrder: 5,
    sections: [
      {
        key: "cheekbone_prominence",
        name: "Cheekbone Prominence",
        displayOrder: 1,
        description: "Height, width, and projection of cheekbones",
      },
      {
        key: "midface_volume",
        name: "Midface Volume",
        displayOrder: 2,
        description: "Fullness and support in the midface region",
      },
      {
        key: "cheek_hollows",
        name: "Cheek Hollows",
        displayOrder: 3,
        description: "Depth and definition of cheek hollows",
      },
      {
        key: "midface_proportions",
        name: "Midface Proportions",
        displayOrder: 4,
        description: "Balance of midface height and width",
      },
      {
        key: "ogee_curve",
        name: "Ogee Curve",
        displayOrder: 5,
        description: "S-curve from temple to cheek to jaw",
      },
    ],
  },
  
  // 6. Jaw & Chin
  {
    key: "jaw_chin",
    name: "Jaw & Chin",
    displayOrder: 6,
    sections: [
      {
        key: "jaw_shape",
        name: "Jaw Shape",
        displayOrder: 1,
        description: "Overall jaw shape and structure",
      },
      {
        key: "jaw_width",
        name: "Jaw Width",
        displayOrder: 2,
        description: "Bigonial width and facial frame",
      },
      {
        key: "jaw_angle",
        name: "Gonial Angle",
        displayOrder: 3,
        description: "Angle at the jaw corner near the ear",
      },
      {
        key: "jawline_definition",
        name: "Jawline Definition",
        displayOrder: 4,
        description: "Clarity and sharpness of the jawline",
      },
      {
        key: "chin_projection",
        name: "Chin Projection",
        displayOrder: 5,
        description: "Forward prominence of the chin",
      },
      {
        key: "chin_width_shape",
        name: "Chin Width & Shape",
        displayOrder: 6,
        description: "Width and contour of the chin",
      },
      {
        key: "chin_inclination",
        name: "Chin Inclination",
        displayOrder: 7,
        description: "Angle and tilt of the chin",
      },
      {
        key: "submental_area",
        name: "Submental Area",
        displayOrder: 8,
        description: "Neck-jaw transition and submental definition",
      },
    ],
  },
  
  // 7. Ears
  {
    key: "ears",
    name: "Ears",
    displayOrder: 7,
    sections: [
      {
        key: "ear_size",
        name: "Ear Size",
        displayOrder: 1,
        description: "Overall size relative to face",
      },
      {
        key: "ear_shape",
        name: "Ear Shape",
        displayOrder: 2,
        description: "Contour and structure of the ear",
      },
      {
        key: "ear_protrusion",
        name: "Ear Protrusion",
        displayOrder: 3,
        description: "How far ears stick out from head",
      },
      {
        key: "ear_symmetry",
        name: "Ear Symmetry",
        displayOrder: 4,
        description: "Balance between left and right ears",
      },
      {
        key: "ear_position",
        name: "Ear Position",
        displayOrder: 5,
        description: "Height and alignment relative to eyes",
      },
    ],
  },
  
  // 8. Skin & Texture
  {
    key: "skin_texture",
    name: "Skin & Texture",
    displayOrder: 8,
    sections: [
      {
        key: "skin_tone_evenness",
        name: "Skin Tone & Evenness",
        displayOrder: 1,
        description: "Uniformity and consistency of skin color",
      },
      {
        key: "skin_texture_quality",
        name: "Texture Quality",
        displayOrder: 2,
        description: "Surface smoothness and refinement",
      },
      {
        key: "skin_pores",
        name: "Pore Size & Visibility",
        displayOrder: 3,
        description: "Size and prominence of pores",
      },
      {
        key: "skin_acne_blemishes",
        name: "Acne & Blemishes",
        displayOrder: 4,
        description: "Active breakouts, scarring, imperfections",
      },
      {
        key: "skin_pigmentation",
        name: "Pigmentation Issues",
        displayOrder: 5,
        description: "Dark spots, hyperpigmentation, melasma",
      },
      {
        key: "skin_redness_sensitivity",
        name: "Redness & Sensitivity",
        displayOrder: 6,
        description: "Flushing, rosacea, vascular issues",
      },
      {
        key: "skin_aging_signs",
        name: "Aging Signs",
        displayOrder: 7,
        description: "Fine lines, wrinkles, elasticity loss",
      },
      {
        key: "skin_overall_health",
        name: "Overall Skin Health",
        displayOrder: 8,
        description: "General vitality and health of skin",
      },
    ],
  },
  
  // 9. Hairline & Forehead
  {
    key: "hairline_forehead",
    name: "Hairline & Forehead",
    displayOrder: 9,
    sections: [
      {
        key: "hairline_shape",
        name: "Hairline Shape",
        displayOrder: 1,
        description: "Shape and contour of the hairline",
      },
      {
        key: "hairline_position",
        name: "Hairline Position",
        displayOrder: 2,
        description: "Height and placement on forehead",
      },
      {
        key: "hairline_recession",
        name: "Recession & Thinning",
        displayOrder: 3,
        description: "Signs of hair loss or recession",
      },
      {
        key: "hair_density_temples",
        name: "Hair Density at Temples",
        displayOrder: 4,
        description: "Thickness at hairline and temples",
      },
      {
        key: "forehead_height",
        name: "Forehead Height",
        displayOrder: 5,
        description: "Vertical proportion of forehead",
      },
      {
        key: "forehead_width",
        name: "Forehead Width",
        displayOrder: 6,
        description: "Horizontal proportion and shape",
      },
      {
        key: "forehead_slope",
        name: "Forehead Slope",
        displayOrder: 7,
        description: "Angle and projection of forehead",
      },
    ],
  },
];

// Helper function to get all section keys
export const getAllSectionKeys = (): string[] => {
  return ANALYSIS_STRUCTURE.flatMap((subtab) =>
    subtab.sections.map((section) => section.key),
  );
};

// Helper function to find section by key
export const findSectionByKey = (
  key: string,
): (AnalysisSection & { subtab: AnalysisSubtab }) | null => {
  for (const subtab of ANALYSIS_STRUCTURE) {
    const section = subtab.sections.find((s) => s.key === key);
    if (section) {
      return { ...section, subtab };
    }
  }
  return null;
};

