// ==========================================
// 1. STATE & DATABASE INISIALISASI (OFFLINE)
// ==========================================
let db = {
    settings: { nama: "OTOPOS MOTOR", alamat: "Jl. Sukajadi No. 123", telp: "0812345678" },
    sparepart: [
        { id: "P01", barcode: "11111", nama: "Oli MPX2 0.8L", harga: 52000, stok: 20 },
        { id: "P02", barcode: "22222", nama: "V-Belt Kit K44", harga: 145000, stok: 10 },
        { id: "P03", barcode: "33333", nama: "Kampas Rem Depan Beat", harga: 35000, stok: 15 }
    ],
    jasa: [
        { id: "J01", nama: "Servis CVT", harga: 45000 },
        { id: "J02", nama: "Servis Ringan", harga: 40000 }
    ],
    mekanik: [
        { id: "M01", nama: "Budi" },
        { id: "M02", nama: "Andi" }
    ],
    transaksi: [],
    antrean: [] // Antrean aktif servis
};

let keranjang = [];
let modeKasirAktif = 'part'; // 'part' (Direct Jual) atau 'servis'
let idAntreanTerpilih = null;

// Sinkronisasi awal database
function initDatabase() {
    const localData = localStorage.getItem('otopos_db');
    if (localData) {
        db = JSON.parse(localData);
    } else {
        localStorage.setItem('otopos_db', JSON.stringify(db));
    }
    renderMekanikDropdown();
}

function saveDB() {
    localStorage.setItem('otopos_db', JSON.stringify(db));
    
    // LOGIKA PENYELAMAT DATA UNTUK VERSI .EXE (ELECTRON INTERACTION)
    if (window.electronAPI) {
        // Otomatis simpan data mentah ke folder di local drive PC kasir tanpa konfirmasi browser
        window.electronAPI.saveToLocalPC(JSON.stringify(db, null, 2));
    }
}

// ==========================================
// 2. LOGIKA SWITCH MODE KASIR (DIRECT VS SERVIS)
// ==========================================
function setModeKasir(mode) {
    modeKasirAktif = mode;
    const lblMode = document.getElementById("lblMode");
    const formKendaraan = document.getElementById("formKendaraan");
    
    // Kosongkan keranjang belanja setiap ganti mode demi kebersihan data
    keranjang = [];
    renderKeranjang();
    
    if (mode === 'part') {
        lblMode.textContent = "DIRECT PART (TANPA SERVIS)";
        lblMode.className = "badge badge-part";
        formKendaraan.classList.add("hidden");
        idAntreanTerpilih = null;
    } else {
        lblMode.textContent = "SERVIS AKTIF";
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

// ==========================================
// 3. PENCARIAN & MANIPULASI KERANJANG
// ==========================================
function cariItem() {
    const keyword = document.getElementById("txtCari").value.toLowerCase();
    const resultBox = document.getElementById("searchResult");
    resultBox.innerHTML = "";
    
    if (keyword === "") return;

    // Cari di Sparepart
    const parts = db.sparepart.filter(p => p.nama.toLowerCase().includes(keyword) || p.barcode.includes(keyword));
    parts.forEach(p => {
        resultBox.innerHTML += `
            <div class="search-item-row" onclick="tambahKeKeranjang('${p.id}', 'part')">
                <span>[PART] ${p.nama} (Stok: ${p.stok})</span>
                <span class="bold">Rp${p.harga.toLocaleString('id-ID')}</span>
            </div>
        `;
    });

    // Cari di Jasa (Hanya bisa ditambahkan jika mode Kasir adalah SERVIS)
    if (modeKasirAktif === 'servis') {
        const jasas = db.jasa.filter(j => j.nama.toLowerCase().includes(keyword));
        jasas.forEach(j => {
            resultBox.innerHTML += `
                <div class="search-item-row" onclick="tambahKeKeranjang('${j.id}', 'jasa')">
                    <span>[JASA] ${j.nama}</span>
                    <span class="bold">Rp${j.harga.toLocaleString('id-ID')}</span>
                </div>
            `;
        });
    }
}

function tambahKeKeranjang(id, tipe) {
    let itemData;
    if (tipe === 'part') {
        itemData = db.sparepart.find(p => p.id === id);
    } else {
        itemData = db.jasa.find(j => j.id === id);
    }

    const itemDiKeranjang = keranjang.find(k => k.id === id && k.tipe === tipe);
    
    if (itemDiKeranjang) {
        if (tipe === 'part' && itemDiKeranjang.qty >= itemData.stok) {
            alert("Stok tidak mencukupi!");
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

function hapusDariKeranjang(index) {
    keranjang.splice(index, 1);
    renderKeranjang();
}

function renderKeranjang() {
    const tbody = document.getElementById("cartItems");
    tbody.innerHTML = "";
    
    keranjang.forEach((item, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${item.nama}</td>
                <td>Rp${item.harga.toLocaleString('id-ID')}</td>
                <td>${item.qty}</td>
                <td>Rp${(item.harga * item.qty).toLocaleString('id-ID')}</td>
                <td><button onclick="hapusDariKeranjang(${index})" style="color:red; border:none; background:none; cursor:pointer;">Hapus</button></td>
            </tr>
        `;
    });
    
    hitungTotalAkhir();
}

// ==========================================
// 4. KALKULASI PEMBAYARAN (CEGAH NaN)
// ==========================================
function hitungTotalAkhir() {
    let subtotal = 0;
    keranjang.forEach(item => {
        subtotal += item.harga * item.qty;
    });

    const diskonInput = document.getElementById("numDiskon").value;
    const diskon = parseFloat(diskonInput) || 0; // Fallback anti-NaN
    const totalAkhir = Math.max(0, subtotal - diskon);

    document.getElementById("lblSubtotal").textContent = `Rp${subtotal.toLocaleString('id-ID')}`;
    document.getElementById("lblTotalAkhir").textContent = `Rp${totalAkhir.toLocaleString('id-ID')}`;
    
    hitungKembalian();
}

function hitungKembalian() {
    const totalString = document.getElementById("lblTotalAkhir").textContent.replace(/[^0-9]/g, '');
    const total = parseFloat(totalString) || 0;

    const bayarInput = document.getElementById("numBayar").value;
    const bayar = parseFloat(bayarInput) || 0; // Fallback anti-NaN
    
    const kembalian = Math.max(0, bayar - total);
    document.getElementById("lblKembalian").textContent = `Rp${kembalian.toLocaleString('id-ID')}`;
}

// ==========================================
// 5. PENYIMPANAN TRANSAKSI & CETAK STRUK 58MM
// ==========================================
function prosesSimpanTransaksi() {
    if (keranjang.length === 0) {
        alert("Keranjang masih kosong!");
        return;
    }

    const totalString = document.getElementById("lblTotalAkhir").textContent.replace(/[^0-9]/g, '');
    const total = parseFloat(totalString) || 0;
    const bayar = parseFloat(document.getElementById("numBayar").value) || 0;

    if (bayar < total) {
        alert("Jumlah uang pembayaran kurang!");
        return;
    }

    const subtotal = total + (parseFloat(document.getElementById("numDiskon").value) || 0);
    const diskon = parseFloat(document.getElementById("numDiskon").value) || 0;
    const kembalian = bayar - total;

    // Buat Dokumen Transaksi Utama
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
        kembali: kembalian
    };

    // LOGIKA PERCABANGAN UTAMA (PENTING): JUAL PART VS SERVIS
    if (modeKasirAktif === 'servis') {
        const plat = document.getElementById("txtPlat").value;
        const motor = document.getElementById("txtMotor").value;
        const mekanik = document.getElementById("selMekanik").value;

        if (!plat || !motor || !mekanik) {
            alert("Untuk mode Servis: Plat, Motor, dan Mekanik wajib diisi!");
            return;
        }

        trxData.plat = plat;
        trxData.motor = motor;
        trxData.mekanik = mekanik;

        // Potong stok part & update gaji mekanik jika servis selesai
        potongStokGudang(keranjang);
        prosesGajiMekanik(mekanik, keranjang);
    } else {
        // Direct Part: Hanya potong stok part di gudang saja
        potongStokGudang(keranjang);
    }

    // Masukkan data ke riwayat database utama
    db.transaksi.push(trxData);
    saveDB();

    // CETAK STRUK SECARA SILENT VIA IFRAME
    cetakStrukOtoPOS(trxData);

    // Reset Form Kasir
    keranjang = [];
    document.getElementById("numDiskon").value = "0";
    document.getElementById("numBayar").value = "";
    document.getElementById("txtPlat").value = "";
    document.getElementById("txtMotor").value = "";
    document.getElementById("selMekanik").value = "";
    renderKeranjang();
    
    alert("Transaksi berhasil disimpan dan struk dicetak!");
}

function potongStokGudang(items) {
    items.forEach(item => {
        if (item.tipe === 'part') {
            const part = db.sparepart.find(p => p.id === item.id);
            if (part) {
                part.stok = Math.max(0, part.stok - item.qty);
            }
        }
    });
}

function prosesGajiMekanik(namaMekanik, items) {
    // Logika perhitungan bonus berdasarkan porsi/jasa dari array items
    console.log(`Mengalokasikan komisi servis untuk Mekanik: ${namaMekanik}`);
}

// ==========================================
// 6. MODULE CETAK STRUK 58mm (DYNAMIC IFRAME)
// ==========================================
function cetakStrukOtoPOS(trx) {
    const iframe = document.getElementById("printFrame");
    const doc = iframe.contentDocument || iframe.contentWindow.document;

    let itemsHTML = "";
    trx.items.forEach(item => {
        itemsHTML += `
            <div class="item-group">
                <span class="item-name">${item.nama}</span>
                <div class="item-details">
                    <span>${item.qty} x Rp${item.harga.toLocaleString('id-ID')}</span>
                    <span>Rp${(item.qty * item.harga).toLocaleString('id-ID')}</span>
                </div>
            </div>
        `;
    });

    const htmlContent = `
        <html>
        <head>
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body {
                    font-family: "Courier New", Courier, monospace;
                    font-size: 11px;
                    line-height: 1.3;
                    width: 58mm;
                    padding: 4px;
                }
                .text-center { text-align: center; }
                .bold { font-weight: bold; }
                .divider { border-top: 1px dashed #000; margin: 5px 0; }
                .shop-name { font-size: 12px; font-weight: bold; text-transform: uppercase; }
                .shop-address { font-size: 9px; }
                .meta { font-size: 10px; margin: 5px 0; }
                .meta-row { display: flex; justify-content: space-between; }
                .item-list { margin: 5px 0; }
                .item-group { margin-bottom: 5px; }
                .item-name { font-weight: bold; display: block; }
                .item-details { display: flex; justify-content: space-between; font-size: 10px; padding-left: 5px; }
                .totals { font-size: 10px; margin-top: 5px; }
                .total-row { display: flex; justify-content: space-between; }
                .grand-total { font-size: 12px; font-weight: bold; border-top: 1px dotted #000; padding-top: 4px; margin-top: 4px;}
                .footer { text-align: center; font-size: 9px; margin-top: 12px; }
            </style>
        </head>
        <body>
            <div class="text-center">
                <div class="shop-name">${db.settings.nama}</div>
                <div class="shop-address">${db.settings.alamat}</div>
                <div class="shop-address">Telp: ${db.settings.telp}</div>
            </div>
            <div class="divider"></div>
            <div class="meta">
                <div class="meta-row"><span>ID: #${trx.id.substring(4, 12)}</span></div>
                <div class="meta-row"><span>Tgl: ${trx.tanggal}</span></div>
                ${trx.mekanik ? `<div class="meta-row"><span>Mek: ${trx.mekanik}</span></div>` : ''}
                ${trx.motor ? `<div class="meta-row"><span>Plat: ${trx.plat} (${trx.motor})</span></div>` : ''}
            </div>
            <div class="divider"></div>
            <div class="item-list">
                ${itemsHTML}
            </div>
            <div class="divider"></div>
            <div class="totals">
                <div class="total-row"><span>Subtotal:</span><span>Rp${trx.subtotal.toLocaleString('id-ID')}</span></div>
                <div class="total-row"><span>Diskon:</span><span>Rp${trx.diskon.toLocaleString('id-ID')}</span></div>
                <div class="total-row grand-total"><span>TOTAL:</span><span>Rp${trx.total.toLocaleString('id-ID')}</span></div>
                <div class="total-row" style="margin-top: 3px;"><span>Bayar:</span><span>Rp${trx.bayar.toLocaleString('id-ID')}</span></div>
                <div class="total-row"><span>Kembali:</span><span>Rp${trx.kembali.toLocaleString('id-ID')}</span></div>
            </div>
            <div class="divider"></div>
            <div class="footer">
                <p class="bold">TERIMA KASIH</p>
                ${trx.mekanik ? '<p>Garansi Servis Ringan 7 Hari</p>' : '<p>Barang dibeli tdk dpt ditukar</p>'}
                <p style="font-size: 7px; margin-top: 5px;">OtoPOS v1.0.0</p>
            </div>
        </body>
        </html>
    `;

    doc.open();
    doc.write(htmlContent);
    doc.close();

    // Trigger Print
    setTimeout(() => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
    }, 200);
}

// ==========================================
// 7. SHORTCUTS KEYBOARD UNTUK LAYAR PC
// ==========================================
document.addEventListener("keydown", function(e) {
    if (e.key === "F2") {
        e.preventDefault();
        document.getElementById("txtCari").focus();
    }
    if (e.key === "F12") {
        e.preventDefault();
        document.getElementById("numBayar").focus();
    }
});

// Jalankan Database Saat Pertama Kali Dibuka
window.onload = initDatabase;