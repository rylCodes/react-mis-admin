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
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const initialEquipmentData = [
  {
    id: 1,
    name: "Treadmill",
    picture: "https://via.placeholder.com/100", // Placeholder image URL
    stockLevel: 5,
    description: "High-quality treadmill with multiple speed settings.",
  },
  {
    id: 2,
    name: "Dumbbells Set",
    picture: "https://via.placeholder.com/100",
    stockLevel: 20,
    description: "Complete set of dumbbells from 2kg to 50kg.",
  },
  {
    id: 3,
    name: "Bench Press",
    picture: "https://via.placeholder.com/100",
    stockLevel: 2,
    description: "Adjustable bench press for all workout needs.",
  },
];

const EquipmentTable = () => {
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

  return (
    <Box sx={{ padding: 3 }}>
      <Header title="Equipment" subtitle="Manage Discounts and Packages" />
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
                    }}
                  />
                </TableCell>
                <TableCell>{equipment.stockLevel}</TableCell>
                <TableCell>{equipment.description}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleEdit(equipment.id)}
                    sx={{ marginRight: 1 }}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default EquipmentTable;
