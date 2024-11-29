import React, { useEffect, useState } from "react";
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

const PaySlip = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    }
  }, [authToken, navigate]);

  const [isVisible, setIsVisible] = useState(true); // State to toggle visibility

  const handleCancel = () => {
    setIsVisible(false); // Hide the pay slip when Cancel is clicked
    navigate("/payroll-list");
  };

  const deductions = [
    { label: "Vale", amount: "191.24" },
    { label: "SSS", amount: "163.13" },
    { label: "PHILHEALTH", amount: "71.50" },
    { label: "PAG-IBIG", amount: "25.00" },
    { label: "Late/Undertime", amount: "354.00" },
  ];

  const breakdowns = [
    "Vale on: 1/31/24",
    "SSS for 1-4 FEB as of 02/03/24",
    "PHL for 1-4 FEB as of 02/03/24",
    "PAG-IBIG for 1-4 FEB as of 02/03/24",
    "Jan 29, 30, 31, Feb 01, 02 = 36hrs",
  ];

  if (!isVisible) return null; // If not visible, don't render anything

  // Handle Print Action
  const handlePrint = () => {
    window.print(); // Opens the print dialog for the current page
  };

  // Handle Save Action (generate PDF)
  const handleSave = () => {
    const doc = new jsPDF();
    doc.text("PAY SLIP", 20, 10);
    doc.text("Payroll Period: Jan. 29 - Feb. 03, 2024", 20, 20);
    doc.text("Employer: GYM DEPOT CORPORATION", 20, 30);
    doc.text("Employee: Puti, John", 20, 40);
    doc.text("Date of Payment: February 3, 2024", 20, 50);
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
                Payroll Period: Jan. 29 - Feb. 03, 2024
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
                Name of Employee: Puti, John
              </Typography>
              <Typography>Employee No.#: 01</Typography>
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
                February 3, 2024
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
                        6
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ color: "#333", padding: "8px 16px" }}
                      >
                        3,300.00
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
                        0.00
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
                        3,300.00
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
                        -682.44
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
            NET PAY.....P 2,617.56
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
        <Button variant="outlined" color="error" onClick={handleCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default PaySlip;
