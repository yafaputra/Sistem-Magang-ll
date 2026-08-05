import { fetchAPI } from "@/lib/api";

export const login = async (email, password) => {
  return await fetchAPI("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
};

export const register = async (name, email, password, role) => {
  return await fetchAPI("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password, role }),
  });
};
