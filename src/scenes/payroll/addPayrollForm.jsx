import React, { useState } from "react";
import { TextField, Button, Box, Grid, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing

const AddPayrollForm = ({ closeModal, onAddEmployee }) => {
  const navigate = useNavigate(); // Use the navigate hook
  const [step, setStep] = useState(1); // Track the current step (1: Basic Details, 2: Salary Details)

  const [employeeData, setEmployeeData] = useState({
    employeeID: "",
    dateFrom: "",    // Date From
    dateTo: "",      // Date To
    presentDays: "", // Present Days
    earnings: {
      overtime: 0,
      yearlyBonus: 0,
      salesCommission: 0,
      taripaIncentives: 0
    },
    deductions: {
      sss: 0,
      pagIbig: 0,
      philHealth: 0,
      underTime: 0
    }
  });

  const [openModal, setOpenModal] = useState(false); // State to open and close modal

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If the value is empty, treat it as an empty string or handle numeric fields
    const numericValue = value === "" ? "" : !isNaN(value) ? parseFloat(value) : value;

    // Handle nested fields for earnings and deductions
    if (name in employeeData.earnings) {
      setEmployeeData(prevData => ({
        ...prevData,
        earnings: {
          ...prevData.earnings,
          [name]: numericValue,
        },
      }));
    } else if (name in employeeData.deductions) {
      setEmployeeData(prevData => ({
        ...prevData,
        deductions: {
          ...prevData.deductions,
          [name]: numericValue,
        },
      }));
    } else {
      setEmployeeData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    setStep(2); // Switch to the salary details step
    setOpenModal(true); // Open the modal when Next is clicked
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddEmployee(employeeData);
    navigate("/payslip", { state: { employeeData } }); // Navigate to payslip page after saving
    closeModal(); // Close the modal after submission
  };

  const handleCloseModal = () => {
    setOpenModal(false); // Close modal when canceled
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {step === 1 && (
        <>
          <TextField
            label="Employee ID"
            name="employeeID"
            value={employeeData.employeeID}
            onChange={handleChange}
            required
          />
          <TextField
            label="Date From"
            name="dateFrom"
            type="date"
            value={employeeData.dateFrom}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            label="Date To"
            name="dateTo"
            type="date"
            value={employeeData.dateTo}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />
        </>
      )}

      <Box mt={3} display="flex" justifyContent="space-between">
        <Button variant="outlined" onClick={closeModal}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary" onClick={handleNext}>
          Next
        </Button>
      </Box>

      {/* Modal for Salary Inclusion */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Salary Inclusion</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} padding={2}>
            <Grid item xs={6}>
              <TextField
                label="Employee ID"
                value={employeeData.employeeID}
                fullWidth
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Present Days"
                name="presentDays"
                value={employeeData.presentDays}
                onChange={handleChange}
                fullWidth
                type="number"
              />
            </Grid>
          </Grid>

          {/* Earnings Table */}
          <Box mt={2}>
            <Typography variant="h6" padding={2}>Earnings</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Overtime"
                  name="overtime"
                  value={employeeData.earnings.overtime || ""}
                  onChange={handleChange}
                  fullWidth
                  type="number"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Yearly Bonus"
                  name="yearlyBonus"
                  value={employeeData.earnings.yearlyBonus || ""}
                  onChange={handleChange}
                  fullWidth
                  type="number"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Sales Commission"
                  name="salesCommission"
                  value={employeeData.earnings.salesCommission || ""}
                  onChange={handleChange}
                  fullWidth
                  type="number"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Taripa Incentives"
                  name="taripaIncentives"
                  value={employeeData.earnings.taripaIncentives || ""}
                  onChange={handleChange}
                  fullWidth
                  type="number"
                />
              </Grid>
            </Grid>
          </Box>

          {/* Deductions Table */}
          <Box mt={2}>
            <Typography variant="h6" padding={2}>Deductions</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="SSS"
                  name="sss"
                  value={employeeData.deductions.sss || ""}
                  onChange={handleChange}
                  fullWidth
                  type="number"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Pag-IBIG"
                  name="pagIbig"
                  value={employeeData.deductions.pagIbig || ""}
                  onChange={handleChange}
                  fullWidth
                  type="number"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="PhilHealth"
                  name="philHealth"
                  value={employeeData.deductions.philHealth || ""}
                  onChange={handleChange}
                  fullWidth
                  type="number"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="UnderTime"
                  name="underTime"
                  value={employeeData.deductions.underTime || ""}
                  onChange={handleChange}
                  fullWidth
                  type="number"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="secondary">
            Save and Go to Payslip
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddPayrollForm;
