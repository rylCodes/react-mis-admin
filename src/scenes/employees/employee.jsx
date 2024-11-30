import { useState, useEffect, useContext } from "react";
import {
  Box,
  useTheme,
  Button,
  Dialog,
  DialogContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddEmployee from "./AddEmployee";
import Header from "../../components/Header";
import axios from "axios"; // For API requests
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useAlert } from "../../context/AlertContext";

const Employee = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { authToken } = useContext(AuthContext);
  const showAlert = useAlert();
  const navigate = useNavigate();

  const handleUpdateSuccess = () => {
    showAlert(`Employee successfully updated.`, "success");
  };

  const handleError = () => {
    showAlert("An error occurred while updating the employee!", "error");
  };

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    }
  }, [authToken, navigate]);

  const [AddEmployeeOpen, setAddEmployeeOpen] = useState(false);
  const [EditEmployeeOpen, setEditEmployeeOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/show-staff",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const formattedData = response.data.data.map((staff) => ({
        id: staff.id,
        name: staff.fullname,
        email: staff.email,
        sex: staff.gender,
        phone: staff.contact_no || "N/A",
        address: staff.address,
        position: staff.position,
      }));
      setEmployees(formattedData);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };

  const fetchPositions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/show-position",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setPositions(response.data.data);
    } catch (error) {
      console.error("Error fetching positions:", error);
    }
  };

  // Fetch employees from the backend
  useEffect(() => {
    const initializeData = async () => {
      try {
        await fetchPositions();
        await fetchEmployees();
        setLoading(false);
      } catch (error) {
        console.error("Error", error);
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  const handleOpen = () => setAddEmployeeOpen(true);
  const handleClose = () => setAddEmployeeOpen(false);

  const handleEditOpen = (employee) => {
    console.log(employee);
    console.log("positions", positions);
    const [firstname, ...lastname] = employee.name.split(" ");
    setSelectedEmployee({
      ...employee,
      firstname,
      lastname: lastname.join(" "),
      gender: employee.sex,
    });
    console.log(selectedEmployee);
    setEditEmployeeOpen(true);
  };
  const handleEditClose = () => setEditEmployeeOpen(false);

  const handleAddEmployee = (newEmployee) => {
    fetchEmployees();
  };

  const handleArchive = (id) => {
    // Archive employee logic
    setEmployees((prevEmployees) =>
      prevEmployees.filter((employee) => employee.id !== id)
    );
  };

  const handleUpdateEmployee = async () => {
    try {
      const position = positions.find(
        (position) => position.name === selectedEmployee.position
      );

      const response = await axios.post(
        `http://localhost:8000/api/admin/update-staff/${selectedEmployee.id}`,
        {
          position_id: position ? position.id : null,
          firstname: selectedEmployee.firstname,
          lastname: selectedEmployee.lastname,
          email: selectedEmployee.email,
          password: selectedEmployee.password,
          address: selectedEmployee.address,
          gender: selectedEmployee.gender,
          contact_no: selectedEmployee.phone,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setEmployees((prevEmployees) =>
        prevEmployees.map((employee) =>
          employee.id === selectedEmployee.id ? response.data.data : employee
        )
      );
      handleEditClose();
      console.log(response.status);

      if (response.status === 200) {
        // Update local state after successful API update
        const updatedEmployees = {
          ...selectedEmployee,
          name: selectedEmployee.firstname + " " + selectedEmployee.lastname,
          sex: selectedEmployee.gender,
          password: "",
        };

        setEmployees((prevEmployees) =>
          prevEmployees.map((e) =>
            e.id === selectedEmployee.id ? updatedEmployees : e
          )
        );

        handleEditClose();
        setIsFetching(false);
        handleUpdateSuccess();
      } else {
        setIsFetching(false);
        handleError();
      }
    } catch (error) {
      console.error("Failed to update employee:", error);
      handleError();
    }
  };

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "sex", headerName: "Sex", headerAlign: "left", align: "left" },
    { field: "phone", headerName: "Phone Number", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 },
    { field: "position", headerName: "Position", flex: 1 },
    { field: "joined", headerName: "Joined", flex: 1 },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" gap="9px" justifyContent="center">
          <Button
            variant="outlined"
            color="primary"
            startIcon={<ArchiveOutlinedIcon />}
            onClick={() => handleArchive(params.row.id)}
          >
            Archive
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<EditOutlinedIcon />}
            onClick={() => handleEditOpen(params.row)}
          >
            Edit
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="Employee" subtitle="Managing the Employee Members" />
      <Box
        m="20px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <Box display="flex" justifyContent="flex-end" mb="10px">
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Add Employee
          </Button>
        </Box>

        <DataGrid checkboxSelection rows={employees} columns={columns} />

        <Dialog
          open={AddEmployeeOpen}
          onClose={handleClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogContent>
            <AddEmployee
              closeModal={handleClose}
              onAddEmployee={handleAddEmployee}
              loading={loading}
              positions={positions}
            />
          </DialogContent>
        </Dialog>

        <Dialog
          open={EditEmployeeOpen}
          onClose={handleEditClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogContent>
            {selectedEmployee && (
              <Box display="flex" flexDirection="column" gap="10px">
                <TextField
                  label="First Name"
                  value={selectedEmployee.firstname}
                  onChange={(e) =>
                    setSelectedEmployee({
                      ...selectedEmployee,
                      firstname: e.target.value,
                    })
                  }
                />
                <TextField
                  label="Last Name"
                  value={selectedEmployee.lastname}
                  onChange={(e) =>
                    setSelectedEmployee({
                      ...selectedEmployee,
                      lastname: e.target.value,
                    })
                  }
                />
                <TextField
                  label="Email"
                  value={selectedEmployee.email}
                  onChange={(e) =>
                    setSelectedEmployee({
                      ...selectedEmployee,
                      email: e.target.value,
                    })
                  }
                />
                <TextField
                  label="Password"
                  type="password"
                  value={selectedEmployee.password}
                  onChange={(e) =>
                    setSelectedEmployee({
                      ...selectedEmployee,
                      password: e.target.value,
                    })
                  }
                />
                <TextField
                  label="Address"
                  value={selectedEmployee.address}
                  onChange={(e) =>
                    setSelectedEmployee({
                      ...selectedEmployee,
                      address: e.target.value,
                    })
                  }
                />
                <TextField
                  label="Contact No"
                  value={selectedEmployee.phone}
                  onChange={(e) =>
                    setSelectedEmployee({
                      ...selectedEmployee,
                      phone: e.target.value,
                    })
                  }
                />
                <FormControl required>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    label="Gender"
                    name="gender"
                    value={selectedEmployee.gender}
                    onChange={(e) =>
                      setSelectedEmployee({
                        ...selectedEmployee,
                        gender: e.target.value,
                      })
                    }
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
                    name="position"
                    value={selectedEmployee.position}
                    onChange={(e) =>
                      setSelectedEmployee({
                        ...selectedEmployee,
                        position: e.target.value,
                      })
                    }
                    disabled={loading || positions.length === 0}
                  >
                    {positions.map((position) => (
                      <MenuItem key={position.id} value={position.name}>
                        {position.name}{" "}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdateEmployee}
                >
                  Update Employee
                </Button>
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Employee;
