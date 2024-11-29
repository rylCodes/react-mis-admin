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

const initialEquipmentData = [
  {
    id: 1,
    name: "Vitamin Powder",
    picture: "https://via.placeholder.com/100",
    stockLevel: 5,
    description: "Premium vitamin powder for energy boosting.",
  },
  {
    id: 2,
    name: "Softdrinks",
    picture: "https://via.placeholder.com/100",
    stockLevel: 20,
    description: "Assorted soft drinks for post-workout refreshments.",
  },
  {
    id: 3,
    name: "Soya",
    picture: "https://via.placeholder.com/100",
    stockLevel: 2,
    description: "High-protein soy beverage.",
  },
  {
    id: 4,
    name: "Mineral Water",
    picture: "https://via.placeholder.com/100",
    stockLevel: 8,
    description: null,
  },
  {
    id: 5,
    name: "Energy Drink",
    picture: "https://via.placeholder.com/100",
    stockLevel: 2,
    description: "Energy drink to recharge during workouts.",
  },
];

const InventoryTable = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    }
  }, [authToken, navigate]);

  const [equipmentData] = useState(initialEquipmentData);

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
                <b>Action</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {equipmentData.map((equipment) => (
              <TableRow key={equipment.id}>
                <TableCell>{equipment.name}</TableCell>
                <TableCell>
                  <img
                    src={equipment.picture}
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
                    color: getStockLevelColor(equipment.stockLevel),
                    fontWeight: "bold",
                  }}
                >
                  {equipment.stockLevel}
                </TableCell>
                <TableCell>
                  {equipment.description || (
                    <i style={{ color: colors.grey[500] }}>
                      No description available
                    </i>
                  )}
                </TableCell>
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
