import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  // Refs to access DOM elements directly for parallax effect
  const parallaxBgRef = useRef(null);
  const mainHeadingRef = useRef(null);
  const subTextRef = useRef(null);

  // useNavigate hook from React Router for programmatic navigation
  const navigate = useNavigate();

  // useEffect hook to handle side effects like adding event listeners
  // This runs once after the component mounts (empty dependency array)
  useEffect(() => {
    // Get current references to the DOM elements
    const parallaxBg = parallaxBgRef.current;
    const mainHeading = mainHeadingRef.current;
    const subText = subTextRef.current;

    // Function to handle mouse movement for parallax effect
    const handleMouseMove = (e) => {
      if (parallaxBg && mainHeading && subText) {
        // Calculate normalized mouse coordinates (-0.5 to 0.5)
        const x = (e.clientX / window.innerWidth - 0.5);
        const y = (e.clientY / window.innerHeight - 0.5);

        // Apply parallax to the background element
        // Scaling slightly to cover potential gaps during movement
        parallaxBg.style.transform = `translate(${x * 30 * 0.5}px, ${y * 30 * 0.5}px) scale(1.05)`;

        // Apply parallax to the main heading (less movement)
        mainHeading.style.transform = `translate(${x * 30 * 0.2}px, ${y * 30 * 0.2}px)`;
        // Apply parallax to the sub-text (even less movement)
        subText.style.transform = `translate(${x * 30 * 0.15}px, ${y * 30 * 0.15}px)`;
      }
    };

    // Add mousemove event listener to the document body
    document.body.addEventListener('mousemove', handleMouseMove);

    // Cleanup function: remove event listener when component unmounts
    return () => {
      document.body.removeEventListener('mousemove', handleMouseMove);
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  // Event handler for the "Go Home" button click
  const handleGoHomeClick = () => {
    // Use navigate hook to go to the root path
    navigate('/');
  };

  return (
    <div className="bg-gray-900 text-white flex items-center justify-center min-h-screen relative overflow-hidden">
      {/*
        Inline style tag for custom CSS. In a real React project,
        you would typically import these styles from a separate .css file.
        The @import for fonts should be in your main CSS file or public/index.html.
      */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
          body {
              font-family: 'Inter', sans-serif;
              overflow: hidden;
          }
          .gradient-bg {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: linear-gradient(135deg, #667eea, #764ba2);
              z-index: -1;
              transition: transform 0.1s ease-out;
          }
          .content-box {
              position: relative;
              z-index: 1;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
          }
          .floating-element {
              position: absolute;
              opacity: 0.1;
              animation: float 6s ease-in-out infinite;
          }
          .floating-element.one {
              top: 10%;
              left: 15%;
              width: 80px;
              height: 80px;
              animation-delay: 0s;
          }
          .floating-element.two {
              bottom: 20%;
              right: 10%;
              width: 100px;
              height: 100px;
              animation-delay: 2s;
          }
          .floating-element.three {
              top: 40%;
              right: 25%;
              width: 60px;
              height: 60px;
              animation-delay: 4s;
          }
          @keyframes float {
              0% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-10px) rotate(5deg); }
              100% { transform: translateY(0px) rotate(0deg); }
          }
        `}
      </style>

      {/* This div acts as the parallax background element */}
      <div id="parallax-bg" ref={parallaxBgRef} className="gradient-bg"></div>

      {/* Decorative floating elements for visual flair */}
      <div className="floating-element one bg-blue-500 rounded-full"></div>
      <div className="floating-element two bg-purple-500 rounded-lg"></div>
      <div className="floating-element three bg-pink-500 rounded-full"></div>

      {/* Main content box for the 404 message and button */}
      <div className="content-box text-center bg-gray-800 bg-opacity-80 p-8 md:p-12 rounded-xl shadow-2xl backdrop-blur-sm">
        <h1
          ref={mainHeadingRef}
          className="text-6xl md:text-8xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500 transform transition-transform duration-300 ease-in-out hover:scale-105"
        >
          404
        </h1>
        <p
          ref={subTextRef}
          className="text-xl md:text-2xl mb-8 text-gray-300 transform transition-transform duration-300 ease-in-out hover:scale-105"
        >
          I think you are lost. Go home!
        </p>
        <button
          onClick={handleGoHomeClick}
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 ease-in-out hover:scale-105 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-75"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
