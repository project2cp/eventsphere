import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import { FaShareAlt, FaEllipsisH } from "react-icons/fa";
import { HeartIcon, ShareMenu, MoreOptionsMenu } from '../cardFeatures';
import { Alert } from '../layout/Alert';

// Import images
import img1 from '../../assets/ai.jpeg';
import img3 from '../../assets/marathon.png';
import img4 from '../../assets/medical.jpeg';

const upcomingEvents = [
    {
        id: 1,
        image: img1,
        title: 'Innovating with DZ-Bot: Algeria’s First AI-Powered Robot for Healthcare and Education',
        subtitle: 'Be part of the Algiers TechXpo 2025 and experience DZ-Bot, the revolutionary robot created by Algerian engineers. Fluent in Algerian Arabic and Tamazight, DZ-Bot is here to redefine healthcare and education.',
    },
    {
        id: 2,
        image: img3,
        title: 'Harmony Stride International Marathon 2025',
        subtitle: 'Join thousands of runners from around the world for the Harmony Stride International Marathon 2025! Experience the thrill of running through scenic routes while supporting a great cause.',
    },
    {
        id: 3,
        image: img4,
        title: "Global Health and Wellness Virtual Conference",
        subtitle: "Join us for a virtual event featuring keynote speakers, panel discussions, and interactive sessions. Connect with experts, explore virtual booths, and network with wellness enthusiasts worldwide."
    },
    {
        id: 4,
        image: img1,
        title: 'Innovating with DZ-Bot: Algeria’s First AI-Powered Robot for Healthcare and Education',
        subtitle: 'Be part of the Algiers TechXpo 2025 and experience DZ-Bot, the revolutionary robot created by Algerian engineers. Fluent in Algerian Arabic and Tamazight, DZ-Bot is here to redefine healthcare and education.',
    },
    {
        id: 5,
        image: img3,
        title: 'Harmony Stride International Marathon 2025',
        subtitle: 'Join thousands of runners from around the world for the Harmony Stride International Marathon 2025! Experience the thrill of running through scenic routes while supporting a great cause.',
    },
    {
        id: 6,
        image: img4,
        title: "Global Health and Wellness Virtual Conference",
        subtitle: "Join us for a virtual event featuring keynote speakers, panel discussions, and interactive sessions. Connect with experts, explore virtual booths, and network with wellness enthusiasts worldwide."
    }
];

export const UpcomingEvent = () => {
    const [activeIndex, setActiveIndex] = useState(1);
    const scrollRef = useRef(null);
    const [alert, setAlert] = useState(null);
    const [eventLikes, setEventLikes] = useState(() => {
      const initialLikes = {};
      upcomingEvents.forEach(event => {
        initialLikes[event.id] = false; // Initialize all events to not liked
      });
      return initialLikes;
    }); // Track like status for each event
    const [shareMenuOpen, setShareMenuOpen] = useState({}); // Track share menu open state for each event
    const [moreMenuOpen, setMoreMenuOpen] = useState({}); // Track more menu open state for each event

    useEffect(() => {
        const container = scrollRef.current;
        if (container) {
            const scrollAmount = (container.offsetWidth - container.offsetWidth * 0.5) / 2;
            container.scrollTo({
                left: scrollAmount + activeIndex * (container.offsetWidth * 0.5),
                behavior: 'smooth',
            });
        }
    }, []);

    const handleScroll = (direction) => {
        const container = scrollRef.current;
        if (!container) return;

        const cardWidth = container.offsetWidth * 0.5; // Active card width
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
      try {
        // Optimistically update the UI immediately
        setEventLikes(prevLikes => ({ ...prevLikes, [eventId]: isLiked }));

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate 500ms delay

        console.log(`Event ${eventId} like status updated to ${isLiked}`);

      } catch (error) {
        console.error("Error updating like status:", error);
        // Revert the UI state in case of an error
        setEventLikes(prevLikes => ({ ...prevLikes, [eventId]: !isLiked })); // Revert on error
      }
    }, []);

    const toggleShareMenu = useCallback((eventId) => {
        setShareMenuOpen(prevShareMenuOpen => ({
            ...prevShareMenuOpen,
            [eventId]: !prevShareMenuOpen[eventId],
        }));
    }, []);

    const toggleMoreMenu = useCallback((eventId) => {
        setMoreMenuOpen(prevMoreMenuOpen => ({
            ...prevMoreMenuOpen,
            [eventId]: !prevMoreMenuOpen[eventId],
        }));
    }, []);

    const handleRegister = useCallback((eventId) => {
      setAlert({ message: `Successfully registered for event ${eventId}!`, type: 'success' });
        // alert(`Registering for event ${eventId}`);
    }, []);

    const handleContact = useCallback((eventId) => {
      setAlert({ message: `Contacting organizer for event ${eventId}...`, type: 'info' });
        // alert(`Contacting organizer for event ${eventId}`);
    }, []);

   const handleCloseAlert = () => {
        setAlert(null);
    };

    return (
        <section className="relative container mx-auto px-4 py-8" id='upcomingEvent'>
            <h1 className="text-3xl font-bold mb-6 text-center text-white">Upcoming Events</h1>
            {alert && (
                <Alert message={alert.message} type={alert.type} onClose={handleCloseAlert} />
            )}
            <div
                ref={scrollRef}
                className="relative flex items-center overflow-x-auto scrollbar-hide"
                style={{
                    paddingLeft: '10vw', // Space for first card to be partially visible
                    paddingRight: '10vw', // Space for last card to be partially visible
                    scrollSnapType: 'x mandatory',
                }}
            >
                {upcomingEvents.map((event, index) => {
                    const isActive = index === activeIndex;
                    const isLiked = eventLikes[event.id] || false;
                    const shareMenuIsOpen = shareMenuOpen[event.id] || false;
                    const moreMenuIsOpen = moreMenuOpen[event.id] || false;
                    const shareUrl = `https://example.com/events/${event.id}`; // Replace with your actual URL

                    return (
                        <div
                            key={event.id}
                            className={`flex-shrink-0 transition-all duration-300 rounded-3xl mx-2 relative`}
                            style={{
                                width: isActive ? '50vw' : '30vw', // Adjusted width for active and inactive cards
                                height: isActive ? '400px' : '300px',
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
                            <div className="absolute top-4 right-4 flex flex-col items-center border border-white p-2 rounded-sm">
                                <HeartIcon eventId={event.id} isLiked={isLiked} onLike={handleLike} />

                                <div className="relative">
                                    <button
                                        onClick={() => toggleShareMenu(event.id)}
                                        className="mb-2"
                                        aria-label="Share"
                                    >
                                        <FaShareAlt color="white" size={24} />
                                    </button>
                                    <ShareMenu isOpen={shareMenuIsOpen} onClose={() => toggleShareMenu(event.id)} shareUrl={shareUrl} />
                                </div>

                                <div className="relative">
                                    <button
                                        onClick={() => toggleMoreMenu(event.id)}
                                        aria-label="More Options"
                                    >
                                        <FaEllipsisH color="white" size={24} />
                                    </button>
                                    <MoreOptionsMenu
                                        isOpen={moreMenuIsOpen}
                                        onClose={() => toggleMoreMenu(event.id)}
                                        onRegister={() => handleRegister(event.id)}
                                        onContact={() => handleContact(event.id)}
                                    />
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-black-52">
                                <h2 className="text-lg font-bold text-white mb-2">{event.title}</h2>
                                <p className="text-gray-200 text-sm mb-2 ">{event.subtitle}</p>
                                <button className="btn-effect text-white ">
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
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-3 z-10"
                aria-label="Previous event"
            >
                <MdArrowBackIos className="text-xl" />
            </button>
            <button
                onClick={() => handleScroll('right')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-3 z-10"
                aria-label="Next event"
            >
                <MdArrowForwardIos className="text-xl" />
            </button>
        </section>
    );
};

