 const formatRupiah = (angka) => {
    if (!angka) return "-";
    const num = parseInt(angka);
    if (isNaN(num)) return angka;
    return "Rp " + num.toLocaleString("id-ID");
  };

export default formatRupiah;
