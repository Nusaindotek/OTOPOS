// Navigasi Pindah Halaman
function navigateTo(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// Logika Kasir (Toggle Tampilan)
function setMode(mode) {
    document.getElementById('tab-perbaikan').classList.toggle('active-tab', mode === 'Perbaikan');
    document.getElementById('tab-part').classList.toggle('active-tab', mode === 'Part');
    
    // Tampilkan/Sembunyikan Field
    const isPerbaikan = (mode === 'Perbaikan');
    document.getElementById('group-mekanik').style.display = isPerbaikan ? 'block' : 'none';
    document.getElementById('group-biaya').style.display = isPerbaikan ? 'block' : 'none';
    
    window.currentMode = mode;
}

// Simpan Data
function simpanTransaksi() {
    alert("Transaksi tersimpan!");
}

// Jalankan mode awal saat buka aplikasi
setMode('Perbaikan');