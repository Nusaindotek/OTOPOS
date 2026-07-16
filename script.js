let dataBengkel = JSON.parse(localStorage.getItem('otopos_data')) || {
    omsetHariIni: 0, servisSelesai: 0, daftarMekanik: [], daftarPart: [], riwayat: [],
    config: { namaBengkel: "Bengkel Maju Motor" }
};

function saveData() { localStorage.setItem('otopos_data', JSON.stringify(dataBengkel)); }

function navigateTo(pageName) {
    document.body.className = `view-${pageName}`;
    document.getElementById('header-title').innerText = pageName.toUpperCase();
    if (pageName === 'stok') renderStok();
    if (pageName === 'riwayat') renderRiwayat();
    if (pageName === 'mekanik') renderMekanik();
}

// Logika Kasir Fleksibel
let currentJenis = 'Perbaikan';
function setJenis(jenis) {
    currentJenis = jenis;
    document.getElementById('btn-perbaikan').className = (jenis === 'Perbaikan') ? 'btn btn-primary' : 'btn btn-secondary';
    document.getElementById('btn-part').className = (jenis === 'Part') ? 'btn btn-primary' : 'btn btn-secondary';
    document.getElementById('group-mekanik').style.display = (jenis === 'Perbaikan') ? 'block' : 'none';
}

function prosesTransaksi() {
    const nama = document.getElementById('kasir-nama').value;
    const biaya = parseInt(document.getElementById('kasir-biaya').value);
    if (!nama || !biaya) return alert("Lengkapi data!");
    
    dataBengkel.omsetHariIni += biaya;
    dataBengkel.riwayat.push({ nama, biaya, jenis: currentJenis, tanggal: new Date().toLocaleDateString() });
    saveData();
    alert("Transaksi Berhasil!");
}

function tambahPart() {
    const nama = document.getElementById('input-nama-part').value;
    const harga = document.getElementById('input-harga-part').value;
    dataBengkel.daftarPart.push({ nama, harga });
    saveData();
    renderStok();
}

function renderStok() {
    document.getElementById('list-stok').innerHTML = dataBengkel.daftarPart.map(p => `<div class="card">${p.nama} - Rp ${p.harga}</div>`).join('');
}

function renderRiwayat() {
    document.getElementById('list-riwayat').innerHTML = dataBengkel.riwayat.map(t => `<div class="card">${t.nama} (${t.jenis}) - Rp ${t.biaya}</div>`).join('');
}

// Fungsi pendukung lainnya (simpanPengaturan, renderMekanik) tetap seperti sebelumnya.