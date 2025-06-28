import React, { useState } from 'react';
import { NavHashLink as NavLink } from 'react-router-hash-link';
import { FaSearch, FaTimes } from 'react-icons/fa';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navLinks = [
    { title: 'HOME', path: '/#home' },
    { title: 'ABOUT US', path: '/#about' },
    { title: 'ROOMS', path: '/#rooms' },
    { title: 'BOOKING', path: '/booking' },
    { title: 'CONTACT', path: '/#contact' },
  ];

  const getNavLinkClass = ({ isActive }) => {
    const baseClasses = 'uppercase hover:text-white transition-colors tracking-wider';
    return isActive
      ? `${baseClasses} text-white font-bold`
      : `${baseClasses} text-gray-300`;
  };

  return (
    <>
      <header className="bg-slate-800 shadow-lg fixed w-full top-0 z-50 text-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo and Brand Name */}
            <NavLink to="/" className="flex items-center space-x-3">
              <div className="flex items-center space-x-3">
                <img
                  src="https://ik.imagekit.io/2rlgs5ipz/GREENGUESTHOUSE/greenguestlogo?updatedAt=1750590886578"
                  alt="Green Guest House Logo"
                  className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-white p-1"
                  style={{
                    objectFit: 'cover',
                    minWidth: '40px',
                    minHeight: '40px'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div>
                  <h1 className="text-xl md:text-2xl font-serif font-bold text-white leading-tight">Green Guest House</h1>
                  <p className="text-xs md:text-sm text-gray-300 leading-tight">Thirunallar</p>
                </div>
              </div>
            </NavLink>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <nav className="flex space-x-6">
                {navLinks.map(link => (
                  <NavLink
                    key={link.title}
                    to={link.path}
                    className={getNavLinkClass}
                  >
                    {link.title}
                  </NavLink>
                ))}
              </nav>
              <div className="border-l border-gray-600 h-6"></div>
              <button onClick={() => setIsSearchOpen(true)} className="text-gray-300 hover:text-white">
                <FaSearch />
              </button>
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden py-4 border-t border-slate-700">
              <div className="flex flex-col space-y-4">
                {navLinks.map(link => (
                  <NavLink
                    key={link.title}
                    to={link.path}
                    className="text-gray-300 hover:text-white transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.title}
                  </NavLink>
                ))}
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-start justify-center pt-24">
          <div className="relative bg-slate-800 p-4 rounded-lg shadow-xl flex items-center">
            <input
              type="text"
              placeholder="Type Keywords..."
              className="w-full bg-slate-700 text-white placeholder-gray-400 rounded-md py-2 pl-4 pr-10 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button onClick={() => setIsSearchOpen(false)} className="absolute right-6 text-gray-400 hover:text-white">
              <FaTimes size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header; 