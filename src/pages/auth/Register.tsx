import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Divider,
  Avatar,
  Snackbar,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  HowToReg as RegisterIcon,
} from "@mui/icons-material";
import { api, getApiErrorMessage } from "../../services/api";

const roles = [
  { value: "admin", label: "Admin" },
  { value: "teacher", label: "Teacher" },
  { value: "student", label: "Student" },
];

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username?.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const payload = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      };

      const response = await api.post("/auth/register.php", payload);

      setSnackbar({
        open: true,
        message: response.data.message || "Registered successfully",
        severity: "success",
      });

      setTimeout(() => {
        navigate("/login", {
          state: { message: "Registration successful. Please login." },
        });
      }, 1500);
    } catch (error) {
      const msg = getApiErrorMessage(error);
      setErrors((prev) => ({ ...prev, submit: msg }));
      setSnackbar({ open: true, message: msg, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, sm: 4 },
            width: "100%",
            borderRadius: 3,
            background: "linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)",
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Avatar
              sx={{
                width: 60,
                height: 60,
                mx: "auto",
                mb: 2,
                background: "linear-gradient(135deg, #1976d2, #9c27b0)",
              }}
            >
              <RegisterIcon sx={{ fontSize: 35 }} />
            </Avatar>
            <Typography
              component="h1"
              variant="h4"
              sx={{
                fontWeight: 600,
                background: "linear-gradient(45deg, #1976d2, #9c27b0)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Join the Student Management System
            </Typography>
          </Box>

          {errors.submit && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errors.submit}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={!!errors.username}
              helperText={errors.username}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Register as</InputLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleSelectChange}
                label="Register as"
              >
                {roles.map((role) => (
                  <MenuItem key={role.value} value={role.value}>
                    {role.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.5,
                mb: 2,
                background: "linear-gradient(45deg, #1976d2, #9c27b0)",
                "&:hover": {
                  background: "linear-gradient(45deg, #1565c0, #7b1fa2)",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Register"
              )}
            </Button>
          </form>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{" "}
              <Button
                component={RouterLink}
                to="/login"
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                Sign In
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
