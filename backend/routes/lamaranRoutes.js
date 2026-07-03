const express = require("express");
const router = express.Router();

const lamaranController = require("../controllers/lamaranController");
const { verifyToken } = require("../middleware/authMiddleware");
const uploadLamaran = require("../middleware/uploadLamaran");

// GET semua lamaran milik mahasiswa yang login
router.get(
    "/mahasiswa",
    verifyToken,
    lamaranController.getLamaranByMahasiswa
);

// POST buat lamaran baru
router.post(
    "/",
    verifyToken,
    uploadLamaran.fields([
        { name: "cv", maxCount: 1 },
        { name: "coverLetter", maxCount: 1 },
        { name: "transcript", maxCount: 1 },
    ]),
    lamaranController.createLamaran
);

// GET semua lamaran (admin / perusahaan)
router.get(
    "/",
    verifyToken,
    lamaranController.getLamaran
);

// GET detail lamaran by ID
router.get(
    "/:id",
    verifyToken,
    lamaranController.getLamaranById
);

// PATCH update status lamaran (oleh admin / perusahaan)
router.patch(
    "/:id/status",
    verifyToken,
    lamaranController.updateStatusLamaran
);

// PATCH konfirmasi penerimaan magang (oleh mahasiswa)
// Body: { konfirmasi: true }  → status jadi KONFIRMASI_DITERIMA
// Body: { konfirmasi: false } → status jadi DITOLAK (batalkan sendiri)
router.patch(
    "/:id/konfirmasi",
    verifyToken,
    lamaranController.konfirmasiPenerimaanMagang
);

// DELETE hapus / batalkan lamaran
router.delete(
    "/:id",
    verifyToken,
    lamaranController.deleteLamaran
);

module.exports = router;