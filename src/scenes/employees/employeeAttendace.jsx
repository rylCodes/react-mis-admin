import { useContext, useEffect, useState } from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EmployeeAttendance = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [employeesAttendance, setEmployeesAttendance] = useState([]);

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    } else {
      fetchAttendanceData();
    }
  }, [authToken, navigate]);

  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/show-attendance-list",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const formattedData = response.data.data.map((attendance) => ({
        id: attendance.id,
        name: attendance.name,
        date: attendance.date,
        attendance: attendance.status,
      }));
      setEmployeesAttendance(formattedData);
      console.log(response.data);
    } catch (error) {
      console.error("Failed to fetch attendance data:", error);
    }
  };

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "date", headerName: "Date", flex: 1 },
    { field: "attendance", headerName: "Attendance", flex: 1 },
  ];

  return (
    <Box m="20px">
      <Header
        title="Employee's Attendance"
        subtitle="Records of Employee's Attendance"
      />
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
        <DataGrid
          checkboxSelection
          rows={employeesAttendance}
          columns={columns}
        />
      </Box>
    </Box>
  );
};

export default EmployeeAttendance;
