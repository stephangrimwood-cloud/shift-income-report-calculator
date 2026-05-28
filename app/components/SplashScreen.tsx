"use client";

import { motion } from "framer-motion";

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black overflow-hidden">
      
      {/* Headlight Glow Background */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.15, 0.3, 0.15] }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Taxi Sign Glow */}
      <motion.div
        className="absolute top-[28%] w-32 h-8 rounded-md bg-amber-400/20 blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.2, 0.7, 0.3] }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* App Title */}
      <motion.h1
        className="mb-6 text-3xl font-semibold tracking-[0.3em] text-amber-400 uppercase"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Driver
      </motion.h1>

      {/* Logo */}
      <motion.img
        src="/icon.png"
        alt="Driver Companion Logo"
        className="w-40 h-40 object-contain relative z-10"
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{
          scale: [0.98, 1.02, 0.98],
          opacity: 1,
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Subtitle */}
      <motion.h2
        className="mt-6 text-xl tracking-[0.4em] text-white/80 uppercase"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        Companion
      </motion.h2>
    </div>
  );
}