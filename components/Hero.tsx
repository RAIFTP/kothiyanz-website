"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="h-screen relative flex items-center justify-center text-center">

      <div className="absolute inset-0 bg-black/70" />

      <motion.div
        initial={{ opacity:0, y:40 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:1 }}
        className="relative z-10"
      >
        <h1 className="text-7xl md:text-9xl font-bold">
          KOTHIYANZ
        </h1>

        <p className="text-gold mt-6 text-xl">
          More Than a Meal.
          An Experience Worth Returning To.
        </p>

        <div className="mt-10 flex gap-5 justify-center">
          <button className="bg-amber px-8 py-4 rounded-full">
            Explore
          </button>

          <button className="border border-white px-8 py-4 rounded-full">
            View Menu
          </button>
        </div>
      </motion.div>
    </section>
  );
}
