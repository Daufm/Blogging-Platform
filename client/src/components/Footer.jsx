import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt
} from "react-icons/fa";
import { motion } from "framer-motion";

const Footer = () => {
  const socialLinks = [
    { icon: <FaFacebookF />, color: "bg-indigo-600 hover:bg-indigo-700", label: "Facebook", url: "#" },
    { icon: <FaTwitter />, color: "bg-blue-500 hover:bg-blue-600", label: "Twitter", url: "#" },
    { icon: <FaInstagram />, color: "bg-gradient-to-tr from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600", label: "Instagram", url: "#" },
    { icon: <FaLinkedinIn />, color: "bg-blue-700 hover:bg-blue-800", label: "LinkedIn", url: "#" },
    { icon: <FaYoutube />, color: "bg-red-600 hover:bg-red-700", label: "YouTube", url: "#" }
  ];

  const footerLinks = [
    {
      title: "Company",
      links: [
        { name: "About Us", url: "/about" },
        { name: "Careers", url: "/careers" },
        { name: "Blog", url: "/blog" },
        { name: "Press", url: "/press" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Help Center", url: "/help" },
        { name: "Tutorials", url: "/tutorials" },
        { name: "API Docs", url: "/api-docs" },
        { name: "Community", url: "/community" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", url: "/privacy" },
        { name: "Terms of Service", url: "/terms" },
        { name: "Cookie Policy", url: "/cookies" },
        { name: "GDPR", url: "/gdpr" }
      ]
    }
  ];

  const contactInfo = [
    { icon: <FaEnvelope />, text: "contact@blogsphere.com", url: "mailto:contact@blogsphere.com" },
    { icon: <FaPhoneAlt />, text: "+1 (555) 123-4567", url: "tel:+15551234567" },
    { icon: <FaMapMarkerAlt />, text: "123 Tech Street, Silicon Valley, CA", url: "https://maps.google.com" }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Contact CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col items-center mb-16"
        >
          <h3 className="text-2xl font-bold mb-6 text-center">Have questions or feedback?</h3>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="mailto:contact@blogsphere.com"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/20"
          >
            <FaEnvelope className="text-lg" />
            <span>Contact Our Team</span>
          </motion.a>
        </motion.div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-bold flex items-center gap-2">
              <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                BlogSphere
              </span>
            </Link>
            <p className="text-gray-400">
              The modern platform for content creators and readers to connect and share ideas.
            </p>
            
            {/* Contact Information */}
            <div className="space-y-3 mt-6">
              {contactInfo.map((item, index) => (
                <a 
                  key={index} 
                  href={item.url} 
                  className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors"
                >
                  <span className="text-indigo-400">{item.icon}</span>
                  <span>{item.text}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section, index) => (
            <div key={index} className="space-y-4">
              <h4 className="text-lg font-semibold text-white">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      to={link.url} 
                      className="text-gray-400 hover:text-indigo-400 transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 bg-indigo-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Subscribe to our newsletter</h4>
            <p className="text-gray-400">
              Get the latest updates, news and product offers.
            </p>
            <form className="mt-4 space-y-3">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 outline-none transition"
                required
              />
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Copyright */}
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} BlogSphere. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex gap-3">
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.url}
                aria-label={social.label}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.9 }}
                className={`flex items-center justify-center w-10 h-10 rounded-full ${social.color} text-white transition-all shadow-md hover:shadow-lg`}
              >
                {social.icon}
              </motion.a>
            ))}
          </div>

          {/* Legal Links */}
          <div className="flex gap-4 text-sm">
            <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link to="/cookies" className="text-gray-400 hover:text-white transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;