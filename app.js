// ==========================================
// 1. STATE & DATABASE INISIALISASI (HIDUP)
// ==========================================
let db = {
    settings: { 
        nama: "OTOPOS MOTOR", 
        alamat: "Jl. Sukajadi No. 123, Bandung", 
        telp: "0812-3456-7890",
        komisiJasa: 50, // 50% komisi dari Jasa Servis
        komisiPart: 5   // 5% komisi dari harga Sparepart yang dipasang (jika servis)
    },
    sparepart: [
        { id: "P01", barcode: "11111", nama: "Oli MPX2 0.8L", harga: 52000, stok: 20 },
        { id: "P02", barcode: "22222", nama: "V-Belt Kit K44", harga: 145000, stok: 10 }
    ],
    jasa: [
        { id: "J01", nama: "Servis Ringan + Tune Up", harga: 50000 },
        { id: "J02", nama: "Servis CVT", harga: 45000 }
    ],
    mekanik: [
        { id: "M01", nama: "Budi" },
        { id: "M02", nama: "Andi" }
    ],
    transaksi: []
};

let keranjang = [];
let modeKasirAktif = 'part'; // 'part' atau 'servis'

function initDatabase() {
    const localData = localStorage.getItem('otopos_db');
    if (localData) {
        db = JSON.parse(localData);
    } else {
        localStorage.setItem('otopos_db', JSON.stringify(db));
    }
    
    // Sinkronisasi Pengaturan ke Layar
    document.getElementById("bengkelName").textContent = db.settings.nama || "OTOPOS MOTOR";
    document.getElementById("setNamaBengkel").value = db.settings.nama || "";
    document.getElementById("setAlamat").value = db.settings.alamat || "";
    document.getElementById("setTelp").value = db.settings.telp || "";
    document.getElementById("setKomisiJasa").value = db.settings.komisiJasa || 0;
    document.getElementById("setKomisiPart").value = db.settings.komisiPart || 0;

    renderMekanikDropdown();
}

function saveDB() {
    localStorage.setItem('otopos_db', JSON.stringify(db));
    if (window.electronAPI) {
        window.electronAPI.saveToLocalPC(JSON.stringify(db, null, 2));
    }
}

// ==========================================
// 2. LOGIKA SWITCH TAB UTAMA
// ==========================================
function switchTab(tabName) {
    document.getElementById("tabKasir").classList.add("hidden");
    document.getElementById("tabManajemen").classList.add("hidden");
    document.getElementById("tabLaporan").classList.add("hidden");
    document.getElementById("tabSetting").classList.add("hidden");
    
    document.getElementById("btnTabKasir").classList.remove("active");
    document.getElementById("btnTabManajemen").classList.remove("active");
    document.getElementById("btnTabLaporan").classList.remove("active");
    document.getElementById("btnTabSetting").classList.remove("active");

    if (tabName === 'kasir') {
        document.getElementById("tabKasir").classList.remove("hidden");
        document.getElementById("btnTabKasir").classList.add("active");
        renderMekanikDropdown();
    } else if (tabName === 'manajemen') {
        document.getElementById("tabManajemen").classList.remove("hidden");
        document.getElementById("btnTabManajemen").classList.add("active");
        renderGudangManajemen();
        renderMekanikManajemen();
        renderJasaManajemen();
    } else if (tabName === 'laporan') {
        document.getElementById("tabLaporan").classList.remove("hidden");
        document.getElementById("btnTabLaporan").classList.add("active");
        renderLaporanKeuangan();
    } else if (tabName === 'setting') {
        document.getElementById("tabSetting").classList.remove("hidden");
        document.getElementById("btnTabSetting").classList.add("active");
    }
}

// ==========================================
// 3. FITUR KASIR INTERAKTIF (EDIT STOK & HARGA)
// ==========================================
function setModeKasir(mode) {
    modeKasirAktif = mode;
    const lblMode = document.getElementById("lblMode");
    const formKendaraan = document.getElementById("formKendaraan");
    
    keranjang = [];
    renderKeranjang();
    
    if (mode === 'part') {
        lblMode.textContent = "DIRECT PART";
        lblMode.className = "badge badge-part";
        formKendaraan.classList.add("hidden");
    } else {
        lblMode.textContent = "SERVIS";
        lblMode.className = "badge badge-servis";
        formKendaraan.classList.remove("hidden");
    }
}

function renderMekanikDropdown() {
    const select = document.getElementById("selMekanik");
    select.innerHTML = '<option value="">-- Pilih Mekanik --</option>';
    db.mekanik.forEach(m => {
        select.innerHTML += `<option value="${m.nama}">${m.nama}</option>`;
    });
}

function cariItem() {
    const keyword = document.getElementById("txtCari").value.toLowerCase();
    const resultBox = document.getElementById("searchResult");
    resultBox.innerHTML = "";
    if (keyword === "") return;

    // Cari Part
    const parts = db.sparepart.filter(p => p.nama.toLowerCase().includes(keyword) || p.barcode.includes(keyword));
    parts.forEach(p => {
        resultBox.innerHTML += `
            <div class="search-item-row" onclick="tambahKeKeranjang('${p.id}', 'part')">
                <span>[PART] ${p.nama} (Stok: ${p.stok})</span>
                <span class="bold">Rp${p.harga.toLocaleString('id-ID')}</span>
            </div>`;
    });

    // Cari Jasa (Hanya jika mode Servis)
    if (modeKasirAktif === 'servis') {
        const jasas = db.jasa.filter(j => j.nama.toLowerCase().includes(keyword));
        jasas.forEach(j => {
            resultBox.innerHTML += `
                <div class="search-item-row" onclick="tambahKeKeranjang('${j.id}', 'jasa')">
                    <span>[JASA] ${j.nama}</span>
                    <span class="bold">Rp${j.harga.toLocaleString('id-ID')}</span>
                </div>`;
        });
    }
}

function tambahKeKeranjang(id, tipe) {
    let itemData = tipe === 'part' ? db.sparepart.find(p => p.id === id) : db.jasa.find(j => j.id === id);
    const itemDiKeranjang = keranjang.find(k => k.id === id && k.tipe === tipe);
    
    if (itemDiKeranjang) {
        if (tipe === 'part' && itemDiKeranjang.qty >= itemData.stok) {
            alert("Stok di gudang tidak mencukupi!");
            return;
        }
        itemDiKeranjang.qty++;
    } else {
        keranjang.push({
            id: itemData.id,
            nama: itemData.nama,
            harga: itemData.harga,
            qty: 1,
            tipe: tipe
        });
    }
    document.getElementById("txtCari").value = "";
    document.getElementById("searchResult").innerHTML = "";
    renderKeranjang();
}

// EDIT QUANTITY DIRECT DI KASIR
function updateQtyKeranjang(index, val) {
    let qtyInput = parseInt(val) || 1;
    const item = keranjang[index];

    if (item.tipe === 'part') {
        const partAsli = db.sparepart.find(p => p.id === item.id);
        if (partAsli && qtyInput > partAsli.stok) {
            alert(`Stok tidak mencukupi! Sisa stok: ${partAsli.stok}`);
            qtyInput = partAsli.stok;
        }
    }
    keranjang[index].qty = Math.max(1, qtyInput);
    renderKeranjang();
}

// EDIT HARGA DIRECT DI KASIR (Untuk Jasa Custom / Part Nego)
function updateHargaKeranjang(index, val) {
    const hargaInput = parseFloat(val) || 0;
    keranjang[index].harga = Math.max(0, hargaInput);
    hitungTotalAkhir();
}

function hapusDariKeranjang(index) {
    keranjang.splice(index, 1);
    renderKeranjang();
}

function kosongkanKeranjang() {
    if (confirm("Apakah Anda yakin ingin mengosongkan seluruh keranjang belanja?")) {
        keranjang = [];
        renderKeranjang();
    }
}

function renderKeranjang() {
    const tbody = document.getElementById("cartItems");
    tbody.innerHTML = "";
    
    keranjang.forEach((item, index) => {
        tbody.innerHTML += `
            <tr>
                <td><strong>${item.nama}</strong> <small style="color:#666; display:block;">[${item.tipe.toUpperCase()}]</small></td>
                <td>
                    <input type="number" class="table-input" value="${item.harga}" onchange="updateHargaKeranjang(${index}, this.value)" style="width: 100px;">
                </td>
                <td>
                    <input type="number" class="table-input" min="1" value="${item.qty}" onchange="updateQtyKeranjang(${index}, this.value)" style="width: 60px;">
                </td>
                <td class="bold">Rp${(item.harga * item.qty).toLocaleString('id-ID')}</td>
                <td><button onclick="hapusDariKeranjang(${index})" class="btn-delete-small">X</button></td>
            </tr>`;
    });
    hitungTotalAkhir();
}

function hitungTotalAkhir() {
    let subtotal = 0;
    keranjang.forEach(item => subtotal += item.harga * item.qty);

    const diskon = parseFloat(document.getElementById("numDiskon").value) || 0;
    const totalAkhir = Math.max(0, subtotal - diskon);

    document.getElementById("lblSubtotal").textContent = `Rp${subtotal.toLocaleString('id-ID')}`;
    document.getElementById("lblTotalAkhir").textContent = `Rp${totalAkhir.toLocaleString('id-ID')}`;
    hitungKembalian();
}

function hitungKembalian() {
    const totalString = document.getElementById("lblTotalAkhir").textContent.replace(/[^0-9]/g, '');
    const total = parseFloat(totalString) || 0;
    const bayar = parseFloat(document.getElementById("numBayar").value) || 0;
    
    const kembalian = Math.max(0, bayar - total);
    document.getElementById("lblKembalian").textContent = `Rp${kembalian.toLocaleString('id-ID')}`;
}

// ==========================================
// 4. PENYIMPANAN TRANSAKSI + KOMISI MEKANIK
// ==========================================
function prosesSimpanTransaksi() {
    if (keranjang.length === 0) {
        alert("Keranjang belanja kosong!");
        return;
    }

    const total = parseFloat(document.getElementById("lblTotalAkhir").textContent.replace(/[^0-9]/g, '')) || 0;
    const bayar = parseFloat(document.getElementById("numBayar").value) || 0;

    if (bayar < total) {
        alert("Uang pembayaran kurang!");
        return;
    }

    const subtotal = total + (parseFloat(document.getElementById("numDiskon").value) || 0);
    const diskon = parseFloat(document.getElementById("numDiskon").value) || 0;
    const kembalian = bayar - total;

    const trxId = "TRX-" + Date.now();
    const trxData = {
        id: trxId,
        tanggal: new Date().toLocaleString('id-ID'),
        tipe: modeKasirAktif,
        items: [...keranjang],
        subtotal: subtotal,
        diskon: diskon,
        total: total,
        bayar: bayar,
        kembali: kembalian,
        komisiMekanik: 0
    };

    if (modeKasirAktif === 'servis') {
        const plat = document.getElementById("txtPlat").value.trim();
        const motor = document.getElementById("txtMotor").value.trim();
        const mekanik = document.getElementById("selMekanik").value;

        if (!plat || !motor || !mekanik) {
            alert("Plat, Motor, dan Mekanik wajib diisi untuk Transaksi Servis!");
            return;
        }

        trxData.plat = plat;
        trxData.motor = motor;
        trxData.mekanik = mekanik;

        // KALKULASI PENDAPATAN KOMISI MEKANIK (DARI SETTINGS)
        let totalKomisi = 0;
        keranjang.forEach(item => {
            if (item.tipe === 'jasa') {
                totalKomisi += (item.harga * item.qty) * (db.settings.komisiJasa / 100);
            } else if (item.tipe === 'part') {
                totalKomisi += (item.harga * item.qty) * (db.settings.komisiPart / 100);
            }
        });
        trxData.komisiMekanik = totalKomisi;
    }

    // Kurangi Stok Sparepart di database
    keranjang.forEach(item => {
        if (item.tipe === 'part') {
            const part = db.sparepart.find(p => p.id === item.id);
            if (part) part.stok = Math.max(0, part.stok - item.qty);
        }
    });

    db.transaksi.push(trxData);
    saveDB();
    
    // Jalankan Printer Thermal
    cetakStrukOtoPOS(trxData);

    // Reset Form
    keranjang = [];
    document.getElementById("numDiskon").value = "0";
    document.getElementById("numBayar").value = "";
    document.getElementById("txtPlat").value = "";
    document.getElementById("txtMotor").value = "";
    document.getElementById("selMekanik").value = "";
    renderKeranjang();
    
    alert("Transaksi Berhasil Diproses!");
}

// ==========================================
// 5. PENGHITUNGAN OMSET & KOMISI MEKANIK (LIVE)
// ==========================================
function renderLaporanKeuangan() {
    let totalOmset = 0;
    db.transaksi.forEach(t => totalOmset += t.total);

    document.getElementById("dashOmset").textContent = `Rp${totalOmset.toLocaleString('id-ID')}`;
    document.getElementById("dashTrxCount").textContent = `${db.transaksi.length} Transaksi`;

    // Render Riwayat Transaksi
    const tbodyTrx = document.getElementById("tblRiwayatTrx");
    tbodyTrx.innerHTML = "";
    db.transaksi.slice().reverse().forEach(t => {
        tbodyTrx.innerHTML += `
            <tr>
                <td>${t.id.substring(4, 12)}</td>
                <td>${t.tanggal}</td>
                <td><span class="badge ${t.tipe === 'part' ? 'badge-part' : 'badge-servis'}">${t.tipe.toUpperCase()}</span></td>
                <td class="bold">Rp${t.total.toLocaleString('id-ID')}</td>
                <td>${t.mekanik || '-'}</td>
                <td><button onclick="cetakUlangStruk('${t.id}')" class="btn-edit-small">Print</button></td>
            </tr>`;
    });

    // Render Komisi Mekanik
    const tbodyKomisi = document.getElementById("tblKomisiMekanik");
    tbodyKomisi.innerHTML = "";
    
    db.mekanik.forEach(mekanik => {
        let totalKomisiMekanik = 0;
        db.transaksi.forEach(t => {
            if (t.mekanik === mekanik.nama) {
                totalKomisiMekanik += t.komisiMekanik || 0;
            }
        });
        tbodyKomisi.innerHTML += `
            <tr>
                <td><strong>${mekanik.nama}</strong></td>
                <td class="bold" style="color: #2e7d32">Rp${totalKomisiMekanik.toLocaleString('id-ID')}</td>
            </tr>`;
    });
}

function cetakUlangStruk(id) {
    const trx = db.transaksi.find(t => t.id === id);
    if (trx) cetakStrukOtoPOS(trx);
}

// ==========================================
// 6. MANAGEMENT DATA (CRUD)
// ==========================================
function renderGudangManajemen() {
    const tbody = document.getElementById("tblStokGudang");
    tbody.innerHTML = "";
    db.sparepart.forEach(p => {
        tbody.innerHTML += `
            <tr>
                <td>${p.barcode}</td>
                <td>${p.nama}</td>
                <td>Rp${p.harga.toLocaleString('id-ID')}</td>
                <td><strong>${p.stok}</strong></td>
                <td>
                    <button onclick="editSparepart('${p.id}')" class="btn-edit-small">Edit</button>
                    <button onclick="hapusSparepart('${p.id}')" class="btn-delete-small">Hapus</button>
                </td>
            </tr>`;
    });
}

function simpanSparepart() {
    const editId = document.getElementById("editPartId").value;
    const barcode = document.getElementById("addPartBarcode").value;
    const nama = document.getElementById("addPartNama").value;
    const harga = parseFloat(document.getElementById("addPartHarga").value) || 0;
    const stok = parseInt(document.getElementById("addPartStok").value) || 0;

    if (!nama || harga <= 0) {
        alert("Gagal menyimpan! Nama & harga harus valid.");
        return;
    }

    if (editId) {
        // Mode EDIT
        const part = db.sparepart.find(p => p.id === editId);
        if (part) {
            part.barcode = barcode;
            part.nama = nama;
            part.harga = harga;
            part.stok = stok;
        }
        document.getElementById("editPartId").value = "";
        document.getElementById("btnSimpanPart").textContent = "Simpan Sparepart";
    } else {
        // Mode TAMBAH BARU
        const newID = "P" + Date.now();
        db.sparepart.push({ id: newID, barcode, nama, harga, stok });
    }

    saveDB();
    renderGudangManajemen();
    
    document.getElementById("addPartBarcode").value = "";
    document.getElementById("addPartNama").value = "";
    document.getElementById("addPartHarga").value = "";
    document.getElementById("addPartStok").value = "";
}

function editSparepart(id) {
    const p = db.sparepart.find(x => x.id === id);
    if (p) {
        document.getElementById("editPartId").value = p.id;
        document.getElementById("addPartBarcode").value = p.barcode;
        document.getElementById("addPartNama").value = p.nama;
        document.getElementById("addPartHarga").value = p.harga;
        document.getElementById("addPartStok").value = p.stok;
        document.getElementById("btnSimpanPart").textContent = "Update Data (Simpan)";
    }
}

function hapusSparepart(id) {
    if (confirm("Hapus item ini?")) {
        db.sparepart = db.sparepart.filter(p => p.id !== id);
        saveDB();
        renderGudangManajemen();
    }
}

// JASA
function renderJasaManajemen() {
    const tbody = document.getElementById("tblJasa");
    tbody.innerHTML = "";
    db.jasa.forEach(j => {
        tbody.innerHTML += `
            <tr>
                <td>${j.nama}</td>
                <td>Rp${j.harga.toLocaleString('id-ID')}</td>
                <td><button onclick="hapusJasa('${j.id}')" class="btn-delete-small">Hapus</button></td>
            </tr>`;
    });
}

function tambahJasa() {
    const nama = document.getElementById("addJasaNama").value;
    const harga = parseFloat(document.getElementById("addJasaHarga").value) || 0;

    if (!nama || harga <= 0) return alert("Isi jasa dengan benar!");
    
    db.jasa.push({ id: "J" + Date.now(), nama, harga });
    saveDB();
    renderJasaManajemen();
    document.getElementById("addJasaNama").value = "";
    document.getElementById("addJasaHarga").value = "";
}

function hapusJasa(id) {
    if (confirm("Hapus Jasa ini?")) {
        db.jasa = db.jasa.filter(j => j.id !== id);
        saveDB();
        renderJasaManajemen();
    }
}

// MEKANIK
function renderMekanikManajemen() {
    const list = document.getElementById("listMekanik");
    list.innerHTML = "";
    db.mekanik.forEach(m => {
        list.innerHTML += `
            <li>
                <span>${m.nama}</span>
                <button onclick="hapusMekanik('${m.id}')" class="btn-delete-small">Hapus</button>
            </li>`;
    });
}

function tambahMekanik() {
    const nama = document.getElementById("addMekanikNama").value.trim();
    if (!nama) return alert("Nama tidak boleh kosong!");
    db.mekanik.push({ id: "M" + Date.now(), nama });
    saveDB();
    renderMekanikManajemen();
    document.getElementById("addMekanikNama").value = "";
}

function hapusMekanik(id) {
    if (confirm("Hapus mekanik ini?")) {
        db.mekanik = db.mekanik.filter(m => m.id !== id);
        saveDB();
        renderMekanikManajemen();
    }
}

function filterGudang() {
    const keyword = document.getElementById("txtCariGudang").value.toLowerCase();
    const rows = document.getElementById("tblStokGudang").getElementsByTagName("tr");
    for (let row of rows) {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(keyword) ? "" : "none";
    }
}

// ==========================================
// 7. HALAMAN PENGATURAN BENGKEL
// ==========================================
function simpanPengaturan() {
    db.settings.nama = document.getElementById("setNamaBengkel").value.trim() || "OTOPOS";
    db.settings.alamat = document.getElementById("setAlamat").value.trim();
    db.settings.telp = document.getElementById("setTelp").value.trim();
    db.settings.komisiJasa = parseFloat(document.getElementById("setKomisiJasa").value) || 0;
    db.settings.komisiPart = parseFloat(document.getElementById("setKomisiPart").value) || 0;

    saveDB();
    document.getElementById("bengkelName").textContent = db.settings.nama;
    alert("Pengaturan Berhasil Disimpan!");
}

// ==========================================
// 8. PRINTER STRUK 58mm (DYNAMIC IN-IFRAME)
// ==========================================
function cetakStrukOtoPOS(trx) {
    const iframe = document.getElementById("printFrame");
    const doc = iframe.contentDocument || iframe.contentWindow.document;

    let itemsHTML = "";
    trx.items.forEach(item => {
        itemsHTML += `
            <div style="margin-bottom: 5px;">
                <span style="font-weight: bold; display: block;">${item.nama}</span>
                <div style="display: flex; justify-content: space-between; font-size: 10px;">
                    <span>${item.qty} x Rp${item.harga.toLocaleString('id-ID')}</span>
                    <span>Rp${(item.qty * item.harga).toLocaleString('id-ID')}</span>
                </div>
            </div>`;
    });

    const htmlContent = `
        <html>
        <head>
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: "Courier New", Courier, monospace; font-size: 11px; width: 58mm; padding: 4px; }
                .text-center { text-align: center; }
                .divider { border-top: 1px dashed #000; margin: 5px 0; }
                .totals { font-size: 10px; margin-top: 5px; }
                .total-row { display: flex; justify-content: space-between; }
                .grand-total { font-size: 12px; font-weight: bold; border-top: 1px dotted #000; padding-top: 4px; margin-top: 4px;}
            </style>
        </head>
        <body>
            <div class="text-center">
                <div style="font-size: 12px; font-weight: bold; text-transform: uppercase;">${db.settings.nama}</div>
                <div style="font-size: 9px;">${db.settings.alamat}</div>
                <div style="font-size: 9px;">Telp: ${db.settings.telp}</div>
            </div>
            <div class="divider"></div>
            <div style="font-size: 10px; margin: 5px 0;">
                <div class="total-row"><span>ID: #${trx.id.substring(4, 12)}</span></div>
                <div class="total-row"><span>Tgl: ${trx.tanggal}</span></div>
                ${trx.mekanik ? `<div class="total-row"><span>Mekanik: ${trx.mekanik}</span></div>` : ''}
                ${trx.motor ? `<div class="total-row"><span>Motor: ${trx.plat} (${trx.motor})</span></div>` : ''}
            </div>
            <div class="divider"></div>
            <div>${itemsHTML}</div>
            <div class="divider"></div>
            <div class="totals">
                <div class="total-row"><span>Subtotal:</span><span>Rp${trx.subtotal.toLocaleString('id-ID')}</span></div>
                <div class="total-row"><span>Diskon:</span><span>Rp${trx.diskon.toLocaleString('id-ID')}</span></div>
                <div class="total-row grand-total"><span>TOTAL:</span><span>Rp${trx.total.toLocaleString('id-ID')}</span></div>
                <div class="total-row" style="margin-top: 3px;"><span>Bayar:</span><span>Rp${trx.bayar.toLocaleString('id-ID')}</span></div>
                <div class="total-row"><span>Kembali:</span><span>Rp${trx.kembali.toLocaleString('id-ID')}</span></div>
            </div>
            <div class="divider"></div>
            <div class="text-center" style="font-size: 9px; margin-top: 10px;">
                <p style="font-weight: bold;">TERIMA KASIH</p>
                ${trx.mekanik ? '<p>Garansi Servis Ringan 7 Hari</p>' : '<p>Barang dibeli tidak dapat ditukar</p>'}
                <p style="font-size: 7px; margin-top: 5px;">OtoPOS v1.1.0</p>
            </div>
        </body>
        </html>`;

    doc.open();
    doc.write(htmlContent);
    doc.close();

    setTimeout(() => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
    }, 250);
}

// KEYBOARD SHORTCUTS
document.addEventListener("keydown", function(e) {
    if (e.key === "F2") { e.preventDefault(); document.getElementById("txtCari").focus(); }
    if (e.key === "F12") { e.preventDefault(); document.getElementById("numBayar").focus(); }
});

window.onload = initDatabase;