// ==========================================
// 1. STATE & DATABASE INISIALISASI (V2.0)
// ==========================================
let db = {
    settings: { 
        nama: "OTOPOS MOTOR", 
        alamat: "Jl. Sukajadi No. 123, Bandung", 
        telp: "0812-3456-7890",
        komisiJasa: 50,
        komisiPart: 5
    },
    sparepart: [
        { id: "P01", barcode: "11111", nama: "Oli MPX2 0.8L", harga: 52000, stok: 20 },
        { id: "P02", barcode: "22222", nama: "V-Belt Kit K44", harga: 145000, stok: 10 },
        { id: "P03", barcode: "33333", nama: "Kampas Rem Depan Beat", harga: 35000, stok: 15 },
        { id: "P04", barcode: "44444", nama: "Busi NGK", harga: 20000, stok: 30 }
    ],
    jasa: [
        { id: "J01", nama: "Servis Ringan + Tune Up", harga: 50000 },
        { id: "J02", nama: "Servis CVT", harga: 45000 }
    ],
    mekanik: [
        { id: "M01", nama: "Budi" },
        { id: "M02", nama: "Andi" }
    ],
    transaksi: [],
    antrian: [] // Menyimpan daftar motor yang saat ini sedang diservis di bengkel
};

// State Kerja Kasir
let modeKasirAktif = 'part';      // 'part' (Direct Jual) atau 'servis'
let sesiAktifId = 'direct';       // 'direct' atau ID antrian dari motor yang sedang dipilih
let keranjangDirect = [];         // Keranjang khusus pembeli part langsung (Direct Part)

// State Paginasi Gudang
let halamanGudangAktif = 1;
const itemPerHalamanGudang = 10;
let hasilFilterGudang = [];

function initDatabase() {
    const localData = localStorage.getItem('otopos_db');
    if (localData) {
        db = JSON.parse(localData);
    } else {
        localStorage.setItem('otopos_db', JSON.stringify(db));
    }
    
    // Sinkronisasi Setup Pengaturan ke Layar
    document.getElementById("bengkelName").textContent = db.settings.nama || "OTOPOS MOTOR";
    document.getElementById("setNamaBengkel").value = db.settings.nama || "";
    document.getElementById("setAlamat").value = db.settings.alamat || "";
    document.getElementById("setTelp").value = db.settings.telp || "";
    document.getElementById("setKomisiJasa").value = db.settings.komisiJasa || 0;
    document.getElementById("setKomisiPart").value = db.settings.komisiPart || 0;

    renderMekanikDropdowns();
    renderAntrianList();
    loadKeranjangAktif();
}

function saveDB() {
    localStorage.setItem('otopos_db', JSON.stringify(db));
    if (window.electronAPI) {
        window.electronAPI.saveToLocalPC(JSON.stringify(db, null, 2));
    }
}

// ==========================================
// 2. NAVIGASI TAB & SWITCHING TOMBOL
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
        renderMekanikDropdowns();
        renderAntrianList();
        loadKeranjangAktif();
    } else if (tabName === 'manajemen') {
        document.getElementById("tabManajemen").classList.remove("hidden");
        document.getElementById("btnTabManajemen").classList.add("active");
        
        // Reset Gudang ke All items
        hasilFilterGudang = [...db.sparepart];
        halamanGudangAktif = 1;
        
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

function renderMekanikDropdowns() {
    const listDrop = ['regMekanik', 'selMekanik'];
    listDrop.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.innerHTML = '<option value="">-- Pilih Mekanik --</option>';
            db.mekanik.forEach(m => {
                el.innerHTML += `<option value="${m.nama}">${m.nama}</option>`;
            });
        }
    });
}

// ==========================================
// 3. SISTEM ANTRIAN MOTOR (WORK IN PROGRESS)
// ==========================================
function setModeKasir(mode) {
    modeKasirAktif = mode;
    
    const btnPart = document.getElementById("btnModePart");
    const btnServis = document.getElementById("btnModeServis");
    const panelAntrian = document.getElementById("panelAntrian");
    const lblMode = document.getElementById("lblMode");

    if (mode === 'part') {
        btnPart.classList.add("active");
        btnServis.classList.remove("active");
        panelAntrian.classList.add("hidden");
        lblMode.textContent = "DIRECT PART";
        lblMode.className = "badge badge-part";
        
        sesiAktifId = 'direct';
    } else {
        btnPart.classList.remove("active");
        btnServis.classList.add("active");
        panelAntrian.classList.remove("hidden");
        lblMode.textContent = "SERVIS AKTIF";
        lblMode.className = "badge badge-servis";
        
        // Pilih antrian pertama jika ada
        if (db.antrian.length > 0) {
            sesiAktifId = db.antrian[0].id;
        } else {
            sesiAktifId = 'none';
        }
    }
    loadKeranjangAktif();
    renderAntrianList();
}

function tambahKeAntrian() {
    const plat = document.getElementById("regPlat").value.trim().toUpperCase();
    const motor = document.getElementById("regMotor").value.trim();
    const mekanik = document.getElementById("regMekanik").value;

    if (!plat || !motor || !mekanik) {
        alert("Mohon isi No. Plat, Tipe Motor & Mekanik!");
        return;
    }

    const antrianBaru = {
        id: "ANT-" + Date.now(),
        plat: plat,
        motor: motor,
        mekanik: mekanik,
        items: [] // Keranjang kosong untuk motor ini
    };

    db.antrian.push(antrianBaru);
    saveDB();

    // Reset input form registrasi
    document.getElementById("regPlat").value = "";
    document.getElementById("regMotor").value = "";
    document.getElementById("regMekanik").value = "";

    // Set antrian baru sebagai sesi aktif
    sesiAktifId = antrianBaru.id;
    
    renderAntrianList();
    loadKeranjangAktif();
}

function renderAntrianList() {
    const container = document.getElementById("listAntrianActive");
    container.innerHTML = "";

    if (db.antrian.length === 0) {
        container.innerHTML = `<p style="color:#888; text-align:center; margin-top:20px;">Tidak ada antrian servis.</p>`;
        return;
    }

    db.antrian.forEach(m => {
        const isActive = m.id === sesiAktifId ? 'active' : '';
        container.innerHTML += `
            <div class="queue-card ${isActive}" onclick="pilihSesiAntrian('${m.id}')">
                <div class="queue-card-info">
                    <h4>${m.plat}</h4>
                    <p>${m.motor} - Mknk: <strong>${m.mekanik}</strong></p>
                    <p style="font-size:9px; color:#3f51b5;">Total Item: ${m.items.length}</p>
                </div>
                <button class="btn-delete-small" onclick="hapusDariAntrian(event, '${m.id}')" style="color:#d32f2f;">X</button>
            </div>`;
    });
}

function pilihSesiAntrian(id) {
    sesiAktifId = id;
    renderAntrianList();
    loadKeranjangAktif();
}

function hapusDariAntrian(event, id) {
    event.stopPropagation(); // Biar klik card nya tidak kepicu
    if (confirm("Hapus antrian motor ini? Data belanja servisnya akan hilang.")) {
        db.antrian = db.antrian.filter(m => m.id !== id);
        saveDB();
        
        if (sesiAktifId === id) {
            sesiAktifId = db.antrian.length > 0 ? db.antrian[0].id : 'none';
        }
        
        renderAntrianList();
        loadKeranjangAktif();
    }
}

// ==========================================
// 4. MANAGEMENT KERANJANG AKTIF (KASIR)
// ==========================================
function getKeranjangAktif() {
    if (modeKasirAktif === 'part') {
        return keranjangDirect;
    } else {
        const motor = db.antrian.find(m => m.id === sesiAktifId);
        return motor ? motor.items : [];
    }
}

function loadKeranjangAktif() {
    const tbody = document.getElementById("cartItems");
    const labelJudul = document.getElementById("lblJudulKeranjang");
    tbody.innerHTML = "";

    if (modeKasirAktif === 'part') {
        labelJudul.innerHTML = "Keranjang Belanja: <strong>Direct Part (Penjualan Langsung)</strong>";
        renderKeranjangUI(keranjangDirect);
    } else {
        const motor = db.antrian.find(m => m.id === sesiAktifId);
        if (motor) {
            labelJudul.innerHTML = `Servis: <strong>${motor.plat} (${motor.motor})</strong>`;
            renderKeranjangUI(motor.items);
        } else {
            labelJudul.innerHTML = "<em>Pilih atau Registrasi Antrian Terlebih Dahulu</em>";
            document.getElementById("lblSubtotal").textContent = "Rp0";
            document.getElementById("lblTotalAkhir").textContent = "Rp0";
            document.getElementById("lblKembalian").textContent = "Rp0";
        }
    }
}

function renderKeranjangUI(items) {
    const tbody = document.getElementById("cartItems");
    tbody.innerHTML = "";
    
    items.forEach((item, index) => {
        tbody.innerHTML += `
            <tr>
                <td><strong>${item.nama}</strong> <small style="color:#666; display:block;">[${item.tipe.toUpperCase()}]</small></td>
                <td>
                    <input type="number" class="table-input" value="${item.harga}" onchange="editHargaKeranjang(${index}, this.value)">
                </td>
                <td>
                    <input type="number" class="table-input" min="1" value="${item.qty}" onchange="editQtyKeranjang(${index}, this.value)">
                </td>
                <td class="bold" style="padding-top:12px;">Rp${(item.harga * item.qty).toLocaleString('id-ID')}</td>
                <td><button onclick="hapusItemKeranjang(${index})" class="btn-delete-small">X</button></td>
            </tr>`;
    });
    hitungTotalAkhir();
}

function tambahKeKeranjang(id, tipe) {
    if (modeKasirAktif === 'servis' && sesiAktifId === 'none') {
        alert("Silahkan buat/pilih antrian motor servis terlebih dahulu!");
        return;
    }

    let itemOriginal = (tipe === 'part') 
        ? db.sparepart.find(p => p.id === id) 
        : db.jasa.find(j => j.id === id);

    let listBelanja = getKeranjangAktif();
    let itemSama = listBelanja.find(i => i.id === id && i.tipe === tipe);

    if (itemSama) {
        if (tipe === 'part' && itemSama.qty >= itemOriginal.stok) {
            alert("Batas stok di gudang tercapai!");
            return;
        }
        itemSama.qty++;
    } else {
        listBelanja.push({
            id: itemOriginal.id,
            nama: itemOriginal.nama,
            harga: itemOriginal.harga,
            qty: 1,
            tipe: tipe
        });
    }

    if (modeKasirAktif === 'servis') saveDB(); // langsung auto-save database antrian
    
    document.getElementById("txtCari").value = "";
    document.getElementById("searchResult").innerHTML = "";
    loadKeranjangAktif();
}

function editQtyKeranjang(index, value) {
    const qty = Math.max(1, parseInt(value) || 1);
    let listBelanja = getKeranjangAktif();
    const item = listBelanja[index];

    if (item.tipe === 'part') {
        const itemOri = db.sparepart.find(p => p.id === item.id);
        if (itemOri && qty > itemOri.stok) {
            alert(`Stok tidak cukup! Sisa stok hanya: ${itemOri.stok}`);
            listBelanja[index].qty = itemOri.stok;
            loadKeranjangAktif();
            return;
        }
    }
    listBelanja[index].qty = qty;
    if (modeKasirAktif === 'servis') saveDB();
    loadKeranjangAktif();
}

function editHargaKeranjang(index, value) {
    const harga = Math.max(0, parseFloat(value) || 0);
    let listBelanja = getKeranjangAktif();
    listBelanja[index].harga = harga;
    
    if (modeKasirAktif === 'servis') saveDB();
    loadKeranjangAktif();
}

function hapusItemKeranjang(index) {
    let listBelanja = getKeranjangAktif();
    listBelanja.splice(index, 1);
    
    if (modeKasirAktif === 'servis') saveDB();
    loadKeranjangAktif();
}

function kosongkanKeranjang() {
    if (confirm("Ingin mengosongkan keranjang belanja ini?")) {
        if (modeKasirAktif === 'part') {
            keranjangDirect = [];
        } else {
            const motor = db.antrian.find(m => m.id === sesiAktifId);
            if (motor) motor.items = [];
        }
        saveDB();
        loadKeranjangAktif();
    }
}

// ==========================================
// 5. KALKULATOR PEMBAYARAN & STRUK
// ==========================================
function hitungTotalAkhir() {
    let subtotal = 0;
    const listBelanja = getKeranjangAktif();
    listBelanja.forEach(i => subtotal += (i.harga * i.qty));

    const diskon = parseFloat(document.getElementById("numDiskon").value) || 0;
    const totalAkhir = Math.max(0, subtotal - diskon);

    document.getElementById("lblSubtotal").textContent = `Rp${subtotal.toLocaleString('id-ID')}`;
    document.getElementById("lblTotalAkhir").textContent = `Rp${totalAkhir.toLocaleString('id-ID')}`;
    hitungKembalian();
}

function hitungKembalian() {
    const total = parseFloat(document.getElementById("lblTotalAkhir").textContent.replace(/[^0-9]/g, '')) || 0;
    const bayar = parseFloat(document.getElementById("numBayar").value) || 0;
    const kembalian = Math.max(0, bayar - total);
    document.getElementById("lblKembalian").textContent = `Rp${kembalian.toLocaleString('id-ID')}`;
}

function cariItem() {
    const key = document.getElementById("txtCari").value.toLowerCase();
    const resBox = document.getElementById("searchResult");
    resBox.innerHTML = "";

    if (!key) return;

    // Filter Part
    const parts = db.sparepart.filter(p => p.nama.toLowerCase().includes(key) || p.barcode.includes(key));
    parts.forEach(p => {
        resBox.innerHTML += `
            <div class="search-item-row" onclick="tambahKeKeranjang('${p.id}', 'part')">
                <span>[PART] ${p.nama} (Stok: ${p.stok})</span>
                <strong>Rp${p.harga.toLocaleString('id-ID')}</strong>
            </div>`;
    });

    // Filter Jasa
    if (modeKasirAktif === 'servis') {
        const jasas = db.jasa.filter(j => j.nama.toLowerCase().includes(key));
        jasas.forEach(j => {
            resBox.innerHTML += `
                <div class="search-item-row" onclick="tambahKeKeranjang('${j.id}', 'jasa')">
                    <span>[JASA] ${j.nama}</span>
                    <strong>Rp${j.harga.toLocaleString('id-ID')}</strong>
                </div>`;
        });
    }
}

function prosesSimpanTransaksi() {
    const listBelanja = getKeranjangAktif();
    if (listBelanja.length === 0) {
        alert("Tidak ada item di dalam keranjang!");
        return;
    }

    const total = parseFloat(document.getElementById("lblTotalAkhir").textContent.replace(/[^0-9]/g, '')) || 0;
    const bayar = parseFloat(document.getElementById("numBayar").value) || 0;

    if (bayar < total) {
        alert("Jumlah pembayaran masih kurang!");
        return;
    }

    const subtotal = total + (parseFloat(document.getElementById("numDiskon").value) || 0);
    const diskon = parseFloat(document.getElementById("numDiskon").value) || 0;

    const trxId = "TRX-" + Date.now();
    const trxData = {
        id: trxId,
        tanggal: new Date().toLocaleString('id-ID'),
        tipe: modeKasirAktif,
        items: [...listBelanja],
        subtotal: subtotal,
        diskon: diskon,
        total: total,
        bayar: bayar,
        kembali: bayar - total,
        komisiMekanik: 0
    };

    if (modeKasirAktif === 'servis') {
        const motor = db.antrian.find(m => m.id === sesiAktifId);
        trxData.plat = motor.plat;
        trxData.motor = motor.motor;
        trxData.mekanik = motor.mekanik;

        // Hitung Komisi Mekanik Realtime
        let komisi = 0;
        listBelanja.forEach(i => {
            if (i.tipe === 'jasa') {
                komisi += (i.harga * i.qty) * (db.settings.komisiJasa / 100);
            } else {
                komisi += (i.harga * i.qty) * (db.settings.komisiPart / 100);
            }
        });
        trxData.komisiMekanik = komisi;

        // Hapus dari antrian aktif karena sudah selesai bayar
        db.antrian = db.antrian.filter(m => m.id !== sesiAktifId);
    }

    // Pengurangan Stok Gudang
    listBelanja.forEach(item => {
        if (item.tipe === 'part') {
            const part = db.sparepart.find(p => p.id === item.id);
            if (part) part.stok = Math.max(0, part.stok - item.qty);
        }
    });

    db.transaksi.push(trxData);
    saveDB();

    // Jalankan Printer Struk Thermal
    cetakStrukOtoPOS(trxData);

    // Reset Kasir
    if (modeKasirAktif === 'part') {
        keranjangDirect = [];
    } else {
        sesiAktifId = db.antrian.length > 0 ? db.antrian[0].id : 'none';
    }

    document.getElementById("numDiskon").value = 0;
    document.getElementById("numBayar").value = "";
    
    renderAntrianList();
    loadKeranjangAktif();
    alert("Transaksi Berhasil Diproses!");
}

// ==========================================
// 6. GUDANG AMAN 500+ ITEM (PAGINASI + CARI)
// ==========================================
function renderGudangManajemen() {
    const tbody = document.getElementById("tblStokGudang");
    tbody.innerHTML = "";

    // Kalkulasi Halaman
    const totalItem = hasilFilterGudang.length;
    const totalHalaman = Math.ceil(totalItem / itemPerHalamanGudang) || 1;
    
    // Pastikan halaman aktif berada di range yang benar
    if (halamanGudangAktif > totalHalaman) halamanGudangAktif = totalHalaman;

    const indexAwal = (halamanGudangAktif - 1) * itemPerHalamanGudang;
    const indexAkhir = indexAwal + itemPerHalamanGudang;
    
    const itemDiHalamanIni = hasilFilterGudang.slice(indexAwal, indexAkhir);

    itemDiHalamanIni.forEach(p => {
        tbody.innerHTML += `
            <tr>
                <td><span style="font-family:monospace; background:#eee; padding:3px 5px; border-radius:3px;">${p.barcode}</span></td>
                <td><strong style="color:#1a237e;">${p.nama}</strong></td>
                <td>Rp${p.harga.toLocaleString('id-ID')}</td>
                <td><span class="badge ${p.stok <= 3 ? 'badge-part' : 'badge-servis'}">${p.stok} Pcs</span></td>
                <td>
                    <button onclick="editSparepart('${p.id}')" class="btn-edit-small">Edit</button>
                    <button onclick="hapusSparepart('${p.id}')" class="btn-delete-small">Hapus</button>
                </td>
            </tr>`;
    });

    // Update Label & tombol paginasi
    document.getElementById("lblHalamanGudang").textContent = `Halaman ${halamanGudangAktif} dari ${totalHalaman}`;
    document.getElementById("btnPrevGudang").disabled = halamanGudangAktif === 1;
    document.getElementById("btnNextGudang").disabled = halamanGudangAktif === totalHalaman;
}

function gantiHalamanGudang(arah) {
    halamanGudangAktif += arah;
    renderGudangManajemen();
}

function filterGudang() {
    const key = document.getElementById("txtCariGudang").value.toLowerCase();
    
    // Filter dari DB Master
    hasilFilterGudang = db.sparepart.filter(p => 
        p.nama.toLowerCase().includes(key) || p.barcode.includes(key)
    );
    
    halamanGudangAktif = 1; // Kembali ke halaman 1 saat pencarian dilakukan
    renderGudangManajemen();
}

function simpanSparepart() {
    const editId = document.getElementById("editPartId").value;
    const barcode = document.getElementById("addPartBarcode").value.trim();
    const nama = document.getElementById("addPartNama").value.trim();
    const harga = parseFloat(document.getElementById("addPartHarga").value) || 0;
    const stok = parseInt(document.getElementById("addPartStok").value) || 0;

    if (!nama || harga <= 0) {
        alert("Gagal! Nama sparepart dan harga wajib valid.");
        return;
    }

    if (editId) {
        // Edit Part
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
        // Tambah Part Baru
        const newID = "P-" + Date.now();
        db.sparepart.push({ id: newID, barcode, nama, harga, stok });
    }

    saveDB();
    
    // Update data tampilan filter
    hasilFilterGudang = [...db.sparepart];
    renderGudangManajemen();

    // Reset Form
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
    if (confirm("Hapus item ini dari gudang?")) {
        db.sparepart = db.sparepart.filter(p => p.id !== id);
        saveDB();
        hasilFilterGudang = [...db.sparepart];
        renderGudangManajemen();
    }
}

// ==========================================
// 7. DATA MEKANIK & JASA (KONTROL PENUH)
// ==========================================
function renderJasaManajemen() {
    const tbody = document.getElementById("tblJasa");
    tbody.innerHTML = "";
    db.jasa.forEach(j => {
        tbody.innerHTML += `
            <tr>
                <td><strong>${j.nama}</strong></td>
                <td>Rp${j.harga.toLocaleString('id-ID')}</td>
                <td><button onclick="hapusJasa('${j.id}')" class="btn-delete-small">Hapus</button></td>
            </tr>`;
    });
}

function tambahJasa() {
    const nama = document.getElementById("addJasaNama").value.trim();
    const harga = parseFloat(document.getElementById("addJasaHarga").value) || 0;

    if (!nama || harga <= 0) return alert("Masukan data jasa dengan benar!");

    db.jasa.push({ id: "J-" + Date.now(), nama, harga });
    saveDB();
    renderJasaManajemen();
    
    document.getElementById("addJasaNama").value = "";
    document.getElementById("addJasaHarga").value = "";
}

function hapusJasa(id) {
    if (confirm("Hapus jasa ini?")) {
        db.jasa = db.jasa.filter(j => j.id !== id);
        saveDB();
        renderJasaManajemen();
    }
}

function renderMekanikManajemen() {
    const list = document.getElementById("listMekanik");
    list.innerHTML = "";
    db.mekanik.forEach(m => {
        list.innerHTML += `
            <li>
                <span><strong>${m.nama}</strong></span>
                <button onclick="hapusMekanik('${m.id}')" class="btn-delete-small">Hapus</button>
            </li>`;
    });
}

function tambahMekanik() {
    const nama = document.getElementById("addMekanikNama").value.trim();
    if (!nama) return alert("Isi nama mekanik!");

    db.mekanik.push({ id: "M-" + Date.now(), nama });
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

// ==========================================
// 8. DASHBOARD LAPORAN OMSET & REKAP GAJI
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
                <td>${t.tanggal.split(' ')[0]}</td>
                <td><span class="badge ${t.tipe === 'part' ? 'badge-part' : 'badge-servis'}">${t.tipe.toUpperCase()}</span></td>
                <td class="bold">Rp${t.total.toLocaleString('id-ID')}</td>
                <td>${t.mekanik || '-'}</td>
                <td><button onclick="cetakUlangStruk('${t.id}')" class="btn-edit-small">Print</button></td>
            </tr>`;
    });

    // Hitung Komisi Mekanik per kepala
    const tbodyKomisi = document.getElementById("tblKomisiMekanik");
    tbodyKomisi.innerHTML = "";
    db.mekanik.forEach(mekanik => {
        let komisiMekanikVal = 0;
        db.transaksi.forEach(t => {
            if (t.mekanik === mekanik.nama) {
                komisiMekanikVal += t.komisiMekanik || 0;
            }
        });
        tbodyKomisi.innerHTML += `
            <tr>
                <td><strong>${mekanik.nama}</strong></td>
                <td class="bold" style="color: #2e7d32">Rp${komisiMekanikVal.toLocaleString('id-ID')}</td>
            </tr>`;
    });
}

function cetakUlangStruk(id) {
    const trx = db.transaksi.find(t => t.id === id);
    if (trx) cetakStrukOtoPOS(trx);
}

// ==========================================
// 9. SETTINGS SYSTEM
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
// 10. DRIVER PRINTER STRUK 58mm
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
            <div style="font-size:10px;">
                <div class="total-row"><span>Subtotal:</span><span>Rp${trx.subtotal.toLocaleString('id-ID')}</span></div>
                <div class="total-row"><span>Diskon:</span><span>Rp${trx.diskon.toLocaleString('id-ID')}</span></div>
                <div class="total-row grand-total"><span>TOTAL:</span><span>Rp${trx.total.toLocaleString('id-ID')}</span></div>
                <div class="total-row" style="margin-top: 3px;"><span>Bayar:</span><span>Rp${trx.bayar.toLocaleString('id-ID')}</span></div>
                <div class="total-row"><span>Kembali:</span><span>Rp${trx.kembali.toLocaleString('id-ID')}</span></div>
            </div>
            <div class="divider"></div>
            <div class="text-center" style="font-size: 9px; margin-top: 10px;">
                <p style="font-weight: bold;">TERIMA KASIH</p>
                ${trx.mekanik ? '<p>Garansi Servis Ringan 7 Hari</p>' : '<p>Barang tidak dapat ditukar</p>'}
                <p style="font-size: 7px; margin-top: 5px;">OtoPOS v2.0</p>
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