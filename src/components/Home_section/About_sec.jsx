import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import img1 from '../../assets/img1.png';
import img2 from '../../assets/img2.png';
import img3 from '../../assets/img3.png';

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

  // Lenis smooth scroll
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

    return () => { lenis.destroy(); };
  }, []);

  // Horizontal scroll with GSAP (responsive)
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const slideWidth = isMobile ? window.innerWidth : window.innerWidth;
    const totalWidth = slideWidth * (sectionsRef.current.length - 1);

    gsap.to(wrapperRef.current, {
      x: () => -totalWidth,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 1,
        end: () => "+=" + (wrapperRef.current.offsetWidth - slideWidth),
        invalidateOnRefresh: true,
      }
    });

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
            className="w-screen h-full flex-shrink-0 flex items-center justify-center px-4 sm:px-8 md:px-12 lg:px-16"
          >
            <div className="container mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-8 lg:gap-12">
              {/* Text Section */}
              <div className="w-full md:w-2/5 lg:w-1/3 text-center md:text-left">
                <h4 className="text-lg sm:text-xl md:text-2xl text-white">
                  {section.subTitle}
                </h4>
              </div>

              {/* Images with Diamond Shape - NO WRAP on desktop */}
              <div className="w-full md:w-3/5 lg:w-2/3 flex flex-wrap md:flex-nowrap justify-center md:justify-end gap-4 sm:gap-6 md:gap-8">
                {section.imgsUrl.map((image, imageIndex) => (
                  <div 
                    key={imageIndex}
                    className="diamond overflow-hidden transform hover:scale-110 transition-transform duration-300 w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-52 lg:h-52 xl:w-56 xl:h-56 flex-shrink-0"
                  >
                    <img 
                      src={image} 
                      alt={`${section.subTitle} - ${imageIndex + 1}`}
                      className="w-full h-full object-cover"
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