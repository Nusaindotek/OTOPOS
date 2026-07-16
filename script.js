// State internal database penampung data
let dataBengkel = {
    omsetHariIni: 330000,
    saldoAktif: 330000,
    servisSelesai: 2,
    kendaraanDiproses: 0,
    antreanLapangan: []
};

// Format Rupiah
function ubahKeFormatRupiah(nominal) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(nominal).replace(/,00$/, '');
}

// Sinkronisasi data ke tampilan
function refreshTampilanDashboard() {
    document.getElementById('stat-omset').innerText = ubahKeFormatRupiah(dataBengkel.omsetHariIni);
    document.getElementById('stat-selesai').innerText = dataBengkel.servisSelesai;
    document.getElementById('stat-proses').innerText = `${dataBengkel.kendaraanDiproses} Kendaraan`;
    
    const lapOmset = document.getElementById('laporan-total-omset');
    if (lapOmset) lapOmset.innerText = ubahKeFormatRupiah(dataBengkel.omsetHariIni);
    
    const lapSaldo = document.getElementById('laporan-saldo-aktif');
    if (lapSaldo) lapSaldo.innerText = ubahKeFormatRupiah(dataBengkel.saldoAktif);

    const lapJumlah = document.getElementById('laporan-jumlah-transaksi');
    if (lapJumlah) lapJumlah.innerText = `Jumlah Transaksi: ${dataBengkel.servisSelesai}`;
}

// Navigasi SPA
function navigateTo(pageName) {
    document.body.className = `view-${pageName}`;
    
    const titleNode = document.getElementById('header-title');
    if (pageName === 'home') titleNode.innerText = 'HOME';
    else if (pageName === 'kasir') titleNode.innerText = 'KASIR';
    else if (pageName === 'laporan') titleNode.innerText = 'LAPORAN';
    else if (pageName === 'servis') titleNode.innerText = 'SERVIS LAPANGAN';
    else if (pageName === 'riwayat') titleNode.innerText = 'RIWAYAT TRANSAKSI';
    else if (pageName === 'part') titleNode.innerText = 'SUKU CADANG';
    else if (pageName === 'mekanik') titleNode.innerText = 'MEKANIK';
    else if (pageName === 'setting') titleNode.innerText = 'PENGATURAN';
    
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const currentNav = document.getElementById(`nav-${pageName}`);
    if (currentNav) currentNav.classList.add('active');

    if (pageName === 'kasir') {
        sinkronisasiDropdownKasir();
    }
}

// Tambah Antrean
function prosesTambahKendaraan() {
    const nodeNopol = document.getElementById('input-nopol');
    const nodeMotor = document.getElementById('input-motor');
    
    const nopolValue = nodeNopol.value.trim();
    const motorValue = nodeMotor.value.trim();
    
    if (!nopolValue || !motorValue) {
        alert('Pastikan Nomor Polisi dan Tipe Motor sudah terisi.');
        return;
    }
    
    const dataUnit = {
        id: Date.now(),
        nopol: nopolValue.toUpperCase(),
        motor: motorValue,
        status: 'Sedang Dikerjakan'
    };
    
    dataBengkel.antreanLapangan.push(dataUnit);
    dataBengkel.kendaraanDiproses++;
    
    nodeNopol.value = '';
    nodeMotor.value = '';
    
    refreshTampilanDashboard();
    renderDaftarAntreanLapangan();
    alert(`Unit ${dataUnit.nopol} berhasil didaftarkan.`);
}

// Render Antrean Lapangan
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

// Dropdown Kasir
function sinkronisasiDropdownKasir() {
    const dropdown = document.getElementById('kasir-pilih-antrean');
    if (!dropdown) return;
    
    dropdown.innerHTML = '<option value="">-- Hubungkan dengan Plat Nomor --</option>';
    
    dataBengkel.antreanLapangan.forEach(unit => {
        dropdown.innerHTML += `<option value="${unit.id}">${unit.nopol} (${unit.motor})</option>`;
    });
}

// Tarik Saldo Owner
function tarikSaldoOwner() {
    let inputNominal = prompt(`Total Saldo di Kasir: ${ubahKeFormatRupiah(dataBengkel.saldoAktif)}\n\nMasukkan nominal uang yang ingin ditarik (hanya angka):`);
    
    if (inputNominal !== null && inputNominal !== "") {
        let nominalTarik = parseInt(inputNominal);
        
        if (isNaN(nominalTarik) || nominalTarik <= 0) {
            alert("Nominal tidak valid! Harap masukkan angka yang benar.");
            return;
        }
        
        if (nominalTarik > dataBengkel.saldoAktif) {
            alert("Gagal! Saldo di kasir tidak mencukupi untuk penarikan ini.");
            return;
        }
        
        dataBengkel.saldoAktif -= nominalTarik;
        refreshTampilanDashboard();
        alert(`Berhasil menarik uang sebesar ${ubahKeFormatRupiah(nominalTarik)} dari kasir.`);
    }
}

// Proses Pembayaran Kasir
function prosesPembayaran() {
    const dropdown = document.getElementById('kasir-pilih-antrean');
    const selectedId = dropdown.value;
    
    if (!selectedId) {
        alert('Silakan pilih salah satu kendaraan antrean yang akan dibayar!');
        return;
    }
    
    const kendaraan = dataBengkel.antreanLapangan.find(unit => unit.id === parseInt(selectedId));
    const totalBayar = 75000; // Simulasi harga
    
    dataBengkel.antreanLapangan = dataBengkel.antreanLapangan.filter(unit => unit.id !== parseInt(selectedId));
    dataBengkel.kendaraanDiproses--;
    dataBengkel.servisSelesai++;
    dataBengkel.omsetHariIni += totalBayar;
    dataBengkel.saldoAktif += totalBayar;
    
    refreshTampilanDashboard();
    renderDaftarAntreanLapangan();
    sinkronisasiDropdownKasir();
    
    cetakStruk(kendaraan, totalBayar);
    navigateTo('home');
}

// Cetak Struk Thermal
function cetakStruk(dataKendaraan, totalBayar) {
    const areaStruk = document.getElementById('area-struk-print');
    let tanggal = new Date().toLocaleString('id-ID');
    
    areaStruk.innerHTML = `
        <div class="struk-header">
            <h3>BENGKEL MAJU MOTOR</h3>
            <p>Telp: 628886225629</p>
            <p>${tanggal}</p>
        </div>
        <div class="struk-garis"></div>
        <p>No. Polisi : ${dataKendaraan.nopol}</p>
        <p>Kendaraan  : ${dataKendaraan.motor}</p>
        <div class="struk-garis"></div>
        <div class="struk-item">
            <span>1x Jasa Servis Ringan</span>
            <span>Rp 35.000</span>
        </div>
        <div class="struk-item">
            <span>1x Oli Mesin Standar</span>
            <span>Rp 40.000</span>
        </div>
        <div class="struk-garis"></div>
        <div class="struk-total">
            TOTAL: ${ubahKeFormatRupiah(totalBayar)}
        </div>
        <div class="struk-garis"></div>
        <div class="struk-footer">
            <p>Terima Kasih atas Kunjungan Anda!</p>
            <p>Barang yang dibeli tidak dapat ditukar</p>
        </div>
    `;
    
    window.print();
}

// Inisialisasi Aplikasi
document.addEventListener('DOMContentLoaded', () => {
    refreshTampilanDashboard();
    renderDaftarAntreanLapangan();
});