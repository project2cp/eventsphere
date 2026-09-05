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
        if (!carousel) return;

        const isMobile = window.innerWidth < 768;
        const totalItems = organizers.length * 2; // Original + Duplicate
        const cardWidth = isMobile ? 180 : 224; // w-44 (176px) + gap on mobile, w-56 (224px) + gap on desktop

        // Calculate the total width to scroll
        const totalWidth = (cardWidth + (isMobile ? 16 : 32)) * organizers.length;

        // Create the infinite scroll animation
        const tl = gsap.to(itemsRef.current, {
            x: -totalWidth,
            duration: 80,
            ease: "none",
            repeat: -1,
            modifiers: {
                x: (x) => {
                    // Loop back to start when reaching the end
                    const currentX = parseFloat(x);
                    if (currentX <= -totalWidth) {
                        return "0px";
                    }
                    return x;
                }
            }
        });

        // Pause on hover
        const handleMouseEnter = () => { tl.pause(); };
        const handleMouseLeave = () => { tl.play(); };

        carousel.addEventListener("mouseenter", handleMouseEnter);
        carousel.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            tl.kill();
            carousel.removeEventListener("mouseenter", handleMouseEnter);
            carousel.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    return (
        <section className="py-8 sm:py-12">
            <h1 className="text-center text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12">
                Explore Organizers
            </h1>
            <div className="relative overflow-hidden h-[340px] sm:h-[400px]">
                <div ref={carouselRef} className="flex gap-4 sm:gap-8 items-center absolute top-0 left-0">
                    {/* Original organizers */}
                    {organizers.map((organizer, index) => (
                        <div
                            key={organizer.id}
                            ref={el => itemsRef.current[index] = el}
                            className="bg-white rounded-2xl shadow-md p-3 sm:p-4 w-44 sm:w-56 flex-shrink-0 text-center transition-transform duration-300 hover:-translate-y-1"
                        >
                            <img
                                src={organizer.logo}
                                alt={organizer.name}
                                className="w-16 h-16 sm:w-24 sm:h-24 mx-auto rounded-full border border-gray-300 mb-2 sm:mb-4 object-contain"
                            />
                            <h2 className="text-base sm:text-xl font-bold text-[var(--bg-purple)] truncate">
                                {organizer.name}
                            </h2>
                            <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-4 h-6 sm:h-10 truncate">
                                {organizer.description}
                            </p>
                            <div className="flex justify-between mb-4 sm:mb-6 px-2 sm:px-4">
                                <div className="text-center">
                                    <div className="font-bold text-sm sm:text-lg">{organizer.events}</div>
                                    <div className="text-[10px] sm:text-xs text-gray-500">Events</div>
                                </div>
                                <div className="border-l border-gray-300 mx-1 sm:mx-2"></div>
                                <div className="text-center">
                                    <div className="font-bold text-sm sm:text-lg">{organizer.followers}</div>
                                    <div className="text-[10px] sm:text-xs text-gray-500">Followers</div>
                                </div>
                                <div className="border-l border-gray-300 mx-1 sm:mx-2"></div>
                                <div className="text-center">
                                    <div className="font-bold text-sm sm:text-lg">{organizer.following}</div>
                                    <div className="text-[10px] sm:text-xs text-gray-500">Following</div>
                                </div>
                            </div>
                            <div className="flex gap-2 sm:gap-3 justify-center">
                                <button className="px-2 sm:px-4 py-1 sm:py-2 bg-white text-[var(--bg-purple)] rounded-xl border border-[var(--bg-purple)] hover:bg-gray-100 transition-colors text-xs sm:text-sm">
                                    Contact
                                </button>
                                <button className="px-2 sm:px-4 py-1 sm:py-2 bg-[var(--bg-btn)] text-white rounded-xl hover:bg-opacity-90 transition-colors text-xs sm:text-sm">
                                    Follow
                                </button>
                            </div>
                        </div>
                    ))}
                    {/* Duplicate cards for infinite scrolling */}
                    {organizers.map((organizer, index) => {
                        const duplicateIndex = index + organizers.length;
                        return (
                            <div
                                key={`${organizer.id}-duplicate`}
                                ref={el => itemsRef.current[duplicateIndex] = el}
                                className="bg-white rounded-2xl shadow-md p-3 sm:p-4 w-44 sm:w-56 flex-shrink-0 text-center transition-transform duration-300 hover:-translate-y-1"
                            >
                                <img
                                    src={organizer.logo}
                                    alt={organizer.name}
                                    className="w-16 h-16 sm:w-24 sm:h-24 mx-auto rounded-full border border-gray-300 mb-2 sm:mb-4 object-contain"
                                />
                                <h2 className="text-base sm:text-xl font-bold text-[var(--bg-purple)] truncate">
                                    {organizer.name}
                                </h2>
                                <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-4 h-6 sm:h-10 truncate">
                                    {organizer.description}
                                </p>
                                <div className="flex justify-between mb-4 sm:mb-6 px-2 sm:px-4">
                                    <div className="text-center">
                                        <div className="font-bold text-sm sm:text-lg">{organizer.events}</div>
                                        <div className="text-[10px] sm:text-xs text-gray-500">Events</div>
                                    </div>
                                    <div className="border-l border-gray-300 mx-1 sm:mx-2"></div>
                                    <div className="text-center">
                                        <div className="font-bold text-sm sm:text-lg">{organizer.followers}</div>
                                        <div className="text-[10px] sm:text-xs text-gray-500">Followers</div>
                                    </div>
                                    <div className="border-l border-gray-300 mx-1 sm:mx-2"></div>
                                    <div className="text-center">
                                        <div className="font-bold text-sm sm:text-lg">{organizer.following}</div>
                                        <div className="text-[10px] sm:text-xs text-gray-500">Following</div>
                                    </div>
                                </div>
                                <div className="flex gap-2 sm:gap-3 justify-center">
                                    <button className="px-2 sm:px-4 py-1 sm:py-2 bg-white text-[var(--bg-purple)] rounded-xl border border-[var(--bg-purple)] hover:bg-gray-100 transition-colors text-xs sm:text-sm">
                                        Contact
                                    </button>
                                    <button className="px-2 sm:px-4 py-1 sm:py-2 bg-[var(--bg-btn)] text-white rounded-xl hover:bg-opacity-90 transition-colors text-xs sm:text-sm">
                                        Follow
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};