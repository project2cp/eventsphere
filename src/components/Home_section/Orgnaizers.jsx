import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Import images
import safex from '../../assets/safax.jpg';
import huawei from '../../assets/huawei.jpg';
import djezzy from '../../assets/djezzy.png';
import microclub from '../../assets/microclub.jpg';
import algeriePost from '../../assets/algerie_post.jpg';
import sonatrach from '../../assets/Sonatrach.png';

const organizers = [
    {
        id: 1,
        logo: djezzy,
        name: "DJEZZY",
        description: 'Telecommunication company in Algeria',
        events: 36,
        followers: '3.2k',
        following: 22
    },
    {
        id: 2,
        logo: sonatrach,
        name: "SONATRACH",
        description: "Algerian national oil and gas company",
        events: 36,
        followers: '3.2k',
        following: 22
    },
    {
        id: 3,
        logo: safex,
        name: "SAFEX",
        description: "Algerian Fairs and Exhibitions Company",
        events: 36,
        followers: '3.2k',
        following: 22
    },
    {
        id: 4,
        logo: "andi.jpg",
        name: "ANDI",
        description: "L'Agence nationale du développement des investissements",
        events: 36,
        followers: '3.2k',
        following: 22
    },
    {
        id: 5,
        logo: huawei,
        name: "Huawei",
        description: "Chinese multinational technology corporation",
        events: 36,
        followers: '3.2k',
        following: 22
    },
    {
        id: 6,
        logo: microclub,
        name: "Micro Club",
        description: "Algerian IT Services Provider",
        events: 36,
        followers: '3.2k',
        following: 22
    },
    {
        id: 7,
        logo: algeriePost,
        name: "Algérie Poste",
        description: "Algerian public company responsible for postal services",
        events: 36,
        followers: '3.2k',
        following: 22
    },
];

gsap.registerPlugin(ScrollTrigger);

export const Organizers = () => {
    const carouselRef = useRef(null);
    const itemsRef = useRef([]);

    useEffect(() => {
        const carousel = carouselRef.current;

        // Initialize GSAP animation
        const setupAnimation = () => {
            const totalWidth = carousel.scrollWidth;

            gsap.to(itemsRef.current, {
                xPercent: -100 * (itemsRef.current.length / 2), // Move left by half the total width
                duration: 80, // Adjust speed here
                ease: "none",
                repeat: -1, // Infinite loop
            });
            
            // Pause on hover
            carousel.addEventListener("mouseenter", () => gsap.globalTimeline.pause());
            carousel.addEventListener("mouseleave", () => gsap.globalTimeline.resume());
            
            return () => {
                gsap.killTweensOf(itemsRef.current);
                carousel.removeEventListener("mouseenter");
                carousel.removeEventListener("mouseleave");
            };
        };

       setupAnimation();
       
    }, []);

    return (
      <section className=" py-12">
          <h1 className="text-center text-white text-4xl font-bold mb-12">
              Explore Organizers
          </h1>
          <div className="relative overflow-hidden h-[400px]">
              <div ref={carouselRef} className="flex gap-8 items-center absolute top-0 left-0">
                  {organizers.map((organizer, index) => (
                      <div key={organizer.id} ref={el => itemsRef.current[index] = el} className="bg-white rounded-2xl shadow-md p-4 w-56  flex-shrink-0 text-center transition-transform duration-300 hover:-translate-y-1">
                          <img src={organizer.logo} alt={organizer.name} className="w-24 h-24 mx-auto rounded-full border border-gray-300 mb-4 object-contain" />
                          <h2 className="text-xl font-bold text-[var(--bg-purple)]">{organizer.name}</h2>
                          <p className="text-gray-600 text-sm mb-4 h-10">{organizer.description}</p>
                          <div className="flex justify-between mb-6 px-4">
                              <div className="text-center">
                                  <div className="font-bold text-lg">{organizer.events}</div>
                                  <div className="text-xs text-gray-500">Events</div>
                              </div>
                              <div className="border-l border-gray-300 mx-2"></div> {/* Vertical line */}
                              <div className="text-center">
                                  <div className="font-bold text-lg">{organizer.followers}</div>
                                  <div className="text-xs text-gray-500">Followers</div>
                              </div>
                              <div className="border-l border-gray-300 mx-2"></div> {/* Vertical line */}
                              <div className="text-center">
                                  <div className="font-bold text-lg">{organizer.following}</div>
                                  <div className="text-xs text-gray-500">Following</div>
                              </div>
                          </div>
                          <div className="flex gap-3 justify-center">
                              <button className="px-4 py-2 bg-white text-[var(--bg-purple)] rounded-xl border border-[var(--bg-purple)] hover:bg-gray-100 transition-colors">Contact</button>
                              <button className="px-4 py-2 bg-[var(--bg-btn)] text-white rounded-xl hover:bg-opacity-90 transition-colors">Follow</button>
                          </div>
                      </div>
                  ))}
                  {/* Duplicate cards for infinite scrolling */}
                  {organizers.map((organizer, index) => (
                      <div key={`${organizer.id}-duplicate`} ref={el => itemsRef.current[index + organizers.length] = el} className="bg-white rounded-2xl shadow-md p-4 w-56  flex-shrink-0 text-center transition-transform duration-300 hover:-translate-y-1">
                          <img src={organizer.logo} alt={organizer.name} className="w-24 h-24 mx-auto rounded-full border border-gray-300 mb-4 object-contain" />
                          <h2 className="text-xl font-bold text-[var(--bg-purple)]">{organizer.name}</h2>
                          <p className="text-gray-600 text-sm mb-4 h-10">{organizer.description}</p>
                          <div className="flex justify-between mb-6 px-4">
                              <div className="text-center">
                                  <div className="font-bold text-lg">{organizer.events}</div>
                                  <div className="text-xs text-gray-500">Events</div>
                              </div>
                              <div className="border-l border-gray-300 mx-2"></div> {/* Vertical line */}
                              <div className="text-center">
                                  <div className="font-bold text-lg">{organizer.followers}</div>
                                  <div className="text-xs text-gray-500">Followers</div>
                              </div>
                              <div className="border-l border-gray-300 mx-2"></div> {/* Vertical line */}
                              <div className="text-center">
                                  <div className="font-bold text-lg">{organizer.following}</div>
                                  <div className="text-xs text-gray-500">Following</div>
                              </div>
                          </div>
                          <div className="flex gap-3 justify-center">
                              <button className="px-4 py-2 bg-white text-[var(--bg-purple)] rounded-xl border border-[var(--bg-purple)] hover:bg-gray-100 transition-colors">Contact</button>
                              <button className="px-4 py-2 bg-[var(--bg-btn)] text-white rounded-xl hover:bg-opacity-90 transition-colors">Follow</button>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>
  );
};
