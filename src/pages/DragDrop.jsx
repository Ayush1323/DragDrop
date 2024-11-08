import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { initialProjects } from "../utils/constant";
import { ThemeContext } from "./ThemeContext";
import CustomSidebar from "../common/CustomSidebar";
import Stack from "@mui/material/Stack";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Link from "@mui/material/Link";
import Search from "../common/Search";
import ThemeToggle from "../common/ThemeToggle";

function DragDrop() {
  const { theme } = useContext(ThemeContext);
  const { id, name } = useParams();
  const [selectedProject, setSelectedProject] = useState(null);
  const [iframeHeight, setIframeHeight] = useState("calc(100vh - 100px)");

  useEffect(() => {
    const project = initialProjects.find(
      (project) => project.id === parseInt(id)
    );
    setSelectedProject(project);

    // Add message listener for iframe communication
    const handleMessage = (event) => {
      // Verify the origin for security
      if (event.origin !== "http://localhost:5173") return;

      if (event.data.type === "resize") {
        setIframeHeight(`${event.data.height}px`);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [id]);

  useEffect(() => {
    if (id && name) {
      const projectFromHome = initialProjects.find(
        (project) => project.id === parseInt(id) && project.name === name
      );
      setSelectedProject(projectFromHome);
    }
  }, [id, name]);

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
  };

  return (
    <div
      className={`flex h-screen ${
        theme === "dark"
          ? "bg-[#0C192A] text-white"
          : "bg-[#F4F6F8] text-gray-800"
      }`}
    >
      <CustomSidebar
        onSelectProject={handleProjectSelect}
        selectedProject={selectedProject}
      />

      <div className="flex flex-col w-full overflow-hidden">
        <div className="flex justify-between items-center mr-9">
          <div
            className={` px-9 pb-1 pt-4  text-2xl font-bold ${
              theme === "dark" ? "text-white" : "text-gray-700"
            }`}
          >
            <Stack spacing={2}>
              <Breadcrumbs
                separator={<NavigateNextIcon fontSize="large" />}
                aria-label="breadcrumb"
                sx={{ color: theme === "dark" ? "white" : "black" }} // Set color based on theme
              >
                <Link
                  underline="hover"
                  color="inherit" // inherit color from Breadcrumbs sx
                  href="/"
                  className="hover:underline"
                  sx={{ color: theme === "dark" ? "white" : "black" }}
                >
                  Projects
                </Link>
                <div
                  style={{
                    color: theme === "dark" ? "#9CA3AF" : "#133280", // Adjust color for selected project
                  }}
                >
                  {selectedProject ? selectedProject.name : "Loading..."}
                </div>
              </Breadcrumbs>
            </Stack>
          </div>
          <div className="flex gap-4 justify-center items-center mt-2">
            <Search />
            <ThemeToggle />
          </div>
        </div>

        {selectedProject && (
          <div className="pr-4 pt-2 flex-1 overflow-hidden ">
            <div className="h-full relative">
              <iframe
                src={`http://localhost:5173/Board/${selectedProject.id}?theme=${theme}`}
                className={`rounded-3xl shadow-lg w-full ${
                  theme === "dark"
                    ? "bg-[#060606] border-gray-500"
                    : "bg-white border-gray-200"
                } border `} // Add animation class
                style={{
                  height: iframeHeight,
                  minHeight: "calc(100vh - 100px) ",
                }}
                title={`Board-${selectedProject.id}`}
                frameBorder="0"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DragDrop;
