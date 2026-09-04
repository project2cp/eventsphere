import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

// Import images directly
import img1 from '../../assets/img1.png';
import img2 from '../../assets/img2.png';

// Mock data for previous events
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
    };
  }, []);

  return (
    <section className="relative min-h-screen" id='gallery'>

      <div className="w-full text-center py-8  relative bg-transparent">
        <h1 className="text-4xl font-bold text-white">EVENT GALLERY</h1>
      </div>

      {/* Scrollable Content */}
      <div ref={galleryRef} className="mx-auto px-16  overflow-hidden">
        <div className="flex items-center h-full">
          {previousEvents.map((event, index) => (
            <div
              ref={(element) => (cardsRef.current[index] = element)}
              key={event.id}
              className="flex-shrink-0 w-full h-full"
            >
              <div className="flex h-full w-full items-start">
                {/* Image Section */}
                <div className="w-1/2 pl-8 pb-15 pt-1 pr-2">
                  <div className="h-80">
                    <img
                      src={event.image}
                      alt="Gallery Background"
                      className="h-full w-full object-cover event-image rounded-lg" 
                    />
                  </div>
                  <div className="text-gray-500 mt-2 text-sm">
                    Category: {event.category}
                  </div>
                </div>

                {/* Content Section */}
                <div className="w-1/2 px-16 text-white"> 
                  <h1 className="text-2xl font-bold mb-4 pb-1">
                    {event.title}
                  </h1>
                  <h3 
                    className="text-sm font-semibold mb-4" 
                    dangerouslySetInnerHTML={{ __html: event.info }} 
                  />
                  <p 
                    className="text-sm event-description pb-4" 
                    dangerouslySetInnerHTML={{ __html: event.description }} 
                  />
                  <button className="btn-effect">More Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};