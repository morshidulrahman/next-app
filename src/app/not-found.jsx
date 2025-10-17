"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { HiOutlineHome, HiOutlineArrowLeft } from "react-icons/hi";
import Image from "next/image";

export default function NotFound() {
  const router = useRouter();

  const float = {
    initial: { y: 0 },
    animate: {
      y: [-8, 8, -8],
      transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
    },
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-blue-50 px-6 py-20">
      {/* Decorative gradient orbs */}
      <motion.div
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-0 -left-16 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.15 }}
      />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <Image
          src="https://i.ibb.co.com/k6P3pGVZ/output-onlinepngtools-1.png"
          alt="RI Tracker"
          width={60}
          height={60}
          className="h-16 w-16"
          unoptimized
        />
      </motion.div>

      {/* Illustration */}
      <motion.div
        variants={float}
        initial="initial"
        animate="animate"
        className="relative mb-10 w-full max-w-md"
      >
        <svg viewBox="0 0 540 360" className="mx-auto h-auto w-full" aria-hidden="true">
          <ellipse cx="270" cy="220" rx="180" ry="70" fill="url(#bg-grad)" opacity="0.35" />
          <defs>
            <linearGradient id="bg-grad" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#93C5FD" />
              <stop offset="100%" stopColor="#C7D2FE" />
            </linearGradient>
            <linearGradient id="main" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
          </defs>

          <text
            x="50%"
            y="40%"
            textAnchor="middle"
            fontSize="88"
            fontWeight="700"
            fill="url(#main)"
          >
            404
          </text>

          <rect
            x="170"
            y="150"
            width="200"
            height="120"
            rx="4"
            fill="#FFFFFF"
            stroke="#E5E7EB"
            strokeWidth="2"
          />
          <path d="M170 168h200" stroke="#E5E7EB" strokeWidth="2" />

          <circle cx="270" cy="215" r="24" fill="#EFF6FF" stroke="#BFDBFE" />
          <circle cx="270" cy="215" r="14" stroke="#60A5FA" strokeWidth="3" fill="none" />
          <line
            x1="284"
            y1="229"
            x2="296"
            y2="241"
            stroke="#60A5FA"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>

      {/* Title + desc */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-xl text-center"
      >
        <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
          Page Not Found
        </h1>
        <p className="mb-10 text-gray-600">
          The page you’re looking for doesn’t exist or may have been moved.
        </p>
      </motion.div>

      {/* CTA */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center rounded-md bg-blue-600 px-6 py-3 font-medium text-white shadow-md transition hover:bg-blue-700"
        >
          <HiOutlineHome className="mr-2 h-5 w-5" /> Go Home
        </Link>
        <motion.button
          onClick={() => router.back()}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="inline-flex items-center rounded-md border border-blue-600 bg-white px-6 py-3 font-medium text-blue-600 shadow-sm transition hover:bg-blue-50"
        >
          <HiOutlineArrowLeft className="mr-2 h-5 w-5" /> Go Back
        </motion.button>
      </div>
    </div>
  );
}
