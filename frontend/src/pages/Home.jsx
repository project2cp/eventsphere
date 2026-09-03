import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Hero_sec } from '../components/Home_section/Hero_sec';
import { About_sec } from '../components/Home_section/About_sec';
import { PreviousEvent } from '../components/Home_section/PreviousEent';
import { UpcomingEvent } from '../components/Home_section/UpcomingEvent';
import { Organizers } from '../components/Home_section/Orgnaizers';
import { Footer } from '../components/Home_section/Footer';

export const Home = () => {



    return (

        <div className=" bg-[var(--bg-purple)] ">
                 <Navbar />
                 <Hero_sec/>
                 <About_sec/>
                 <PreviousEvent/>
                 <UpcomingEvent/>
                 <Organizers/>
                 <Footer/>
        </div>
        
    );
};
