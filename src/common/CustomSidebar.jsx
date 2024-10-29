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
  const [internalSelectedProject, setInternalSelectedProject] = useState(selectedProject);

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

  return (
    <div className="flex justify-center items-start">
      <div
        className={`${
          open ? "w-60" : "w-0"
        } ${theme === 'dark' ? 'bg-[#0C192A] text-white' : 'bg-[#F7FAFF] text-black'} h-screen p-5 pt-6 relative `}
      >
        <div
          className={`absolute cursor-pointer -right-7 top-4 w-10 h-10 text-[24px] rounded-full flex justify-center items-center  `}
          onClick={() => setOpen(!open)}
        >
          <FaBars />
        </div>
        
        <div className={`flex items-center gap-x-4 ${!open && "hidden"}`}>
          <AutoAwesomeMotionIcon />
          <h1 className={`font-semibold text-2xl duration-200 ${!open && "hidden"}`}>
            Tasks
          </h1>
        </div>

        <div className="mt-6">
          {Menus.map((menu, index) => (
            <div key={index} className={`${!open && "hidden"}`}>
              <Link
                to="/"
                className={`flex items-center p-2 mt-2 rounded-lg 
                            ${theme === 'dark' ? 'hover:bg-blue-950' : 'hover:bg-white'}`}
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
                      className={`familychange mt-2 px-3 py-[15px] rounded-lg cursor-pointer  duration-300 text-[14px] font-bold
                        ${internalSelectedProject === project
                          ? (theme === 'dark' ? 'bg-blue-700' : 'bg-[#133280] text-white') // Selected background
                          : (theme === 'dark' ? 'hover:bg-blue-950' : 'hover:bg-gray-100') // Hover state
                        }`}
                      onClick={() => handleProjectClick(project)}
                    >
                      {project.name}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <div className="text-[16px] font-semibold">All Projects</div>
                <div>
                  {allProjects.map((project, idx) => (
                    <div
                      key={idx}
                      className={`familychange mt-2 p-2 rounded-lg cursor-pointer  text-[14px] 
                        ${theme === 'dark' ? 'hover:bg-blue-950' : 'hover:bg-gray-100'}`} // Hover state
                      onClick={() => handleProjectClick(project)}
                    >
                      {project.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomSidebar;
