import React, { useState, useContext } from "react";
import Select from "react-select";
import { ThemeContext } from "./ThemeContext";
import Switch from "react-switch";
import { IconButton } from "@mui/material";
import Save from "@mui/icons-material/Save";
import RemoveCircleOutline from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";

const DailyAllocation = () => {
  const [isSearchable, setIsSearchable] = useState(true);
  const { theme } = useContext(ThemeContext); // Access theme value

  const statuses = [
    {
      color: "#F87171",
      description: "Currently occupied and engaged in live projects or hired.",
    },
    {
      color: "#4ADE80",
      description:
        'Available for live projects. Any time allocated to in-house projects will be marked as "Available for live projects".',
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
      hours: "00:00",
      tentative: false,
      updatedBy: "---",
    },
  ]);

  // Handle change events for each input
  const handleInputChange = (id, field, value) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  // Add a new row
  const addRow = () => {
    const newRow = {
      id: rows.length + 1,
      user: { name: "", role: "", initials: "" },
      project: "",
      note: "",
      role: "--",
      until: "--",
      hours: "00:00",
      tentative: false,
      updatedBy: "---",
    };
    setRows([...rows, newRow]);
  };

  // Remove a row
  const removeRow = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  return (
    <div>
      <div className="flex justify-between p-3 mr-4 border border-gray-200">
        <div className=" ">
          {statuses.map((status, index) => (
            <div key={index} className="flex items-center mb-2">
              <span
                className="inline-block w-[50px] h-4 mr-2 "
                style={{ backgroundColor: status.color }}
              ></span>
              <p className="text-[14px]">{status.description}</p>
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
      <div className="overflow-x-auto mt-2">
        <table className="border border-gray-300 text-sm">
          <thead>
            <tr>
              <th className="flex flex-col w-[250px] border-0 relative m-0 p-0 ">
                <div>
                  <div className="bg-green-400 w-full h-[8px]"></div>
                  {rows.map((row, rowIndex) => (
                    <div
                      className="flex items-center space-x-2 px-3 p-2"
                      key={row.id}
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-white font-semibold">
                        {row.user.initials}
                      </div>
                      <div>
                        <div className="font-semibold">{row.user.name}</div>
                        <div className="text-xs text-gray-500 flex justify-start">
                          {row.user.role}
                        </div>
                      </div>
                    </div>
                  ))}
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
              <th className={`p-2 sticky right-0 ${theme==="dark" ?"":"bg-white" } z-10`}>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td></td>
                <td className="py-3 px-4 border border-b-0 relative">
                  <Select
                    className="z-50"
                    classNamePrefix="select"
                    placeholder="" // Sets placeholder to an empty string
                    isSearchable={isSearchable}
                    menuPortalTarget={document.body} // Ensures dropdown is rendered at the body level
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      menu: (provided) => ({
                        ...provided,
                        zIndex: 9999,
                        width: "250px",
                      }), // Fixed width for dropdown
                      control: (provided, state) => ({
                        ...provided,
                        width: "250px",
                        borderColor: state.isFocused
                          ? "black"
                          : provided.borderColor, // Sets border color to black on focus
                        boxShadow: state.isFocused
                          ? "none"
                          : provided.boxShadow, // Removes default blue outline
                        "&:hover": {
                          borderColor: "black", // Ensures border remains black on hover
                        },
                      }),
                    }}
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
                    value="00:00"
                    onChange={(e) =>
                      handleInputChange(row.id, "hours", e.target.value)
                    }
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
                <td className="py-3 border border-b-0 ">
                  <div className="p-[15px] text-[14px]">{row.updatedBy}</div>
                </td>
                <td className={`py-3 px-4 text-center space-x-2 sticky right-0  z-10 border ${theme==="dark" ?"":"bg-white" } border-gray-300`}>
                  <IconButton onClick={() => console.log("Save clicked")}>
                    <Save />
                  </IconButton>
                  <IconButton onClick={() => removeRow(row.id)}>
                    <RemoveCircleOutline />
                  </IconButton>
                  <IconButton onClick={addRow}>
                    <AddCircleOutline />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DailyAllocation;
