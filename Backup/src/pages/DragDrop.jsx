import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { initialProjects } from "../utils/constant";
import { ThemeContext } from "./ThemeContext";
import CustomSidebar from "../common/CustomSidebar";

function DragDrop() {
  const {theme}= useContext(ThemeContext)
  const { id, name } = useParams(); // Extract id and name from the route parameters
  const [selectedProject, setSelectedProject] = useState(null); // State to manage the selected project

  useEffect(() => {
    // Set the selected project based on the URL parameters (id)
    const project = initialProjects.find(
      (project) => project.id === parseInt(id)
    );
    setSelectedProject(project);
  }, [id]);

  // Set the initial project based on the route parameters if available
  useEffect(() => {
    if (id && name) {
      // Find the project from the initialProjects array based on the id and name
      const projectFromHome = initialProjects.find(
        (project) => project.id === parseInt(id) && project.name === name
      );
      setSelectedProject(projectFromHome);
    }
  }, [id, name]);

  // Function to update the selected project from the sidebar
  const handleProjectSelect = (project) => {
    setSelectedProject(project);
  };
  
  return (
    <div className={`flex h-screen ${theme === 'dark' ? "bg-[#0C192A] text-white" : "bg-[#F7FAFF] text-gray-800"}`}>
    {/* Pass handleProjectSelect to CustomSidebar to allow it to update the selected project */}
    <CustomSidebar
      onSelectProject={handleProjectSelect}
      selectedProject={selectedProject} // Pass the selected project to the sidebar
    />

    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center mr-9">
        <div
          className={`px-9 py-3 text-2xl font-bold ${theme === 'dark' ? "bg-[#0C192A] text-white" : "bg-[#F7FAFF] text-gray-700"}`}
        >
          {selectedProject ? selectedProject.name : ""}
        </div>
        {/* <ThemeToggle /> */}
      </div>

        {selectedProject ? (
          <div className="pr-4 pt-2">
            <iframe
              src={`http://localhost:5175/Board/${selectedProject.id}?theme=${theme}`} // Use selected project's id
              className={`rounded-3xl shadow-lg h-[calc(100vh-100px)] w-full ${theme === 'dark' ? "bg-[#060606] border-gray-500" : "bg-white border-gray-200"} border`}
              title={`Board-${selectedProject.id}`} // Accessible title
              frameBorder="0"
              allowFullScreen
              sandbox="allow-same-origin allow-scripts"
              scrolling="no"
            ></iframe>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default DragDrop;
