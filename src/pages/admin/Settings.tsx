import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Card,
  CardContent,
} from "@mui/material";
import {
  Save as SaveIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Palette as PaletteIcon,
  Settings as SettingsIcon,
  Language as LanguageIcon,
} from "@mui/icons-material";

export default function Settings() {
  const [settings, setSettings] = useState({
    siteName: "Student Management System",
    adminEmail: "admin@school.com",
    timezone: "UTC+5:30",
    dateFormat: "DD/MM/YYYY",
    emailNotifications: true,
    smsNotifications: false,
    darkMode: false,
    twoFactorAuth: true,
  });

  const handleChange = (field: string) => (event: any) => {
    setSettings({ ...settings, [field]: event.target.value });
  };

  const handleToggle =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setSettings({ ...settings, [field]: event.target.checked });
    };

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        System Settings
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <SettingsIcon />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Settings Menu
                </Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<PaletteIcon />}
                  fullWidth
                >
                  General Settings
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<SecurityIcon />}
                  fullWidth
                >
                  Security
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<NotificationsIcon />}
                  fullWidth
                >
                  Notifications
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<LanguageIcon />}
                  fullWidth
                >
                  Localization
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              General Settings
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              Configure your system settings below.
            </Alert>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Site Name"
                  value={settings.siteName}
                  onChange={handleChange("siteName")}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Admin Email"
                  type="email"
                  value={settings.adminEmail}
                  onChange={handleChange("adminEmail")}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Timezone"
                  value={settings.timezone}
                  onChange={handleChange("timezone")}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Date Format"
                  value={settings.dateFormat}
                  onChange={handleChange("dateFormat")}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" fontWeight={600} gutterBottom>
              Notification Settings
            </Typography>
            <Box sx={{ mb: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.emailNotifications}
                    onChange={handleToggle("emailNotifications")}
                  />
                }
                label="Email Notifications"
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.smsNotifications}
                    onChange={handleToggle("smsNotifications")}
                  />
                }
                label="SMS Notifications"
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" fontWeight={600} gutterBottom>
              Security Settings
            </Typography>
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.twoFactorAuth}
                    onChange={handleToggle("twoFactorAuth")}
                  />
                }
                label="Two-Factor Authentication"
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 3,
              }}
            >
              <Button variant="outlined">Cancel</Button>
              <Button variant="contained" startIcon={<SaveIcon />}>
                Save Changes
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
