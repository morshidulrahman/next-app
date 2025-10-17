"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaWindows, FaApple, FaAndroid } from "react-icons/fa";
import { HiOutlineDownload } from "react-icons/hi";
import { TbDeviceDesktop, TbDeviceMobile, TbDeviceLaptop } from "react-icons/tb";
import { AiOutlineBarChart, AiOutlineClockCircle } from "react-icons/ai";
import { HiOutlineUsers, HiOutlineBriefcase } from "react-icons/hi";
import { toast, Toaster } from "sonner";
import Image from "next/image";

const Download = () => {
  const [activeTab, setActiveTab] = useState("windows");
  const [showFeature, setShowFeature] = useState(null);

  const handleDownload = (platform) => {
    if (platform === "windows") {
      const link = document.createElement("a");
      link.href = "https://remoteintegrity.s3.us-east-1.amazonaws.com/tracker_app/RI_Tracker_Setup.zip";
      link.download = "RemoteIntegrity-Setup.exe";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Download started!");
    } else if (platform === "mac") {
      toast.info("Mac version coming soon!");
    } else if (platform === "android") {
      toast.info("Android version coming soon!");
    }
  };

  const features = [
    {
      id: "tracking",
      icon: <AiOutlineClockCircle className="h-10 w-10 text-blue-500" />,
      title: "Real-time Tracking",
      description: "Monitor employee activity with precise time tracking and automatic screenshots.",
    },
    {
      id: "analytics",
      icon: <AiOutlineBarChart className="h-10 w-10 text-blue-500" />,
      title: "Advanced Analytics",
      description: "Gain insights with comprehensive data analysis and productivity metrics.",
    },
    {
      id: "teams",
      icon: <HiOutlineUsers className="h-10 w-10 text-blue-500" />,
      title: "Team Management",
      description: "Create teams, assign projects, and track performance across your organization.",
    },
    {
      id: "projects",
      icon: <HiOutlineBriefcase className="h-10 w-10 text-blue-500" />,
      title: "Project Tracking",
      description: "Manage projects, set milestones, and monitor progress in real-time.",
    },
  ];

  const downloadLinks = {
    windows: {
      version: "1.0.14",
      size: "32.8 MB",
      link: "https://remoteintegrity.s3.us-east-1.amazonaws.com/tracker_app/RI_Tracker_Setup.zip",
      requirements: "Windows 10 or later",
      icon: <FaWindows className="h-12 w-12" />,
      deviceIcon: <TbDeviceDesktop className="h-8 w-8" />,
    },
    mac: {
      version: "1.2.1",
      size: "52.3 MB",
      link: "#",
      requirements: "macOS 10.15 or later",
      icon: <FaApple className="h-12 w-12" />,
      deviceIcon: <TbDeviceLaptop className="h-8 w-8" />,
    },
    android: {
      version: "1.1.8",
      size: "23.5 MB",
      link: "#",
      requirements: "Android 8.0 or later",
      icon: <FaAndroid className="h-12 w-12" />,
      deviceIcon: <TbDeviceMobile className="h-8 w-8" />,
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster />

      {/* Hero Section with Animated Background */}
      <div className="relative overflow-hidden mb-16">
        {/* Animated background elements */}
        <div className="absolute inset-0 z-0">
          <motion.div
            className="absolute top-20 right-[10%] w-64 h-64 rounded-full bg-blue-200 opacity-20"
            animate={{ scale: [1, 1.2, 1], x: [0, 20, 0], y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
          />
          <motion.div
            className="absolute bottom-10 left-[15%] w-40 h-40 rounded-full bg-indigo-300 opacity-20"
            animate={{ scale: [1, 1.3, 1], x: [0, -30, 0], y: [0, 30, 0] }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
          />
          <motion.div
            className="absolute top-40 left-[25%] w-20 h-20 rounded-full bg-blue-400 opacity-10"
            animate={{ scale: [1, 1.5, 1], x: [0, 40, 0], y: [0, 40, 0] }}
            transition={{ duration: 7, repeat: Infinity, repeatType: "reverse" }}
          />
        </div>

        <motion.div
          className="max-w-7xl mx-auto text-center py-16 px-4 sm:px-6 lg:px-8 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-8"
          >
            <Image
              src="https://i.ibb.co.com/k6P3pGVZ/output-onlinepngtools-1.png"
              alt="RI Tracker Logo"
              className="h-16 mx-auto"
              width={64}
              height={64}
              unoptimized
            />
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Download{" "}
            <span className="text-blue-600 relative">
              RI Tracker
              <motion.span
                className="absolute bottom-0 left-0 w-full h-1 bg-blue-600"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 1, duration: 0.8 }}
              />
            </span>{" "}
            Desktop App
          </motion.h1>

          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Track resources, monitor productivity, and optimize your workflow with our powerful desktop application.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <a
              href="#download-section"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
            >
              Get Started
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2 animate-bounce"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Download Section */}
      <motion.div
        id="download-section"
        className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden mb-20 relative"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-6 -mr-6">
          <motion.div
            className="w-20 h-20 rounded-full bg-blue-100"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
          />
        </div>
        <div className="absolute top-0 right-2 -mt-10 -mr-4">
          <motion.div
            className="w-16 h-16 rounded-full bg-indigo-50"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 relative z-10">
          {/* Platform Tabs */}
          <div className="bg-gray-50 p-6 border-r border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Choose Your Platform</h2>
            <div className="space-y-4">
              {Object.entries(downloadLinks).map(([key, value]) => (
                <motion.button
                  key={key}
                  className={`flex items-center w-full p-4 rounded-lg transition-all duration-300 ${
                    activeTab === key ? "bg-blue-600 text-white shadow-md" : "bg-white text-gray-700 hover:bg-blue-50"
                  }`}
                  onClick={() => setActiveTab(key)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="mr-4">{value.icon}</div>
                  <div className="text-left">
                    <p className="font-medium capitalize">{key}</p>
                    <p className={`text-sm ${activeTab === key ? "text-blue-100" : "text-gray-500"}`}>
                      Version {value.version}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Download Details */}
          <div className="col-span-2 p-8">
            {/* Replaced CSSTransition with motion.div */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <motion.div className="flex items-center mb-8">
                <div className="mr-6 p-4 bg-blue-100 rounded-full">{downloadLinks[activeTab].deviceIcon}</div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 capitalize">RI Tracker for {activeTab}</h2>
                  <p className="text-gray-600">
                    Version {downloadLinks[activeTab].version} • {downloadLinks[activeTab].size}
                  </p>
                </div>
              </motion.div>

              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-800 mb-2">System Requirements</h3>
                <p className="text-gray-600">{downloadLinks[activeTab].requirements}</p>
              </div>

              {/* Fixed Download Button (no nested button) */}
              <motion.button
                onClick={() => handleDownload(activeTab)}
                className="flex items-center justify-center w-full md:w-auto px-8 py-4 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center">
                  <HiOutlineDownload className="mr-2 h-5 w-5" />
                  Download for {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </span>

                <motion.span
                  className="absolute inset-0 bg-blue-500 z-0"
                  initial={{ x: "-100%" }}
                  animate={{ x: "200%" }}
                  transition={{ repeat: Infinity, repeatType: "loop", duration: 2, ease: "linear" }}
                />
              </motion.button>

              <p className="mt-4 text-sm text-gray-500">
                By downloading, you agree to our{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
                .
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        className="max-w-7xl mx-auto mb-20"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2 className="text-3xl font-bold text-center text-gray-900 mb-12" variants={itemVariants}>
          Powerful Features for Your Team
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 relative overflow-hidden"
              variants={itemVariants}
              whileHover={{
                y: -5,
                boxShadow:
                  "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)",
              }}
              onMouseEnter={() => setShowFeature(feature.id)}
              onMouseLeave={() => setShowFeature(null)}
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-full -mt-10 -mr-10 z-0" />
              <div className="relative z-10">
                <motion.div
                  className="mb-4 bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center"
                  whileHover={{ rotate: 5 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Testimonial Section */}
      <motion.div
        className="max-w-5xl mx-auto bg-gradient-to-br from-blue-600 to-indigo-800 rounded-2xl p-10 text-white relative overflow-hidden"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        whileHover={{ y: -5 }}
      >
        {/* Animated decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <motion.div
            className="absolute top-10 right-10 w-40 h-40 rounded-full bg-white"
            animate={{ y: [0, -15, 0], x: [0, 15, 0] }}
            transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
          />
          <motion.div
            className="absolute bottom-10 left-10 w-60 h-60 rounded-full bg-white"
            animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
            transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
          />
        </div>

        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">What Our CEO Say</h2>

          <p className="text-xl italic mb-8">
            &quot;RI Tracker has transformed how we manage our resources. The desktop app makes it easy to track time,
            monitor productivity, and generate reports. It&apos;s been a game-changer for our remote team.&quot;
          </p>

        <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-lg">
              CK
            </div>
            <div className="ml-4">
              <p className="font-medium text-lg">Colin Koenig</p>
              <p className="text-blue-200">CEO, Remote Integrity</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto mt-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>

        <div className="space-y-6">
          {[
            {
              question: "How do I install RI Tracker on my computer?",
              answer:
                "Download the application for your platform, run the installer, and follow the on-screen instructions. The setup wizard will guide you through the installation process.",
            },
            {
              question: "Is my data secure with RI Tracker?",
              answer:
                "Yes, RI Tracker uses enterprise-grade encryption to protect your data. All information is securely transmitted and stored according to industry best practices.",
            },
            {
              question: "Can I use RI Tracker on multiple devices?",
              answer:
                "Yes, your RI Tracker allows you to use the application on multiple devices. Simply download the appropriate version for each platform and sign in with your account.",
            },
            {
              question: "How often is the desktop app updated?",
              answer:
                "We release updates regularly with new features, improvements, and bug fixes. The application will notify you when updates are available.",
            },
          ].map((faq, index) => (
            <motion.div
              key={faq.question}
              className="bg-white rounded-lg shadow-md overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <motion.div
        className="max-w-4xl mx-auto text-center mt-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Get Started?</h2>
        <p className="text-xl text-gray-600 mb-8">
          Download RI Tracker today and take control of your team&apos;s productivity.
        </p>

        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.button
            className="flex items-center px-8 py-4 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDownload(activeTab)}
          >
            <HiOutlineDownload className="mr-2 h-5 w-5" />
            Download for {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </motion.button>

          <motion.a
            href="/register"
            className="flex items-center px-8 py-4 bg-white text-blue-600 border border-blue-600 font-medium rounded-lg shadow-sm hover:bg-blue-50 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create Account
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Image
              src="https://i.ibb.co.com/k6P3pGVZ/output-onlinepngtools-1.png"
              alt="RI Tracker Logo"
              className="h-8"
              height={32}
              width={32}
              unoptimized
            />
          </div>
          <div className="text-sm text-gray-500">
            <p>© {new Date().getFullYear()} RI Tracker. All rights reserved.</p>
            <p>For support inquiries, please contact support@remoteintegrity.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Download;
