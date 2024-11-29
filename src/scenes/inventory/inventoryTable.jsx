import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Tooltip,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const InventoryTable = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [inventoryData, setInventoryData] = useState([]);

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

  const handleEdit = (id) => {
    alert(`Editing equipment with ID: ${id}`);
  };

  const getStockLevelColor = (stockLevel) => {
    if (stockLevel <= 5) return "error.main"; // Low stock
    if (stockLevel <= 15) return "warning.main"; // Medium stock
    return "success.main"; // High stock
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Header title="Inventory" subtitle="Manage Discounts and Packages" />
      <TableContainer
        component={Paper}
        sx={{ backgroundColor: colors.primary[400] }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Name</b>
              </TableCell>
              <TableCell>
                <b>Picture</b>
              </TableCell>
              <TableCell>
                <b>Stock Level</b>
              </TableCell>
              <TableCell>
                <b>Description</b>
              </TableCell>
              <TableCell>
                <b>Unit Price</b>
              </TableCell>
              <TableCell>
                <b>Action</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventoryData.map((equipment) => (
              <TableRow key={equipment.id}>
                <TableCell>{equipment.name}</TableCell>
                <TableCell>
                  <img
                    src={equipment.picture || "https://via.placeholder.com/100"}
                    alt={equipment.name}
                    style={{
                      width: "100px",
                      height: "auto",
                      borderRadius: "5px",
                      maxWidth: "100%",
                    }}
                  />
                </TableCell>
                <TableCell
                  sx={{
                    color: getStockLevelColor(equipment.quantity),
                    fontWeight: "bold",
                  }}
                >
                  {equipment.quantity}
                </TableCell>
                <TableCell>
                  {equipment.short_description || (
                    <i style={{ color: colors.grey[500] }}>
                      No description available
                    </i>
                  )}
                </TableCell>
                <TableCell>{equipment.price}</TableCell>
                <TableCell>
                  <Tooltip title="Edit this equipment" arrow>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleEdit(equipment.id)}
                      sx={{ marginRight: 1 }}
                    >
                      Edit
                    </Button>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default InventoryTable;
