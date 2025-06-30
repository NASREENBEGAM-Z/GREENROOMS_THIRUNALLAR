import React, { useState, useEffect } from 'react';

const About = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState({});

  const images = [
    {
      url: "https://ik.imagekit.io/2rlgs5ipz/GREENGUESTHOUSE/reception?updatedAt=1750576917165",
      alt: "Reception Area"
    },
    {
      url: "https://ik.imagekit.io/2rlgs5ipz/GREENGUESTHOUSE/kovil%20?updatedAt=1750576917711",
      alt: "Temple View"
    },
    {
      url: "https://ik.imagekit.io/2rlgs5ipz/GREENGUESTHOUSE/kovil?updatedAt=1750576916581",
      alt: "Sacred Temple"
    },
    {
      url: "https://ik.imagekit.io/2rlgs5ipz/GREENGUESTHOUSE/varanda?updatedAt=1750576917234",
      alt: "Veranda View"
    },
    {
      url: "https://ik.imagekit.io/2rlgs5ipz/GREENGUESTHOUSE/parking",
      alt: "Parking Area"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const handleImageError = (index) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  const hasValidImages = images.some((_, index) => !imageErrors[index]);

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="section-title">About Green Rooms</h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Your Home Away From Home</h3>
            <p className="text-gray-600 mb-6">
              Green Rooms is located in the holy town of Thirunallar, just a 2-minute walk from the famous
              Saneeswarar Temple. We provide comfortable and affordable accommodation for devotees and leisure
              travelers alike.
            </p>
            <p className="text-gray-600 mb-6">
              Our hotel offers modern amenities with traditional hospitality, ensuring your stay is both
              comfortable and memorable. Whether you're here for spiritual purposes or leisure, we make sure
              you feel at home.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">2 Min</div>
                <div className="text-gray-600">Walk to Temple</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">24/7</div>
                <div className="text-gray-600">Service</div>
              </div>
            </div>
          </div>

          {/* Image Carousel */}
          <div className="relative h-80 rounded-lg overflow-hidden shadow-lg">
            {images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={image.alt}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentImageIndex && !imageErrors[index] ? 'opacity-100' : 'opacity-0'
                  }`}
                onError={() => handleImageError(index)}
              />
            ))}

            {/* Fallback if no images load */}
            {!hasValidImages && (
              <div className="absolute inset-0 bg-green-600 flex items-center justify-center text-white text-2xl font-bold">
                Guest House Image
              </div>
            )}

            {/* Image Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${index === currentImageIndex && !imageErrors[index]
                    ? 'bg-white'
                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                    }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={() => goToImage(currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors duration-300 z-10"
              aria-label="Previous image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={() => goToImage(currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors duration-300 z-10"
              aria-label="Next image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About; 