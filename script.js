let dataBengkel = JSON.parse(localStorage.getItem('otopos_data')) || {
    omsetHariIni: 0, daftarMekanik: [], daftarPart: [], riwayat: [], config: { namaBengkel: "Bengkel Maju Motor" }
};

let currentJenis = 'Perbaikan';

function saveData() { localStorage.setItem('otopos_data', JSON.stringify(dataBengkel)); }

function navigateTo(pageName) {
    document.body.className = `view-${pageName}`;
    document.getElementById('header-title').innerText = pageName.toUpperCase();
    if (pageName === 'kasir') { updateDropdownMekanik(); setJenis('Perbaikan'); }
    if (pageName === 'stok') renderStok();
    if (pageName === 'riwayat') renderRiwayat();
    if (pageName === 'mekanik') renderMekanik();
}

function setJenis(jenis) {
    currentJenis = jenis;
    
    // Tampilkan/Sembunyikan group-mekanik dan group-biaya
    document.getElementById('group-mekanik').style.display = (jenis === 'Perbaikan') ? 'block' : 'none';
    document.getElementById('group-biaya').style.display = (jenis === 'Perbaikan') ? 'block' : 'none';
    
    // Ubah warna tombol
    document.getElementById('btn-perbaikan').className = (jenis === 'Perbaikan') ? 'btn btn-primary' : 'btn btn-secondary';
    document.getElementById('btn-part').className = (jenis === 'Part') ? 'btn btn-primary' : 'btn btn-secondary';
}

function prosesTransaksi() {
    const nama = document.getElementById('kasir-nama').value;
    const biaya = (currentJenis === 'Perbaikan') ? parseInt(document.getElementById('kasir-biaya').value) : 0;
    
    if (!nama) return alert("Isi nama pelanggan!");
    
    // Simpan riwayat
    dataBengkel.riwayat.push({ nama, biaya, jenis: currentJenis, tanggal: new Date().toLocaleDateString() });
    saveData();
    alert("Transaksi Disimpan!");
    
    // Reset form
    document.getElementById('kasir-nama').value = '';
    document.getElementById('kasir-biaya').value = '';
}

// Fungsi Render
function renderStok() { document.getElementById('list-stok').innerHTML = dataBengkel.daftarPart.map(p => `<div class="card">${p.nama}</div>`).join(''); }
function renderRiwayat() { document.getElementById('list-riwayat').innerHTML = dataBengkel.riwayat.map(t => `<div class="card">${t.nama} (${t.jenis}) - Rp ${t.biaya}</div>`).join(''); }
function renderMekanik() { document.getElementById('list-mekanik').innerHTML = dataBengkel.daftarMekanik.map(m => `<div class="card">${m.nama}</div>`).join(''); }
function updateDropdownMekanik() { document.getElementById('kasir-mekanik').innerHTML = dataBengkel.daftarMekanik.map(m => `<option value="${m.nama}">${m.nama}</option>`).join(''); }
function simpanPengaturan() { dataBengkel.config.namaBengkel = document.getElementById('set-nama-bengkel').value; saveData(); alert("Tersimpan!"); }