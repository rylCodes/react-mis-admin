import React, { useEffect, useState } from "react";
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

const Login = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // For loading state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate(); // Hook for navigation

  // Fetch user data from the backend
  useEffect(() => {
    fetch("http://localhost:5000/loginadmin")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setData(data);
        } else {
          console.error("Unexpected API response:", data);
          setError("Unexpected server response.");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch user data.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Handle Login
  const handleSubmit = (e) => {
    e.preventDefault();

    // Check for empty inputs
    if (!username || !password) {
      setError("Username and password are required.");
      return;
    }

    // Ensure `data` is an array
    if (!Array.isArray(data)) {
      setError("Unable to process login at this time.");
      return;
    }

    // Validate credentials
    const user = data.find(
      (user) => user.username === username && user.password === password
    );

    if (user) {
      // Successful login
      navigate("/dashboard");
    } else {
      // Invalid credentials
      setError("Invalid credentials.");
    }
  };

  // Toggle password visibility
  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  // Styling
  const paperStyle = { padding: 20, height: "60vh", width: 380, margin: "150px auto" };
  const avatarStyle = { backgroundColor: "#1bbd7e" };
  const btnStyle = { margin: "8px 0" };

  if (loading) {
    // Show a loading indicator while fetching data
    return <Typography>Loading...</Typography>;
  }

  return (
    <Grid>
      <Paper elevation={15} style={paperStyle}>
        <Grid align="center">
          <Avatar style={avatarStyle}>
            <LockOutlinedIcon />
          </Avatar>
          <h2>Sign In</h2>
        </Grid>
        <TextField
          label="Username"
          placeholder="Enter username"
          fullWidth
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
          onClick={handleSubmit}
        >
          Sign In
        </Button>
      </Paper>
    </Grid>
  );
};

export default Login;
