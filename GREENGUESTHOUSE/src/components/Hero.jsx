import React from 'react';

const Hero = () => {
  return (
    <section
      id="home"
      className="relative h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('https://ik.imagekit.io/2rlgs5ipz/GREENGUESTHOUSE/entrance?updatedAt=1750576917561')`
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">Welcome to Green Guest House</h1>
        <p className="text-xl md:text-2xl mb-8">Your Comfortable Stay in Thirunallar</p>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Located near the sacred Saneeswarar Temple, we provide luxury accommodation at budget-friendly prices
        </p>
        <a href="#booking" className="btn-primary text-lg px-8 py-3">Book Now</a>
      </div>
    </section>
  );
};

export default Hero; 