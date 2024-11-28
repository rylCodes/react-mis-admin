import { useState } from "react";
import { TextField, Button, Box, MenuItem, Select, InputLabel, FormControl } from "@mui/material";

const AddEmployee = ({ closeModal, onAddEmployee }) => {
  const [employeeData, setEmployeeData] = useState({
    name: "",
    sex: "",
    phone: "",
    email: "",
    address: "",
    position: "",
    joined: "",
    action: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would usually send a POST request to your backend
    // For now, let's just log the data
    onAddEmployee(employeeData);

    // Close the modal after submitting
    closeModal();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <TextField
        label="Name"
        name="name"
        value={employeeData.name}
        onChange={handleChange}
        required
      />
      <TextField
        label="Phone Number"
        name="phone"
        value={employeeData.phone}
        onChange={handleChange}
        required
      />
      <TextField
        label="Email"
        name="email"
        value={employeeData.email}
        onChange={handleChange}
        required
      />
      <TextField
        label="Address"
        name="address"
        value={employeeData.address}
        onChange={handleChange}
        required
      />
      <TextField
        label="Joined"
        name="joined"
        type="date"
        value={employeeData.joined}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        required
      />

      <FormControl required>
        <InputLabel>Gender</InputLabel>
        <Select
          label="Sex"
          name="sex"
          value={employeeData.gender}
          onChange={handleChange}
        >
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>
      </FormControl>

      <FormControl required>
        <InputLabel>Position</InputLabel>
        <Select
          label="Position"
          name="position"
          value={employeeData.position}
          onChange={handleChange}
        >
          <MenuItem value="Cashier">Cashier</MenuItem>
          <MenuItem value="Admin">Admin</MenuItem>
          <MenuItem value="Instructor">Instructor</MenuItem>
        </Select>
      </FormControl>

      <Button type="submit" variant="contained" color="primary">
        Add Employee
      </Button>
    </Box>
  );
};

export default AddEmployee;
