"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";

// Donut Chart Component
const DonutChart = ({ count = "3", thickness = "48", className = "" }) => {
  return (
    <div className={`donut-chart ${className}`}>
      <Image
        src="/donut-count-3-thickness-48.svg"
        alt="Donut Chart"
        width={112}
        height={112}
        className="donut-instance"
      />
    </div>
  );
};

// Semicircle Component
const SemicircleChart = ({ thickness = "64", className = "" }) => {
  return (
    <div className={`semicircle-chart ${className}`}>
      <Image
        src="/semicircle-style-2-thickness-64.svg"
        alt="Semicircle Chart"
        width={92}
        height={46}
      />
    </div>
  );
};

// Frame Component (decorative element)
const FrameComponent = ({ className = "" }) => {
  return (
    <div className={`frame-component ${className}`}>
      <Image
        src="/frame-1-states-default.svg"
        alt="Frame"
        width={420}
        height={204}
      />
    </div>
  );
};

export const LandingPageV2 = () => {
  return (
    <div className="landing-page-v-2 bg-gray-400 min-h-screen relative">
      <div className="landing-page bg-white w-full mx-auto relative overflow-hidden">
        
        {/* Header Section */}
        <div className="section-1 relative w-full max-w-[1696px] mx-auto mt-16 mb-16 overflow-hidden">
          <Image
            className="noise-texture absolute inset-0 w-full h-full object-cover"
            src="/noise-texture2.png"
            alt="Background texture"
            width={2653}
            height={1600}
          />
          
          {/* Navigation */}
          <div className="frame-1272 bg-white/17 rounded-[13px] border border-[#5e4747] w-full max-w-[1504px] h-[100px] mx-auto mt-16 mb-8 flex items-center justify-between px-8">
            <div className="flex items-center gap-8">
              <Image
                className="parallel-alexander-final-1"
                src="/parallel-alexander-final-10.png"
                alt="Parallel Logo"
                width={76}
                height={76}
              />
              <nav className="flex items-center gap-8 text-black text-[21px]">
                <span>Why Glow-up</span>
                <span>How it works</span>
                <span>FAQ</span>
                <span>Login</span>
              </nav>
            </div>
            <Link href="/auth">
              <Button className="orange-gradient rounded-full px-8 py-4 text-black text-[18px]">
                Join Now →
              </Button>
            </Link>
          </div>

          {/* Hero Content */}
          <div className="text-center mb-16">
            <div className="frame-1243 inline-block rounded-[10px] border border-black bg-white px-8 py-3 mb-8">
              <span className="text-black text-[18px]">Science-Based Aesthetics</span>
            </div>
            
            <h1 className="times-ten text-black text-center text-[82px] italic font-normal mb-8">
              Start Your Parallel Journey
            </h1>
            
            <p className="text-black text-center text-[30px] max-w-[724px] mx-auto mb-12">
              Get your custom facial analysis, morph and transformation plan based on 2000+ academic studies.
            </p>

            <Link href="/auth">
              <Button className="gradient-background rounded-[10px] px-12 py-6 text-white text-[28px] mb-16">
                Start Now →
              </Button>
            </Link>
          </div>

          {/* Benefits Section */}
          <div className="frame-170 bg-white rounded-[14px] w-full max-w-[1645px] mx-auto p-12">
            <div className="grid grid-cols-2 gap-8 items-center">
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <Image src="/group-83.svg" alt="Icon" width={24} height={24} />
                  <span className="text-[#4a4a4a] text-[30px]">Stop being invisible</span>
                </div>
                <div className="flex items-center gap-4">
                  <Image src="/group-84.svg" alt="Icon" width={24} height={24} />
                  <span className="text-[#4a4a4a] text-[30px]">Improve job opportunities</span>
                </div>
                <div className="text-[#4a4a4a] text-[30px]">Broadcast status without saying a word</div>
                <div className="text-[#4a4a4a] text-[30px]">Escape dating-app purgatory</div>
                <div className="text-[#4a4a4a] text-[30px]">Live life on easy mode</div>
              </div>
              
              <div className="flex justify-center">
                <div className="relative">
                  <Image
                    src="/remi-turcotte-oq-6-dp-54-awvw-unsplash-15.png"
                    alt="Before/After"
                    width={483}
                    height={634}
                    className="rounded-[24px]"
                  />
                  <div className="absolute top-4 left-4 bg-white/80 rounded-[14px] px-4 py-2">
                    <span className="text-white text-[18px]">BEFORE</span>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/80 rounded-[14px] px-4 py-2">
                    <span className="text-white text-[18px]">AFTER</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="text-center mt-8">
            <div className="flex items-center justify-center gap-4">
              <span className="text-black text-[16px]">4.8</span>
              <Image src="/group-1490.svg" alt="Stars" width={111} height={22} />
              <span className="text-black text-[16px]">1000+ Reviews</span>
            </div>
          </div>
        </div>

        {/* Analysis Features Section */}
        <div className="group-134 w-full max-w-[1645px] mx-auto mb-16">
          <div className="grid grid-cols-3 gap-8 mb-16">
            <Image
              src="/olga-kovalski-z-pua-6-bxdk-zi-unsplash-10.png"
              alt="Analysis 1"
              width={526}
              height={271}
              className="rounded-[25px]"
            />
            <Image
              src="/edrece-stansberry-92-widq-xwf-y-unsplash-10.png"
              alt="Analysis 2"
              width={271}
              height={526}
              className="rounded-[25px] transform -rotate-90"
            />
            <Image
              src="/josep-martins-cc-mcua-ox-1-jk-unsplash-10.png"
              alt="Analysis 3"
              width={271}
              height={526}
              className="rounded-[25px] transform -rotate-90"
            />
          </div>

          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="flex items-center justify-center mb-4">
                <div className="w-[34px] h-[34px] rounded-full border border-black flex items-center justify-center">
                  <span className="text-black text-[19px] font-medium">1</span>
                </div>
              </div>
              <h3 className="text-black text-[25px] font-medium mb-4">Your face, quantified</h3>
              <p className="text-black text-[15px]">
                We analyze over 100 aspects of your face to understand your personal facial aesthetics.
              </p>
            </div>
            
            <div>
              <div className="flex items-center justify-center mb-4">
                <div className="w-[34px] h-[34px] rounded-full border border-black flex items-center justify-center">
                  <span className="text-black text-[19px] font-medium">2</span>
                </div>
              </div>
              <h3 className="text-black text-[25px] font-medium mb-4">Focus on overall facial harmony</h3>
              <p className="text-black text-[15px]">
                We study the signals in your face to uncover key indicators of your health and wellness.
              </p>
            </div>
            
            <div>
              <div className="flex items-center justify-center mb-4">
                <div className="w-[34px] h-[34px] rounded-full border border-black flex items-center justify-center">
                  <span className="text-black text-[19px] font-medium">3</span>
                </div>
              </div>
              <h3 className="text-black text-[25px] font-medium mb-4">Your facial age, unlocked</h3>
              <p className="text-black text-[15px]">
                Facial biomarkers reveal the biological age your features project.
              </p>
            </div>
          </div>
        </div>

        {/* Analysis Results Section */}
        <div className="grid grid-cols-3 gap-8 w-full max-w-[1645px] mx-auto mb-16">
          <div className="bg-white/10 rounded-[15px] p-8 relative overflow-hidden">
            <Image
              src="/janko-ferlic-znvgl-pcf-74-unsplash-10.png"
              alt="Background"
              width={927}
              height={469}
              className="absolute inset-0 w-full h-full object-cover blur-sm"
            />
            <div className="relative z-10">
              <h3 className="text-white text-[42px] font-medium mb-4">Perceived Facial Age</h3>
              <div className="text-white text-[42px] font-medium mb-4">26</div>
              <p className="text-white text-[20px]">2.5 years younger than your chronological age</p>
            </div>
          </div>

          <div className="bg-white/10 rounded-[15px] p-8 relative overflow-hidden">
            <Image
              src="/janko-ferlic-znvgl-pcf-74-unsplash-11.png"
              alt="Background"
              width={927}
              height={469}
              className="absolute inset-0 w-full h-full object-cover blur-sm"
            />
            <div className="relative z-10">
              <h3 className="text-white text-[42px] font-medium mb-4">Facial Health Indicators</h3>
              <div className="mb-4">
                <SemicircleChart className="mx-auto" />
              </div>
              <p className="text-white text-[20px]">Your biomarkers in range</p>
            </div>
          </div>

          <div className="bg-white/10 rounded-[15px] p-8 relative overflow-hidden">
            <Image
              src="/janko-ferlic-znvgl-pcf-74-unsplash-12.png"
              alt="Background"
              width={927}
              height={469}
              className="absolute inset-0 w-full h-full object-cover blur-sm"
            />
            <div className="relative z-10">
              <div className="text-white text-[42px] font-medium mb-4">12 out of range</div>
              <div className="text-white text-[20px] mb-4">71 in range</div>
              <DonutChart className="mx-auto" />
            </div>
          </div>
        </div>

        {/* Approach Section */}
        <div className="text-center mb-16">
          <div className="inline-block rounded-[10px] border border-black bg-white px-8 py-3 mb-8">
            <span className="text-black text-[18px]">Our New Approach</span>
          </div>
          
          <h2 className="times-ten text-black text-[82px] italic font-normal mb-8">
            A New Way to Glow Up
          </h2>
          
          <p className="text-black text-[30px] max-w-[724px] mx-auto mb-16">
            Every face is unique. We analyze over 100 aspects of your face to understand your personal facial aesthetics.
          </p>
        </div>

        {/* Old vs New Way Comparison */}
        <div className="section-4 bg-white rounded-[15px] w-full max-w-[1685px] mx-auto p-16 mb-16">
          {/* Headers */}
          <div className="grid grid-cols-2 gap-16 mb-8">
            <div className="border border-black rounded-t-[15px] p-8 pb-4">
              <h3 className="text-black text-center text-[60px] font-extralight">The Old Way</h3>
            </div>
            <div className="bg-gradient-to-r from-gray-700 via-gray-500 to-gray-300 rounded-t-[15px] p-8 pb-4">
              <h3 className="text-white text-center text-[60px] font-medium">The New Way</h3>
            </div>
          </div>

          {/* Aligned Rows */}
          <div className="space-y-8">
            {[
              {
                old: "Obsess over single flaws",
                new: "Understand overall facial health & harmony"
              },
              {
                old: "Rely on clinics and sales tactics",
                new: "Science-driven Parallel Analysis"
              },
              {
                old: "Little to no objective analysis",
                new: "Visualize realistic, data-backed outcomes"
              },
              {
                old: "Risk of over-treatment or surgery",
                new: "Receive a personalized improvement roadmap"
              },
              {
                old: "Disappointing, unnatural outcomes",
                new: "Achieve results without unnecessary surgery"
              }
            ].map((row, index) => (
              <div key={index} className="grid grid-cols-2 gap-16">
                {/* Old Way Item */}
                <div className="border border-black rounded-[15px] p-8">
                  <div className="flex items-center gap-4">
                    <div className="w-[60px] h-[60px] rounded-full border border-black flex items-center justify-center flex-shrink-0">
                      <span className="text-black text-[36px] font-medium">{index + 1}</span>
                    </div>
                    <span className="text-black text-[25px] font-medium">{row.old}</span>
                  </div>
                </div>

                {/* New Way Item */}
                <div className="bg-gradient-to-r from-gray-700 via-gray-500 to-gray-300 rounded-[15px] p-8">
                  <div className="flex items-center gap-4">
                    <div className="w-[60px] h-[60px] rounded-full border border-white flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-[36px] font-medium">{index + 1}</span>
                    </div>
                    <span className="text-white text-[25px] font-medium">{row.new}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Process Steps */}
        <div className="mt-16 text-center">
            <h3 className="times-ten text-black text-[82px] italic font-normal mb-8">
              Get a Proven Parallel Plan
            </h3>
            <p className="text-black text-[30px] max-w-[724px] mx-auto mb-16">
              Every face is unique. We analyze over 100 aspects of your face to understand your personal facial aesthetics.
            </p>

            <div className="grid grid-cols-4 gap-8">
              {[
                "Get your expert facial analysis",
                "Visualise your ideal self with a morph",
                "Get your glow-up protocol", 
                "Track progress and see dramatic results"
              ].map((step, index) => (
                <div key={index} className="bg-gradient-to-r from-gray-700 via-gray-500 to-gray-300 rounded-[15px] p-8 text-white">
                  <div className="w-[60px] h-[60px] rounded-full border border-white flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-[36px] font-medium">{index + 1}</span>
                  </div>
                  <p className="text-white text-[25px] font-medium">{step}</p>
                </div>
              ))}
            </div>

            {/* Before/After Images */}
            <div className="mt-16 flex justify-center gap-8">
              <div className="relative">
                <Image
                  src="/remi-turcotte-oq-6-dp-54-awvw-unsplash-14.png"
                  alt="Before"
                  width={458}
                  height={532}
                  className="rounded-[24px]"
                />
                <div className="absolute top-4 left-4 bg-white/80 rounded-[14px] px-4 py-2">
                  <span className="text-white text-[18px]">Before</span>
                </div>
              </div>
              <div className="relative">
                <Image
                  src="/remi-turcotte-oq-6-dp-54-awvw-unsplash-24.png"
                  alt="After"
                  width={458}
                  height={532}
                  className="rounded-[24px]"
                />
                <div className="absolute top-4 right-4 bg-white/80 rounded-[14px] px-4 py-2">
                  <span className="text-white text-[18px]">After</span>
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <Link href="/auth">
                <Button className="bg-gradient-to-r from-gray-700 via-gray-500 to-gray-300 rounded-[10px] px-12 py-6 text-white text-[28px]">
                  Join Now →
                </Button>
              </Link>
            </div>
          </div>

        {/* Client Transformations */}
        <div className="section-5 relative w-full max-w-[1696px] mx-auto mb-16 overflow-hidden">
          <Image
            className="noise-texture absolute inset-0 w-full h-full object-cover"
            src="/noise-texture0.png"
            alt="Background texture"
            width={2653}
            height={1600}
          />
          
          <div className="relative z-10 text-center py-16">
            <div className="inline-block rounded-[10px] border border-black bg-white px-8 py-3 mb-8">
              <span className="text-black text-[18px]">Client Transformation</span>
            </div>
            
            <h2 className="times-ten text-black text-[82px] italic font-normal mb-8">
              Real Transformations by<br />Parallel Clients
            </h2>
            
            <p className="text-black text-[30px] max-w-[724px] mx-auto mb-16">
              Join 3,000+ people and start your transformation.
            </p>

            {/* Transformation Grid */}
            <div className="grid grid-cols-4 gap-4 mb-16">
              {[
                "/remi-turcotte-oq-6-dp-54-awvw-unsplash-10.png",
                "/remi-turcotte-oq-6-dp-54-awvw-unsplash-20.png",
                "/remi-turcotte-oq-6-dp-54-awvw-unsplash-11.png",
                "/remi-turcotte-oq-6-dp-54-awvw-unsplash-21.png",
                "/remi-turcotte-oq-6-dp-54-awvw-unsplash-12.png",
                "/remi-turcotte-oq-6-dp-54-awvw-unsplash-22.png",
                "/remi-turcotte-oq-6-dp-54-awvw-unsplash-13.png",
                "/remi-turcotte-oq-6-dp-54-awvw-unsplash-23.png"
              ].map((src, index) => (
                <Image
                  key={index}
                  src={src}
                  alt={`Transformation ${index + 1}`}
                  width={352}
                  height={410}
                  className="rounded-[24px] border border-white"
                />
              ))}
            </div>

            {/* Features List */}
            <div className="bg-white rounded-[14px] p-16 mb-16">
              <div className="grid grid-cols-2 gap-16">
                <div className="space-y-8">
                  {[
                    {
                      icon: "/group-360.svg",
                      title: "Complete facial analysis",
                      desc: "Get an in-depth breakdown of your facial structure and features including 30 measurements."
                    },
                    {
                      icon: "/group-370.svg", 
                      title: "Personalized facial improvement protocol",
                      desc: "Receive a step-by-step plan on how to improve your facial aesthetics."
                    },
                    {
                      icon: "/group-380.svg",
                      title: "Biometrics scores and tracking", 
                      desc: "Understand your current facial biometric scores and track your progress over time."
                    },
                    {
                      icon: "/group-390.svg",
                      title: "Before-and-after morph of your potential ascension",
                      desc: "See what your face could accurately look like after your glow-up."
                    },
                    {
                      icon: "/group-400.svg",
                      title: "Clinical support on standby.",
                      desc: "Ask any questions to our team directly from your dashboard."
                    }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <Image src={feature.icon} alt="Icon" width={38} height={38} />
                      <div>
                        <h4 className="text-[#4a4a4a] text-[30px] font-medium mb-2">{feature.title}</h4>
                        <p className="text-[#4a4a4a] text-[19px]">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing Card */}
                <div className="bg-gradient-to-r from-gray-700 via-gray-500 to-gray-300 rounded-[15px] p-8 text-white">
                  <Image
                    className="noise-texture absolute inset-0 w-full h-full object-cover"
                    src="/noise-texture1.png"
                    alt="Background texture"
                    width={2653}
                    height={1600}
                  />
                  <div className="relative z-10">
                    <div className="bg-white/17 rounded-[10px] px-8 py-4 mb-8 inline-block">
                      <span className="text-white text-[24px] font-medium">Premium Plan</span>
                    </div>
                    
                    <h3 className="text-white text-[43px] font-medium mb-8">
                      Parallel<br />Membership
                    </h3>
                    
                    <div className="mb-8">
                      <span className="text-white text-[85px] font-semibold">$19</span>
                      <span className="text-white text-[30px] ml-4">per month</span>
                    </div>
                    
                    <p className="text-white text-[20px] mb-8">No hidden fees. Cancel anytime</p>
                    
                    <Link href="/auth">
                      <Button className="bg-white text-[#4a4a4a] rounded-[10px] w-full py-4 text-[24px] font-medium">
                        Get Access →
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Recommendations */}
        <div className="frame-131 bg-[#f3f3f3] rounded-[15px] border border-[#4a4a4a] w-full max-w-[375px] mx-auto p-8 mb-16">
          <div className="space-y-8">
            {[
              {
                title: "Topical GHK-CU",
                desc: "For skin dullness",
                image: "/throne-ghkcu-10.png"
              },
              {
                title: "Panoxyl",
                desc: "For acne/red spots", 
                image: "/panoxyl-10.png"
              },
              {
                title: "Gua Sha",
                desc: "For inflammation",
                image: "/gua-sha-10.png"
              }
            ].map((product, index) => (
              <div key={index}>
                <h4 className="text-[#4a4a4a] text-[20px] font-medium mb-4">Product Recommendation</h4>
                <div className="flex items-center gap-4 mb-4">
                  <Image src={product.image} alt={product.title} width={42} height={42} />
                  <div>
                    <div className="text-[#4a4a4a] text-[14px] font-medium">{product.title}</div>
                    <div className="text-[#4a4a4a] text-[10px] font-medium">{product.desc}</div>
                  </div>
                </div>
                <Button className="bg-[#4a4a4a]/16 border border-[#4a4a4a] rounded-full px-6 py-2 text-[#4a4a4a] text-[15px]">
                  Shop Here
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="gradient-42 bg-gradient-to-b from-[#4c4c4c] to-[#999999] w-full p-16">
          <Image
            className="noise-texture4 absolute inset-0 w-full h-full object-cover"
            src="/noise-texture3.png"
            alt="Background texture"
            width={2986}
            height={1600}
          />
          
          <div className="relative z-10 grid grid-cols-4 gap-16 text-white">
            <div className="flex items-center gap-4">
              <Image
                src="/parallel-alexander-final-11.png"
                alt="Parallel Logo"
                width={142}
                height={142}
              />
              <span className="text-white text-[43px] font-medium">Parallel</span>
            </div>

            <div>
              <h4 className="text-white text-[30px] font-semibold mb-8">Company/</h4>
              <div className="space-y-4 text-[30px]">
                <div>Products</div>
                <div>Research</div>
                <div>Contact Us</div>
                <div>Become a Partner</div>
              </div>
            </div>

            <div>
              <h4 className="text-white text-[30px] font-semibold mb-8">Others/</h4>
              <div className="space-y-4 text-[30px]">
                <div>Privacy Policy</div>
                <div>Terms of Service</div>
              </div>
            </div>

            <div>
              <h4 className="text-white text-[30px] font-semibold mb-8">Connect/</h4>
              <div className="space-y-4 text-[30px]">
                <div>LinkedIn</div>
                <div>Youtube</div>
                <div>Instagram</div>
                <div>Tiktok</div>
              </div>
              
              <Link href="/auth" className="mt-8 block">
                <Button className="bg-white/17 rounded-[10px] px-12 py-4 text-white text-[24px] font-medium">
                  Join Now →
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom CTA Bar */}
        <div className="frame-178 bg-[#4a4a4a] w-full h-[69px] flex items-center justify-center">
          <span className="text-white text-[20px] font-medium">
            Join thousands using the science of facial aesthetics to look their best. 
            <Link href="/auth" className="underline ml-2">Start Now →</Link>
          </span>
        </div>
      </div>
    </div>
  );
};
