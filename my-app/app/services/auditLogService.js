import { fetchAPI, getAuthHeaders } from "@/lib/api";

export const getAuditLogs = async(
    page,
    search,
    module,
    status
) => {
    const params = new URLSearchParams({
        page,
        limit: 10,
    });

    if (search) params.set("search", search);

    if (module !== "Semua Modul") {
        params.set("module", module);
    }

    if (status !== "Semua Status") {
        params.set("status", status);
    }

    return await fetchAPI(
        `/api/audit-logs?${params}`, {
            headers: {
                ...getAuthHeaders(),
            },
        }
    );
};

export const exportAuditLogs = async(
    search,
    module,
    status
) => {
    const params = new URLSearchParams({
        page: 1,
        limit: 99999,
    });

    if (search) params.set("search", search);

    if (module !== "Semua Modul") {
        params.set("module", module);
    }

    if (status !== "Semua Status") {
        params.set("status", status);
    }

    return await fetchAPI(
        `/api/audit-logs?${params}`, {
            headers: {
                ...getAuthHeaders(),
            },
        }
    );
};