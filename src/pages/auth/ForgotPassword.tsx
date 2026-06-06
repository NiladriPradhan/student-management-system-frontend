import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
  Avatar,
} from '@mui/material';
import {
  Email as EmailIcon,
  ArrowBack as ArrowBackIcon,
  Send as SendIcon,
  LockReset as LockResetIcon,
} from '@mui/icons-material';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateForm = () => {
    if (!email) {
      setErrors('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors('Please enter a valid email address');
      return false;
    }
    setErrors('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // API call to your backend
      // const response = await fetch('/api/auth/forgot-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitted(true);
      
    } catch (err) {
      setErrors('Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Container component="main" maxWidth="sm">
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
            <LockResetIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Check Your Email
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              We've sent a password reset link to <strong>{email}</strong>
            </Typography>
            <Button component={RouterLink} to="/login" variant="contained">
              Back to Login
            </Button>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper sx={{ p: 4, borderRadius: 3, width: '100%' }}>
          <IconButton component={RouterLink} to="/login" sx={{ mb: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: '#1976d2' }}>
              <LockResetIcon />
            </Avatar>
            <Typography variant="h5" fontWeight={600}>
              Forgot Password?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Enter your email address and we'll send you a link to reset your password.
            </Typography>
          </Box>

          {errors && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errors}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} /> : (
                <>
                  <SendIcon sx={{ mr: 1 }} />
                  Send Reset Link
                </>
              )}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}