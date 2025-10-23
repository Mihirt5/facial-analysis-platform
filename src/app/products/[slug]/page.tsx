import Image from "next/image";
import Link from "next/link";

const PRODUCTS: Record<string, {
  title: string;
  hero: string;
  short: string;
  description: string;
  benefits: Array<{
    title: string;
    description: string;
  }>;
  dosing: {
    frequency: string;
    timing: string;
    amount: string;
    duration: string;
    instructions: Array<{
      day: string;
      instruction: string;
      time?: string;
    }>;
  };
  priceMonthly?: string;
  priceFull?: string;
}> = {
  "ru-58841": {
    title: "RU 58841 Topical",
    hero: "/RU 58841 Topical.png",
    short: "Topical anti-androgen to help reduce DHT activity at the follicle.",
    description: "RU 58841 is a research anti-androgen applied topically. It acts at androgen receptors in the scalp to reduce DHT signaling locally, which may help decrease shedding and preserve density. For cosmetic research purposes only.",
    benefits: [
      { title: "Local Anti-Androgen", description: "Targets receptors at the scalp to reduce androgen signaling without systemic dosing." },
      { title: "Shedding Control", description: "May help stabilize active shedding and protect miniaturizing follicles." },
      { title: "Stack Compatible", description: "Often used alongside minoxidil or oral DHT blockers in a comprehensive routine." },
    ],
    dosing: {
      frequency: "Once daily",
      timing: "Evening",
      amount: "1 ml dropper to thinning areas",
      duration: "8–12 weeks for visible changes",
      instructions: [
        { day: "Week 1-4", instruction: "Apply 1 ml nightly to dry scalp; allow to dry fully." },
        { day: "Week 5-8", instruction: "Continue nightly; shedding may stabilize." },
        { day: "Week 9-12", instruction: "Maintain use to support density at hairline and crown." },
      ]
    },
    priceMonthly: "$49",
  },
  "azelaic-acid": {
    title: "Azelaic Acid 15%",
    hero: "/Azalaec_acid.png",
    short: "Targets acne, calms redness, and evens tone for clearer skin.",
    description: "Azelaic Acid is a multi-functional dicarboxylic acid that helps reduce acne-causing bacteria, unclog pores, and fade post-inflammatory hyperpigmentation. Its anti-inflammatory properties soothe redness and support a more even complexion.",
    benefits: [
      { title: "Acne & Congestion", description: "Helps reduce C. acnes bacteria and normalize keratinization to keep pores clear." },
      { title: "Redness & Rosacea-Prone Skin", description: "Calms visible redness and irritation for a more balanced appearance." },
      { title: "Tone & Texture", description: "Fades dark marks and smooths rough texture over consistent use." },
    ],
    dosing: {
      frequency: "Once or twice daily",
      timing: "Morning and/or evening",
      amount: "Pea-sized layer to affected areas",
      duration: "8–12 weeks for best results",
      instructions: [
        { day: "Week 1-2", instruction: "Apply a thin layer once daily; moisturize after." },
        { day: "Week 3-6", instruction: "Increase to twice daily as tolerated; use sunscreen AM." },
        { day: "Week 7-12", instruction: "Maintain use to fade marks and keep pores clear." },
      ]
    },
    priceMonthly: "$49",
  },
  "dutasteride": {
    title: "Dutasteride",
    hero: "/newdutasteride.png",
    short: "Blocks DHT more broadly than finasteride to slow shedding and preserve density.",
    description: "Dutasteride inhibits both type I and type II 5-alpha-reductase, leading to a greater reduction in DHT compared to finasteride. Lower DHT levels help protect vulnerable follicles, reduce shedding, and may support regrowth over time.",
    benefits: [
      {
        title: "Broader DHT Suppression",
        description: "Targets both type I and II 5-alpha-reductase to reduce DHT levels more comprehensively in scalp tissue."
      },
      {
        title: "Hair Preservation",
        description: "Helps slow recession and thinning at the hairline and crown by protecting miniaturizing follicles."
      },
      {
        title: "Potential Regrowth",
        description: "Sustained suppression of DHT may allow some follicles to recover thickness and coverage."
      }
    ],
    dosing: {
      frequency: "Once daily",
      timing: "Morning with food",
      amount: "0.5mg capsule",
      duration: "6–12 months for visible results",
      instructions: [
        { day: "Month 1-3", instruction: "Take 0.5mg capsule daily with breakfast", time: "8 AM" },
        { day: "Month 4-6", instruction: "Continue daily – shedding may stabilize", time: "8 AM" },
        { day: "Month 7-12", instruction: "Full treatment – coverage and density may improve", time: "8 AM" },
      ]
    },
    priceMonthly: "$59",
  },
  "bpc-157": {
    title: "BPC 157",
    hero: "/BPC157.png",
    short: "Supports tissue recovery and calms inflammation for healthier-looking skin.",
    description: "BPC 157 (Body Protection Compound) is a research peptide studied for its potential to promote tissue repair and modulate inflammation. In cosmetic contexts, improved recovery can support clearer skin and better tolerance to active routines.",
    benefits: [
      { title: "Recovery Support", description: "Studied to aid tissue repair and resilience, supporting skin that handles actives better." },
      { title: "Inflammation Modulation", description: "May help calm visible redness and post-treatment irritation." },
      { title: "Stack Friendly", description: "Often combined with retinoids or exfoliants to support overall routine tolerance." },
    ],
    dosing: {
      frequency: "Once daily",
      timing: "Morning or evening",
      amount: "As directed",
      duration: "4–8 weeks to assess response",
      instructions: [
        { day: "Week 1-2", instruction: "Begin once daily; monitor tolerance." },
        { day: "Week 3-4", instruction: "Continue daily; pair with moisturizer and SPF." },
        { day: "Week 5-8", instruction: "Maintain use to support recovery and skin clarity." },
      ]
    },
    priceMonthly: "$49",
  },
  "retatutride": {
    title: "Retatutride",
    hero: "/Retatutride.png",
    short: "Multi-receptor incretin that supports fat loss for more defined facial contours.",
    description: "Retatutride is a next-generation incretin therapy researched for comprehensive metabolic support. By improving insulin sensitivity and satiety signaling, it can help reduce overall and facial adiposity, revealing cleaner lines through the cheeks and a sharper mandibular angle for a more defined jawline.",
    benefits: [
      { title: "Facial Fat Reduction", description: "Lower adiposity around the cheeks and submandibular area can increase jaw visibility." },
      { title: "Whole‑Body Recomposition", description: "Supports steady fat loss while helping preserve lean mass with diet and training." },
      { title: "Metabolic Efficiency", description: "Enhanced satiety and glucose control help maintain a consistent calorie deficit." },
    ],
    dosing: {
      frequency: "Weekly",
      timing: "As prescribed",
      amount: "Per protocol",
      duration: "12–24 weeks for visible changes",
      instructions: [
        { day: "Weeks 1-4", instruction: "Initiate weekly dose; monitor GI tolerance and hydration." },
        { day: "Weeks 5-12", instruction: "Continue weekly; pair with high-protein diet and light resistance training." },
        { day: "Weeks 13-24", instruction: "Maintain schedule; expect progressive facial and waist reductions." },
      ]
    },
    priceMonthly: "$349",
  },
  "trt": {
    title: "TRT (Testosterone)",
    hero: "/TRT.png",
    short: "Restores optimal testosterone to accelerate fat loss and carve a stronger jawline.",
    description: "Testosterone Replacement Therapy (TRT) provides a direct, reliable increase in serum testosterone. Elevated testosterone drives nutrient partitioning and lean mass retention while reducing visceral and subcutaneous fat. In the face, decreases in buccal and submandibular fullness can unmask cheek structure and sharpen the mandibular angle—producing a visibly stronger jawline and more athletic proportions.",
    benefits: [
      { title: "Jawline Definition", description: "Lower facial fat with better muscle tone around the masseter and neck highlights bone structure." },
      { title: "Body Recomposition", description: "Improves nutrient partitioning—supporting lean mass while steadily reducing fat." },
      { title: "Energy & Drive", description: "Higher testosterone supports training intensity and adherence to a fat‑loss plan." },
    ],
    dosing: {
      frequency: "Weekly or bi‑weekly",
      timing: "As prescribed",
      amount: "Per protocol",
      duration: "12–24 weeks for visible changes",
      instructions: [
        { day: "Weeks 1-4", instruction: "Initiate dose; monitor hematology, lipids, and blood pressure." },
        { day: "Weeks 5-12", instruction: "Continue per protocol; pair with strength training and high‑protein diet." },
        { day: "Weeks 13-24", instruction: "Maintain schedule; expect progressive fat loss and stronger facial definition." },
      ]
    },
    priceMonthly: "$199",
  },
  "latisse": {
    title: "Latisse",
    hero: "/Latisse.png",
    short: "Boosts eyelash length, thickness, and darkness to frame the eyes.",
    description: "Latisse (bimatoprost) is an FDA-approved prescription treatment for hypotrichosis of the eyelashes, designed to promote longer, thicker, and darker eyelashes. Originally developed as a glaucoma medication, its eyelash-growing properties were discovered as a beneficial side effect. Latisse works by extending the growth phase of the eyelash cycle and increasing the number of hairs in the growth phase.",
    benefits: [
      {
        title: "Enhanced Eyelash Growth",
        description: "Clinical studies have shown that Latisse can significantly increase eyelash length, thickness, and darkness. The treatment works by prolonging the anagen (growth) phase of the eyelash cycle, allowing lashes to grow longer before entering the resting phase."
      },
      {
        title: "Improved Eyelash Density",
        description: "Research indicates that Latisse may increase the number of eyelashes in the growth phase, resulting in fuller, more voluminous lashes that frame the eyes beautifully."
      },
      {
        title: "FDA-Approved Safety",
        description: "Latisse is the only FDA-approved prescription treatment for inadequate or not having enough eyelashes. It has undergone rigorous clinical testing to ensure safety and efficacy when used as directed."
      }
    ],
    dosing: {
      frequency: "Once daily",
      timing: "Evening",
      amount: "1 drop per eye",
      duration: "16 weeks for full results",
      instructions: [
        { day: "Week 1-4", instruction: "Apply 1 drop to upper eyelid margin once daily in the evening", time: "8 PM" },
        { day: "Week 5-8", instruction: "Continue daily application, you may notice longer lashes", time: "8 PM" },
        { day: "Week 9-12", instruction: "Full eyelash growth phase - maintain daily routine", time: "8 PM" },
        { day: "Week 13-16", instruction: "Peak results achieved - continue for maintenance", time: "8 PM" },
      ]
    },
    priceMonthly: "$39",
    priceFull: "$45",
  },
  "ghk-cu": {
    title: "GHK-Cu Injection",
    hero: "/GHK-CU.png",
    short: "Copper peptide studied to support collagen and skin rejuvenation.",
    description: "GHK-Cu is a powerful copper peptide studied for its potential to support skin rejuvenation, wound healing, and hair health. Research suggests it may promote collagen and elastin production, helping improve skin firmness, elasticity, and the appearance of fine lines and discoloration. Additionally, GHK-Cu has been explored for its ability to enhance tissue repair, support hair follicle health, and help regulate inflammation, making it a promising option for overall skin and cellular vitality.",
    benefits: [
      {
        title: "Skin Rejuvenation & Anti-Aging",
        description: "GHK-Cu has been studied for its role in improving skin health and appearance. Research suggests it may help promote collagen and elastin production, which are essential for skin firmness and elasticity. Studies indicate it may help reduce wrinkles, sagging, and hyperpigmentation, contributing to smoother, more resilient skin."
      },
      {
        title: "Wound Healing & Tissue Repair",
        description: "GHK-Cu has been explored for its potential to accelerate wound healing and tissue regeneration by stimulating cell migration and new blood vessel formation. Studies suggest it may promote faster wound closure and reduce scar formation, supporting the body's natural healing process."
      },
      {
        title: "Hair Growth Support",
        description: "Preliminary research suggests GHK-Cu may support hair follicle stimulation and hair growth. Studies indicate it may help prolong the hair growth (anagen) phase and improve follicle cell proliferation, potentially aiding those experiencing hair thinning or certain types of alopecia under medical guidance."
      },
      {
        title: "Anti-Inflammatory Effects",
        description: "GHK-Cu has been studied for its ability to help regulate the body's inflammatory response by modulating cytokines and chemokines. This means it may help calm excessive inflammation, supporting tissue recovery and reducing the impact of chronic inflammation on aging and healing."
      },
      {
        title: "Antioxidant & Cell Protective Properties",
        description: "Research suggests GHK-Cu has antioxidant properties that may help neutralize free radicals and protect cells from oxidative damage, which is a key factor in aging and chronic conditions. By reducing inflammation and oxidative stress, GHK-Cu may support overall skin and tissue health."
      }
    ],
    dosing: {
      frequency: "Weekly injections",
      timing: "As prescribed",
      amount: "0.25-1mg per injection",
      duration: "12-16 weeks for initial results",
      instructions: [
        { day: "Week 1-2", instruction: "Initial injections - may experience mild injection site reactions", time: "As scheduled" },
        { day: "Week 3-6", instruction: "Regular injection schedule - skin may begin to show improved texture", time: "As scheduled" },
        { day: "Week 7-12", instruction: "Mid-treatment phase - collagen production increases", time: "As scheduled" },
        { day: "Week 13-16", instruction: "Full treatment cycle - optimal skin rejuvenation results", time: "As scheduled" },
      ]
    },
    priceMonthly: "$175",
  },
  "finasteride": {
    title: "Finasteride",
    hero: "/finasteride.png",
    short: "Reduces DHT to slow shedding and preserve hairline density.",
    description: "Finasteride is an FDA-approved prescription medication that works by inhibiting the enzyme 5-alpha-reductase, which converts testosterone to dihydrotestosterone (DHT). DHT is a hormone that can cause hair follicles to shrink and eventually stop producing hair. By reducing DHT levels, finasteride helps preserve existing hair and may promote new hair growth in men experiencing male pattern hair loss.",
    benefits: [
      {
        title: "DHT Reduction",
        description: "Finasteride effectively reduces DHT levels by up to 70% in the scalp, addressing the root cause of male pattern hair loss. This helps prevent further hair loss and may promote regrowth in some individuals."
      },
      {
        title: "Hair Preservation",
        description: "Clinical studies have shown that finasteride can help preserve existing hair and prevent further thinning. Many users experience a halt in hair loss progression within the first year of treatment."
      },
      {
        title: "Potential Hair Regrowth",
        description: "Some men may experience new hair growth in areas that were previously thinning. Studies indicate that approximately 48% of men taking finasteride experience some degree of hair regrowth after one year of treatment."
      }
    ],
    dosing: {
      frequency: "Once daily",
      timing: "Morning with food",
      amount: "1mg tablet",
      duration: "6-12 months for full results",
      instructions: [
        { day: "Month 1-3", instruction: "Take 1mg tablet daily with breakfast", time: "8 AM" },
        { day: "Month 4-6", instruction: "Continue daily - hair shedding may decrease", time: "8 AM" },
        { day: "Month 7-9", instruction: "Mid-treatment - some regrowth may be visible", time: "8 AM" },
        { day: "Month 10-12", instruction: "Full treatment cycle - optimal results achieved", time: "8 AM" },
      ]
    },
    priceMonthly: "$59",
  },
  "minoxidil": {
    title: "Minoxidil",
    hero: "/Minoxodil.png",
    short: "Stimulates follicles to thicken strands and improve coverage.",
    description: "Minoxidil is an FDA-approved topical treatment for hair loss that works by widening blood vessels and opening potassium channels, which allows more oxygen, blood, and nutrients to reach the hair follicles. This increased circulation can help stimulate hair follicles and promote hair growth in both men and women experiencing pattern hair loss.",
    benefits: [
      {
        title: "Improved Blood Circulation",
        description: "Minoxidil works by dilating blood vessels in the scalp, increasing blood flow to hair follicles. This enhanced circulation delivers more oxygen and nutrients to the hair roots, creating an optimal environment for hair growth."
      },
      {
        title: "Follicle Stimulation",
        description: "Research suggests that minoxidil may help stimulate dormant hair follicles and extend the growth phase of existing hairs. This can result in thicker, longer hair strands and improved overall hair density."
      },
      {
        title: "Proven Efficacy",
        description: "Clinical studies have demonstrated that minoxidil is effective for both men and women with pattern hair loss. The treatment has been shown to slow hair loss progression and promote new hair growth in many users."
      }
    ],
    dosing: {
      frequency: "Twice daily",
      timing: "Morning and evening",
      amount: "1ml topical solution",
      duration: "3-6 months for full results",
      instructions: [
        { day: "Week 1-4", instruction: "Apply 1ml to scalp twice daily - may experience mild irritation", time: "8 AM & 8 PM" },
        { day: "Week 5-8", instruction: "Continue twice daily - hair shedding may temporarily increase", time: "8 AM & 8 PM" },
        { day: "Week 9-16", instruction: "Mid-treatment - new hair growth may begin", time: "8 AM & 8 PM" },
        { day: "Week 17-24", instruction: "Full treatment cycle - optimal hair density achieved", time: "8 AM & 8 PM" },
      ]
    },
    priceMonthly: "$29",
  },
  "tretinoin": {
    title: "Tretinoin 0.025%",
    hero: "/Tretinoin New.png",
    short: "Speeds cell turnover to clear acne and smooth texture.",
    description: "Tretinoin is a powerful prescription retinoid derived from vitamin A that works by accelerating skin cell turnover and promoting the growth of new skin cells. It's widely regarded as one of the most effective treatments for acne and anti-aging. Tretinoin helps unclog pores, reduce inflammation, and stimulate collagen production, resulting in clearer, smoother, and more youthful-looking skin.",
    benefits: [
      {
        title: "Acne Treatment",
        description: "Tretinoin is highly effective at treating acne by preventing dead skin cells from clogging pores and reducing inflammation. It helps clear existing breakouts and prevents new ones from forming."
      },
      {
        title: "Anti-Aging Benefits",
        description: "Regular use of tretinoin can significantly reduce the appearance of fine lines, wrinkles, and age spots. It stimulates collagen production and improves skin texture, resulting in smoother, more youthful-looking skin."
      },
      {
        title: "Improved Skin Texture",
        description: "Tretinoin promotes cellular renewal, which helps smooth rough skin texture, reduce pore size, and even out skin tone. Over time, skin becomes softer, more radiant, and better able to retain moisture."
      }
    ],
    dosing: {
      frequency: "Once daily",
      timing: "Evening before bed",
      amount: "Pea-sized amount",
      duration: "8-12 weeks for full results",
      instructions: [
        { day: "Week 1-2", instruction: "Apply pea-sized amount to clean face once daily in evening", time: "9 PM" },
        { day: "Week 3-4", instruction: "Continue daily - may experience mild peeling or dryness", time: "9 PM" },
        { day: "Week 5-8", instruction: "Mid-treatment - skin texture begins to improve", time: "9 PM" },
        { day: "Week 9-12", instruction: "Full treatment cycle - optimal skin clarity achieved", time: "9 PM" },
      ]
    },
    priceMonthly: "$49",
  },
  "tazarotene": {
    title: "Tazarotene",
    hero: "/Tazarotene.png",
    short: "Potent retinoid that refines pores and combats photoaging.",
    description: "Tazarotene is a powerful third-generation retinoid that's particularly effective for treating acne and photoaging. It works by normalizing skin cell growth and differentiation, helping to unclog pores and reduce inflammation. Tazarotene is known for its rapid action and effectiveness in treating stubborn acne and improving skin texture, making it a valuable option for those who haven't responded well to other treatments.",
    benefits: [
      {
        title: "Advanced Acne Treatment",
        description: "Tazarotene is particularly effective for treating moderate to severe acne, including inflammatory and non-inflammatory lesions. It works by normalizing keratinocyte differentiation and reducing inflammation."
      },
      {
        title: "Photoaging Reversal",
        description: "Studies have shown that tazarotene can significantly improve signs of photoaging, including fine lines, wrinkles, and hyperpigmentation. It promotes collagen synthesis and improves overall skin quality."
      },
      {
        title: "Rapid Results",
        description: "Tazarotene is known for providing faster results compared to other retinoids, with many users seeing improvement in acne and skin texture within 4-8 weeks of treatment."
      }
    ],
    dosing: {
      frequency: "Once daily",
      timing: "Evening before bed",
      amount: "Pea-sized amount",
      duration: "6-8 weeks for full results",
      instructions: [
        { day: "Week 1-2", instruction: "Apply pea-sized amount to clean face once daily in evening", time: "9 PM" },
        { day: "Week 3-4", instruction: "Continue daily - faster results than other retinoids", time: "9 PM" },
        { day: "Week 5-6", instruction: "Mid-treatment - significant improvement in acne and texture", time: "9 PM" },
        { day: "Week 7-8", instruction: "Full treatment cycle - optimal results achieved", time: "9 PM" },
      ]
    },
    priceMonthly: "$39",
    priceFull: "$45",
  },
};

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = PRODUCTS[slug];

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium">Product not found</p>
          <Link href="/glow-up-protocol" className="mt-2 inline-block underline">Back</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl bg-white p-4 shadow-sm sm:p-6">
            <div className="relative mb-6 overflow-hidden rounded-2xl bg-muted h-72 sm:h-80">
              <Image src={product.hero} alt={product.title} fill className="object-contain" />
            </div>
            <h1 className="mb-3 text-3xl font-serif font-semibold text-foreground sm:text-4xl">
              {product.title}
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            <div className="mt-8">
              <h2 className="mb-4 text-xl font-semibold">Potential Benefits</h2>
              <div className="space-y-4">
                {product.benefits.map((benefit, index) => (
                  <div key={index} className="border-l-4 border-blue-200 pl-4">
                    <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h2 className="mb-4 text-xl font-semibold">Your Glow Up</h2>
              <div className="rounded-xl border bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Dosing Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Frequency:</span>
                        <span className="font-medium">{product.dosing.frequency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Timing:</span>
                        <span className="font-medium">{product.dosing.timing}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount:</span>
                        <span className="font-medium">{product.dosing.amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="font-medium">{product.dosing.duration}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Treatment Timeline</h3>
                    <div className="space-y-3">
                      {product.dosing.instructions.map((instruction, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm text-foreground">{instruction.day}</span>
                              {instruction.time && (
                                <span className="text-xs text-muted-foreground bg-white px-2 py-1 rounded-full">
                                  {instruction.time}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">{instruction.instruction}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 items-center gap-4 rounded-xl border p-4 text-center">
              <div className="col-span-2 sm:col-span-1">
                <div className="text-2xl font-semibold">{product.priceMonthly}</div>
                <div className="text-xs text-muted-foreground">Per Month</div>
              </div>
              {product.priceFull && (
                <div className="hidden sm:block">
                  <div className="text-2xl font-semibold">{product.priceFull}</div>
                  <div className="text-xs text-muted-foreground">Full Price</div>
                </div>
              )}
              <div className="col-span-2 mt-2">
                <button className="w-full rounded-full bg-[#ff6b5f] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90">
                  PURCHASE
                </button>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="mb-3 text-xl font-semibold">Order Fulfillment</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Doctor review within 48 hours</li>
                <li>• Processing can take 7 – 10 business days (subject to pharmacy partners)</li>
                <li>• Once ready, shipping is via 2-day</li>
              </ul>
            </div>

            <div className="mt-8">
              <h2 className="mb-3 text-xl font-semibold">Highlights</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Free Shipping</li>
                <li>• Medical Consultation Included</li>
              </ul>
            </div>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h2 className="mb-3 text-lg font-semibold">Disclaimer</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {product.title === "GHK-Cu Injection" 
                  ? "This compounded peptide product is customized for individual needs based on a licensed healthcare provider's prescription. These statements and the product have not been evaluated or approved by the Food and Drug Administration (FDA). This product is not intended to diagnose, treat, cure, or prevent any disease. Compounded medications are not FDA-approved, and their safety and efficacy have not been independently verified by the FDA. This information is provided for educational purposes only and should not be considered medical advice. Potential side effects, including those of GHK-Cu, and long-term impacts are still being studied. Always consult your licensed healthcare provider or primary care professional before beginning any new treatment."
                  : "This product is a prescription medication that requires a licensed healthcare provider's prescription. These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease. Always consult your licensed healthcare provider before beginning any new treatment. Individual results may vary."
                }
              </p>
            </div>

            <div className="mt-10">
              <Link href="/glow-up-protocol" className="text-sm underline">Back to Glow Up Protocol</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


