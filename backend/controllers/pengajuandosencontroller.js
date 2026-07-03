// controllers/pengajuanDosenController.js
const prisma = require("../config/prisma");
const createAuditLog = require("../utils/auditLog");

/* ═══════════════════════════════════════════════════════════════
   HELPER — tambah riwayat status
═══════════════════════════════════════════════════════════════ */
async function addRiwayat(pengajuanId, status, keterangan, userId, role) {
  return prisma.riwayatStatusPengajuan.create({
    data: {
      pengajuanId,
      status,
      keterangan: keterangan || null,
      changedById: userId || null,
      changedByRole: role || null,
    },
  });
}

/* ═══════════════════════════════════════════════════════════════
   HELPER — kirim notifikasi
═══════════════════════════════════════════════════════════════ */
async function kirimNotifikasi(userId, lamaranId, judul, pesan) {
  try {
    await prisma.notifikasi.create({
      data: { userId, lamaranId, judul, pesan, dibaca: false },
    });
  } catch (e) {
    console.error("NOTIF ERROR:", e.message);
  }
}

/* ═══════════════════════════════════════════════════════════════
   MAHASISWA — Buat pengajuan dosen pembimbing
   POST /api/pengajuan-dosen
   Body: { lamaranId, dosenUsulanId?, alasanMemilih, catatanTambahan? }
═══════════════════════════════════════════════════════════════ */
exports.buatPengajuan = async (req, res) => {
  try {
    const { lamaranId, dosenUsulanId, alasanMemilih, catatanTambahan } = req.body;

    if (!lamaranId || !alasanMemilih) {
      return res.status(400).json({ message: "lamaranId dan alasanMemilih wajib diisi" });
    }

    const mahasiswa = await prisma.mahasiswa.findUnique({
      where: { userId: Number(req.user.id) },
    });
    if (!mahasiswa) {
      return res.status(404).json({ message: "Profil mahasiswa tidak ditemukan" });
    }

    // Cek lamaran milik mahasiswa & status KONFIRMASI_DITERIMA
    const lamaran = await prisma.lamaran.findUnique({
      where: { id: Number(lamaranId) },
      include: { lowongan: { include: { perusahaan: true } } },
    });
    if (!lamaran) return res.status(404).json({ message: "Lamaran tidak ditemukan" });
    if (lamaran.mahasiswaId !== mahasiswa.id) return res.status(403).json({ message: "Akses ditolak" });
    if (lamaran.status !== "KONFIRMASI_DITERIMA") {
      return res.status(400).json({
        code: "STATUS_NOT_ELIGIBLE",
        message: "Pengajuan dosen pembimbing hanya dapat dilakukan setelah status magang KONFIRMASI_DITERIMA.",
      });
    }

    // Cek apakah sudah ada pengajuan (selain DITOLAK_DOSEN yang perlu re-assign)
    const existing = await prisma.pengajuanDosenPembimbing.findUnique({
      where: { lamaranId: Number(lamaranId) },
    });
    if (existing && existing.status !== "DITOLAK_DOSEN") {
      return res.status(400).json({
        code: "ALREADY_SUBMITTED",
        message: "Pengajuan dosen pembimbing untuk magang ini sudah ada.",
      });
    }

    let pengajuan;
    if (existing) {
      // Re-submit setelah ditolak dosen
      pengajuan = await prisma.pengajuanDosenPembimbing.update({
        where: { id: existing.id },
        data: {
          dosenUsulanId: dosenUsulanId ? Number(dosenUsulanId) : null,
          dosenDitetapkanId: null,
          alasanMemilih,
          catatanTambahan: catatanTambahan || null,
          status: "MENUNGGU_VERIFIKASI_PRODI",
          alasanPenolakan: null,
        },
      });
    } else {
      pengajuan = await prisma.pengajuanDosenPembimbing.create({
        data: {
          lamaranId: Number(lamaranId),
          mahasiswaId: mahasiswa.id,
          dosenUsulanId: dosenUsulanId ? Number(dosenUsulanId) : null,
          alasanMemilih,
          catatanTambahan: catatanTambahan || null,
          status: "MENUNGGU_VERIFIKASI_PRODI",
        },
      });
    }

    await addRiwayat(pengajuan.id, "MENUNGGU_VERIFIKASI_PRODI", "Pengajuan dosen pembimbing dikirim oleh mahasiswa", req.user.id, "mahasiswa");

    // Notifikasi ke admin (userId 1 sebagai placeholder — di prod cari admin prodi)
    await kirimNotifikasi(req.user.id, Number(lamaranId), "Pengajuan Dosen Pembimbing Terkirim",
      `Pengajuan dosen pembimbing untuk magang di ${lamaran.lowongan?.perusahaan?.nama} telah dikirim dan menunggu verifikasi prodi.`);

    try {
      await createAuditLog({ req, user: req.user, action: "BUAT_PENGAJUAN_DOSEN", description: `Mahasiswa mengajukan dosen pembimbing untuk lamaran #${lamaranId}`, module: "PengajuanDosen", status: "BERHASIL" });
    } catch (e) { console.error("AUDIT:", e.message); }

    return res.status(201).json({ message: "Pengajuan dosen pembimbing berhasil dikirim", data: pengajuan });
  } catch (error) {
    console.error("ERROR BUAT PENGAJUAN:", error);
    return res.status(500).json({ message: "Gagal membuat pengajuan", error: error.message });
  }
};

/* ═══════════════════════════════════════════════════════════════
   MAHASISWA — Ambil pengajuan milik saya
   GET /api/pengajuan-dosen/saya
═══════════════════════════════════════════════════════════════ */
exports.getPengajuanSaya = async (req, res) => {
  try {
    const mahasiswa = await prisma.mahasiswa.findUnique({ where: { userId: Number(req.user.id) } });
    if (!mahasiswa) return res.json({ data: [] });

    const data = await prisma.pengajuanDosenPembimbing.findMany({
      where: { mahasiswaId: mahasiswa.id },
      include: {
        lamaran: { include: { lowongan: { include: { perusahaan: true } } } },
        dosenUsulan: { include: { user: { select: { name: true } } } },
        dosenDitetapkan: { include: { user: { select: { name: true } } } },
        riwayatStatus: { orderBy: { createdAt: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ data });
  } catch (error) {
    return res.status(500).json({ message: "Gagal mengambil data", error: error.message });
  }
};

/* ═══════════════════════════════════════════════════════════════
   ADMIN PRODI — Ambil semua pengajuan
   GET /api/pengajuan-dosen
═══════════════════════════════════════════════════════════════ */
exports.getAllPengajuan = async (req, res) => {
  try {
    const { status, search } = req.query;
    const where = {};
    if (status && status !== "semua") where.status = status;

    const data = await prisma.pengajuanDosenPembimbing.findMany({
      where,
      include: {
        mahasiswa: { include: { user: { select: { name: true, email: true } } } },
        lamaran: { include: { lowongan: { include: { perusahaan: true } } } },
        dosenUsulan: { include: { user: { select: { name: true } } } },
        dosenDitetapkan: { include: { user: { select: { name: true } } } },
        riwayatStatus: { orderBy: { createdAt: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    });

    const filtered = search
      ? data.filter((d) => {
          const q = search.toLowerCase();
          return (
            d.mahasiswa?.user?.name?.toLowerCase().includes(q) ||
            d.lamaran?.lowongan?.perusahaan?.nama?.toLowerCase().includes(q)
          );
        })
      : data;

    return res.json({ data: filtered });
  } catch (error) {
    return res.status(500).json({ message: "Gagal mengambil data", error: error.message });
  }
};

/* ═══════════════════════════════════════════════════════════════
   ADMIN PRODI — Tetapkan / setujui dosen pembimbing
   PATCH /api/pengajuan-dosen/:id/tetapkan
   Body: { dosenDitetapkanId, catatanProdi? }
═══════════════════════════════════════════════════════════════ */
exports.tetapkanDosen = async (req, res) => {
  try {
    const { id } = req.params;
    const { dosenDitetapkanId, catatanProdi } = req.body;

    if (!dosenDitetapkanId) {
      return res.status(400).json({ message: "dosenDitetapkanId wajib diisi" });
    }

    const pengajuan = await prisma.pengajuanDosenPembimbing.findUnique({
      where: { id: Number(id) },
      include: {
        mahasiswa: { include: { user: true } },
        lamaran: { include: { lowongan: { include: { perusahaan: true } } } },
      },
    });
    if (!pengajuan) return res.status(404).json({ message: "Pengajuan tidak ditemukan" });

    const dosen = await prisma.dosen.findUnique({ where: { id: Number(dosenDitetapkanId) }, include: { user: true } });
    if (!dosen) return res.status(404).json({ message: "Dosen tidak ditemukan" });

    const updated = await prisma.pengajuanDosenPembimbing.update({
      where: { id: Number(id) },
      data: {
        dosenDitetapkanId: Number(dosenDitetapkanId),
        status: "MENUNGGU_PERSETUJUAN_DOSEN",
        catatanProdi: catatanProdi || null,
      },
    });

    // Update dosenPembimbingId di lamaran
    await prisma.lamaran.update({
      where: { id: pengajuan.lamaranId },
      data: { dosenPembimbingId: Number(dosenDitetapkanId) },
    });

    await addRiwayat(pengajuan.id, "MENUNGGU_PERSETUJUAN_DOSEN", `Dosen ditetapkan oleh admin prodi: ${dosen.user?.name}`, req.user.id, "admin");

    // Notifikasi ke mahasiswa
    await kirimNotifikasi(pengajuan.mahasiswa.userId, pengajuan.lamaranId, "Dosen Pembimbing Ditetapkan",
      `Dosen pembimbing Anda telah ditetapkan: ${dosen.user?.name}. Menunggu persetujuan dosen.`);

    // Notifikasi ke dosen
    await kirimNotifikasi(dosen.userId, pengajuan.lamaranId, "Permohonan Bimbingan Magang",
      `Anda mendapat permohonan bimbingan magang dari ${pengajuan.mahasiswa.user?.name} (${pengajuan.lamaran?.lowongan?.perusahaan?.nama}).`);

    return res.json({ message: "Dosen pembimbing berhasil ditetapkan", data: updated });
  } catch (error) {
    return res.status(500).json({ message: "Gagal menetapkan dosen", error: error.message });
  }
};

/* ═══════════════════════════════════════════════════════════════
   DOSEN — Ambil daftar permohonan bimbingan
   GET /api/pengajuan-dosen/dosen/permohonan
═══════════════════════════════════════════════════════════════ */
exports.getPermohonanDosen = async (req, res) => {
  try {
    const dosen = await prisma.dosen.findUnique({ where: { userId: Number(req.user.id) } });
    if (!dosen) return res.status(404).json({ message: "Profil dosen tidak ditemukan" });

    const data = await prisma.pengajuanDosenPembimbing.findMany({
      where: { dosenDitetapkanId: dosen.id },
      include: {
        mahasiswa: { include: { user: { select: { name: true, email: true } } } },
        lamaran: { include: { lowongan: { include: { perusahaan: true } } } },
        riwayatStatus: { orderBy: { createdAt: "asc" } },
      },
      orderBy: { updatedAt: "desc" },
    });

    return res.json({ data });
  } catch (error) {
    return res.status(500).json({ message: "Gagal mengambil data", error: error.message });
  }
};

/* ═══════════════════════════════════════════════════════════════
   DOSEN — Setujui permohonan bimbingan
   PATCH /api/pengajuan-dosen/:id/setujui
═══════════════════════════════════════════════════════════════ */
exports.setujuiPermohonan = async (req, res) => {
  try {
    const { id } = req.params;
    const dosen = await prisma.dosen.findUnique({ where: { userId: Number(req.user.id) } });

    const pengajuan = await prisma.pengajuanDosenPembimbing.findUnique({
      where: { id: Number(id) },
      include: {
        mahasiswa: { include: { user: true } },
        lamaran: { include: { lowongan: { include: { perusahaan: true } } } },
      },
    });
    if (!pengajuan) return res.status(404).json({ message: "Pengajuan tidak ditemukan" });
    if (pengajuan.dosenDitetapkanId !== dosen.id) return res.status(403).json({ message: "Akses ditolak" });

    const updated = await prisma.pengajuanDosenPembimbing.update({
      where: { id: Number(id) },
      data: { status: "BIMBINGAN_AKTIF" },
    });

    await addRiwayat(pengajuan.id, "BIMBINGAN_AKTIF", "Permohonan bimbingan disetujui oleh dosen", req.user.id, "dosen");

    await kirimNotifikasi(pengajuan.mahasiswa.userId, pengajuan.lamaranId, "Bimbingan Magang Disetujui",
      `Dosen pembimbing ${dosen.name || ""} telah menyetujui permohonan bimbingan magang Anda. Selamat!`);

    return res.json({ message: "Permohonan bimbingan berhasil disetujui", data: updated });
  } catch (error) {
    return res.status(500).json({ message: "Gagal menyetujui permohonan", error: error.message });
  }
};

/* ═══════════════════════════════════════════════════════════════
   DOSEN — Tolak permohonan bimbingan
   PATCH /api/pengajuan-dosen/:id/tolak
   Body: { alasanPenolakan }
═══════════════════════════════════════════════════════════════ */
exports.tolakPermohonan = async (req, res) => {
  try {
    const { id } = req.params;
    const { alasanPenolakan } = req.body;

    if (!alasanPenolakan?.trim()) {
      return res.status(400).json({ message: "Alasan penolakan wajib diisi" });
    }

    const dosen = await prisma.dosen.findUnique({ where: { userId: Number(req.user.id) }, include: { user: true } });
    const pengajuan = await prisma.pengajuanDosenPembimbing.findUnique({
      where: { id: Number(id) },
      include: {
        mahasiswa: { include: { user: true } },
        lamaran: { include: { lowongan: { include: { perusahaan: true } } } },
      },
    });
    if (!pengajuan) return res.status(404).json({ message: "Pengajuan tidak ditemukan" });
    if (pengajuan.dosenDitetapkanId !== dosen.id) return res.status(403).json({ message: "Akses ditolak" });

    const updated = await prisma.pengajuanDosenPembimbing.update({
      where: { id: Number(id) },
      data: {
        status: "DITOLAK_DOSEN",
        alasanPenolakan: alasanPenolakan.trim(),
        dosenDitetapkanId: null,
      },
    });

    // Reset dosenPembimbingId di lamaran
    await prisma.lamaran.update({
      where: { id: pengajuan.lamaranId },
      data: { dosenPembimbingId: null },
    });

    await addRiwayat(pengajuan.id, "DITOLAK_DOSEN", `Ditolak oleh dosen. Alasan: ${alasanPenolakan}`, req.user.id, "dosen");

    // Notifikasi mahasiswa
    await kirimNotifikasi(pengajuan.mahasiswa.userId, pengajuan.lamaranId, "Permohonan Bimbingan Ditolak Dosen",
      `Dosen ${dosen.user?.name} menolak permohonan bimbingan. Alasan: ${alasanPenolakan}. Admin prodi akan menetapkan dosen lain.`);

    return res.json({ message: "Permohonan berhasil ditolak", data: updated });
  } catch (error) {
    return res.status(500).json({ message: "Gagal menolak permohonan", error: error.message });
  }
};