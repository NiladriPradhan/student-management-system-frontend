import { useEffect, useEffectEvent, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Skeleton,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import {
  Forum as ForumIcon,
  Groups as GroupsIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { getApiErrorMessage } from "../../services/api";
import { getStudentMessages } from "../../services/message.service";
import type { Message } from "../../types/message";

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

export default function StudentMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success" as "success" | "error",
    message: "",
  });

  const loadMessages = async () => {
    setLoading(true);
    setError("");

    try {
      setMessages(await getStudentMessages());
    } catch (loadError) {
      const message = getApiErrorMessage(loadError);
      setError(message);
      setSnackbar({ open: true, severity: "error", message });
    } finally {
      setLoading(false);
    }
  };

  const loadMessagesEvent = useEffectEvent(loadMessages);

  useEffect(() => {
    void loadMessagesEvent();
  }, []);

  const messageCounts = useMemo(
    () => ({
      class: messages.filter((item) => item.message_type === "class").length,
      direct: messages.filter((item) => item.message_type === "direct").length,
    }),
    [messages],
  );

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
            View class announcements and direct messages from teachers.
          </Typography>
        </Box>
        <Button variant="outlined" onClick={() => void loadMessages()}>
          Refresh
        </Button>
      </Stack>

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
              Inbox
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
            Array.from({ length: 5 }).map((_, index) => (
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
                No messages yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Teacher announcements and direct notes will appear here.
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
                    color={item.message_type === "direct" ? "primary" : "default"}
                    label={
                      item.message_type === "direct"
                        ? "Direct message"
                        : "Class announcement"
                    }
                  />
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {item.sender_name || "Teacher"} - {getClassLabel(item)} -{" "}
                  {formatDate(item.created_at)}
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                  {item.message}
                </Typography>
              </Box>
            ))
          )}
        </Stack>
      </Paper>

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
