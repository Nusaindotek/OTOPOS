// 1. FUNGSI LOAD DATA (Jika belum ada, gunakan data awal)
function loadData() {
    const savedData = localStorage.getItem('otopos_data');
    if (savedData) {
        return JSON.parse(savedData);
    } else {
        // Data default jika aplikasi baru pertama kali dibuka
        return {
            omsetHariIni: 0,
            saldoAktif: 0,
            servisSelesai: 0,
            kendaraanDiproses: 0,
            antreanLapangan: []
        };
    }
}

// Inisialisasi variabel global
let dataBengkel = loadData();

// 2. FUNGSI SAVE DATA (Dipanggil setiap ada perubahan data)
function saveData() {
    localStorage.setItem('otopos_data', JSON.stringify(dataBengkel));
}

// 3. UPDATE FUNGSI REFRESH (Ditambahkan saveData di dalamnya)
function refreshTampilanDashboard() {
    document.getElementById('stat-omset').innerText = ubahKeFormatRupiah(dataBengkel.omsetHariIni);
    document.getElementById('stat-selesai').innerText = dataBengkel.servisSelesai;
    document.getElementById('stat-proses').innerText = `${dataBengkel.kendaraanDiproses} Kendaraan`;
    
    // Sinkronisasi ke bagian Laporan jika ada
    const lapOmset = document.getElementById('laporan-total-omset');
    if (lapOmset) lapOmset.innerText = ubahKeFormatRupiah(dataBengkel.omsetHariIni);
    
    const lapSaldo = document.getElementById('laporan-saldo-aktif');
    if (lapSaldo) lapSaldo.innerText = ubahKeFormatRupiah(dataBengkel.saldoAktif);
    
    // Pastikan data tersimpan di browser setiap kali tampilan di-refresh
    saveData(); 
}

// Contoh implementasi di fungsi transaksi:
function prosesPembayaran() {
    // ... (kode sebelumnya) ...
    
    dataBengkel.omsetHariIni += totalBayar;
    dataBengkel.saldoAktif += totalBayar;
    
    // Setelah semua perubahan data:
    saveData(); 
    refreshTampilanDashboard();
    // ...
}