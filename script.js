// 1. Inisialisasi Data dari LocalStorage (Offline Persistence)
function loadData() {
    const savedData = localStorage.getItem('otopos_data');
    if (savedData) {
        return JSON.parse(savedData);
    } else {
        return {
            omsetHariIni: 0,
            servisSelesai: 0,
            kendaraanDiproses: 0,
            antreanLapangan: [],
            daftarMekanik: []
        };
    }
}

let dataBengkel = loadData();

// 2. Fungsi Simpan Data
function saveData() {
    localStorage.setItem('otopos_data', JSON.stringify(dataBengkel));
}

// 3. Fungsi Refresh UI
function refreshTampilanDashboard() {
    const elOmset = document.getElementById('stat-omset');
    const elSelesai = document.getElementById('stat-selesai');
    
    if (elOmset) elOmset.innerText = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(dataBengkel.omsetHariIni).replace(/,00$/, '');
    if (elSelesai) elSelesai.innerText = dataBengkel.servisSelesai;
    
    saveData();
}

// 4. Navigasi
function navigateTo(pageName) {
    document.body.className = `view-${pageName}`;
    document.getElementById('header-title').innerText = pageName.toUpperCase();
    
    if (pageName === 'mekanik') renderMekanik();
}

// 5. Fitur Mekanik
function tambahMekanik() {
    const input = document.getElementById('input-nama-mekanik');
    if (!input.value) return alert("Masukkan nama mekanik!");
    
    dataBengkel.daftarMekanik.push({
        id: Date.now(),
        nama: input.value,
        totalServis: 0
    });
    
    input.value = '';
    saveData();
    renderMekanik();
}

function renderMekanik() {
    const container = document.getElementById('list-mekanik');
    container.innerHTML = '';
    dataBengkel.daftarMekanik.forEach(m => {
        container.innerHTML += `<div class="card">${m.nama} <small>(${m.totalServis} servis)</small></div>`;
    });
}

// 6. Fitur CS
function hubungiCS() {
    window.location.href = "mailto:nusaindoteknologi@gmail.com?subject=Dukungan Teknis OTOPOS";
}

// Inisialisasi saat aplikasi dibuka
document.addEventListener('DOMContentLoaded', () => {
    refreshTampilanDashboard();
    renderMekanik();
});