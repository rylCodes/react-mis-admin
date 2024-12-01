import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Grid,
  Divider,
  Button,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { jsPDF } from "jspdf"; // Import jsPDF
import { AuthContext } from "../../context/AuthContext";

const PaySlip = ({ selectedEmployee, handlePayslipClose }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    }
  }, [authToken, navigate]);

  useEffect(() => {
    console.log("selectedEmployee", selectedEmployee);
  }, []);

  const [isVisible, setIsVisible] = useState(true); // State to toggle visibility

  const handleCancel = () => {
    setIsVisible(false); // Hide the pay slip when Cancel is clicked
    navigate("/payroll-list");
  };

  const deductions = [
    { label: "Vale", amount: selectedEmployee?.vale || "" },
    { label: "SSS", amount: selectedEmployee?.sss || "" },
    { label: "PHILHEALTH", amount: selectedEmployee?.philhealth || "" },
    { label: "PAG-IBIG", amount: selectedEmployee?.pag_ibig || "" },
    {
      label: "Late/Undertime",
      amount: selectedEmployee?.undertime || "",
    },
  ];

  const getDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return "--";

    const start = new Date(startDate);
    const end = new Date(endDate);

    const options = { day: "numeric", month: "short" };
    return `${start.toLocaleDateString(
      "en-US",
      options
    )}-${end.toLocaleDateString("en-US", options)}`;
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "short", day: "2-digit" };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  const breakdowns = [
    `Vale on: ${
      selectedEmployee?.end_date ? formatDate(selectedEmployee.end_date) : "--"
    }`,
    `SSS for ${getDateRange(
      selectedEmployee?.start_date,
      selectedEmployee?.end_date
    )} as of ${
      selectedEmployee?.end_date ? formatDate(selectedEmployee.end_date) : "--"
    }`,
    `PHL for ${getDateRange(
      selectedEmployee?.start_date,
      selectedEmployee?.end_date
    )} as of ${
      selectedEmployee?.end_date ? formatDate(selectedEmployee.end_date) : "--"
    }`,
    `PAG-IBIG for ${getDateRange(
      selectedEmployee?.start_date,
      selectedEmployee?.end_date
    )} as of ${
      selectedEmployee?.end_date ? formatDate(selectedEmployee.end_date) : "--"
    }`,
    `${
      selectedEmployee?.start_date
        ? formatDate(selectedEmployee.start_date)
        : "--"
    }, ${
      selectedEmployee?.end_date ? formatDate(selectedEmployee.end_date) : "--"
    } = ${
      selectedEmployee?.present_day ? selectedEmployee.present_day * 8 : "--"
    } hrs`,
  ];

  // Handle Print Action
  const handlePrint = () => {
    window.print(); // Opens the print dialog for the current page
  };

  // Handle Save Action (generate PDF)
  const handleSave = () => {
    const doc = new jsPDF();
    doc.text("PAY SLIP", 20, 10);
    doc.text(
      `Payroll Period: ${selectedEmployee?.start_date || ""} - ${
        selectedEmployee?.end_date || ""
      }`,
      20,
      20
    );
    doc.text("Employer: GYM DEPOT CORPORATION", 20, 30);
    doc.text(`Employee: ${selectedEmployee.name}`, 20, 40);
    doc.text(`Date of Payment: ${selectedEmployee?.pay_date || ""}`, 20, 50);
    doc.text("Mode of Payment: Cash", 20, 60);
    doc.save("payslip.pdf"); // This will download the generated PDF
  };

  return (
    <Box p={6}>
      <Paper elevation={2} sx={{ padding: 2, backgroundColor: "#f5f5f5" }}>
        {/* Header */}
        <Box px={4} py={2}>
          <Typography
            variant="h6"
            fontWeight="bold"
            gutterBottom
            backgroundColor={colors.primary[300]}
            sx={{
              // Dark background
              color: "white",
              padding: "8px 16px",
            }}
          >
            PAY SLIP
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography
                sx={{
                  backgroundColor: "#333", // Dark background
                  color: "white",
                  padding: "8px 16px",
                }}
              >
                Payroll Period: {selectedEmployee?.start_date || ""} -{" "}
                {selectedEmployee?.end_date || ""}
              </Typography>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: "black", padding: "22px 16px" }}
              >
                Employer: GYM DEPOT CORPORATION
              </Typography>

              <Typography
                sx={{
                  backgroundColor: "#333", // Dark background
                  color: "white",
                  padding: "8px 16px",
                }}
              >
                Name of Employee: {selectedEmployee.name}
              </Typography>
              <Typography>Employee No.#: {selectedEmployee.name}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                sx={{
                  backgroundColor: "#333", // Dark background
                  color: "white",
                  padding: "8px 16px",
                }}
              >
                Date of Payment:
              </Typography>
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{
                  color: "#333",
                  padding: "22px 16px",
                }}
              >
                {selectedEmployee?.pay_date || ""}
              </Typography>
              <Typography
                sx={{
                  backgroundColor: "#333", // Dark background
                  color: "white",
                  padding: "8px 16px",
                }}
              >
                Mode of Payment: Cash
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Divider />
        {/* Main Table */}
        <Box p={4}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ color: "#333", padding: "8px 16px" }}>
                        NO. OF DAYS WORKED
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ color: "#333", padding: "8px 16px" }}
                      >
                        {selectedEmployee.present_day}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ color: "#333", padding: "8px 16px" }}
                      >
                        {selectedEmployee.net_income}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ color: "#333", padding: "8px 16px" }}>
                        Overtime
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ color: "#333", padding: "8px 16px" }}
                      >
                        {selectedEmployee.overtime}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ color: "#333", padding: "8px 16px" }}
                      ></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2} align="right">
                        <Typography
                          fontWeight="bold"
                          sx={{
                            color: "#f5f5f5",
                            padding: "8px 16px",
                            backgroundColor: "#333",
                          }}
                        >
                          Total
                        </Typography>
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ color: "#333", padding: "8px 16px" }}
                      >
                        {selectedEmployee.net_income}
                      </TableCell>
                    </TableRow>

                    {/* Deductions */}
                    {deductions.map((deduction, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ color: "#333", padding: "8px 16px" }}>
                          {deduction.label}
                        </TableCell>
                        <TableCell
                          colSpan={2}
                          align="right"
                          sx={{ color: "#333", padding: "8px 16px" }}
                        >
                          {deduction.amount}
                        </TableCell>
                      </TableRow>
                    ))}

                    <TableRow>
                      <TableCell colSpan={2} align="right">
                        <Typography
                          color="error"
                          fontWeight="bold"
                          sx={{ color: "#333", padding: "8px 16px" }}
                        >
                          Total Deductions
                        </Typography>
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ color: "#333", padding: "8px 16px" }}
                      >
                        {selectedEmployee.total_deductions}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: "#333", padding: "8px 16px" }}
              >
                Breakdowns
              </Typography>
              <Box sx={{ color: "#333", padding: "8px 16px" }}>
                {breakdowns.map((breakdown, index) => (
                  <Typography key={index} variant="body2">
                    {breakdown}
                  </Typography>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Divider />
        {/* Footer */}
        <Box
          p={4}
          textAlign="center"
          sx={{ color: "#333", paddingTop: "20px", marginTop: "15px" }}
        >
          <Typography variant="h5" fontWeight="bold">
            NET PAY.....P {selectedEmployee.final_salary}
          </Typography>
        </Box>
      </Paper>

      {/* Buttons moved outside the main Box */}
      <Box p={4} textAlign="center" sx={{ marginTop: "20px" }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ mr: 2 }}
          onClick={handlePrint}
        >
          Print
        </Button>
        <Button
          variant="contained"
          color="secondary"
          sx={{ mr: 2 }}
          onClick={handleSave}
        >
          Save
        </Button>
        <Button variant="outlined" color="error" onClick={handlePayslipClose}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default PaySlip;
