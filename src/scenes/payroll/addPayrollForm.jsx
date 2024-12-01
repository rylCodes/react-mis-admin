import React, { useContext, useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const AddPayrollForm = ({ closeModal, onAddEmployee }) => {
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    }
  }, [authToken, navigate]);

  const [step, setStep] = useState(1); // Track the current step (1: Basic Details, 2: Salary Details)

  const [employeeData, setEmployeeData] = useState({
    employeeID: "",
    dateFrom: "", // Date From
    dateTo: "", // Date To
    earnings: {
      overtime: 0,
      yearlyBonus: 0,
      salesCommission: 0,
      taripaIncentives: 0,
    },
    deductions: {
      sss: 0,
      pagIbig: 0,
      philHealth: 0,
      underTime: 0,
    },
  });

  const [openModal, setOpenModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericValue =
      value === "" ? "" : !isNaN(value) ? parseFloat(value) : value;

    if (name in employeeData.earnings) {
      setEmployeeData((prevData) => ({
        ...prevData,
        earnings: {
          ...prevData.earnings,
          [name]: numericValue,
        },
      }));
    } else if (name in employeeData.deductions) {
      setEmployeeData((prevData) => ({
        ...prevData,
        deductions: {
          ...prevData.deductions,
          [name]: numericValue,
        },
      }));
    } else {
      setEmployeeData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    setStep(2);
    setOpenModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8000/api/admin/store-staff-payroll/${employeeData.employeeID}`,
        {
          staff_id: employeeData.employeeID,
          start_date: employeeData.dateFrom,
          end_date: employeeData.dateTo,
          over_time: employeeData.earnings.overtime,
          yearly_bonus: employeeData.earnings.yearlyBonus,
          sales_comission: employeeData.earnings.salesCommission,
          incentives: employeeData.earnings.taripaIncentives,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        onAddEmployee(employeeData);
        navigate("/payslip", { state: { employeeData } });
        closeModal();
      } else {
        console.error("Failed to store payroll data:", response);
      }
    } catch (error) {
      console.error("Error storing payroll data:", error);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
    >
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
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={handleNext}
        >
          Next
        </Button>
      </Box>

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

          <Box mt={2}>
            <Typography variant="h6" padding={2}>
              Earnings
            </Typography>
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

          <Box mt={2}>
            <Typography variant="h6" padding={2}>
              Deductions
            </Typography>
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
