import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black text-white w-full">
      {/* Contact Us - Centered */}
      <div className="flex justify-center py-6 border-b border-gray-700">
        <a
          href="mailto:contact@blogsphere.com"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl transition"
        >
          Contact Us
        </a>
      </div>

      {/* Top part with navigation (optional) */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 border-b border-gray-700">
        {/* You can add footer links here if needed */}
      </div>

      {/* Bottom part with logo, tagline and social links */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Logo or Site Name */}
        <Link to="/" className="text-lg font-bold text-white hover:text-indigo-400 transition-colors">
          BlogSphere.com
        </Link>

        {/* Tagline */}
        <p className="text-sm text-gray-400 text-center">BLOGSPHERE</p>

        {/* Social Icons */}
        <div className="flex gap-4 text-xl">
          <a href="#" className="hover:text-indigo-400"><FaFacebookF /></a>
          <a href="#" className="hover:text-indigo-400"><FaTwitter /></a>
          <a href="#" className="hover:text-indigo-400"><FaInstagram /></a>
          <a href="#" className="hover:text-indigo-400"><FaLinkedinIn /></a>
          <a href="#" className="hover:text-indigo-400"><FaYoutube /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
