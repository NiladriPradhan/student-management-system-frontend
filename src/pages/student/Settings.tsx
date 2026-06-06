// StudentSettings.tsx
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
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
} from "@mui/icons-material";

export default function StudentSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    darkMode: false,
    twoFactorAuth: false,
  });

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Settings
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          Customize your account preferences and notification settings.
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
          <Button variant="outlined" sx={{ mt: 2 }}>
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

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Button variant="contained">Save Settings</Button>
        </Box>
      </Paper>
    </Box>
  );
}
