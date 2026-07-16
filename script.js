// Data Default
let dataBengkel = JSON.parse(localStorage.getItem('otopos_data')) || {
    omsetHariIni: 0,
    servisSelesai: 0,
    daftarMekanik: [],
    config: { namaBengkel: "Bengkel Maju Motor", logoUrl: "", footerStruk: "Terima Kasih" }
};

function saveData() { localStorage.setItem('otopos_data', JSON.stringify(dataBengkel)); }

// Navigasi
function navigateTo(pageName) {
    document.body.className = `view-${pageName}`;
    document.getElementById('header-title').innerText = pageName.toUpperCase();
    if (pageName === 'setting') loadPengaturanKeForm();
    if (pageName === 'mekanik') renderMekanik();
}

// Fitur Pengaturan
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

// Fitur Mekanik
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

// Init
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('display-nama-bengkel').innerText = dataBengkel.config.namaBengkel;
    renderMekanik();
});