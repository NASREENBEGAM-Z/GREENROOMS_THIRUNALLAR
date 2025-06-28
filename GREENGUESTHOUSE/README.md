# Green Guest House - Hotel Booking Web App

A modern, responsive hotel booking website for Green Guest House located in Thirunallar, Tamil Nadu. This web application is built with React, Vite, and Tailwind CSS.

## Features

- **Responsive Design**: Mobile-first approach with beautiful UI on all devices
- **Room Booking System**: Interactive booking form with date selection and room types
- **Room Showcase**: Display of different room categories with amenities and pricing
- **Contact Information**: Easy access to contact details and location
- **Modern UI**: Clean, professional design with smooth animations
- **SEO Optimized**: Proper meta tags and semantic HTML structure

## Room Types

1. **Deluxe Two Double Bed A/C** - ₹2,500/night
2. **Deluxe Two Double Bed Non A/C** - ₹1,800/night
3. **Deluxe One Double Bed A/C** - ₹2,000/night
4. **Deluxe One Double Bed Non A/C** - ₹1,500/night

## Technologies Used

- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **JavaScript ES6+** - Modern JavaScript features

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository or navigate to the project directory
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

To create a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── main.jsx          # Main application entry point
├── style.css         # Global styles and Tailwind imports
└── assets/           # Static assets (images, icons)

Components:
├── Header            # Navigation and logo
├── Hero              # Hero section with call-to-action
├── About             # About section with guest house information
├── Rooms             # Room showcase with pricing
├── BookingForm       # Interactive booking form
├── Contact           # Contact information and location
└── Footer            # Footer with links and social media
```

## Features Overview

### Header Navigation
- Fixed navigation bar with smooth scrolling
- Mobile-responsive hamburger menu
- Brand logo and navigation links

### Hero Section
- Full-screen hero with gradient background
- Compelling call-to-action
- Information about location and services

### About Section
- Information about the guest house
- Location benefits (2-minute walk to temple)
- Key highlights and statistics

### Rooms Section
- Grid layout of room types
- Pricing information
- Amenities list for each room
- Hover effects and animations

### Booking Form
- Interactive form with validation
- Date picker for check-in/check-out
- Guest count selection
- Room type selection
- Personal information fields

### Contact Section
- Contact details (phone, email, address)
- Location information
- Social media links

## Customization

### Colors
The application uses a green color scheme that can be customized in `src/style.css`:
- Primary: Green-600 (#059669)
- Secondary: Gray tones
- Accent: Green-500 (#10b981)

### Content
All content is easily editable in the `main.jsx` file:
- Room information and pricing
- Contact details
- About section content
- Navigation links

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is created for Green Guest House. All rights reserved.

## Contact

For any questions or support, please contact:
- Phone: +91-9003769514, +91-9080322029
- Email: info@greenguesthouse.com
- Location: Near Saneeswarar Temple, Thirunallar, Tamil Nadu 