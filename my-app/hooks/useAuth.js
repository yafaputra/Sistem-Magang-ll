"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function useAuth(requiredRole) {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const rawUser = localStorage.getItem("user");

        // Belum login sama sekali
        if (!token || !rawUser) {
            router.push("/masuk?mode=login"); // ← sesuaikan dengan route login kamu
            return;
        }

        let user;
        try {
            user = JSON.parse(rawUser);
        } catch {
            // Data localStorage korup → bersihkan dan paksa login ulang
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            router.push("/masuk");
            return;
        }

        // Role tidak sesuai → redirect ke dashboard yang benar
        if (requiredRole && user.role !== requiredRole) {
            const routes = {
                mahasiswa: "/dashboard-mahasiswa/",
                dosen: "/dashboard-dosen/",
                admin: "/dashboard-admin-prodi/",
                perusahaan: "/dashboard-perusahaan/",
            };
            router.push(routes[user.role] || "/masuk");
        }
    }, [router, requiredRole]);
}