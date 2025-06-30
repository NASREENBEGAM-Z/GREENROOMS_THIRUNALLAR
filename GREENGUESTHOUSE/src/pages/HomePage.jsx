import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import Rooms from '../components/Rooms';
import Reviews from '../components/Reviews';
import Footer from '../components/Footer';

const HomePage = () => (
    <>
        <Header />
        <main>
            <Hero />
            <About />
            <Rooms />
            <Reviews />
        </main>
        <Footer />
    </>
);

export default HomePage; 