import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import { FaShareAlt, FaEllipsisH } from "react-icons/fa";
import { HeartIcon, ShareMenu, MoreOptionsMenu } from '../cardFeatures';
import { Alert } from '../layout/Alert';

import img1 from '../../assets/ai.jpeg';
import img3 from '../../assets/marathon.png';
import img4 from '../../assets/medical.jpeg';

const upcomingEvents = [
    {
        id: 1,
        image: img1,
        title: 'Innovating with DZ-Bot: Algeria\'s First AI-Powered Robot',
        subtitle: 'Be part of the Algiers TechXpo 2025 and experience DZ-Bot.',
    },
    {
        id: 2,
        image: img3,
        title: 'Harmony Stride International Marathon 2025',
        subtitle: 'Join thousands of runners from around the world!',
    },
    {
        id: 3,
        image: img4,
        title: "Global Health and Wellness Virtual Conference",
        subtitle: "Keynote speakers, panel discussions, and interactive sessions.",
    },
    {
        id: 4,
        image: img1,
        title: 'Innovating with DZ-Bot: Algeria\'s First AI-Powered Robot',
        subtitle: 'Be part of the Algiers TechXpo 2025.',
    },
    {
        id: 5,
        image: img3,
        title: 'Harmony Stride International Marathon 2025',
        subtitle: 'Join thousands of runners from around the world!',
    },
    {
        id: 6,
        image: img4,
        title: "Global Health and Wellness Virtual Conference",
        subtitle: "Keynote speakers, panel discussions, and interactive sessions.",
    }
];

export const UpcomingEvent = () => {
    const [activeIndex, setActiveIndex] = useState(1);
    const scrollRef = useRef(null);
    const [alert, setAlert] = useState(null);
    const [eventLikes, setEventLikes] = useState(() => {
        const initialLikes = {};
        upcomingEvents.forEach(event => { initialLikes[event.id] = false; });
        return initialLikes;
    });
    const [shareMenuOpen, setShareMenuOpen] = useState({});
    const [moreMenuOpen, setMoreMenuOpen] = useState({});

    useEffect(() => {
        const container = scrollRef.current;
        if (container) {
            const isMobile = window.innerWidth < 768;
            const cardWidth = isMobile ? container.offsetWidth * 0.8 : container.offsetWidth * 0.5;
            const scrollAmount = (container.offsetWidth - cardWidth) / 2;
            container.scrollTo({
                left: scrollAmount + activeIndex * cardWidth,
                behavior: 'smooth',
            });
        }
    }, []);

    const handleScroll = (direction) => {
        const container = scrollRef.current;
        if (!container) return;

        const isMobile = window.innerWidth < 768;
        const cardWidth = isMobile ? container.offsetWidth * 0.8 : container.offsetWidth * 0.5;
        const scrollAmount = (container.offsetWidth - cardWidth) / 2;
        const newIndex = direction === 'right' ? activeIndex + 1 : activeIndex - 1;

        if (newIndex >= 0 && newIndex < upcomingEvents.length) {
            container.scrollTo({
                left: scrollAmount + newIndex * cardWidth,
                behavior: 'smooth',
            });
            setActiveIndex(newIndex);
        }
    };

    const handleLike = useCallback(async (eventId, isLiked) => {
        setEventLikes(prevLikes => ({ ...prevLikes, [eventId]: isLiked }));
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log(`Event ${eventId} like status updated to ${isLiked}`);
    }, []);

    const toggleShareMenu = useCallback((eventId) => {
        setShareMenuOpen(prev => ({ ...prev, [eventId]: !prev[eventId] }));
    }, []);

    const toggleMoreMenu = useCallback((eventId) => {
        setMoreMenuOpen(prev => ({ ...prev, [eventId]: !prev[eventId] }));
    }, []);

    const handleRegister = useCallback((eventId) => {
        setAlert({ message: `Successfully registered for event ${eventId}!`, type: 'success' });
    }, []);

    const handleContact = useCallback((eventId) => {
        setAlert({ message: `Contacting organizer for event ${eventId}...`, type: 'info' });
    }, []);

    const handleCloseAlert = () => { setAlert(null); };

    return (
        <section className="relative container mx-auto px-2 sm:px-4 py-6 sm:py-8" id='upcomingEvent'>
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-white">Upcoming Events</h1>
            {alert && <Alert message={alert.message} type={alert.type} onClose={handleCloseAlert} />}
            
            <div
                ref={scrollRef}
                className="relative flex items-center overflow-x-auto scrollbar-hide"
                style={{
                    paddingLeft: '5vw',
                    paddingRight: '5vw',
                    scrollSnapType: 'x mandatory',
                }}
            >
                {upcomingEvents.map((event, index) => {
                    const isActive = index === activeIndex;
                    const isMobile = window.innerWidth < 768;
                    const cardWidth = isMobile ? '70vw' : '50vw';
                    const inactiveWidth = isMobile ? '50vw' : '30vw';
                    const cardHeight = isMobile ? '280px' : (isActive ? '400px' : '300px');

                    return (
                        <div
                            key={event.id}
                            className="flex-shrink-0 transition-all duration-300 rounded-3xl mx-1 sm:mx-2 relative"
                            style={{
                                width: isActive ? cardWidth : inactiveWidth,
                                height: cardHeight,
                                opacity: isActive ? 1 : 0.5,
                                transform: isActive ? 'scale(1)' : 'scale(0.9)',
                                transition: 'all 0.3s ease-in-out',
                                scrollSnapAlign: isActive ? 'center' : undefined,
                            }}
                        >
                            <img
                                src={event.image}
                                alt="Event"
                                className="w-full h-full object-cover rounded-3xl"
                            />
                            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex flex-col items-center border border-white p-1 sm:p-2 rounded-sm">
                                <HeartIcon eventId={event.id} isLiked={eventLikes[event.id] || false} onLike={handleLike} />
                                <div className="relative">
                                    <button onClick={() => toggleShareMenu(event.id)} className="mb-1 sm:mb-2">
                                        <FaShareAlt color="white" size={16} className="sm:w-6 sm:h-6" />
                                    </button>
                                    <ShareMenu isOpen={shareMenuOpen[event.id] || false} onClose={() => toggleShareMenu(event.id)} shareUrl={`https://example.com/events/${event.id}`} />
                                </div>
                                <div className="relative">
                                    <button onClick={() => toggleMoreMenu(event.id)}>
                                        <FaEllipsisH color="white" size={16} className="sm:w-6 sm:h-6" />
                                    </button>
                                    <MoreOptionsMenu
                                        isOpen={moreMenuOpen[event.id] || false}
                                        onClose={() => toggleMoreMenu(event.id)}
                                        onRegister={() => handleRegister(event.id)}
                                        onContact={() => handleContact(event.id)}
                                    />
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 bg-black-52 rounded-b-3xl">
                                <h2 className="text-xs sm:text-sm md:text-lg font-bold text-white mb-1 sm:mb-2 line-clamp-2">
                                    {event.title}
                                </h2>
                                <p className="text-gray-200 text-xs sm:text-sm mb-1 sm:mb-2 line-clamp-2 sm:line-clamp-3">
                                    {event.subtitle}
                                </p>
                                <button className="btn-effect text-white text-xs sm:text-sm">
                                    More Details
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Navigation Buttons */}
            <button
                onClick={() => handleScroll('left')}
                className="absolute left-1 sm:left-4 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-1.5 sm:p-3 z-10"
                aria-label="Previous event"
            >
                <MdArrowBackIos className="text-sm sm:text-xl" />
            </button>
            <button
                onClick={() => handleScroll('right')}
                className="absolute right-1 sm:right-4 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-1.5 sm:p-3 z-10"
                aria-label="Next event"
            >
                <MdArrowForwardIos className="text-sm sm:text-xl" />
            </button>
        </section>
    );
};