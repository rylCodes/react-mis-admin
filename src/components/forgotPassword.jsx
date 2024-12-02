import React, { useState } from "react";
import {
  useTheme,
  Container,
  TextField,
  Button,
  Grid,
  Box,
} from "@mui/material";
import { tokens } from "../theme";
import { useNavigate } from "react-router-dom"; // For navigation
import axios from "axios"; // For making API requests

const ForgotPassword = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate(); // Initialize navigation

  const [secretKeywords, setSecretKeywords] = useState({
    keyword1: "",
    keyword2: "",
    keyword3: "",
  });

  const [error, setError] = useState({
    keyword1: false,
    keyword2: false,
    keyword3: false,
  });

  const [loading, setLoading] = useState(false); // To handle loading state

  // Handle the keyword input changes
  const handleKeywordChange = (event, keywordKey) => {
    setSecretKeywords((prev) => ({
      ...prev,
      [keywordKey]: event.target.value,
    }));
  };

  // Handle form submission
  const handleConfirm = async () => {
    // Validate input fields
    const newError = {
      keyword1: !secretKeywords.keyword1,
      keyword2: !secretKeywords.keyword2,
      keyword3: !secretKeywords.keyword3,
    };

    setError(newError);

    // If no errors, proceed to send data
    if (!Object.values(newError).some((value) => value)) {
      setLoading(true);
      try {
        const response = await axios.post(
          "https://your-api-url.com/api/admin/add-security-answer", // Update with your actual API endpoint
          {
            secret_keyword_1: secretKeywords.keyword1,
            secret_keyword_2: secretKeywords.keyword2,
            secret_keyword_3: secretKeywords.keyword3,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Token if needed
            },
          }
        );
        alert(response.data.message); // Show success message
        navigate("/change-password"); // Navigate to password reset page
      } catch (error) {
        // Handle API error
        console.error("Error submitting secret keywords:", error);
        alert(
          error.response?.data?.error || "An error occurred. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  // Reset form
  const handleCancel = () => {
    setSecretKeywords({
      keyword1: "",
      keyword2: "",
      keyword3: "",
    });
    setError({
      keyword1: false,
      keyword2: false,
      keyword3: false,
    });
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        marginTop: 5,
        backgroundColor: colors.primary[400],
        padding: 3,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Box sx={{ textAlign: "center", marginBottom: 4 }}>
        <h2>Forgot Password</h2>
        <p>Enter your secret keywords to proceed.</p>
      </Box>

      <Grid container spacing={2}>
        {["keyword1", "keyword2", "keyword3"].map((keywordKey, index) => (
          <Grid item xs={12} key={keywordKey}>
            <TextField
              fullWidth
              margin="normal"
              label={`Secret Keyword ${index + 1}`}
              type="password" // Using password type for security
              value={secretKeywords[keywordKey]}
              onChange={(e) => handleKeywordChange(e, keywordKey)}
              error={error[keywordKey]}
              helperText={error[keywordKey] ? "Secret keyword is required" : ""}
            />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2} sx={{ marginTop: 3 }}>
        <Grid item xs={6}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirm}
            sx={{ width: "100%" }}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Confirm"}
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleCancel}
            sx={{ width: "100%" }}
            disabled={loading}
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ForgotPassword;
