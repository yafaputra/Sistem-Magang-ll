import { fetchAPI, getAuthHeaders } from "@/lib/api";

export const getDosenList = async () => {
  return await fetchAPI("/api/dosen", {
    headers: { ...getAuthHeaders() },
  });
};
