import { fetchAPI, getAuthHeaders } from "@/lib/api";

export const getAdminStats = async () => {
  const headers = getAuthHeaders();
  const [lamaran, perusahaan, mahasiswaCount, verifikasi] = await Promise.all([
    fetchAPI("/api/lamaran?limit=500", { headers }),
    fetchAPI("/api/perusahaan/public"),
    fetchAPI("/api/mahasiswa/admin/mahasiswa/count", { headers }),
    fetchAPI("/api/verifikasi-perusahaan", { headers }),
  ]);
  return { lamaran, perusahaan, mahasiswaCount, verifikasi };
};

export const updateVerifikasiPerusahaanStatus = async (id, statusVerifikasi) => {
  return await fetchAPI(`/api/verifikasi-perusahaan/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ statusVerifikasi }),
  });
};

export const getAdminKonversiSKS = async (search = "", status = "") => {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (status) params.set("status", status);
  const queryString = params.toString() ? `?${params.toString()}` : "";
  return await fetchAPI(`/api/admin/persetujuan-konversi${queryString}`, {
    headers: { ...getAuthHeaders() },
  });
};

export const updateAdminKonversiSKSStatus = async (mkId, status, keterangan) => {
  return await fetchAPI(`/api/admin/persetujuan-konversi/${mkId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ status, keterangan }),
  });
};

export const getUsers = async (search = "", role = "", page = 1, limit = 10) => {
  const params = new URLSearchParams({ page, limit });
  if (search) params.set("search", search);
  if (role) params.set("role", role);
  return await fetchAPI(`/api/users?${params}`, {
    headers: { ...getAuthHeaders() },
  });
};

export const createUser = async (userData) => {
  return await fetchAPI("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(userData),
  });
};

export const updateUser = async (id, userData) => {
  return await fetchAPI(`/api/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(userData),
  });
};

export const deleteUser = async (id) => {
  return await fetchAPI(`/api/users/${id}`, {
    method: "DELETE",
    headers: { ...getAuthHeaders() },
  });
};

export const getPengajuanDosen = async () => {
  return await fetchAPI("/api/pengajuan-dosen", {
    headers: { ...getAuthHeaders() },
  });
};

export const tetapkanDosen = async (id, dosenId) => {
  return await fetchAPI(`/api/pengajuan-dosen/${id}/tetapkan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ dosenId }),
  });
};

export const sahkanPengajuanDosen = async (id) => {
  return await fetchAPI(`/api/pengajuan-dosen/${id}/sahkan`, {
    method: "POST",
    headers: { ...getAuthHeaders() },
  });
};
