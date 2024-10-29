import StarIcon from "@mui/icons-material/Star";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import CommonPagination from "../common/Pagination";
import { PER_PAGE_OPTIONS, initialProjects } from "../utils/constant";
import { ThemeContext } from "../pages/ThemeContext"; // Import ThemeContext

const Projects = () => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [projects, setProjects] = useState(initialProjects);
  const [favoriteProjects, setFavoriteProjects] = useState([]);
  const [selectedTab, setSelectedTab] = useState("1");
  const { theme } = useContext(ThemeContext); // Access theme value

  const handleRating = (id) => {
    setProjects((prevProjects) => {
      const updatedProjects = prevProjects.map((project) =>
        project.id === id
          ? { ...project, isFavorite: !project.isFavorite }
          : project
      );
      const favorites = updatedProjects.filter((project) => project.isFavorite);
      setFavoriteProjects(favorites);
      return updatedProjects;
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const paginatedProjects = projects.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const paginatedFavoriteProjects = favoriteProjects.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <div>
      <div
        className={`px-9 pb-9  mx-auto  ${
          theme === "dark"
            ? "dark:bg-slate-800 dark:text-gray-200"
            : "bg-white text-black "
        } pt-4`}
      >
        {/* dark:bg-slate-800 dark:text-gray-200 */}
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-[20px] font-semibold  ">Projects</h3>
        </div>

        <TabContext value={selectedTab}>
          <Box>
            <TabList onChange={handleTabChange}>
              <Tab
                label={`Your Projects (${projects.length})`}
                value="1"
                sx={{
                  textTransform: "none",
                  color: theme === "dark" ? "white" : "black", // Apply color based on theme
                }}
              />

              <Tab
                label={`Favorite Projects (${favoriteProjects.length})`}
                value="2"
                sx={{
                  textTransform: "none",
                  color: theme === "dark" ? "white" : "black", // Apply color based on theme
                }}
              />
              <Tab
                label="Daily Allocation (0)"
                value="3"
                sx={{
                  textTransform: "none",
                  color: theme === "dark" ? "white" : "black", // Apply color based on theme
                }}
              />
            </TabList>
          </Box>

          {/* Tab for All Projects */}
          <TabPanel value="1" sx={{ p: 0 }}>
            {paginatedProjects.map((project) => (
              <div
                className={`flex items-center justify-between p-3 border-b   transition-all ${theme === 'dark' ?"border-gray-700":"border-gray-300"}`} 
                key={project.id}
              >
                <div className="flex items-center">
                  <div
                    className={`text-[24px] w-10 h-10 flex justify-center items-center text-black  rounded-md ${project.color}`} 
                  >
                    {project.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/CurrentProject/${project.name}/${project.id}`}
                      >
                        <h3 className="hover:underline cursor-pointer text-base ">
                          {project.name}
                        </h3>
                      </Link>
                      <StarIcon
                        className={`cursor-pointer transition-colors ${
                          project.isFavorite
                            ? "text-yellow-400"
                            : "text-gray-400 hover:text-gray-500"
                        }`}
                        onClick={() => handleRating(project.id)}
                      />
                    </div>
                    <p className="text-gray-500 text-sm">{project.tag}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Created {project.created}
                </div>
              </div>
            ))}
          </TabPanel>

          {/* Tab for Favorite Projects */}
          <TabPanel value="2" sx={{ p: 0 }}>
            {paginatedFavoriteProjects.length > 0 ? (
              paginatedFavoriteProjects.map((project) => (
                <div
                  className={`flex items-center justify-between p-3 border-b    transition-all ${theme === 'dark' ? "border-gray-700":"border-gray-300"}`} // dark:border-gray-700
                  key={project.id}
                >
                  <div className="flex items-center">
                    <div
                      className={`text-xl w-10 h-10 flex justify-center items-center text-black rounded-md ${project.color}`} 
                    >
                      {project.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/CurrentProject/${project.name}/${project.id}`}
                        >
                          <h3 className="hover:underline cursor-pointer text-base ">
                            {project.name}
                          </h3>
                        </Link>
                        <StarIcon
                          className={`cursor-pointer transition-colors ${
                            project.isFavorite
                              ? "text-yellow-400"
                              : "text-gray-400 hover:text-gray-500"
                          }`}
                          onClick={() => handleRating(project.id)}
                        />
                      </div>
                      <p className="text-gray-500 text-sm">{project.tag}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Created {project.created}
                  </div>
                </div>
              ))
            ) : (
              <p className="p-6 text-center">No favorite projects yet.</p>
            )}
          </TabPanel>

          {/* Tab for Daily Allocation */}
          <TabPanel value="3" className="p-9 text-center">
            Daily allocation content goes here.
          </TabPanel>
        </TabContext>

        {/* Use the CommonPagination component */}
        {(selectedTab === "1" ? projects.length : favoriteProjects.length) >
          0 && (
          <CommonPagination
            page={page}
            rowsPerPage={rowsPerPage}
            totalCount={
              selectedTab === "1" ? projects.length : favoriteProjects.length
            }
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            perPageOptions={PER_PAGE_OPTIONS}
          />
        )}
      </div>
    </div>
  );
};

export default Projects;
