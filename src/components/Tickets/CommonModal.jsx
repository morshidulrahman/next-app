/* eslint-disable react/prop-types */
import { IoMdClose } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";

const CommonModal = ({ isOpen, onClose, title, children, wide }) => {
  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: {
      scale: 0.8,
      opacity: 0,
      y: 20,
    },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
    exit: {
      scale: 0.8,
      opacity: 0,
      y: 10,
      transition: {
        duration: 0.2,
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.95,
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/10 bg-opacity-50 flex items-center justify-center z-50 "
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
        >
          <motion.div
            className={`bg-white rounded-[4px] shadow-xl max-h-[90vh] ${wide} p-1 `}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="px-6 py-4 border-b flex justify-between items-center "
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.h3
                className="text-lg font-semibold"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {title}
              </motion.h3>
              <motion.button
                onClick={onClose}
                className="px-1 py-1 border rounded-[4px] text-gray-700 hover:bg-gray-100 "
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <IoMdClose className="h-5 w-5" />
              </motion.button>
            </motion.div>
            {/* Scrollable Content Wrapper */}
            <motion.div
              className="px-6 py-4 overflow-y-auto max-h-[75vh]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {children}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommonModal;
