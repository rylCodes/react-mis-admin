import { useEffect, useState } from "react";
import { Box, useTheme, Button, Dialog, DialogContent } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import { mockDataEmployee } from "../../data/mockData";
import Header from "../../components/Header";
import AddPayrollForm from "../payroll/addPayrollForm";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const PayrollList = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    }
  }, [authToken, navigate]);

  const [AddEmployeeOpen, setAddEmployeeOpen] = useState(false);
  const [employees, setEmployees] = useState(mockDataEmployee);

  const handleOpen = () => setAddEmployeeOpen(true);
  const handleClose = () => setAddEmployeeOpen(false);

  const handleArchive = (id) => {
    // Delete employee logic
    setEmployees((prevEmployees) =>
      prevEmployees.filter((employee) => employee.id !== id)
    );
  };

  const handleAddEmployee = (newEmployee) => {
    setEmployees((prevEmployees) => [
      ...prevEmployees,
      { id: prevEmployees.length + 1, ...newEmployee }, // Adding new employee data
    ]);
  };

  const columns = [
    { field: "id", headerName: "Employee ID" },
    { field: "title", headerName: "Title", flex: 1 },
    { field: "from", headerName: "From", headerAlign: "left", align: "left" },
    { field: "to", headerName: "To", flex: 1 },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" gap="9px" justifyContent="center">
          <Button
            variant="outlined"
            color="#f5f5f5"
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
      <Header title="Payroll" subtitle="Managing the Payroll Members" />
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
            New Payroll
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
            <AddPayrollForm
              closeModal={handleClose}
              onAddEmployee={handleAddEmployee}
            />
          </DialogContent>
        </Dialog>
      </Box>
    </Box>
  );
};

export default PayrollList;
