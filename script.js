// ... (Kode sebelumnya tetap sama)

function navigateTo(pageName) {
    document.body.className = `view-${pageName}`;
    document.getElementById('header-title').innerText = pageName.toUpperCase();
    if (pageName === 'setting') loadPengaturanKeForm();
    if (pageName === 'mekanik') renderMekanik();
    if (pageName === 'kasir') updateDropdownMekanik();
    if (pageName === 'riwayat') renderRiwayat(); // Tambahkan ini
}

// FUNGSI RIWAYAT
function renderRiwayat() {
    const container = document.getElementById('list-riwayat');
    if (dataBengkel.riwayat.length === 0) {
        container.innerHTML = '<p>Belum ada transaksi.</p>';
        return;
    }
    
    container.innerHTML = dataBengkel.riwayat.map(t => `
        <div class="card" style="margin-bottom:10px;">
            <strong>${t.nama}</strong> - ${t.jenis}<br>
            <small>Mekanik: ${t.mekanik}</small><br>
            <span style="color:green; font-weight:bold;">Rp ${t.biaya.toLocaleString()}</span>
        </div>
    `).join('');
}

// ... (Sisa fungsi lainnya tetap sama)