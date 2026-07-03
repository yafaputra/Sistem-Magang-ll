export async function fetchAPI(endpoint, options = {}) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
            ...options,
            cache: "no-store",
        }
    );

    if (!res.ok) {
        let errorMessage = "Terjadi kesalahan";

        try {
            const err = await res.json();
            errorMessage = err.message || errorMessage;
        } catch {}

        throw new Error(errorMessage);
    }

    return res.json();
}

export function getAuthHeaders() {
    const token = localStorage.getItem("token");

    return {
        Authorization: token ?
            `Bearer ${token}` :
            "",
    };
}