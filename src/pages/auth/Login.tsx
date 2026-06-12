import axios from "axios";
import { useState } from "react";
import { useNavigate, Link as RouterLink, useLocation } from "react-router-dom";
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
  Divider,
  Avatar,
  Checkbox,
  FormControlLabel,
  Link,
  Snackbar,
} from "@mui/material";
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  School as SchoolIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
  SupervisorAccount as TeacherIcon,
} from "@mui/icons-material";
import { getProfile, login } from "../../services/auth.service";
import { saveAuth, saveUser } from "../../utils/auth";
import type { AuthPayload, UserRole } from "../../types/auth";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  // Check for registration success message
  const registrationMessage = location.state?.message;

  const redirectByRole = (role: UserRole) => {
    switch (role) {
      case "admin":
        navigate("/admin/dashboard");
        break;
      case "teacher":
        navigate("/teacher/dashboard");
        break;
      case "student":
        navigate("/student/dashboard");
        break;
      default:
        navigate("/login");
    }
  };

  const getErrorMessage = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const backendMessage =
        typeof error.response?.data === "object" &&
        error.response?.data &&
        "message" in error.response.data
          ? String(error.response.data.message)
          : "";

      if (error.response?.status === 401) {
        return backendMessage || "Unauthorized. Please login again.";
      }

      if (error.response?.status === 400 || error.response?.status === 404) {
        return backendMessage || "Invalid credentials. Please try again.";
      }

      if (error.response?.status && error.response.status >= 500) {
        return backendMessage || "Server is down. Please try again later.";
      }

      if (error.request) {
        return "Network error. Please check your connection or backend server.";
      }
    }

    return "Something went wrong. Please try again.";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = { email: "", password: "" };
    let isValid = true;

    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      console.log("Login response:", response);

      // Validate response shape: `login` should return ApiResponse<AuthPayload>
      if (!response || typeof response !== "object") {
        console.error(
          "Invalid login response type:",
          typeof response,
          response,
        );
        const contentPreview =
          typeof response === "string"
            ? String(response).slice(0, 500)
            : JSON.stringify(response ?? {}).slice(0, 500);
        throw new Error(
          `Invalid response from server (type=${typeof response}): ${contentPreview}`,
        );
      }

      if (!response.success) {
        throw new Error(response.message || "Login failed");
      }

      const authData: AuthPayload | undefined = (response as any).data;

      if (!authData || !authData.token) {
        throw new Error(
          response.message || "Authentication token missing in response",
        );
      }

      // Keep token and user in the chosen browser storage.
      saveAuth(authData.token, authData.user, rememberMe);
      const profileResponse = await getProfile();
      saveUser(profileResponse.data);

      setSnackbar({
        open: true,
        message: response.message,
        severity: "success",
      });

      redirectByRole(profileResponse.data.role);
    } catch (error) {
      console.error("Login error:", error);
      const message =
        error instanceof Error && error.message
          ? error.message
          : getErrorMessage(error);

      setSnackbar({
        open: true,
        message,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role: "admin" | "teacher" | "student") => {
    const demoCredentials = {
      admin: { email: "niladrip347@gmail.com", password: "Niladri@123" },
      teacher: { email: "sivani@gmail.com", password: "Sivani@123" },
      student: { email: "sujoy@gmail.com", password: "Sujoy@123" },
    };

    setFormData({
      email: demoCredentials[role].email,
      password: demoCredentials[role].password,
    });

    setSnackbar({
      open: true,
      message: `Demo credentials loaded for ${role} account`,
      severity: "success",
    });
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
                width: 70,
                height: 70,
                mx: "auto",
                mb: 2,
                background: "linear-gradient(135deg, #1976d2, #9c27b0)",
              }}
            >
              <SchoolIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography
              component="h1"
              variant="h4"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(45deg, #1976d2, #9c27b0)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Sign in to continue to Student Management System
            </Typography>
          </Box>

          {/* Registration Success Message */}
          {registrationMessage && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {registrationMessage}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
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
              sx={{ mb: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    color="primary"
                  />
                }
                label="Remember me"
              />
              <Link
                component={RouterLink}
                to="/forgot-password"
                variant="body2"
                underline="hover"
              >
                Forgot password?
              </Link>
            </Box>

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
                <>
                  <LoginIcon sx={{ mr: 1 }} />
                  Sign In
                </>
              )}
            </Button>

            {/* <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider> */}

            {/* Social Login Buttons */}
            {/* <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                sx={{ textTransform: "none" }}
              >
                Google
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FacebookIcon />}
                sx={{ textTransform: "none" }}
              >
                Facebook
              </Button>
            </Box> */}

            {/* Demo Accounts Section */}
            <Box sx={{ mt: 3, p: 2, bgcolor: "#f0f7ff", borderRadius: 2 }}>
              <Typography
                variant="subtitle2"
                fontWeight={600}
                gutterBottom
                align="center"
              >
                Demo Accounts
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<AdminIcon />}
                  onClick={() => handleDemoLogin("admin")}
                  sx={{ textTransform: "none" }}
                >
                  Admin
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<TeacherIcon />}
                  onClick={() => handleDemoLogin("teacher")}
                  sx={{ textTransform: "none" }}
                >
                  Teacher
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<PersonIcon />}
                  onClick={() => handleDemoLogin("student")}
                  sx={{ textTransform: "none" }}
                >
                  Student
                </Button>
              </Box>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                align="center"
                sx={{ mt: 1 }}
              >
                Click to auto-fill demo credentials
              </Typography>
            </Box>
          </form>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Don&apos;t have an account?
            </Typography>
            <Button
              component={RouterLink}
              to="/register"
              variant="text"
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Register Here
            </Button>
          </Box>
        </Paper>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
