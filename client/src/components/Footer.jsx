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
    <div className="bg-gradient-to-br from-slate-800 to-gray-500 text-white">
    <footer className=" max-w-full">
      {/* Contact Us - Centered */}
      <div className="flex justify-center py-6 border-b border-gray-700">
        <a
          href="mailto:contact@blogsphere.com"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl transition"
        >
          Mail Us
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
          <div className="flex gap-4 text-xl ">
            <a
              href="#"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 hover:translate-x-2 text-white transition-all"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 hover:translate-x-2 text-white transition-all"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-pink-500 hover:bg-pink-600 hover:translate-x-2 text-white transition-all"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-700 hover:bg-blue-800 hover:translate-x-2 text-white transition-all"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn />
            </a>
            <a
              href="#"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 hover:translate-x-2 text-white transition-all"
              aria-label="YouTube"
            >
              <FaYoutube />
            </a>
          </div>
      </div>
      <p className="text-center text-sm text-gray-100 py-4">
        © {new Date().getFullYear()} BlogSphere.com All rights reserved.
      </p>

    </footer>
    </div>
  );
};

export default Footer;
