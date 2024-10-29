import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddCircleSharpIcon from "@mui/icons-material/AddCircleSharp";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

// Styles for the main container
const containerStyle = {
  backgroundColor: "#411C30",
  height: "100vh",
  color: "white",
  padding: "20px",
  boxSizing: "border-box",
  position: "relative",
};

// Styles for the logo image
const logoStyle = {
  position: "absolute",
  top: "20px",
  left: "20px",
  width: "200px",
  height: "auto",
};

// Styles for the form wrapper
const formWrapperStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
};

// Styles for the form
const formStyle = {
  width: "80%",
  maxWidth: "600px",
  margin: "0 auto",
  textAlign: "left",
};

// TextInput component for reusable input fields
const TextInput = ({ label, entries, onAdd, onRemove }) => (
  <div style={{ marginBottom: "20px" }}>
    <label style={{ display: "block", marginBottom: "5px", textAlign: "left" }}>
      {label}
    </label>
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "5px",
        padding: "10px",
        height: "100px",
        overflowY: "auto",
        color: "black",
      }}
    >
      {entries.map((entry, index) => (
        <div key={index} style={{ display: "flex", alignItems: "center" }}>
          <span style={{ flexGrow: 1 }}>{entry}</span>
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

    <Button
      variant="contained"
      endIcon={<AddCircleSharpIcon />}
      onClick={onAdd}
      style={{ marginTop: "5px", backgroundColor: "#5A5A5A", color: "white" }}
    >
      Add
    </Button>
  </div>
);

const NameInput = ({ label, entries, onAdd, onRemove }) => (
  <div style={{ marginBottom: "20px" }}>
    <label style={{ display: "block", marginBottom: "5px", textAlign: "left" }}>
      {label}
    </label>
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "5px",
        padding: "10px",
        height: "100px",
        overflowY: "auto",
        color: "black",
      }}
    >
      {entries.map((entry, index) => (
        <div key={index} style={{ display: "flex", alignItems: "center" }}>
          <span style={{ flexGrow: 1 }}>{entry}</span>
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
    {entries.length === 0 && (
     <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
     <Button
       variant="contained"
       endIcon={<AddCircleSharpIcon />}
       onClick={onAdd}
       style={{ backgroundColor: "#5A5A5A", color: "white" }}
     >
       Add
     </Button>
     <Button
       variant="outlined"
       style={{ color: "white", borderColor: "white" }}
       onClick={() => {/* Define your function here */}}
     >
       Submit
     </Button>
   </div>
      
    )}
  </div>
);


const Home = () => {
  const [names, setNames] = useState(
    JSON.parse(localStorage.getItem("names")) || []
  );
  const [jobRoles, setJobRoles] = useState(
    JSON.parse(localStorage.getItem("jobRoles")) || []
  );
  const [locations, setLocations] = useState(
    JSON.parse(localStorage.getItem("locations")) || []
  );
  const [fields, setFields] = useState(
    JSON.parse(localStorage.getItem("fields")) || []
  );

  const handleAddEntry = (type, setEntries, entries) => {
    const newEntry = prompt(`Enter a new ${type}:`);
    if (newEntry) {
      const updatedEntries = [...entries, newEntry];
      setEntries(updatedEntries);
      localStorage.setItem(type, JSON.stringify(updatedEntries));
    }
  };

  const handleRemoveEntry = (type, setEntries, entries, index) => {
    const updatedEntries = entries.filter((_, i) => i !== index);
    setEntries(updatedEntries);
    localStorage.setItem(type, JSON.stringify(updatedEntries));
  };

  return (
    <div style={containerStyle}>
      {/* Logo */}
      <img src="/logo.png" alt="Logo" style={logoStyle} />

      {/* Form Section */}
      <div style={formWrapperStyle}>
        <form style={formStyle}>
          {/* Name Input */}
          <NameInput
            label="Name"
            entries={names}
            onAdd={() => handleAddEntry("names", setNames, names)}
            onRemove={(index) => handleRemoveEntry("names", setNames, names, index)}
          />

      {/* <label>
        Enter Text:
        <input className="text-black"
          type="text" 
          placeholder="Type something..." 
        />
      </label> */}
      
    

          {/* Job Roles Input */}
          <TextInput
            label="Job Roles"
            entries={jobRoles}
            onAdd={() => handleAddEntry("jobRoles", setJobRoles, jobRoles)}
            onRemove={(index) => handleRemoveEntry("jobRoles", setJobRoles, jobRoles, index)}
          />

          {/* Locations Input */}
          <TextInput
            label="Locations"
            entries={locations}
            onAdd={() => handleAddEntry("locations", setLocations, locations)}
            onRemove={(index) => handleRemoveEntry("locations", setLocations, locations, index)}
          />

          {/* Fields Input */}
          <TextInput
            label="Fields"
            entries={fields}
            onAdd={() => handleAddEntry("fields", setFields, fields)}
            onRemove={(index) => handleRemoveEntry("fields", setFields, fields, index)}
          />
        </form>
      </div>
    </div>
  );
};

export default Home;
