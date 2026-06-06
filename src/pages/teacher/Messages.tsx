import { useEffect, useEffectEvent, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Skeleton,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  Forum as ForumIcon,
  Groups as GroupsIcon,
  Person as PersonIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { getApiErrorMessage } from "../../services/api";
import {
  getClasses,
  getTeacherStudents,
} from "../../services/classes.service";
import {
  getTeacherMessages,
  sendMessage,
} from "../../services/message.service";
import type { Class as SchoolClass } from "../../types/classes";
import type { Message } from "../../types/message";
import type { Student } from "../../types/student";

const initialForm = {
  class_id: 0,
  receiver_id: "",
  subject: "",
  message: "",
};

const formatDate = (value: string) => {
  if (!value) {
    return "N/A";
  }

  return new Date(value).toLocaleString("default", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const getClassLabel = (message: Message) =>
  `${message.class_name || "Class"}${message.section ? ` - ${message.section}` : ""}`;

export default function TeacherMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [formValues, setFormValues] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [studentLoading, setStudentLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success" as "success" | "error",
    message: "",
  });

  const showSnackbar = (
    message: string,
    severity: "success" | "error" = "success",
  ) => {
    setSnackbar({ open: true, severity, message });
  };

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [messageList, classList] = await Promise.all([
        getTeacherMessages(),
        getClasses(),
      ]);

      setMessages(messageList);
      setClasses(classList.classes);
    } catch (loadError) {
      const message = getApiErrorMessage(loadError);
      setError(message);
      showSnackbar(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const loadDataEvent = useEffectEvent(loadData);

  useEffect(() => {
    void loadDataEvent();
  }, []);

  useEffect(() => {
    if (!formValues.class_id) {
      setStudents([]);
      return;
    }

    let isCurrent = true;
    setStudentLoading(true);

    getTeacherStudents(formValues.class_id)
      .then((items) => {
        if (isCurrent) {
          setStudents(items);
        }
      })
      .catch((studentError) => {
        if (isCurrent) {
          showSnackbar(getApiErrorMessage(studentError), "error");
          setStudents([]);
        }
      })
      .finally(() => {
        if (isCurrent) {
          setStudentLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [formValues.class_id]);

  const messageCounts = useMemo(
    () => ({
      class: messages.filter((item) => item.message_type === "class").length,
      direct: messages.filter((item) => item.message_type === "direct").length,
    }),
    [messages],
  );

  const handleClassChange = (classId: number) => {
    setFormValues((prev) => ({
      ...prev,
      class_id: classId,
      receiver_id: "",
    }));
    setFormError("");
  };

  const handleSend = async () => {
    const subject = formValues.subject.trim();
    const message = formValues.message.trim();

    if (!formValues.class_id || !subject || !message) {
      setFormError("Class, subject, and message are required.");
      return;
    }

    setSubmitLoading(true);
    setFormError("");

    try {
      await sendMessage({
        class_id: formValues.class_id,
        receiver_id: formValues.receiver_id
          ? Number(formValues.receiver_id)
          : null,
        subject,
        message,
      });

      setFormValues((prev) => ({
        ...initialForm,
        class_id: prev.class_id,
      }));
      showSnackbar("Message sent successfully.");
      await loadData();
    } catch (sendError) {
      const messageText = getApiErrorMessage(sendError);
      setFormError(messageText);
      showSnackbar(messageText, "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <ForumIcon color="primary" />
            <Typography variant="h4" fontWeight={700}>
              Messages
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Send class announcements or direct notes to students.
          </Typography>
        </Box>
        <Button variant="outlined" onClick={() => void loadData()}>
          Refresh
        </Button>
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Compose Message
            </Typography>
            <Stack spacing={2}>
              <TextField
                select
                label="Class"
                value={formValues.class_id}
                onChange={(event) => handleClassChange(Number(event.target.value))}
                fullWidth
                required
              >
                <MenuItem value={0}>Select class</MenuItem>
                {classes.map((classItem) => (
                  <MenuItem key={classItem.id} value={classItem.id}>
                    {classItem.class_name}
                    {classItem.section ? ` - ${classItem.section}` : ""}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Recipient"
                value={formValues.receiver_id}
                onChange={(event) =>
                  setFormValues((prev) => ({
                    ...prev,
                    receiver_id: event.target.value,
                  }))
                }
                fullWidth
                disabled={!formValues.class_id || studentLoading}
                helperText="Leave as entire class for announcements."
              >
                <MenuItem value="">Entire class</MenuItem>
                {students.map((student) => (
                  <MenuItem key={student.id} value={student.id}>
                    {student.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Subject"
                value={formValues.subject}
                onChange={(event) =>
                  setFormValues((prev) => ({
                    ...prev,
                    subject: event.target.value,
                  }))
                }
                inputProps={{ maxLength: 255 }}
                fullWidth
                required
              />
              <TextField
                label="Message"
                value={formValues.message}
                onChange={(event) =>
                  setFormValues((prev) => ({
                    ...prev,
                    message: event.target.value,
                  }))
                }
                multiline
                minRows={6}
                fullWidth
                required
              />
              {formError ? <Alert severity="error">{formError}</Alert> : null}
              <Button
                variant="contained"
                startIcon={<SendIcon />}
                onClick={handleSend}
                disabled={submitLoading}
              >
                Send Message
              </Button>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={1}
              sx={{ mb: 2 }}
            >
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Sent Messages
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {messages.length} total messages
                </Typography>
              </Box>
              <Stack direction="row" spacing={1}>
                <Chip icon={<GroupsIcon />} label={`${messageCounts.class} class`} />
                <Chip icon={<PersonIcon />} label={`${messageCounts.direct} direct`} />
              </Stack>
            </Stack>

            {error ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            ) : null}

            <Stack spacing={2} divider={<Divider flexItem />}>
              {loading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <Box key={index}>
                    <Skeleton width="45%" height={28} />
                    <Skeleton width="100%" height={22} />
                    <Skeleton width="65%" height={22} />
                  </Box>
                ))
              ) : messages.length === 0 ? (
                <Box sx={{ py: 7, textAlign: "center" }}>
                  <ForumIcon color="disabled" sx={{ fontSize: 48, mb: 1 }} />
                  <Typography variant="h6" fontWeight={600}>
                    No messages sent yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Class announcements and direct messages will appear here.
                  </Typography>
                </Box>
              ) : (
                messages.map((item) => (
                  <Box key={item.id}>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      justifyContent="space-between"
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      spacing={1}
                    >
                      <Typography variant="subtitle1" fontWeight={700}>
                        {item.subject}
                      </Typography>
                      <Chip
                        size="small"
                        color={item.message_type === "class" ? "primary" : "default"}
                        label={
                          item.message_type === "class"
                            ? "Entire class"
                            : item.receiver_name || "Direct"
                        }
                      />
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {getClassLabel(item)} - {formatDate(item.created_at)}
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                      {item.message}
                    </Typography>
                  </Box>
                ))
              )}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
