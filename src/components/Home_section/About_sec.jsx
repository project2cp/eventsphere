import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from 'lenis';


// Images
import img1 from '../../assets/img1.png';
import img2 from '../../assets/img2.png';
import img3 from '../../assets/img3.png';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const sectionData = [
  {
    subTitle: "An All-In-One Platform For Event Promotion, Discovery, And Seamless Participant Engagement",
    imgsUrl: [img1, img2, img3]
  },
  {
    subTitle: "Find the Best Events Near You Anytime, Anywhere",
    imgsUrl: [img1, img2, img3]
  },
  {
    subTitle: "Promote Your Event to Thousands of Attendees Effortlessly",
    imgsUrl: [img1, img2, img3]
  }
];


export const About_sec = () => {
  const sectionsRef = useRef([]);
  const containerRef = useRef();
  const wrapperRef = useRef();

  // set up lenis 
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    // Set up horizontal scroll
    gsap.to(wrapperRef.current, {
      x: () => -(window.innerWidth * (sectionsRef.current.length - 1)),
      ease: "none", // Moves at a constant speed
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true, // this keep the wrapper fixed during thr scrolling
        scrub: 1,  // Moves perfectly in sync with scroll position
        end: () => "+=" + (wrapperRef.current.offsetWidth - window.innerWidth)
      }
    });

    // Cleanup
    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <section 
      ref={containerRef}
      className="h-screen w-full overflow-hidden"
      id='about'
    >
      <div 
        ref={wrapperRef}
        className="flex h-screen w-[300vw] relative"
      >
        {sectionData.map((section, index) => (
          <div 
            key={index}
            ref={el => sectionsRef.current[index] = el}
            className="w-screen h-full flex-shrink-0 flex items-center px-16"
          >
            <div className="container mx-auto flex items-center gap-12">
              <div className="w-1/3">
                <h4 className="text-2xl text-white mb-8">
                  {section.subTitle}
                </h4>
              </div>

              <div className="w-2/3 flex gap-8">
                {section.imgsUrl.map((image, imageIndex) => (
                  <div 
                    key={imageIndex}
                    className="relative diamond overflow-hidden transform hover:scale-110 transition-transform w-64 h-64"
                  >
                    <img 
                      src={image} 
                      alt={`${section.subTitle} - ${imageIndex + 1}`}
                      className="w-64 h-64 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};