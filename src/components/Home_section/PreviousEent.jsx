import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

import img1 from '../../assets/img1.png';
import img2 from '../../assets/img2.png';

const previousEvents = [
  {
    id: 1,
    image: img1,
    title: 'ECSEL Expo',
    info: `Organized by ALGERIA EXHIBITIONS SPA <br />
           February 22 to 24, 2025 <br />
           Centre de Conventions d'Oran (CCO) in Oran`,
    description: `ECSEL Expo is a premier event held in [Location], showcasing advancements
                  in electronics, semiconductors, and smart systems. Industry leaders, researchers, and
                  policymakers gathered for expert discussions, networking,
                  and live demonstrations. The event featured interactive workshops on AI,
                  IoT, and microelectronics, highlighting innovations shaping the future of
                  technology.`,
    category: 'Technology & Innovation, Business & Industry, Workshops & Conferences, Networking & Exhibitions'
  },
  {
    id: 2,
    image: img2,
    title: 'ECSEL Expo',
    info: `Organized by ALGERIA EXHIBITIONS SPA <br />
           February 22 to 24, 2025 <br />
           Centre de Conventions d'Oran (CCO) in Oran`,
    description: `ECSEL Expo is a premier event held in [Location], showcasing advancements
                  in electronics, semiconductors, and smart systems. Industry leaders, researchers, and
                  policymakers gathered for expert discussions, networking,
                  and live demonstrations. The event featured interactive workshops on AI,
                  IoT, and microelectronics, highlighting innovations shaping the future of
                  technology.`,
    category: 'Technology & Innovation, Business & Industry, Workshops & Conferences, Networking & Exhibitions'
  },
];

export const PreviousEvent = () => {
  const galleryRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const isMobile = window.innerWidth < 768;

    // Horizontal scroll animation
    const horizontalScroll = gsap.to(cardsRef.current, {
      xPercent: -100 * (previousEvents.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: galleryRef.current,
        pin: true,
        scrub: 1,
        snap: 1 / (previousEvents.length - 1),
        end: () => `+=${galleryRef.current.offsetWidth}`,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      horizontalScroll.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section className="relative min-h-screen" id='gallery'>
      <div className="w-full text-center py-6 sm:py-8 relative bg-transparent">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">EVENT GALLERY</h1>
      </div>

      <div ref={galleryRef} className="mx-auto px-4 sm:px-8 md:px-12 lg:px-16 overflow-hidden">
        <div className="flex items-center h-full">
          {previousEvents.map((event, index) => (
            <div
              ref={(element) => (cardsRef.current[index] = element)}
              key={event.id}
              className="flex-shrink-0 w-full h-full"
            >
              <div className="flex flex-col md:flex-row h-full w-full items-start gap-6 md:gap-8">
                {/* Image Section */}
                <div className="w-full md:w-1/2 pl-0 md:pl-8 pb-4 md:pb-15 pt-4 md:pt-1 pr-0 md:pr-2">
                  <div className="h-48 sm:h-56 md:h-64 lg:h-80">
                    <img
                      src={event.image}
                      alt="Gallery Background"
                      className="h-full w-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="text-gray-500 mt-2 text-xs sm:text-sm">
                    Category: {event.category}
                  </div>
                </div>

                {/* Content Section */}
                <div className="w-full md:w-1/2 px-2 sm:px-4 md:px-8 lg:px-16 text-white pb-8 md:pb-0">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 md:mb-4">
                    {event.title}
                  </h1>
                  <h3 
                    className="text-xs sm:text-sm font-semibold mb-3 md:mb-4"
                    dangerouslySetInnerHTML={{ __html: event.info }}
                  />
                  <p 
                    className="text-xs sm:text-sm event-description pb-3 md:pb-4 line-clamp-4 sm:line-clamp-none"
                    dangerouslySetInnerHTML={{ __html: event.description }}
                  />
                  <button className="btn-effect text-sm sm:text-base">More Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};