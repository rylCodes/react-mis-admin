import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  useTheme,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../context/AlertContext";

const Report = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const showAlert = useAlert();

  const [inventoryData, setInventoryData] = useState([]);
  const [isDialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    } else {
      const fetchInventoryData = async () => {
        try {
          const response = await axios.get(
            "http://localhost:8000/api/admin/show-inventory",
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
          setInventoryData(response.data.data);
        } catch (error) {
          console.error("Error fetching inventory data:", error);
        }
      };

      fetchInventoryData();
    }
  }, [authToken, navigate]);

  const getTotalItems = () => inventoryData.length;

  const getTotalStockLevel = () =>
    inventoryData.reduce((total, item) => total + item.quantity, 0);

  const getTotalPrice = () =>
    inventoryData
      .reduce(
        (total, item) => total + parseFloat(item.price) * item.quantity,
        0
      )
      .toFixed(2);

  const getTotalItemsByType = (type) =>
    inventoryData.filter((item) => item.type === type).length;

  const getTotalPriceByType = (type) => {
    const total = inventoryData
      .filter((item) => item.type === type)
      .reduce(
        (total, item) => total + parseFloat(item.price) * item.quantity,
        0
      );
    return total.toFixed(2);
  };

  const getMinInventoryItem = () => {
    if (inventoryData.length === 0) return { name: "N/A", quantity: 0 };
    return inventoryData.reduce(
      (minItem, item) => (item.quantity < minItem.quantity ? item : minItem),
      inventoryData[0]
    );
  };

  const getMaxInventoryItem = () => {
    if (inventoryData.length === 0) return { name: "N/A", quantity: 0 };
    return inventoryData.reduce(
      (maxItem, item) => (item.quantity > maxItem.quantity ? item : maxItem),
      inventoryData[0]
    );
  };

  const generateCSV = () => {
    const headers = ["ID", "Item Code", "Name", "Type", "Stock Level", "Price"];
    const rows = inventoryData.map((item) => [
      item.id,
      item.item_code,
      item.name,
      item.type,
      item.quantity,
      item.price,
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      headers.join(",") +
      "\n" +
      rows.map((row) => row.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "inventory_report.csv");
    document.body.appendChild(link);
    link.click();

    setDialogOpen(false); // Close the dialog after downloading
  };

  const handleDownloadClick = () => {
    setDialogOpen(true);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Header
        title="Inventory Report"
        subtitle="Generate reports on inventory data"
      />
      <Paper
        elevation={3}
        sx={{ padding: 3, backgroundColor: colors.primary[400] }}
      >
        <Typography variant="h6" gutterBottom>
          Inventory Statistics
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" gutterBottom>
              Total Items: {getTotalItems()}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Total Stock Level: {getTotalStockLevel()}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Total Inventory Price: ₱{getTotalPrice()}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Total Equipment Items: {getTotalItemsByType("equipment")}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Total Supplement Items: {getTotalItemsByType("supplement")}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Total Equipment Price: ₱{getTotalPriceByType("equipment")}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Total Supplement Price: ₱{getTotalPriceByType("supplement")}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" gutterBottom>
              Item with Minimum Inventory: {getMinInventoryItem().name} (
              {getMinInventoryItem().quantity})
            </Typography>
            <Typography variant="body1" gutterBottom>
              Item with Maximum Inventory: {getMaxInventoryItem().name} (
              {getMaxInventoryItem().quantity})
            </Typography>
          </Grid>
        </Grid>
        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            onClick={handleDownloadClick}
          >
            Download CSV Report
          </Button>
        </Box>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Confirm CSV Download</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to download the inventory report as a CSV
            file?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={generateCSV} color="primary" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Report;
