import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const AddEmployee = ({ closeModal, onAddEmployee, loading, positions }) => {
  const { authToken } = useContext(AuthContext);

  const [employeeData, setEmployeeData] = useState({
    firstname: "",
    lastname: "",
    gender: "",
    contact_no: "",
    email: "",
    address: "",
    position_id: "",
    password: "defaultPassword123", // Default password (you can generate this dynamically if needed)
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/admin/store-staff",
        employeeData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 201) {
        onAddEmployee(response.data.data); // Pass the new staff to the parent component
        alert(response.data.message || "Employee added successfully!");
        closeModal(); // Close the modal
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while adding the employee. Please try again.");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
    >
      <TextField
        label="First Name"
        name="firstname"
        value={employeeData.firstname}
        onChange={handleChange}
        required
      />
      <TextField
        label="Last Name"
        name="lastname"
        value={employeeData.lastname}
        onChange={handleChange}
        required
      />
      <TextField
        label="Contact Number"
        name="contact_no"
        value={employeeData.contact_no}
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
          label="Gender"
          name="gender"
          value={employeeData.gender}
          onChange={handleChange}
        >
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </Select>
      </FormControl>

      <FormControl required>
        <InputLabel>Position</InputLabel>
        <Select
          label="Position"
          name="position_id"
          value={employeeData.position_id}
          onChange={handleChange}
          disabled={loading || positions.length === 0}
        >
          {positions.map((position) => (
            <MenuItem key={position.id} value={position.id}>
              {position.name}{" "}
              {/* Adjust `position.name` if the field name is different */}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
      >
        {loading ? "Loading..." : "Add Employee"}
      </Button>
    </Box>
  );
};

export default AddEmployee;
