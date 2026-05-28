"use client";

import { motion } from "framer-motion";

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black overflow-hidden">
      
      {/* Headlight Glow Background */}
      <motion.div
        className="absolute w-[340px] h-[340px] rounded-full bg-amber-400/16 blur-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.12, 0.28, 0.12] }}
        transition={{
          duration: 3.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* App Title */}
      <h1
        className="mb-4 text-4xl font-semibold tracking-[0.22em] text-amber-400 uppercase"
      >
        Driver
      </h1>

        {/* Logo Wrapper */}
        <div className="relative z-10 w-40 h-40">
        <img
            src="/icon-512.png"
            alt="Driver Companion Logo"
            className="relative z-10 w-40 h-40 object-contain"
        />

        {/* Headlight Flash Overlay */}
        <motion.img
        src="/headlight-flash.png"
        alt=""
        className="absolute inset-0 z-20 w-40 h-40 object-contain pointer-events-none"
        style={{
            filter: "brightness(3.5) drop-shadow(0 0 18px white)"
            }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 5, 0, 0, 2.5, 0] }}
        transition={{
            duration: 1.6,
            ease: "easeOut",
            times: [0, 0.18, 0.38, 0.58, 0.78, 1],
        }}
        />

        {/* Taxi Sign Glow Overlay */}
        <motion.div
            className="absolute left-1/2 top-[19%] h-5 w-14 -translate-x-1/2 rounded-md bg-amber-300/60 blur-md"
            initial={{ opacity: 0.15 }}
            animate={{ opacity: [0.15, 0.8, 0.25, 0.65, 0.2] }}
            transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            }}
        />
        </div>

      {/* Subtitle */}
      <h2
        className="mt-4 text-xl tracking-[0.28em] text-white/80 uppercase"
      >
        Companion
      </h2>
    </div>
  );
}