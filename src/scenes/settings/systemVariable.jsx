import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const sections = [
  { id: "edit", label: "Edit Logo" },
  { id: "edit-1", label: "Edit Information" },

  { id: "edit-discount", label: "Edit Discount" },
  { id: "edit-package-1", label: "GYM PER SESSION" },
  { id: "edit-package-2", label: "GYM MONTHLY" },
  { id: "edit-package-10", label: "GYM+TREDAMILL   " },
  { id: "edit-package-3", label: "MONTHLY TREADMILL" },
  { id: "edit-package-4", label: "P.I PER SESSION" },
  { id: "edit-package-5", label: "P.I MONTHLY" },
  { id: "edit-package-6", label: "ZUMBA" },
  { id: "edit-package-7", label: "DANCE STUDIO" },
  { id: "edit-package-8", label: "TAEKWANDO" },
  { id: "edit-package-9", label: "MUAY THAI" },
  { id: "edit-package-10", label: "BOXING   " },
];

const SystemVariable = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    }
  }, [authToken, navigate]);

  const [selectedSection, setSelectedSection] = useState("edit-discount");
  const [setImage] = useState(null);
  const [description, setDescription] = useState(
    "STUDENT PROMO IS BACK.\nPresent your ID or any proof that you are a student / or graduating student/s for this school year 2023-2024.\nPROMO RUNS UNTIL July 4, 2024."
  );

  const handleSectionSelect = (sectionId) => {
    setSelectedSection(sectionId);
    setImage(null); // Reset image when switching sections
    setDescription(""); // Reset description for the new section
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleUpdate = () => {
    alert(`Updated ${selectedSection} with description: ${description}`);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Header
        title="System Variable"
        subtitle="Manage Discounts and Packages"
      />

      {/* Section Selection Buttons */}
      <Box sx={{ marginBottom: 3 }}>
        <Typography variant="h6" gutterBottom>
          Select a Section to Edit
        </Typography>
        <Grid container spacing={2}>
          {sections.map((section) => (
            <Grid item key={section.id}>
              <Button
                variant="contained"
                color={selectedSection === section.id ? "secondary" : "primary"}
                onClick={() => handleSectionSelect(section.id)}
              >
                {section.label}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Dynamic Section Editor */}
      <Paper
        elevation={3}
        sx={{ padding: 3, backgroundColor: colors.primary[400] }}
      >
        <Typography variant="h6" gutterBottom>
          {sections.find((section) => section.id === selectedSection)?.label}
        </Typography>

        <Grid
          container
          spacing={2}
          alignItems="center"
          sx={{ marginBottom: 3 }}
        >
          <Grid item xs={12} md={6}>
            <Typography variant="body2">
              Please upload an image (in .jpg, .png only)
            </Typography>
            <input
              type="file"
              accept=".jpg,.png"
              onChange={handleImageChange}
              aria-label="Upload image"
            />
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          <Grid item xs={12}>
            <TextField
              label="Description"
              multiline
              rows={6}
              fullWidth
              value={description}
              onChange={handleDescriptionChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} display="flex" justifyContent="flex-end">
            <Button variant="contained" color="primary" onClick={handleUpdate}>
              Update
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default SystemVariable;
