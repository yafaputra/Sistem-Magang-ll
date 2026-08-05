import { fetchAPI, getAuthHeaders } from "@/lib/api";

export const getPublicLowongan = async (limit = 100) => {
  return await fetchAPI(`/api/lowongan/public?limit=${limit}`);
};

export const getLowonganDetail = async (slug) => {
  return await fetchAPI(`/api/lowongan/public/${slug}`);
};

export const getAdminLowongan = async (paramsString) => {
  return await fetchAPI(`/api/admin/lowongan?${paramsString}`, {
    headers: { ...getAuthHeaders() },
  });
};

export const approveLowongan = async (id) => {
  return await fetchAPI(`/api/admin/lowongan/${id}/setujui`, {
    method: "PATCH",
    headers: { ...getAuthHeaders() },
  });
};

export const rejectLowongan = async (id, alasan) => {
  return await fetchAPI(`/api/admin/lowongan/${id}/tolak`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ alasan }),
  });
};

export const deleteLowongan = async (id, alasan) => {
  return await fetchAPI(`/api/admin/lowongan/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: alasan ? JSON.stringify({ alasan }) : undefined,
  });
};
