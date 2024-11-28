import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Tabs,
  Tab,
  useTheme
} from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";



const InventoryForm = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    itemNumber: "",
    productId: "",
    itemName: "",
    quantity: "",
    unitPrice: "",
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    console.log("Form Data Submitted:", formData);
    // Add logic to submit form data (e.g., API call)
  };

  const handleClear = () => {
    setFormData({
      itemNumber: "",
      productId: "",
      itemName: "",
      quantity: "",
      unitPrice: "",
    });
  };

  return (
    <>
    <Header title="Inventory Form" subtitle="" />
    <Box p={2} sx={{backgroundColor: colors.primary[400]}}>
      <Typography variant="h5" mb={2}>
        Item Details
      </Typography>
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Item" />
        <Tab label="Upload Image" />
      </Tabs>

      {tabValue === 0 && (
        <Box>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={6}>
              <TextField
                label="Item Number"
                name="itemNumber"
                value={formData.itemNumber}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Product ID"
                name="productId"
                value={formData.productId}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
          </Grid>
          <TextField
            label="Item Name"
            name="itemName"
            value={formData.itemName}
            onChange={handleInputChange}
            fullWidth
            mb={2}
          />
          <TextField
            label="Description"
            multiline
            rows={4}
            fullWidth
            mb={2}
          />
          <Grid container spacing={2} mb={2}>
            <Grid item xs={6}>
              <TextField
                label="Quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Unit Price"
                name="unitPrice"
                value={formData.unitPrice}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
          </Grid>
          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{ mr: 2 }}
            >
              Update
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleClear}>
              Clear
            </Button>
          </Box>
        </Box>
      )}

      {tabValue === 1 && (
        <Box>
          <Typography variant="body1">Upload image feature coming soon...</Typography>
        </Box>
      )}
    </Box>
    </>
  );
};

export default InventoryForm;
