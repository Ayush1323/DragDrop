import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import AutoAwesomeMosaicIcon from "@mui/icons-material/AutoAwesomeMosaic";
import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";
import { FaBars } from "react-icons/fa";
import { initialProjects } from "../utils/constant";
import { ThemeContext } from "../pages/ThemeContext";

const CustomSidebar = ({ selectedProject, onSelectProject }) => {
  const { theme } = useContext(ThemeContext); // Get the current theme from context
  const [open, setOpen] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [internalSelectedProject, setInternalSelectedProject] =
    useState(selectedProject);

  useEffect(() => {
    setInternalSelectedProject(selectedProject);
  }, [selectedProject]);

  const Menus = [
    {
      title: "View All Projects",
      src: "Overview",
      icon: <AutoAwesomeMosaicIcon />,
    },
  ];

  // Function to handle when a project is clicked
  const handleProjectClick = (project) => {
    setInternalSelectedProject(project);
    onSelectProject(project); // Notify the parent component about the selection
  };

  // Get current and all projects
  const currentProjects = initialProjects.filter(
    (project) => project === internalSelectedProject
  );
  const allProjects = initialProjects.filter(
    (project) => project !== internalSelectedProject
  );

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex justify-center items-start ">
      <div
        className={`${open ? "w-60" : "w-0 "} ${
          theme === "dark"
            ? "bg-[#0C192A] text-white"
            : "bg-[#F4F6F8] text-black"
        } h-screen p-5 pt-6 relative `}
        style={{
          transition: "width 0.5s ease",
        }}
      >
        <div
          className={`absolute cursor-pointer -right-7 top-3.5 w-10 h-10 text-[24px] rounded-full flex justify-center items-center  `}
          onClick={() => setOpen(!open)}
        >
          <FaBars />
        </div>

        <div className={`flex items-center text-md ${!open && "hidden"}`}>
          <img
            src="https://staging-tasks.mindinventory.net/static/media/mindInventoryLogo.140c672d.svg"
            alt=""
          />
          <div
            className={`font-semibold duration-200 ml-1.5  ${
              !open && "hidden"
            }`}
          >
            Tasks
          </div>
        </div>

        <div className="mt-6">
          {Menus.map((menu, index) => (
            <div key={index} className={`${!open && "hidden"}`}>
              <Link
                to="/"
                className={`flex items-center py-2 mt-2 rounded-lg 
                            ${
                              theme === "dark"
                                ? "hover:bg-blue-950"
                                : "hover:bg-white"
                            }`}
              >
                <div className="text-xl flex justify-center items-center">
                  {menu.icon}
                </div>
                <span className={`ml-2 font-medium text-[14px]`}>
                  {menu.title}
                </span>
              </Link>
              <div className="mt-4">
                <div className="text-[16px] font-semibold">
                  Current Projects
                </div>
                <div>
                  {currentProjects.map((project, idx) => (
                    <div
                      key={idx}
                      className={`familychange mt-2 px-3 py-2 rounded-lg cursor-pointer  duration-300 text-[14px] font-bold
                        ${
                          internalSelectedProject === project
                            ? theme === "dark"
                              ? "bg-blue-700"
                              : "bg-[#133280] text-white" // Selected background
                            : theme === "dark"
                            ? "hover:bg-blue-950"
                            : "hover:bg-gray-100" // Hover state
                        }`}
                      onClick={() => handleProjectClick(project)}
                    >
                      {project.name}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <div
                  className="text-[16px] font-semibold flex items-center cursor-pointer"
                  onClick={toggleDropdown}
                >
                  <span
                    className={`mr-2 transform transition-transform ${
                      isOpen ? "" : "-rotate-90"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                      class="h-4 w-4 shrink-0 duration-200"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                      ></path>
                    </svg>
                  </span>
                  Favorite Projects
                </div>

                {isOpen && (
                  <div className="mt-2 ">
                    {allProjects.map((project, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center p-2 rounded-lg cursor-pointer text-[14px] 
                ${theme === "dark" ? "hover:bg-blue-950" : "hover:bg-white"}`}
                        onClick={() => handleProjectClick(project)}
                      >
                        <div className="truncate px-[8px] py-[4px] ">
                          {project.name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomSidebar;
