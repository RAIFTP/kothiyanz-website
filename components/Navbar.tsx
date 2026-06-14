"use client";

import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      className="fixed w-full z-50 bg-black/40 backdrop-blur-lg"
    >
      <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between">
        <h1 className="text-2xl font-bold gold-text">
          KOTHIYANZ
        </h1>

        <div className="hidden md:flex gap-8">
          <a href="#story">Story</a>
          <a href="#ambience">Ambience</a>
          <a href="#menu">Menu</a>
          <a href="#contact">Contact</a>
        </div>
      </div>
    </motion.nav>
  );
}
