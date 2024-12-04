import { useState, useEffect, useContext } from "react";
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
import { useAlert } from "../../context/AlertContext";

const AddEmployee = ({ closeModal, onAddEmployee, positions }) => {
  const { authToken } = useContext(AuthContext);
  const showAlert = useAlert();

  const [isLoading, setIsLoading] = useState(false);

  const handleSuccess = () => {
    showAlert(`Employee successfully added.`, "success");
  };

  const handleError = () => {
    showAlert("An error occurred while adding the employee!", "error");
  };

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
    setIsLoading(true);
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
        closeModal(); // Close the modal
        handleSuccess();
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      handleError();
      setIsLoading(false);
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
        inputProps={{ maxLength: 11 }}
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
        >
          {positions.map((position) => (
            <MenuItem key={position.id} value={position.id}>
              {position.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Add Employee"}
      </Button>
    </Box>
  );
};

export default AddEmployee;
