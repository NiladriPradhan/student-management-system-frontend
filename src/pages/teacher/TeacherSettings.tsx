import { useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  TextField,
  Alert,
  Card,
  CardContent,
  IconButton,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tab,
  Tabs,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon,
  Person as PersonIcon,
  Delete as DeleteIcon,
  Backup as BackupIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Settings() {
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    assignmentAlerts: true,
    attendanceAlerts: true,
    gradeAlerts: true,
    systemUpdates: false,
    newsletter: true,
  });

  // Appearance Settings
  const [appearance, setAppearance] = useState({
    darkMode: false,
    compactView: false,
    fontSize: 16,
    primaryColor: "#1976d2",
    animations: true,
  });

  // Security Settings
  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: 30,
    deviceManagement: true,
  });

  // Language Settings
  const [language, setLanguage] = useState({
    appLanguage: "english",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h",
    timezone: "UTC+5:30",
  });

  // Privacy Settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: "teachers_only",
    showEmail: true,
    showPhone: false,
    dataSharing: false,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    setPasswordDialog(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleDeleteAccount = () => {
    setDeleteDialog(false);
    // Add delete account logic here
  };

  const handleExportData = () => {
    // Add export data logic here
    console.log("Exporting data...");
  };

  const handleImportData = () => {
    // Add import data logic here
    console.log("Importing data...");
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Manage your account preferences and system configurations.
      </Typography>

      <Paper sx={{ borderRadius: 3, boxShadow: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            px: 2,
            pt: 2,
            "& .MuiTab-root": { textTransform: "none", fontWeight: 500 },
          }}
        >
          <Tab icon={<NotificationsIcon />} label="Notifications" />
          <Tab icon={<PaletteIcon />} label="Appearance" />
          <Tab icon={<SecurityIcon />} label="Security" />
          <Tab icon={<LanguageIcon />} label="Language" />
          <Tab icon={<PersonIcon />} label="Privacy" />
          <Tab icon={<BackupIcon />} label="Data" />
        </Tabs>

        {/* Notifications Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ maxWidth: 600 }}>
            <Alert severity="info" sx={{ mb: 3 }}>
              Choose how you want to receive notifications.
            </Alert>

            <Typography variant="h6" fontWeight={600} gutterBottom>
              Notification Channels
            </Typography>
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications.emailNotifications}
                    onChange={() =>
                      setNotifications({
                        ...notifications,
                        emailNotifications: !notifications.emailNotifications,
                      })
                    }
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1">Email Notifications</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Receive notifications via email
                    </Typography>
                  </Box>
                }
                sx={{
                  mb: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  mx: 0,
                }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications.pushNotifications}
                    onChange={() =>
                      setNotifications({
                        ...notifications,
                        pushNotifications: !notifications.pushNotifications,
                      })
                    }
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1">Push Notifications</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Browser push notifications
                    </Typography>
                  </Box>
                }
                sx={{
                  mb: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  mx: 0,
                }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications.smsNotifications}
                    onChange={() =>
                      setNotifications({
                        ...notifications,
                        smsNotifications: !notifications.smsNotifications,
                      })
                    }
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1">SMS Notifications</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Text message alerts
                    </Typography>
                  </Box>
                }
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  mx: 0,
                }}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" fontWeight={600} gutterBottom>
              Alert Preferences
            </Typography>
            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications.assignmentAlerts}
                    onChange={() =>
                      setNotifications({
                        ...notifications,
                        assignmentAlerts: !notifications.assignmentAlerts,
                      })
                    }
                  />
                }
                label="Assignment Alerts"
                sx={{
                  mb: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  mx: 0,
                }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications.attendanceAlerts}
                    onChange={() =>
                      setNotifications({
                        ...notifications,
                        attendanceAlerts: !notifications.attendanceAlerts,
                      })
                    }
                  />
                }
                label="Attendance Alerts"
                sx={{
                  mb: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  mx: 0,
                }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications.gradeAlerts}
                    onChange={() =>
                      setNotifications({
                        ...notifications,
                        gradeAlerts: !notifications.gradeAlerts,
                      })
                    }
                  />
                }
                label="Grade Updates"
                sx={{
                  mb: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  mx: 0,
                }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications.systemUpdates}
                    onChange={() =>
                      setNotifications({
                        ...notifications,
                        systemUpdates: !notifications.systemUpdates,
                      })
                    }
                  />
                }
                label="System Updates"
                sx={{
                  mb: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  mx: 0,
                }}
              />
            </Box>

            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
              <Button variant="contained" startIcon={<SaveIcon />}>
                Save Changes
              </Button>
            </Box>
          </Box>
        </TabPanel>

        {/* Appearance Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ maxWidth: 600 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Theme Settings
            </Typography>
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={appearance.darkMode}
                    onChange={() =>
                      setAppearance({
                        ...appearance,
                        darkMode: !appearance.darkMode,
                      })
                    }
                  />
                }
                label="Dark Mode"
                sx={{
                  mb: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  mx: 0,
                }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={appearance.compactView}
                    onChange={() =>
                      setAppearance({
                        ...appearance,
                        compactView: !appearance.compactView,
                      })
                    }
                  />
                }
                label="Compact View"
                sx={{
                  mb: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  mx: 0,
                }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={appearance.animations}
                    onChange={() =>
                      setAppearance({
                        ...appearance,
                        animations: !appearance.animations,
                      })
                    }
                  />
                }
                label="Enable Animations"
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  mx: 0,
                }}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" fontWeight={600} gutterBottom>
              Font Size
            </Typography>
            <Box sx={{ px: 2, mb: 3 }}>
              <Slider
                value={appearance.fontSize}
                onChange={(_, value) =>
                  setAppearance({ ...appearance, fontSize: value as number })
                }
                min={12}
                max={24}
                step={1}
                marks={[
                  { value: 12, label: "Small" },
                  { value: 16, label: "Medium" },
                  { value: 20, label: "Large" },
                  { value: 24, label: "XL" },
                ]}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" fontWeight={600} gutterBottom>
              Primary Color
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              {["#1976d2", "#2e7d32", "#ed6c02", "#9c27b0", "#d32f2f"].map(
                (color) => (
                  <Box
                    key={color}
                    onClick={() =>
                      setAppearance({ ...appearance, primaryColor: color })
                    }
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      bgcolor: color,
                      cursor: "pointer",
                      border:
                        appearance.primaryColor === color
                          ? "3px solid #000"
                          : "none",
                      "&:hover": { opacity: 0.8 },
                    }}
                  />
                ),
              )}
            </Box>

            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
              <Button variant="contained" startIcon={<SaveIcon />}>
                Save Changes
              </Button>
            </Box>
          </Box>
        </TabPanel>

        {/* Security Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ maxWidth: 600 }}>
            <Card sx={{ mb: 3, bgcolor: "#f5f5f5" }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      Change Password
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Update your password regularly to keep your account secure
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    onClick={() => setPasswordDialog(true)}
                  >
                    Change
                  </Button>
                </Box>
              </CardContent>
            </Card>

            <Typography variant="h6" fontWeight={600} gutterBottom>
              Security Features
            </Typography>
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={security.twoFactorAuth}
                    onChange={() =>
                      setSecurity({
                        ...security,
                        twoFactorAuth: !security.twoFactorAuth,
                      })
                    }
                  />
                }
                label="Two-Factor Authentication"
                sx={{
                  mb: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  mx: 0,
                }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={security.loginAlerts}
                    onChange={() =>
                      setSecurity({
                        ...security,
                        loginAlerts: !security.loginAlerts,
                      })
                    }
                  />
                }
                label="Login Alerts"
                sx={{
                  mb: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  mx: 0,
                }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={security.deviceManagement}
                    onChange={() =>
                      setSecurity({
                        ...security,
                        deviceManagement: !security.deviceManagement,
                      })
                    }
                  />
                }
                label="Device Management"
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  mx: 0,
                }}
              />
            </Box>

            <Typography variant="h6" fontWeight={600} gutterBottom>
              Session Settings
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" gutterBottom>
                Auto logout after inactivity (minutes)
              </Typography>
              <Slider
                value={security.sessionTimeout}
                onChange={(_, value) =>
                  setSecurity({ ...security, sessionTimeout: value as number })
                }
                min={5}
                max={120}
                step={5}
                marks={[
                  { value: 15, label: "15m" },
                  { value: 30, label: "30m" },
                  { value: 60, label: "1h" },
                  { value: 120, label: "2h" },
                ]}
              />
            </Box>

            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
              <Button variant="contained" startIcon={<SaveIcon />}>
                Save Changes
              </Button>
            </Box>
          </Box>
        </TabPanel>

        {/* Language Tab */}
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ maxWidth: 600 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <InputLabel>App Language</InputLabel>
                  <Select
                    value={language.appLanguage}
                    label="App Language"
                    onChange={(e) =>
                      setLanguage({ ...language, appLanguage: e.target.value })
                    }
                  >
                    <MenuItem value="english">English</MenuItem>
                    <MenuItem value="spanish">Spanish</MenuItem>
                    <MenuItem value="french">French</MenuItem>
                    <MenuItem value="german">German</MenuItem>
                    <MenuItem value="hindi">Hindi</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <InputLabel>Date Format</InputLabel>
                  <Select
                    value={language.dateFormat}
                    label="Date Format"
                    onChange={(e) =>
                      setLanguage({ ...language, dateFormat: e.target.value })
                    }
                  >
                    <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                    <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                    <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <InputLabel>Time Format</InputLabel>
                  <Select
                    value={language.timeFormat}
                    label="Time Format"
                    onChange={(e) =>
                      setLanguage({ ...language, timeFormat: e.target.value })
                    }
                  >
                    <MenuItem value="12h">12-hour format</MenuItem>
                    <MenuItem value="24h">24-hour format</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <InputLabel>Timezone</InputLabel>
                  <Select
                    value={language.timezone}
                    label="Timezone"
                    onChange={(e) =>
                      setLanguage({ ...language, timezone: e.target.value })
                    }
                  >
                    <MenuItem value="UTC-8">Pacific Time (UTC-8)</MenuItem>
                    <MenuItem value="UTC-5">Eastern Time (UTC-5)</MenuItem>
                    <MenuItem value="UTC+0">GMT (UTC+0)</MenuItem>
                    <MenuItem value="UTC+1">Central European (UTC+1)</MenuItem>
                    <MenuItem value="UTC+5:30">
                      Indian Standard (UTC+5:30)
                    </MenuItem>
                    <MenuItem value="UTC+8">Singapore Time (UTC+8)</MenuItem>
                    <MenuItem value="UTC+9">Japan Time (UTC+9)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
              <Button variant="contained" startIcon={<SaveIcon />}>
                Save Changes
              </Button>
            </Box>
          </Box>
        </TabPanel>

        {/* Privacy Tab */}
        <TabPanel value={tabValue} index={4}>
          <Box sx={{ maxWidth: 600 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Profile Visibility
            </Typography>
            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Who can see your profile?</InputLabel>
                <Select
                  value={privacy.profileVisibility}
                  label="Who can see your profile?"
                  onChange={(e) =>
                    setPrivacy({
                      ...privacy,
                      profileVisibility: e.target.value,
                    })
                  }
                >
                  <MenuItem value="everyone">Everyone</MenuItem>
                  <MenuItem value="teachers_only">Teachers Only</MenuItem>
                  <MenuItem value="students_only">Students Only</MenuItem>
                  <MenuItem value="no_one">No One</MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Switch
                    checked={privacy.showEmail}
                    onChange={() =>
                      setPrivacy({ ...privacy, showEmail: !privacy.showEmail })
                    }
                  />
                }
                label="Show Email Address"
                sx={{
                  mb: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  mx: 0,
                }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={privacy.showPhone}
                    onChange={() =>
                      setPrivacy({ ...privacy, showPhone: !privacy.showPhone })
                    }
                  />
                }
                label="Show Phone Number"
                sx={{
                  mb: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  mx: 0,
                }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={privacy.dataSharing}
                    onChange={() =>
                      setPrivacy({
                        ...privacy,
                        dataSharing: !privacy.dataSharing,
                      })
                    }
                  />
                }
                label="Share data for analytics"
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  mx: 0,
                }}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography
              variant="h6"
              fontWeight={600}
              gutterBottom
              color="error"
            >
              Danger Zone
            </Typography>
            <Card sx={{ border: "1px solid #f44336", bgcolor: "#ffebee" }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      color="error"
                    >
                      Delete Account
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Permanently delete your account and all data
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => setDeleteDialog(true)}
                  >
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>

            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
              <Button variant="contained" startIcon={<SaveIcon />}>
                Save Changes
              </Button>
            </Box>
          </Box>
        </TabPanel>

        {/* Data Tab */}
        <TabPanel value={tabValue} index={5}>
          <Box sx={{ maxWidth: 600 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Data Management
            </Typography>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Export Data
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Download all your data in JSON or CSV format
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={handleExportData}
                  >
                    Export
                  </Button>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Import Data
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Import data from backup file
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    startIcon={<UploadIcon />}
                    onClick={handleImportData}
                  >
                    Import
                  </Button>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Backup Data
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Create a manual backup of your data
                    </Typography>
                  </Box>
                  <Button variant="outlined" startIcon={<BackupIcon />}>
                    Backup Now
                  </Button>
                </Box>
              </CardContent>
            </Card>

            <Alert severity="warning">
              <Typography variant="body2">
                <strong>Note:</strong> Data exports include all your personal
                information, grades, and activity history. Please keep your
                exported files secure.
              </Typography>
            </Alert>
          </Box>
        </TabPanel>
      </Paper>

      {/* Change Password Dialog */}
      <Dialog
        open={passwordDialog}
        onClose={() => setPasswordDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Change Password
          <IconButton
            sx={{ position: "absolute", right: 8, top: 8 }}
            onClick={() => setPasswordDialog(false)}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              type="password"
              label="Current Password"
              fullWidth
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value,
                })
              }
            />
            <TextField
              type={showPassword ? "text" : "password"}
              label="New Password"
              fullWidth
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                ),
              }}
            />
            <TextField
              type={showPassword ? "text" : "password"}
              label="Confirm New Password"
              fullWidth
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handlePasswordChange}>
            Update Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle color="error">
          Delete Account
          <IconButton
            sx={{ position: "absolute", right: 8, top: 8 }}
            onClick={() => setDeleteDialog(false)}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight={600}>
              Warning: This action cannot be undone!
            </Typography>
          </Alert>
          <Typography variant="body2" gutterBottom>
            Are you sure you want to delete your account? This will permanently
            remove:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="All your personal information" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Grades and attendance records" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Messages and notifications" />
            </ListItem>
          </List>
          <TextField
            label="Type 'DELETE' to confirm"
            fullWidth
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
