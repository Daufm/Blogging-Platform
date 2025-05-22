import React from "react";
import { motion } from "framer-motion";
import teamImg from "../assets/image1.jpg"; // make sure this exists
import missionImg from "../assets/images2.jpg"; // make sure this exists
import techImg from "../assets/images3.jpg"; // make sure this exists
import Footer  from "./Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.3,
      duration: 0.6,
      type: "spring",
    },
  }),
};

const About = () => {
  return (
    <>
      <div className="md:px-20 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100">
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-center mb-6"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          About <span className="text-indigo-600">BlogSphere</span>
        </motion.h1>

        <motion.p
          className="text-center max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300 mb-16"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          Learn more about the people, purpose, and technologies behind our platform.
        </motion.p>

        <div className="space-y-24">
          {/* Our Team */}
          <motion.div
            className="flex flex-col md:flex-row items-center gap-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full md:w-1/2"
            >
              <img
                src={teamImg}
                alt="Team working together"
                className="rounded-2xl shadow-xl transition-transform duration-500 hover:shadow-indigo-500/40"
              />
            </motion.div>
            <div className="w-full md:w-1/2 space-y-4">
              <h2 className="text-3xl font-semibold text-indigo-600">Our Team</h2>
              <p>
                We&apos;re a passionate group of developers and designers from Gondar University,
                dedicated to building meaningful digital experiences. Our team thrives on
                creativity, teamwork, and a love for coding!
              </p>
            </div>
          </motion.div>

          {/* Mission */}
          <motion.div
            className="flex flex-col-reverse md:flex-row items-center gap-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            variants={fadeUp}
          >
            <div className="w-full md:w-1/2 space-y-4">
              <h2 className="text-3xl font-semibold text-indigo-600">Our Mission</h2>
              <p>
                At BlogSphere, our mission is to empower writers and readers with a platform
                that’s simple, interactive, and meaningful. We believe in giving everyone a voice.
              </p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05, rotate: -1 }}
              transition={{ duration: 0.5 }}
              className="w-full md:w-1/2"
            >
              <img
                src={missionImg}
                alt="Mission visualization"
                className="rounded-2xl shadow-xl transition-transform duration-500 hover:shadow-indigo-500/40"
              />
            </motion.div>
          </motion.div>

          {/* Technology */}
          <motion.div
            className="flex flex-col md:flex-row items-center gap-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
            variants={fadeUp}
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ duration: 0.5 }}
              className="w-full md:w-1/2"
            >
              <img
                src={techImg}
                alt="Technology stack"
                className="rounded-2xl shadow-xl transition-transform duration-500 hover:shadow-indigo-500/40"
              />
            </motion.div>
            <div className="w-full md:w-1/2 space-y-4">
              <h2 className="text-3xl font-semibold text-indigo-600">Our Technology</h2>
              <p>
                Built with React, Tailwind CSS, and Node.js, BlogSphere is a modern full-stack app
                designed for performance, responsiveness, and beautiful UI/UX.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Contact Section */}
        <div className="mt-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-indigo-600">Want to Collaborate or Ask Us Something?</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Reach out via email or follow us on social media. We’d love to connect!
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full bg-gray-100 dark:bg-gray-800">
        <Footer />
      </div>
    </>
  );
};

export default About;