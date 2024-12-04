import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme,
  MenuItem,
  Typography,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useAlert } from "../../context/AlertContext";

const EmployeeAttendance = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { authToken } = useContext(AuthContext);
  const showAlert = useAlert();
  const navigate = useNavigate();

  const handleUpdateSuccess = () => {
    showAlert(`Attendance successfully updated.`, "success");
  };

  const handleError = () => {
    showAlert("An error occurred while updating the attendance!", "error");
  };

  const [employeesAttendance, setEmployeesAttendance] = useState([]);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [newAttendanceStatus, setNewAttendanceStatus] = useState("");
  const [open, setOpen] = useState(false);

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

  const handleUpdateAttendance = async () => {
    if (!selectedAttendance || !newAttendanceStatus) return;

    try {
      const response = await axios.post(
        `http://localhost:8000/api/admin/update-attendance/${selectedAttendance.id}`,
        { attendance: newAttendanceStatus },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      fetchAttendanceData();
      setSelectedAttendance(null);
      setNewAttendanceStatus("");
      setOpen(false);
      handleUpdateSuccess();
    } catch (error) {
      console.error("Failed to update attendance:", error);
      handleError();
    }
  };

  const handleClickOpen = (row) => {
    setSelectedAttendance(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedAttendance(null);
    setNewAttendanceStatus("");
  };

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "date", headerName: "Date", flex: 1 },
    { field: "attendance", headerName: "Attendance", flex: 1 },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" gap="9px" alignItems={"center"} height={"100%"}>
          <Button
            variant="outlined"
            color="success"
            startIcon={<EditOutlinedIcon />}
            onClick={() => handleClickOpen(params.row)}
          >
            Update
          </Button>
        </Box>
      ),
    },
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

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Update Attendance</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Update the attendance status for {selectedAttendance?.name}.
          </DialogContentText>
          <FormControl fullWidth required sx={{ mb: 2 }}>
            <InputLabel>Attendance</InputLabel>
            <Select
              label="Attendance"
              value={newAttendanceStatus}
              onChange={(e) => setNewAttendanceStatus(e.target.value)}
            >
              <MenuItem value="present">Present</MenuItem>
              <MenuItem value="absent">Absent</MenuItem>
              <MenuItem value="halfday">Halfday</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
          <Button onClick={handleUpdateAttendance} color="secondary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployeeAttendance;
