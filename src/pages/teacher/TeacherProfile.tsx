import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  Alert,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon,
} from "@mui/icons-material";

export default function TeacherSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    assignmentAlerts: true,
    attendanceAlerts: true,
    darkMode: false,
    twoFactorAuth: false,
    language: "english",
    timezone: "UTC-5",
  });

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Settings
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          Configure your account preferences and notification settings.
        </Alert>

        <Typography variant="h6" fontWeight={600} gutterBottom>
          <NotificationsIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          Notification Preferences
        </Typography>
        <Box sx={{ ml: 4, mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.emailNotifications}
                onChange={() =>
                  setSettings({
                    ...settings,
                    emailNotifications: !settings.emailNotifications,
                  })
                }
              />
            }
            label="Email Notifications"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.smsNotifications}
                onChange={() =>
                  setSettings({
                    ...settings,
                    smsNotifications: !settings.smsNotifications,
                  })
                }
              />
            }
            label="SMS Notifications"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.assignmentAlerts}
                onChange={() =>
                  setSettings({
                    ...settings,
                    assignmentAlerts: !settings.assignmentAlerts,
                  })
                }
              />
            }
            label="Assignment Submission Alerts"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.attendanceAlerts}
                onChange={() =>
                  setSettings({
                    ...settings,
                    attendanceAlerts: !settings.attendanceAlerts,
                  })
                }
              />
            }
            label="Attendance Reports"
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" fontWeight={600} gutterBottom>
          <SecurityIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          Security Settings
        </Typography>
        <Box sx={{ ml: 4, mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.twoFactorAuth}
                onChange={() =>
                  setSettings({
                    ...settings,
                    twoFactorAuth: !settings.twoFactorAuth,
                  })
                }
              />
            }
            label="Two-Factor Authentication"
          />
          <Button variant="outlined" sx={{ mt: 2, display: "block" }}>
            Change Password
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" fontWeight={600} gutterBottom>
          <PaletteIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          Appearance
        </Typography>
        <Box sx={{ ml: 4, mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.darkMode}
                onChange={() =>
                  setSettings({ ...settings, darkMode: !settings.darkMode })
                }
              />
            }
            label="Dark Mode"
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" fontWeight={600} gutterBottom>
          <LanguageIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          Language & Region
        </Typography>
        <Box sx={{ ml: 4, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Language</InputLabel>
                <Select
                  value={settings.language}
                  label="Language"
                  onChange={(e) =>
                    setSettings({ ...settings, language: e.target.value })
                  }
                >
                  <MenuItem value="english">English</MenuItem>
                  <MenuItem value="spanish">Spanish</MenuItem>
                  <MenuItem value="french">French</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Timezone</InputLabel>
                <Select
                  value={settings.timezone}
                  label="Timezone"
                  onChange={(e) =>
                    setSettings({ ...settings, timezone: e.target.value })
                  }
                >
                  <MenuItem value="UTC-5">Eastern Time (UTC-5)</MenuItem>
                  <MenuItem value="UTC-6">Central Time (UTC-6)</MenuItem>
                  <MenuItem value="UTC-7">Mountain Time (UTC-7)</MenuItem>
                  <MenuItem value="UTC-8">Pacific Time (UTC-8)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Button variant="contained">Save Settings</Button>
        </Box>
      </Paper>
    </Box>
  );
}
