import { useContext, useEffect, useState } from "react";
import { Button, Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataMonthlyCus } from "../../data/mockData";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";

import Header from "../../components/Header";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Monthly = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [monthly, setMonthly] = useState(mockDataMonthlyCus);

  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    }
  }, [authToken, navigate]);

  const handleupdate = (id) => {
    // Delete employee logic
    setMonthly((prevtMonthly) =>
      prevtMonthly.filter((monthly) => monthly.id !== id)
    );
  };

  const handleEdit = (id) => {
    // Handle edit functionality
    console.log("Edit employee with ID:", id);
    // You can open a modal with pre-filled employee data for editing
  };

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "sex", headerName: "Sex", headerAlign: "left", align: "left" },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "contact", headerName: "Contact No", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 },
    { field: "chosenservices", headerName: "Chosen Services", flex: 1 },
    { field: "instructor", headerName: "Instructor", flex: 1 },
    { field: "plan", headerName: "Plan", flex: 1 },
    { field: "amount", headerName: "Amount", flex: 1 },

    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" gap="15px" justifyContent="center">
          <Button
            variant="outlined"
            color="primary"
            startIcon={<ArchiveOutlinedIcon />}
            onClick={() => handleEdit(params.row.id)}
          >
            Archive
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<EditOutlinedIcon />}
            onClick={() => handleupdate(params.row.id)}
          >
            Update
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="Monthly" subtitle="Managing the monthly Members" />
      <Box
        m="40px 0 0 0"
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
        <DataGrid checkboxSelection rows={monthly} columns={columns} />
      </Box>
    </Box>
  );
};

export default Monthly;
