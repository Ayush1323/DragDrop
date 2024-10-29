// ThemeToggle.js
import React, { useContext } from "react";
import { ThemeContext } from "../pages/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div>
      <button
        onClick={toggleTheme}
        className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 p-3 rounded-full  
        shadow-lg hover:shadow-xl  hover:scale-105 flex items-center gap-2 "
      >
        {theme === "dark" ? (
          <>
            <FaSun className="text-yellow-400 " size={20} />
            <span>Light Mode</span>
          </>
        ) : (
          <>
            <FaMoon className="text-gray-200" size={20} />
            <span>Dark Mode</span>
          </>
        )}
      </button>
    </div>
  );
};

export default ThemeToggle;
