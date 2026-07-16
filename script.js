let dataBengkel = JSON.parse(localStorage.getItem('otopos_data')) || {
    omsetHariIni: 0,
    servisSelesai: 0,
    daftarMekanik: [],
    config: { namaBengkel: "Bengkel Maju Motor", logoUrl: "", footerStruk: "Terima Kasih" }
};

function saveData() { localStorage.setItem('otopos_data', JSON.stringify(dataBengkel)); }

function refreshDashboard() {
    document.getElementById('stat-omset').innerText = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(dataBengkel.omsetHariIni).replace(/,00$/, '');
    document.getElementById('stat-selesai').innerText = dataBengkel.servisSelesai;
}

function navigateTo(pageName) {
    document.body.className = `view-${pageName}`;
    document.getElementById('header-title').innerText = pageName.toUpperCase();
    if (pageName === 'setting') loadPengaturanKeForm();
    if (pageName === 'mekanik') renderMekanik();
    if (pageName === 'kasir') updateDropdownMekanik();
}

// FUNGSI KASIR
function updateDropdownMekanik() {
    const select = document.getElementById('kasir-mekanik');
    select.innerHTML = dataBengkel.daftarMekanik.map(m => `<option value="${m.nama}">${m.nama}</option>`).join('');
}

function prosesTransaksi() {
    const nama = document.getElementById('kasir-nama').value;
    const biaya = parseInt(document.getElementById('kasir-biaya').value);
    const mekanik = document.getElementById('kasir-mekanik').value;
    if (!nama || !biaya || !mekanik) return alert("Lengkapi data transaksi!");
    
    dataBengkel.omsetHariIni += biaya;
    dataBengkel.servisSelesai += 1;
    saveData();
    alert("Transaksi Berhasil!");
    document.getElementById('kasir-nama').value = '';
    document.getElementById('kasir-biaya').value = '';
    refreshDashboard();
}

// FUNGSI LAINNYA
function simpanPengaturan() {
    dataBengkel.config = {
        namaBengkel: document.getElementById('set-nama-bengkel').value,
        logoUrl: document.getElementById('set-logo').value,
        footerStruk: document.getElementById('set-footer').value
    };
    saveData();
    document.getElementById('display-nama-bengkel').innerText = dataBengkel.config.namaBengkel;
    alert("Pengaturan tersimpan!");
}

function loadPengaturanKeForm() {
    document.getElementById('set-nama-bengkel').value = dataBengkel.config.namaBengkel;
    document.getElementById('set-logo').value = dataBengkel.config.logoUrl;
    document.getElementById('set-footer').value = dataBengkel.config.footerStruk;
}

function tambahMekanik() {
    const input = document.getElementById('input-nama-mekanik');
    if (!input.value) return;
    dataBengkel.daftarMekanik.push({ id: Date.now(), nama: input.value });
    input.value = '';
    saveData();
    renderMekanik();
}

function renderMekanik() {
    const container = document.getElementById('list-mekanik');
    container.innerHTML = dataBengkel.daftarMekanik.map(m => `<div class="card">${m.nama}</div>`).join('');
}

function hubungiCS() { window.location.href = "mailto:nusaindoteknologi@gmail.com?subject=Dukungan Teknis OTOPOS"; }

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('display-nama-bengkel').innerText = dataBengkel.config.namaBengkel;
    refreshDashboard();
    renderMekanik();
});