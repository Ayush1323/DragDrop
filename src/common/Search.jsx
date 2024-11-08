import React, { useState, useEffect, useRef } from "react";
import { initialProjects } from "../utils/constant"; // assuming this contains the array of projects
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../pages/ThemeContext";

const Search = () => {
  const { theme } = useContext(ThemeContext); // Access theme value
  const [inputText, setInputText] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1); // For arrow key navigation
  const ref = useRef(null); // Create a ref for the component
  const filteredData = initialProjects.filter((project) =>
    project.name.toLowerCase().includes(inputText)
  );
  const navigate = useNavigate();

  const inputHandler = (e) => {
    const lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
    setSelectedIndex(-1); // Reset the index when user types
  };

  const handleClearInput = () => {
    setInputText(""); // Clear the input field
    setSelectedIndex(-1); // Reset selected index
  };

  const handleKeyDown = (e) => {
    if (filteredData.length > 0) {
      if (e.key === "ArrowDown") {
        // Move selection down
        setSelectedIndex((prevIndex) =>
          prevIndex === filteredData.length - 1 ? 0 : prevIndex + 1
        );
      } else if (e.key === "ArrowUp") {
        // Move selection up
        setSelectedIndex((prevIndex) =>
          prevIndex <= 0 ? filteredData.length - 1 : prevIndex - 1
        );
      } else if (e.key === "Enter" && selectedIndex >= 0) {
        // Navigate to the selected project on Enter key press
        const selectedProject = filteredData[selectedIndex];
        navigate(
          `/CurrentProject/${selectedProject.name}/${selectedProject.id}`
        );
        handleClearInput();
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handleClearInput(); // Clear input on outside click
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return (
    <div ref={ref}>
      <div className={`relative flex items-center justify-center focus-within:outline-none border border-gray-300 rounded-full overflow-hidden bg-white `}>
        <input
          className={`focus:outline-none pl-5 ${
            inputText !== "" ? "" : "w-[228px]"
          }  h-[38px] text-sm text-gray-900 bg-white`}
          placeholder="Search or jump to..."
          value={inputText}
          onChange={inputHandler}
          onKeyDown={handleKeyDown} // Listen for key events
        />
        {inputText !== "" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            className="cursor-pointer w-5 min-w-[1.25rem] h-5 text-gray-400 mr-3"
            onClick={handleClearInput}
          >
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"></path>
          </svg>
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="hidden lg:block w-4 min-w-[1rem] h-5 absolute right-4"
          >
            <g id="Magnifer" clipPath="url(#clip0_4353_6103)">
              <circle
                id="Vector"
                cx="9.58317"
                cy="9.58335"
                r="7.91667"
                stroke="#888888"
                strokeWidth="1.5"
              />
              <path
                id="Vector_2"
                d="M15.4165 15.4167L18.3332 18.3334"
                stroke="#888888"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_4353_6103">
                <rect width="20" height="20" fill="white" />
              </clipPath>
            </defs>
          </svg>
        )}
      </div>

      {inputText !== "" && (
        <div className="absolute mt-1 bg-white shadow-2xl border rounded-lg w-[228px] max-h-56 p-[4px] overflow-auto scrollable-no-scrollbar break-all z-50">
          {filteredData.length > 0 ? (
            filteredData.map((project, index) => (
              <Link
                to={`/CurrentProject/${project.name}/${project.id}`}
                key={index}
                onClick={handleClearInput}
              >
                <div
                  className={`p-2 rounded-lg hover:bg-[#F3F4F6] ${
                    index === selectedIndex ? "bg-gray-100" : ""
                  }`}
                >
                  <p className={`text-black`}>{project.name}</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-[12px] py-1">No projects found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;