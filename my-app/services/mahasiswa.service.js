import { fetchAPI, getAuthHeaders } from "@/lib/api";

export const getMahasiswaProfile = async () => {
  return await fetchAPI("/api/mahasiswa/profile", {
    headers: { ...getAuthHeaders() },
  });
};

export const updateMahasiswaProfile = async (profileData) => {
  return await fetchAPI("/api/mahasiswa/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(profileData),
  });
};

export const uploadProfileFoto = async (formData) => {
  return await fetchAPI("/api/mahasiswa/profile/foto", {
    method: "POST",
    headers: { ...getAuthHeaders() },
    body: formData,
  });
};

export const getMyLamaran = async () => {
  return await fetchAPI("/api/lamaran/mahasiswa", {
    headers: { ...getAuthHeaders() },
  });
};

export const submitLamaran = async (lamaranData) => {
  return await fetchAPI("/api/lamaran", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(lamaranData),
  });
};

export const deleteLamaran = async (id) => {
  return await fetchAPI(`/api/lamaran/${id}`, {
    method: "DELETE",
    headers: { ...getAuthHeaders() },
  });
};

export const confirmLamaran = async (id, status) => {
  return await fetchAPI(`/api/lamaran/${id}/konfirmasi`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ status }),
  });
};

export const getLaporanInfoAktif = async () => {
  return await fetchAPI("/api/laporan-magang/info-aktif", {
    headers: { ...getAuthHeaders() },
  });
};

export const getLaporanHistory = async () => {
  return await fetchAPI("/api/laporan-magang/mahasiswa", {
    headers: { ...getAuthHeaders() },
  });
};

export const getKonversiSKS = async (status) => {
  const query = status ? `?status=${status}` : "";
  return await fetchAPI(`/api/konversi-sks${query}`, {
    headers: { ...getAuthHeaders() },
  });
};

export const submitKonversiSKS = async (data) => {
  return await fetchAPI("/api/konversi-sks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });
};

export const getMyPengajuanDosen = async () => {
  return await fetchAPI("/api/pengajuan-dosen/saya", {
    headers: { ...getAuthHeaders() },
  });
};

export const submitPengajuanDosen = async (data) => {
  return await fetchAPI("/api/pengajuan-dosen", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });
};
