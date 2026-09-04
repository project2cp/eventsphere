import React from 'react'
import videoBg from '../../assets/bg-vd1.mp4';

export const Hero_sec = () => {
  return (
        <section className="relative h-screen overflow-hidden" >
            <video
                className="absolute top-0 left-0 w-full h-full object-cover z-1"
                src={videoBg}
                autoPlay
                loop
                muted
            />
            <div className="relative z-10 flex flex-col items-start justify-center h-full text-white px-16">
                <h1 className="text-5xl font-bold mb-4 w-3/4">
                    Discover, Connect, and Participate in the Best Events
                </h1>
                <p className="text-xl mb-8">
                    Your gateway to conferences, expos, and networking opportunities worldwide
                </p>
        </div>
    </section>
  )
}
