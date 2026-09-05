import React from 'react'
import videoBg from '../../assets/bg-vd1.mp4';

export const Hero_sec = () => {
    return (
        <section className="relative h-screen overflow-hidden">
            <video
                className="absolute top-0 left-0 w-full h-full object-cover z-1"
                src={videoBg}
                autoPlay
                loop
                muted
                playsInline
            />
            <div className="absolute inset-0 bg-black/40 z-5"></div>
            <div className="relative z-10 flex flex-col items-start justify-center h-full text-white px-4 sm:px-8 md:px-12 lg:px-16">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 w-full sm:w-3/4 lg:w-3/4">
                    Discover, Connect, and Participate in the Best Events
                </h1>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 w-full sm:w-2/3 lg:w-1/2">
                    Your gateway to conferences, expos, and networking opportunities worldwide
                </p>
            </div>
        </section>
    )
}