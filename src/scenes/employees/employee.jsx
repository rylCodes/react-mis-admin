import { useState, useEffect } from "react";
import { Box, useTheme, Button, Dialog, DialogContent } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import AddEmployee from "./AddEmployee";
import Header from "../../components/Header";
import axios from "axios"; // For API requests

const Employee = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [AddEmployeeOpen, setAddEmployeeOpen] = useState(false);
  const [employees, setEmployees] = useState([]);

  // Fetch employees from the backend
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/admin/show-staff"
        );
        const formattedData = response.data.data.map((staff) => ({
          id: staff.id,
          name: staff.fullname,
          email: staff.email,
          sex: staff.gender,
          phone: staff.contact_no || "N/A", // Handle null values
          address: staff.address,
          position: staff.position,
        }));
        setEmployees(formattedData);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  const handleOpen = () => setAddEmployeeOpen(true);
  const handleClose = () => setAddEmployeeOpen(false);

  const handleAddEmployee = (newEmployee) => {
    // Add new employee to the state (consider adding an API call here)
    setEmployees((prevEmployees) => [
      ...prevEmployees,
      { id: prevEmployees.length + 1, ...newEmployee },
    ]);
  };

  const handleArchive = (id) => {
    // Archive employee logic
    setEmployees((prevEmployees) =>
      prevEmployees.filter((employee) => employee.id !== id)
    );
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
            />
          </DialogContent>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Employee;
