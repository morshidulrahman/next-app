"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUserPlus,
  FiSearch,
  FiCheck,
  FiX,
  FiAlertCircle,
  FiLoader,
  FiBriefcase,
  FiArrowLeft,
  FiArrowRight,
} from "react-icons/fi";
import { BsBuilding } from "react-icons/bs";
import { lookupEmployeeById, register as registerAction } from "@/actiions/auth";

const StepOne = ({
  formData,
  handleChange,
  employeeError,
  employeeFound,
  employeeLoading,
}) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3 }}
  >
    <div>
      <label
        htmlFor="employeeId"
        className="block text-sm font-semibold text-gray-700 mb-2"
      >
        Employee ID *
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          id="employeeId"
          name="employeeId"
          type="text"
          required
          className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            employeeError
              ? "border-red-300 bg-red-50"
              : employeeFound
              ? "border-green-300 bg-green-50"
              : "border-gray-300"
          }`}
          placeholder="Enter your employee ID"
          value={formData.employeeId}
          onChange={handleChange}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {employeeLoading && (
            <FiLoader className="h-5 w-5 text-blue-500 animate-spin" />
          )}
          {!employeeLoading && employeeFound && (
            <FiCheck className="h-5 w-5 text-green-500" />
          )}
          {!employeeLoading && employeeError && (
            <FiX className="h-5 w-5 text-red-500" />
          )}
        </div>
      </div>
      {employeeError && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-600 flex items-center"
        >
          <FiAlertCircle className="h-4 w-4 mr-1" />
          {employeeError}
        </motion.p>
      )}
      {employeeFound && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-green-600 flex items-center"
        >
          <FiCheck className="h-4 w-4 mr-1" />
          Employee found successfully
        </motion.p>
      )}
    </div>
  </motion.div>
);

const StepTwo = ({ formData, handleChange }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3 }}
  >
    <div>
      <label
        htmlFor="username"
        className="block text-sm font-semibold text-gray-700 mb-2"
      >
        Username
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiUser className="h-5 w-5 text-gray-400" />
        </div>
        <input
          id="username"
          name="username"
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Choose a username (optional)"
          value={formData.username}
          onChange={handleChange}
        />
      </div>
      <p className="mt-1 text-xs text-gray-500">
        Leave empty to use email prefix as username
      </p>
    </div>
  </motion.div>
);
const StepThree = ({
  formData,
  handleChange,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  passwordErrors,
  isPasswordMatch,
  isPasswordMismatch,
}) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3 }}
    className="space-y-5"
  >
    <div>
      <label
        htmlFor="password"
        className="block text-sm font-semibold text-gray-700 mb-2"
      >
        Password *
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiLock className="h-5 w-5 text-gray-400" />
        </div>
        <input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          required
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Create a strong password"
          value={formData.password}
          onChange={handleChange}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <FiEyeOff className="h-5 w-5" />
          ) : (
            <FiEye className="h-5 w-5" />
          )}
        </button>
      </div>
      {formData.password && passwordErrors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 bg-red-50 rounded-lg p-3 border border-red-200"
        >
          <p className="text-xs font-medium text-red-700 mb-1">
            Password requirements:
          </p>
          <ul className="space-y-1">
            {passwordErrors.map((error, index) => (
              <li key={index} className="flex items-center text-xs text-red-600">
                <FiX className="h-3 w-3 mr-1 flex-shrink-0" />
                {error}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
      {formData.password && passwordErrors.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 flex items-center text-sm text-green-600"
        >
          <FiCheck className="h-4 w-4 mr-2" />
          Password meets all requirements
        </motion.div>
      )}
    </div>

    <div>
      <label
        htmlFor="confirmPassword"
        className="block text-sm font-semibold text-gray-700 mb-2"
      >
        Confirm Password *
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiLock className="h-5 w-5 text-gray-400" />
        </div>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          required
          className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            isPasswordMismatch ? "border-red-300 bg-red-50" : "border-gray-300"
          }`}
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          {showConfirmPassword ? (
            <FiEyeOff className="h-5 w-5" />
          ) : (
            <FiEye className="h-5 w-5" />
          )}
        </button>
      </div>
      {isPasswordMismatch && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-600 flex items-center"
        >
          <FiX className="h-4 w-4 mr-2" />
          Passwords do not match
        </motion.p>
      )}
      {isPasswordMatch && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-green-600 flex items-center"
        >
          <FiCheck className="h-4 w-4 mr-2" />
          Passwords match perfectly
        </motion.p>
      )}
    </div>
  </motion.div>
);
const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    employeeId: "",
    avatar: "",
    position: "",
    companyName: "",
  });

  const searchParams = useSearchParams();
  const router = useRouter();

  const employeeIdFromQuery = searchParams.get("employeeid");

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);

  const [employeeLoading, setEmployeeLoading] = useState(false);
  const [employeeError, setEmployeeError] = useState("");
  const [employeeFound, setEmployeeFound] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const lookupRequestRef = useRef(0);

  useEffect(() => {
    if (employeeIdFromQuery) {
      setFormData((prev) => {
        if (prev.employeeId === employeeIdFromQuery) {
          return prev;
        }
        return {
          ...prev,
          employeeId: employeeIdFromQuery,
        };
      });
    }
  }, [employeeIdFromQuery]);

  useEffect(() => {
    const trimmedId = formData.employeeId?.trim() ?? "";

    if (!trimmedId) {
      lookupRequestRef.current += 1;
      setEmployeeLoading(false);
      setEmployeeFound(false);
      setEmployeeError("");
      setFormData((prev) => {
        if (!prev.name && !prev.email && !prev.avatar && !prev.position) {
          return prev;
        }
        return {
          ...prev,
          name: "",
          email: "",
          avatar: "",
          position: "",
          companyName: "",
        };
      });
      return;
    }

    const requestId = ++lookupRequestRef.current;

    setEmployeeLoading(true);
    setEmployeeFound(false);
    setEmployeeError("");

    const timeoutId = setTimeout(async () => {
      const result = await lookupEmployeeById(trimmedId);

      if (lookupRequestRef.current !== requestId) {
        return;
      }

      if (result.success && result.data) {
        const employee = result.data;
        setFormData((prev) => ({
          ...prev,
          name: employee.employeeName || "",
          email: employee.employeeEmail || "",
          avatar: employee.avatar || "",
          position: employee.positionName || "",
          companyName: employee.companyName || "",
        }));
        setEmployeeFound(true);
        setEmployeeError("");
      } else {
        setEmployeeError(
          result.error || "Invalid Employee ID or Employee Not Found"
        );
        setEmployeeFound(false);
        setFormData((prev) => ({
          ...prev,
          name: "",
          email: "",
          avatar: "",
          position: "",
          companyName: "",
        }));
      }

      setEmployeeLoading(false);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [formData.employeeId]);
  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push("At least 8 characters");
    if (!/[A-Z]/.test(password)) errors.push("One uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("One lowercase letter");
    if (!/\d/.test(password)) errors.push("One number");
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      setPasswordErrors(validatePassword(value));
    }

    if (name === "employeeId") {
      setEmployeeFound(false);
      setEmployeeError("");
    }

    if (submitError) {
      setSubmitError("");
    }
  };

  const handleNext = (e) => {
    e.preventDefault();

    if (currentStep === 1 && !employeeFound) {
      setEmployeeError("Please enter a valid Employee ID");
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();

    if (!employeeFound) {
      setEmployeeError("Please enter a valid Employee ID");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      return;
    }

    if (passwordErrors.length > 0) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await registerAction({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        username: formData.username || formData.email.split("@")[0],
        employeeId: formData.employeeId,
        avatar: formData.avatar,
        position: formData.position,
      });

      if (response?.success) {
        if (response.autoLogin) {
          router.push("/dashboard");
        } else {
          alert("Registration successful! Please login to continue."); // TODO: Replace with a toast notification 
          router.push("/login");
        }
      } else {
        setSubmitError(
          response?.error || "Registration failed. Please try again."
        );
      }
    } catch (err) {
      setSubmitError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const isPasswordMatch =
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword;

  const isPasswordMismatch =
    formData.password &&
    formData.confirmPassword &&
    formData.password !== formData.confirmPassword;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-2 sm:p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mb-4 sm:mb-8"
        >
          <div className="mx-auto h-12 w-12 sm:h-16 sm:w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg mb-3 sm:mb-4">
            <FiUserPlus className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Create Your Account
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 px-4">
            Join our platform and start your journey
          </p>
          <p className="text-xs sm:text-sm text-gray-500 px-4">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px] sm:min-h-[600px]">
            <div className="p-4 sm:p-6 lg:p-12 flex flex-col h-full order-1">
              <div className="mb-6 sm:mb-8">
                <div className="flex items-center justify-between">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div
                        className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all duration-300 ${
                          step <= currentStep
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {step < currentStep ? (
                          <FiCheck className="h-3 w-3 sm:h-4 sm:w-4" />
                        ) : (
                          step
                        )}
                      </div>
                      {step < 3 && (
                        <div
                          className={`flex-1 h-0.5 sm:h-1 mx-2 sm:mx-4 transition-all duration-300 ${
                            step < currentStep ? "bg-blue-600" : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-3 sm:mt-4 text-center">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    {currentStep === 1 && "Verify Employee ID"}
                    {currentStep === 2 && "Choose Username"}
                    {currentStep === 3 && "Create Password"}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Step {currentStep} of {totalSteps}
                  </p>
                </div>
              </div>

              {submitError && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-4 sm:mb-6 rounded-lg bg-red-50 border border-red-200 p-3 sm:p-4"
                >
                  <div className="flex items-center">
                    <FiAlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-400 mr-2 sm:mr-3 flex-shrink-0" />
                    <p className="text-xs sm:text-sm font-medium text-red-800">
                      {submitError}
                    </p>
                  </div>
                </motion.div>
              )}

              <div className="flex-1 flex flex-col">
                <form
                  onSubmit={
                    currentStep === totalSteps ? handleFinalSubmit : handleNext
                  }
                  className="flex flex-col h-full"
                >
                  <div className="flex-1 space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                    <AnimatePresence mode="wait">
                      {currentStep === 1 && (
                        <StepOne
                          key="step1"
                          formData={formData}
                          handleChange={handleChange}
                          employeeError={employeeError}
                          employeeFound={employeeFound}
                          employeeLoading={employeeLoading}
                        />
                      )}
                      {currentStep === 2 && (
                        <StepTwo
                          key="step2"
                          formData={formData}
                          handleChange={handleChange}
                        />
                      )}
                      {currentStep === 3 && (
                        <StepThree
                          key="step3"
                          formData={formData}
                          handleChange={handleChange}
                          showPassword={showPassword}
                          setShowPassword={setShowPassword}
                          showConfirmPassword={showConfirmPassword}
                          setShowConfirmPassword={setShowConfirmPassword}
                          passwordErrors={passwordErrors}
                          isPasswordMatch={isPasswordMatch}
                          isPasswordMismatch={isPasswordMismatch}
                        />
                      )}
                    </AnimatePresence>
                  </div>

                  {currentStep === totalSteps && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-center mb-4 sm:mb-6 px-2"
                    >
                      <p className="text-xs text-gray-500 leading-relaxed">
                        By creating an account, you agree to our{" "}
                        <a
                          href="#"
                          className="text-blue-600 hover:text-blue-500 font-medium"
                        >
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a
                          href="#"
                          className="text-blue-600 hover:text-blue-500 font-medium"
                        >
                          Privacy Policy
                        </a>
                      </p>
                    </motion.div>
                  )}

                  <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-0 pt-4 sm:pt-6 border-t border-gray-100 bg-white">
                    {currentStep > 1 && (
                      <motion.button
                        type="button"
                        onClick={handleBack}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-center px-4 py-3 sm:py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base font-medium"
                      >
                        <FiArrowLeft className="h-4 w-4 mr-2" />
                        Back
                      </motion.button>
                    )}

                    {currentStep < totalSteps ? (
                      <motion.button
                        type="submit"
                        disabled={
                          currentStep === 1 ? employeeLoading || !employeeFound : false
                        }
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center justify-center px-6 py-3 rounded-lg text-white font-medium transition-all text-sm sm:text-base ${
                          currentStep === 1 && (employeeLoading || !employeeFound)
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        } ${
                          currentStep === 1
                            ? "w-full sm:ml-auto sm:w-auto"
                            : "w-full sm:ml-auto sm:w-auto"
                        }`}
                      >
                        {currentStep === 1 && employeeLoading ? (
                          <>
                            <FiLoader className="animate-spin h-4 w-4 mr-2" />
                            Verifying...
                          </>
                        ) : (
                          <>
                            Continue
                            <FiArrowRight className="h-4 w-4 ml-2" />
                          </>
                        )}
                      </motion.button>
                    ) : (
                      <motion.button
                        type="submit"
                        disabled={
                          isSubmitting ||
                          passwordErrors.length > 0 ||
                          isPasswordMismatch ||
                          !employeeFound
                        }
                        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                        className="flex items-center justify-center px-6 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm sm:text-base w-full sm:ml-auto sm:w-auto"
                      >
                        {isSubmitting ? (
                          <>
                            <FiLoader className="animate-spin h-4 w-4 mr-2" />
                            Creating Account...
                          </>
                        ) : (
                          <>
                            <FiUserPlus className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">
                              Create Account &amp; Sign In
                            </span>
                            <span className="sm:hidden">Create Account</span>
                          </>
                        )}
                      </motion.button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            <div className="hidden lg:flex bg-gradient-to-br from-blue-50 to-indigo-100 p-8 lg:p-12 flex-col justify-center order-2">
              {!employeeFound ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-center"
                >
                  <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-white shadow-lg mb-6">
                    <FiSearch className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Enter Your Employee ID
                  </h3>
                  <p className="text-gray-600 mb-6">
                    We&apos;ll automatically fetch your employee information
                    from our system to complete your profile.
                  </p>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-medium text-gray-900 mb-2">
                      What we&apos;ll fetch:
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li className="flex items-center">
                        <FiUser className="h-4 w-4 mr-2 text-blue-500" />
                        Full Name
                      </li>
                      <li className="flex items-center">
                        <FiMail className="h-4 w-4 mr-2 text-blue-500" />
                        Email Address
                      </li>
                      <li className="flex items-center">
                        <FiBriefcase className="h-4 w-4 mr-2 text-blue-500" />
                        Position
                      </li>
                      <li className="flex items-center">
                        <BsBuilding className="h-4 w-4 mr-2 text-blue-500" />
                        Company
                      </li>
                    </ul>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <div className="mb-6">
                    <div className="mx-auto h-24 w-24 rounded-full overflow-hidden bg-white shadow-lg mb-4">
                      {formData.avatar ? (
                        <img
                          src={formData.avatar}
                          alt="Employee Avatar"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gray-100">
                          <FiUser className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mb-4">
                      <FiCheck className="h-4 w-4 mr-1" />
                      Employee Verified
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm text-left">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Employee Information
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <FiUser className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Full Name
                          </p>
                          <p className="text-gray-900">{formData.name}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <FiMail className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Email Address
                          </p>
                          <p className="text-gray-900">{formData.email}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <FiBriefcase className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Position
                          </p>
                          <p className="text-gray-900">{formData.position}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <FiSearch className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Employee ID
                          </p>
                          <p className="text-gray-900">{formData.employeeId}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <FiCheck className="h-4 w-4 inline mr-1" />
                        All information has been automatically filled. Please
                        complete the form on the left to create your account.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {employeeFound && (
              <div className="lg:hidden bg-gradient-to-br from-blue-50 to-indigo-100 p-4 order-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-lg p-4 shadow-sm"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                      {formData.avatar ? (
                        <img
                          src={formData.avatar}
                          alt="Employee Avatar"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <FiUser className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {formData.name}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {formData.position}
                      </p>
                    </div>
                    <div className="flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <FiCheck className="h-3 w-3 mr-1" />
                      Verified
                    </div>
                  </div>
                  <div className="text-xs text-blue-800 bg-blue-50 rounded p-2">
                    <FiCheck className="h-3 w-3 inline mr-1" />
                    Employee information loaded successfully
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
