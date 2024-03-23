import { motion } from "framer-motion";
import { TiTick } from "react-icons/ti";
import { IoMdClose } from "react-icons/io";
import { useEffect } from "react";

export const Toast = ({ setToastVisiblity, message, success = true }) => {
  
  // Toast By default display for 3 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      setToastVisiblity(false);
    }, 3000); // 3000 milliseconds = 3 seconds

    return () => clearTimeout(timeout); // Clean up the timeout when component unmounts
  }, []);

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 400 }}
      id="toast-success"
      className="w-full max-w-xs px-4 py-2 mb-4 text-gray-500 bg-white rounded-lg shadow fixed bottom-0 z-[60] right-2 "
      role="alert"
    >
      <div className="flex justify-center items-center w-full md:w-auto ">
        <div
          className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg ${
            success ? "text-green-500 bg-green-100" : "text-red-500 bg-red-100"
          }`}
        >
          {success ? <TiTick /> : <IoMdClose />}
        </div>
        <div className="ms-3 text-sm font-normal">{message}</div>
        <button
          type="button"
          className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8"
          data-dismiss-target="#toast-success"
          aria-label="Close"
          onClick={() => setToastVisiblity(false)}
        >
          <span className="sr-only">Close</span>
          
          <svg
            className="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>

        </button>
      </div>
    </motion.div>
  );
};
