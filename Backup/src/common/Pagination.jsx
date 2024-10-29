import React, { useContext } from "react";
import { Pagination } from "@mui/material";
import { ThemeContext } from "../pages/ThemeContext"; // Import ThemeContext

const CommonPagination = ({
  page,
  rowsPerPage,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
  perPageOptions,
}) => {
  const { theme } = useContext(ThemeContext); // Access theme value

  return (
    <div className={`flex justify-between items-center mt-3 ${theme === 'dark' ? "bg-gray-800 text-white" : "bg-white text-gray-800"} p-2 rounded`}>
      <div>
        <label htmlFor="rowsPerPage" className={`mr-2 ${theme === 'dark' ? "text-white" : "text-gray-700"}`}>
          Per page:
        </label>
        <select
          id="rowsPerPage"
          value={rowsPerPage}
          onChange={onRowsPerPageChange}
          className={`border rounded px-2 py-2 ${theme === 'dark' ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-700 border-gray-300"}`}
        >
          {perPageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <Pagination
        count={Math.ceil(totalCount / rowsPerPage)}
        page={page}
        onChange={onPageChange}
        variant="outlined"
        shape="rounded"
        className={`${theme === 'dark' ? "text-white" : "text-gray-700"}`}
        sx={{
          "& .MuiPaginationItem-root": {
            color: theme === 'dark' ? 'white' : 'gray',
            "&.Mui-selected": {
              backgroundColor: theme === 'dark' ? '#333' : '#ddd',
              color: theme === 'dark' ? 'white' : 'black',
            },
          },
        }}
      />
    </div>
  );
};

export default CommonPagination;
