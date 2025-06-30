import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({
    checkIn: today,
    checkOut: today,
    adults: 1,
    children: 0
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(form).toString();
    navigate(`/booking?${params}`);
  };

  return (
    <section
      id="home"
      className="relative h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('https://ik.imagekit.io/2rlgs5ipz/GREENGUESTHOUSE/entrance?updatedAt=1750576917561')`
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 text-center text-white px-4 w-full">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">Welcome to Green Rooms</h1>
        <p className="text-xl md:text-2xl mb-8">Your Comfortable Stay in Thirunallar</p>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Located near the sacred Saneeswarar Temple, we provide luxury accommodation at budget-friendly prices
        </p>
        <form onSubmit={handleSubmit} className="bg-white bg-opacity-90 rounded-lg p-6 flex flex-col md:flex-row items-center justify-center gap-4 max-w-3xl mx-auto shadow-lg">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Check In</label>
            <input type="date" name="checkIn" value={form.checkIn} onChange={handleChange} min={today} className="p-2 rounded border border-gray-300 text-gray-900 bg-white" required />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Check Out</label>
            <input type="date" name="checkOut" value={form.checkOut} onChange={handleChange} min={form.checkIn} className="p-2 rounded border border-gray-300 text-gray-900 bg-white" required />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Adults</label>
            <select name="adults" value={form.adults} onChange={handleChange} className="p-2 rounded border border-gray-300 text-gray-900 bg-white">
              {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Children</label>
            <select name="children" value={form.children} onChange={handleChange} className="p-2 rounded border border-gray-300 text-gray-900 bg-white">
              {[0, 1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <button type="submit" className="btn-primary px-6 py-3 text-lg mt-4 md:mt-6">Check Availability</button>
        </form>
      </div>
    </section>
  );
};

export default Hero; 