// TextInput component for reusable input fields

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddCircleSharpIcon from "@mui/icons-material/AddCircleSharp";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

import Modal from "./Modal.jsx";

const TextInput = ({ label, entries, onAdd, onRemove }) => (
  <div className="font-inter">
    <div className="text-md font-regular mb-[5px] text-white">
    {label}
    </div>
    <div className="flex flex-row">
    <div
      className="bg-black rounded-md p-2 h-auto min-h-[50px] overflow-y-auto text-white w-4/5 border border-gray-500"
    >
      {entries.map((entry, index) => (
      <div key={index} style={{ display: "flex", alignItems: "center" }}>
        <span style={{ flexGrow: 1 }} className="text-sm">{entry}</span>
        <IconButton
        size="small"
        onClick={() => onRemove(index)}
        style={{ color: "red" }}
        >
        <DeleteIcon fontSize="small" />
        </IconButton>
      </div>
      ))}
    </div>

    {/* Modal trigger Button */}
    <Button
      onClick={onAdd}
    >
      <AddCircleSharpIcon />
    </Button>

    </div>
  
  </div>
  );

  export default TextInput;