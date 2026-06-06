import { useEffect, useState } from "react";
import { getProfile } from "../services/auth.service";
import { getUser, saveUser } from "../utils/auth";
import type { AuthUser } from "../types/auth";

export const getDisplayName = (
  user: AuthUser | null,
  fallback = "User",
  loading = false,
) => {
  if (loading && !user) {
    return "Loading...";
  }

  return user?.name || user?.username || fallback;
};

export const useCurrentUser = () => {
  const [user, setUser] = useState<AuthUser | null>(() => getUser());
  const [loading, setLoading] = useState(!getUser()?.name);

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        const response = await getProfile();
        saveUser(response.data);

        if (mounted) {
          setUser(response.data);
        }
      } catch {
        if (mounted) {
          setUser(getUser());
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  return { user, loading };
};
