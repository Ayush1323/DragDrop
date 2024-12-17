import React, { useState, useContext } from "react";
import Select from "react-select";
import { ThemeContext } from "./ThemeContext";
import Switch from "react-switch";
import { IconButton } from "@mui/material";
import Save from "@mui/icons-material/Save";
import RemoveCircleOutline from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import { initialProjects } from "../utils/constant";

const DailyAllocation = () => {
  const [isSearchable, setIsSearchable] = useState(true);
  const { theme } = useContext(ThemeContext);

  const statuses = [
    {
      color: "#F87171",
      description: "Currently occupied and engaged in live projects or hired.",
    },
    {
      color: "#4ADE80",
      description: `Available for live projects. Any time allocated to in-house projects will be marked as "Available for live projects".`,
    },
    { color: "#9CA3AF", description: "Indicates that you are on leave." },
    { color: "rgb(192 132 252)", description: "Training and Internship." },
  ];

  const [rows, setRows] = useState([
    {
      id: 1,
      user: { name: "System Admin", role: "Super Admin", initials: "SA" },
      project: "",
      note: "",
      role: "--",
      until: "--",
      hours: "",
      tentative: false,
      updatedBy: "---",
    },
  ]);
  // console.log(rows);

  // Handle input changes for each field
  const handleInputChange = (id, field, value) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  // Check if the current row is fully filled
  const isRowComplete = (row) => {
    return row.project && row.note && row.hours;
  };

  // Add a new row if the last row is complete, and don't include the user again
  const addRow = () => {
    // Check if the user is already set in the first row
    const user = rows[0].user;

    // Calculate the next available ID by considering the current rows
    const newRowId = Math.max(...rows.map((row) => row.id)) + 1;

    // Create a new row with the calculated ID
    const newRow = {
      id: newRowId,
      user: user,
      project: "",
      note: "",
      role: "--",
      until: "--",
      hours: "",
      tentative: false,
      updatedBy: "---",
    };

    setRows([...rows, newRow]);
  };
  console.log(rows);

  // Remove a row, but allow removal only if there is more than one row
  const removeRow = (id) => {
    if (rows.length > 1) {
      const updatedRows = rows.filter((row) => row.id !== id);

      // Reassign IDs to keep them sequential after removal
      const reIndexedRows = updatedRows.map((row, index) => ({
        ...row,
        id: index + 1,
      }));

      setRows(reIndexedRows);
    }
  };

  // Filter projects already selected in other rows
  const getAvailableProjects = () => {
    const selectedProjects = rows
      .map((row) => row.project?.value)
      .filter(Boolean);
    return initialProjects
      .filter((project) => !selectedProjects.includes(project.name))
      .map((project) => ({ value: project.name, label: project.name }));
  };

  const [timeValue, setTimeValue] = useState("00:00");
  const handleTimeChange = (id, value) => {
    // Keep only the first 4 digits and remove other characters
    const cleanedValue = value.replace(/[^0-9]/g, "").slice(0, 4);
    // Extract hours and minutes from the cleaned value using regex
    let formattedValue = cleanedValue.replace(
      /^(\d{0,2})(\d{0,2})?$/,
      (match, h, m) => {
        // Ensure hours and minutes don't exceed their limits
        h = Math.min(23, h || 0)
        .toString()
        .padStart(2, "0");
        m = Math.min(59, m || 0)
        .toString()
        .padStart(2, "0");
        return `${h}:${m}`;
      }
      );
      // Update the state with the formatted value
      setTimeValue(formattedValue);
      
      // Call handleInputChange with the formatted value
      handleInputChange(id, "hours", formattedValue);
    };
    console.log(timeValue);
    
  return (
    <div className="px-9">
      <div className="flex justify-between p-3 border border-gray-200">
        <div>
          {statuses.map((status, index) => (
            <div key={index} className="flex items-center mb-2">
              <div
                className=" w-[50px] h-4 mr-2"
                style={{ backgroundColor: status.color }}
              ></div>
              <div className="text-[14px] max-lg:w-96">
                {status.description}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-end">
          <button className="bg-green-500 text-white py-1 px-2 rounded-md font-semibold mt-2 text-sm">
            Present
          </button>
        </div>
      </div>

      {/* Table section */}
      <div className="overflow-x-auto mt-2 inline-block min-w-full pt-2 align-middle w-full overflow-auto h-auto min-h-[calc(100vh-65px)] scrollable-no-scrollbar">
        <table className="border border-gray-300 text-sm">
          <thead>
            <tr>
              <th className="flex flex-col w-[250px] border-0 relative m-0 p-0">
                <div>
                  <div
                    style={{ backgroundColor: statuses[0].color }}
                    className="w-full h-[8px]"
                  ></div>
                  {rows.map(
                    (row, index) =>
                      // Only render the user info in the first row
                      index === 0 && (
                        <div
                          className="flex items-center space-x-2 px-3 p-2"
                          key={row.id}
                        >
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-white font-semibold">
                            {row.user.initials}
                          </div>
                          <div>
                            <div className="font-semibold">{row.user.name}</div>
                            <div className="flex justify-start text-xs text-gray-500">
                              {row.user.role}
                            </div>
                          </div>
                        </div>
                      )
                  )}
                </div>
              </th>

              <th className="p-2 border-r border-l">Projects</th>
              <th className="p-2 border-r">
                Note <span className="text-red-500">*</span>
              </th>
              <th className="p-2 border-r">Role</th>
              <th className="p-2 border-r">Until</th>
              <th className="p-2 border-r">
                Est. Hours <span className="text-red-500">*</span>
              </th>
              <th className="p-2 border-r">Tentative</th>
              <th className="p-2 border-r">Last updated by/on</th>
              <div
                className={`flex justify-center  border  sticky right-0 pt-[23px] pb-[32px] z-10 ${
                  theme === "dark" ? "bg-[#1E293B]" : "bg-white"
                } `}
              >
                <th
                  className={`${
                    theme === "dark" ? "bg-[#1E293B]" : "bg-white"
                  } `}
                >
                  Action
                </th>
              </div>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id}>
                <td></td>
                <td className="py-3 px-4 border border-b-0 relative">
                  <Select
                    autoFocus
                    classNamePrefix="select"
                    placeholder=""
                    isSearchable={isSearchable}
                    menuPortalTarget={document.body}
                    options={getAvailableProjects()}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      menu: (provided) => ({
                        ...provided,
                        zIndex: 9999,
                        position: "absolute",
                        width: "250px",
                        marginTop: 0,
                      }),
                      control: (provided, state) => ({
                        ...provided,
                        width: "250px",
                        borderColor: state.isFocused
                          ? "black"
                          : provided.borderColor,
                        boxShadow: state.isFocused
                          ? "none"
                          : provided.boxShadow,
                        "&:hover": { borderColor: "black" },
                      }),
                    }}
                    value={row.project}
                    onChange={(selectedOption) =>
                      handleInputChange(row.id, "project", selectedOption)
                    }
                  />
                </td>
                <td className="py-3 px-4 border border-b-0">
                  <textarea
                    className="border border-gray-200 w-[250px] min-h-[39px] p-2 text-[14px] rounded-md outline-neutral-800"
                    value={row.note}
                    onChange={(e) =>
                      handleInputChange(row.id, "note", e.target.value)
                    }
                  />
                </td>
                <td className="py-3 border border-b-0">
                  <div className="p-2 text-[14px]">{row.role}</div>
                </td>
                <td className="py-3 border border-b-0">
                  <div className="p-2 text-[14px]">{row.until}</div>
                </td>
                <td className="py-3 px-1 border border-b-0">
                  <input
                    type="text"
                    className="border outline-none rounded-md p-2 text-[16px] font-medium mx-1.5 w-[75px]"
                    value={timeValue}
                    onChange={(e) => handleTimeChange(row.id, e.target.value)}
                  />
                </td>

                <td className="py-3 px-4 border border-b-0">
                  <Switch
                    checked={row.tentative}
                    onChange={(checked) =>
                      handleInputChange(row.id, "tentative", checked)
                    }
                    onColor="#4ADE80"
                    offColor="#F87171"
                    height={20}
                    width={40}
                    handleDiameter={20}
                  />
                </td>
                <td className="py-3 border border-b-0">
                  <div className="p-[15px] text-[14px]">{row.updatedBy}</div>
                </td>
                <div className="sticky right-0  ">
                  <td
                    className={`py-3 px-4 text-center sticky right-0 z-10 border w-40 ${
                      theme === "dark" ? "bg-[#1E293B]" : "bg-white"
                    } `}
                  >
                    <div className="flex py-5 ">
                      <IconButton onClick={() => console.log("Save clicked")}>
                        <Save />
                      </IconButton>
                      <IconButton
                        onClick={() => removeRow(row.id)}
                        disabled={rows.length === 1 && index === 0}
                      >
                        <RemoveCircleOutline />
                      </IconButton>
                      {index === rows.length - 1 && (
                        <IconButton
                          onClick={addRow}
                          disabled={!isRowComplete(rows[rows.length - 1])}
                        >
                          <AddCircleOutline />
                        </IconButton>
                      )}
                    </div>
                  </td>
                </div>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DailyAllocation;
