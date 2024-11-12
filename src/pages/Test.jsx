<div className="overflow-x-auto mt-2">
<table className="min-w-full border border-gray-300 text-sm">
  <thead className="bg-gray-100">
    <tr>
      <th className="py-3 px-4 border-r">User</th>
      <th className="py-3 px-4 border-r">Projects</th>
      <th className="py-3 px-4 border-r">Note <span className="text-red-500">*</span></th>
      <th className="py-3 px-4 border-r">Role</th>
      <th className="py-3 px-4 border-r">Until</th>
      <th className="py-3 px-4 border-r">Est. Hours <span className="text-red-500">*</span></th>
      <th className="py-3 px-4 border-r">Tentative</th>
      <th className="py-3 px-4 border-r">Last updated by/on</th>
      <th className="py-3 px-4">Action</th>
    </tr>
  </thead>
  <tbody>
    {rows.map((row, index) => (
      <tr key={row.id} className="border-b">
        <td className="py-3 px-4 border-r flex items-center">
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              {row.user.initials}
            </div>
            <div>
              <div className="font-semibold">{row.user.name}</div>
              <div className="text-xs text-gray-500">{row.user.role}</div>
            </div>
          </div>
        </td>
        <td className="py-3 px-4 border-r">
          <Select
            value={row.project}
            onChange={(e) => handleInputChange(row.id, "project", e.target.value)}
            displayEmpty
            className="w-full"
          >
            <MenuItem value="">
              <em>Select a project</em>
            </MenuItem>
            <MenuItem value="Project A">Project A</MenuItem>
            <MenuItem value="Project B">Project B</MenuItem>
          </Select>
        </td>
        <td className="py-3 px-4 border-r">
          <TextField
            value={row.note}
            onChange={(e) => handleInputChange(row.id, "note", e.target.value)}
            variant="outlined"
            size="small"
            fullWidth
          />
        </td>
        <td className="py-3 px-4 border-r text-center">{row.role}</td>
        <td className="py-3 px-4 border-r text-center">{row.until}</td>
        <td className="py-3 px-4 border-r">
          <TextField
            type="time"
            value={row.hours}
            onChange={(e) => handleInputChange(row.id, "hours", e.target.value)}
            size="small"
          />
        </td>
        <td className="py-3 px-4 border-r text-center">
          <Switch
            checked={row.tentative}
            onChange={(e) => handleInputChange(row.id, "tentative", e.target.checked)}
          />
        </td>
        <td className="py-3 px-4 border-r text-center">{row.updatedBy}</td>
        <td className="py-3 px-4 text-center space-x-2">
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





const [timeValue, setTimeValue] = useState("00:00");

const handleTimeChange = (id, value) => {
  // Split the value into hours and minutes around the ':'
  let [hours, minutes] = value.split(":");

  // Remove non-numeric characters and limit hours to 2 digits
  hours = hours.replace(/[^0-9]/g, "").slice(0, 2);
  // Ensure hours do not exceed 23
  hours = Math.min(parseInt(hours, 10) || 0, 23).toString();

  // Remove non-numeric characters and limit minutes to 2 digits
  minutes = (minutes || "").replace(/[^0-9]/g, "").slice(0, 2);
  // Ensure minutes do not exceed 59
  minutes = Math.min(parseInt(minutes, 10) || 0, 59).toString();

  // Reassemble the time with the ':' in the middle
  const formattedValue = `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;

  setTimeValue(formattedValue);

  // Call handleInputChange with the formatted value
  handleInputChange(id, "hours", formattedValue);
};


<td className="py-3 px-1 border border-b-0">
<input
  type="text"
  className="border outline-none rounded-md p-2 text-[16px] font-medium mx-1.5 w-[75px]"
  value={timeValue}
  onChange={(e) => handleTimeChange(row.id, e.target.value)}
/>
</td>







