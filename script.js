// State internal database penampung data sementara aplikasi
let dataBengkel = {
    omsetHariIni: 330000,
    servisSelesai: 2,
    kendaraanDiproses: 0,
    antreanLapangan: []
};

// Fungsi memformat angka biasa menjadi format mata uang Rupiah yang teratur
function ubahKeFormatRupiah(nominal) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(nominal).replace(/,00$/, '');
}

// Sinkronisasi data dari variabel state ke antarmuka DOM Dashboard
function refreshTampilanDashboard() {
    document.getElementById('stat-omset').innerText = ubahKeFormatRupiah(dataBengkel.omsetHariIni);
    document.getElementById('stat-selesai').innerText = dataBengkel.servisSelesai;
    document.getElementById('stat-proses').innerText = `${dataBengkel.kendaraanDiproses} Kendaraan`;
    
    // Perbarui halaman laporan juga agar sinkron
    const lapOmset = document.getElementById('laporan-total-omset');
    if (lapOmset) lapOmset.innerText = ubahKeFormatRupiah(dataBengkel.omsetHariIni);
}

// Logika sistem Single Page Application (SPA) untuk berpindah menu utama
function navigateTo(pageName) {
    // Ubah kelas penanda pada body untuk trigger CSS
    document.body.className = `view-${pageName}`;
    
    // Sinkronisasi teks judul pada Top Bar Header
    const titleNode = document.getElementById('header-title');
    if (pageName === 'home') titleNode.innerText = 'HOME';
    else if (pageName === 'kasir') titleNode.innerText = 'KASIR';
    else if (pageName === 'laporan') titleNode.innerText = 'LAPORAN';
    else if (pageName === 'servis') titleNode.innerText = 'SERVIS LAPANGAN';
    
    // Mengatur status highlight tombol aktif pada navigasi bawah
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const currentNav = document.getElementById(`nav-${pageName}`);
    if (currentNav) currentNav.classList.add('active');

    // Jika masuk ke halaman kasir, bangun ulang pilihan daftar antrean terupdate
    if (pageName === 'kasir') {
        sinkronisasiDropdownKasir();
    }
}

// Memasukkan entri unit servis baru dari lapangan ke sistem antrean
function prosesTambahKendaraan() {
    const nodeNopol = document.getElementById('input-nopol');
    const nodeMotor = document.getElementById('input-motor');
    
    const nopolValue = nodeNopol.value.trim();
    const motorValue = nodeMotor.value.trim();
    
    if (!nopolValue || !motorValue) {
        alert('Gagal memproses! Pastikan Nomor Polisi dan Tipe Motor sudah terisi.');
        return;
    }
    
    // Skema objek data kendaraan baru
    const dataUnit = {
        id: Date.now(),
        nopol: nopolValue.toUpperCase(),
        motor: motorValue,
        status: 'Sedang Dikerjakan'
    };
    
    dataBengkel.antreanLapangan.push(dataUnit);
    dataBengkel.kendaraanDiproses++;
    
    // Pengosongan kolom input setelah sukses submit
    nodeNopol.value = '';
    nodeMotor.value = '';
    
    refreshTampilanDashboard();
    renderDaftarAntreanLapangan();
    alert(`Unit ${dataUnit.nopol} berhasil didaftarkan.`);
}

// Membangun ulang list elemen HTML daftar antrean di lapangan
function renderDaftarAntreanLapangan() {
    const listContainer = document.getElementById('wrapper-antrean-lapangan');
    if (!listContainer) return;
    
    listContainer.innerHTML = '<h4 style="margin-top:20px; margin-bottom:10px;">Daftar Lapangan Aktif:</h4>';
    
    if (dataBengkel.antreanLapangan.length === 0) {
        listContainer.innerHTML += '<p style="color:#64748b; font-size:13px;">Tidak ada kendaraan yang sedang ditangani saat ini.</p>';
        return;
    }
    
    dataBengkel.antreanLapangan.forEach(unit => {
        listContainer.innerHTML += `
            <div class="card" style="margin-top:8px; padding:12px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <strong style="font-size:15px; color:#1e293b;">${unit.nopol}</strong>
                    <div style="font-size:12px; color:#64748b;">${unit.motor}</div>
                </div>
                <span style="font-size:11px; background:#ffedd5; color:#ea580c; padding:4px 8px; border-radius:4px; font-weight:600;">
                    ${unit.status}
                </span>
            </div>
        `;
    });
}

// Mengisi pilihan dropdown di halaman kasir berdasarkan kendaraan yang ada di lapangan
function sinkronisasiDropdownKasir() {
    const dropdown = document.getElementById('kasir-pilih-antrean');
    if (!dropdown) return;
    
    dropdown.innerHTML = '<option value="">-- Hubungkan dengan Plat Nomor --</option>';
    
    dataBengkel.antreanLapangan.forEach(unit => {
        dropdown.innerHTML += `<option value="${unit.id}">${unit.nopol} (${unit.motor})</option>`;
    });
}

// Simulasi tombol selesaikan pembayaran di kasir
function prosesPembayaran() {
    const dropdown = document.getElementById('kasir-pilih-antrean');
    const selectedId = dropdown.value;
    
    if (!selectedId) {
        alert('Silakan pilih salah satu kendaraan antrean yang akan dibayar!');
        return;
    }
    
    // Hapus kendaraan dari list antrean aktif
    dataBengkel.antreanLapangan = dataBengkel.antreanLapangan.filter(unit => unit.id !== parseInt(selectedId));
    
    // Update data kalkulasi nominal
    dataBengkel.kendaraanDiproses--;
    dataBengkel.servisSelesai++;
    dataBengkel.omsetHariIni += 75000; // Asumsi simulasi penambahan nilai omset per transaksi masuk
    
    refreshTampilanDashboard();
    renderDaftarAntreanLapangan();
    sinkronisasiDropdownKasir();
    
    alert('Pembayaran sukses diproses. Struk transaksi berhasil disimpan ke sistem.');
    navigateTo('home');
}

// Pengaktifan fungsi utama saat struktur halaman web selesai dimuat penuh oleh peramban
document.addEventListener('DOMContentLoaded', () => {
    refreshTampilanDashboard();
    renderDaftarAntreanLapangan();
});