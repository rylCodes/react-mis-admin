import React, { useState } from "react";
import {
  Grid,
  Paper,
  Avatar,
  TextField,
  Button,
  Typography,
  Link,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate(); // Hook for navigation

  // Handle Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
        remember_me: rememberMe ? 1 : 0, // Pass rememberMe as a boolean flag
      });

      const { data } = response;
      // Handle successful login, e.g., save token, redirect, etc.
      console.log("Login successful:", data);
      localStorage.setItem("access_token", data.meta.access_token); // Save token for authentication
      navigate("/dashboard");
    } catch (err) {
      // Handle errors
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error.message || "Invalid credentials");
      } else {
        setError("An error occurred. Please try again.");
      }
      console.error("Login failed:", err);
    }
  };

  // Toggle password visibility
  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const paperStyle = {
    padding: 20,
    height: "60vh",
    width: 380,
    margin: "150px auto",
  };
  const avatarStyle = { backgroundColor: "#1bbd7e" };
  const btnStyle = { margin: "8px 0" };

  return (
    <Grid>
      <Paper elevation={15} style={paperStyle}>
        <Grid align="center">
          <Avatar style={avatarStyle}>
            <LockOutlinedIcon />
          </Avatar>
          <h2>Sign In</h2>
        </Grid>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            placeholder="Enter email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div style={{ position: "relative" }}>
            <TextField
              label="Password"
              placeholder="Enter password"
              type={showPassword ? "text" : "password"}
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              onClick={handlePasswordToggle}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
              }}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </Button>
          </div>
          <FormControlLabel
            control={
              <Checkbox
                name="rememberMe"
                color="primary"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
            }
            label="Remember me"
          />
          <Typography>
            <Link href="/forgot-password">Forgot password?</Link>
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
          <Button
            type="submit"
            color="primary"
            variant="contained"
            style={btnStyle}
            fullWidth
          >
            Sign In
          </Button>
        </form>
        {/* Link to Sign Up Page */}
        <Typography>
          <Link href="/signup" style={{ textDecoration: "none" }}>
            Don't have an account? Sign Up
          </Link>
        </Typography>
      </Paper>
    </Grid>
  );
};

export default Login;
