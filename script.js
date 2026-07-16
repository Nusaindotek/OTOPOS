let db = {
    setting: { nama: "Bengkel Maju Motor", telp: "08123456789", logo: "" },
    mekanik: [{ nama: "Udin", status: "Ready" }, { nama: "Wowo", status: "Ready" }],
    parts: [{ id: "p1", nama: "Oli MPX 1", kode: "OLI001", harga: 55000, stok: 13 }, { id: "p2", nama: "Enduro", kode: "OLI002", harga: 65000, stok: 99 }, { id: "p3", nama: "Dispad", kode: "REM001", harga: 15000, stok: 101 }],
    servisAktif: [],
    riwayat: [
        { id: "T1", type: "servis", nopol: "D123TRW", diagnosis: "Ganti Oli Mesin", tanggal: "15/7/2026, 12.31", mekanik: "Wowo", parts: [{ nama: "Enduro", qty: 1, harga: 65000 }], jasa: 25000, total: 90000, isGajianPaid: false },
        { id: "T2", type: "servis", nopol: "D1234TRE", diagnosis: "Servis Ringan + Rem", tanggal: "15/7/2026, 11.56", mekanik: "Udin", parts: [{ nama: "Enduro", qty: 2, harga: 65000 }, { nama: "Dispad", qty: 5, harga: 15000 }], jasa: 35000, total: 205000, isGajianPaid: false },
        { id: "T3", type: "servis", nopol: "B 1234 ABC", diagnosis: "Ganti Oli", tanggal: "15/7/2026, 11.54", mekanik: "Udin", parts: [{ nama: "Oli MPX 1", qty: 1, harga: 55000 }], jasa: 35000, total: 90000, isGajianPaid: false }
    ]
};
if (localStorage.getItem("OTOPOS_DB")) db = JSON.parse(localStorage.getItem("OTOPOS_DB"));

let tempLogoBase64 = "";
let activeDetailServisId = "";
let currentKasirMode = "servis";
let selectedServisId = "";
let directCart = [];

window.onload = function() {
    initDashboard();
    applyBannerLogo();
}

function saveDB() {
    localStorage.setItem("OTOPOS_DB", JSON.stringify(db));
}
function formatRupiah(num) {
    return "Rp " + num.toLocaleString('id-ID');
}
function applyBannerLogo() {
    const logoData = db.setting.logo;
    const bannerImg = document.getElementById("imgBannerLogo");
    if(logoData) {
        bannerImg.src = logoData;
        bannerImg.style.display = "block";
    } else {
        bannerImg.style.display = "none";
    }
}

function initDashboard() {
    document.getElementById("lblNamaBengkel").innerText = db.setting.nama;
    document.getElementById("lblTelpBengkel").innerText = db.setting.telp;
    let totalOmset = db.riwayat.reduce((sum, item) => sum + item.total, 0);
    document.getElementById("statOmset").innerText = formatRupiah(totalOmset);
    document.getElementById("statSelesai").innerText = db.riwayat.length;
    document.getElementById("statProses").innerText = db.servisAktif.length + " Kendaraan";
}

function switchMainTab(tab) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(`page-${tab}`).classList.add('active');
    document.getElementById(`nav-${tab}`).classList.add('active');
    document.getElementById("btnBack").style.display = "none";
    document.getElementById("btnAddTop").style.display = "none";
    document.getElementById("pageTitle").innerText = "OTOPOS";
    if(tab === 'kasir') initKasirPage();
    if(tab === 'laporan') renderLaporan();
    if(tab === 'home') initDashboard();
}

function openSubPage(sub) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(`page-sub-${sub}`).classList.add('active');
    document.getElementById("pageTitle").innerText = sub.replace('-',' ').toUpperCase();
    document.getElementById("btnBack").style.display = "block";
    if(['parts','mekanik','kendaraan'].includes(sub)) {
        document.getElementById("btnAddTop").style.display = "block";
        document.getElementById("btnAddTop").onclick = () => {
            document.getElementById("formTambah"+sub.charAt(0).toUpperCase()+sub.slice(1)).style.display='block';
        }
    }
    if(sub === 'setting') {
        document.getElementById("cfgNamaBengkel").value = db.setting.nama;
        document.getElementById("cfgTelpBengkel").value = db.setting.telp;
        document.getElementById("imgSettingPreview").src = db.setting.logo;
    }
    if(sub === 'parts') renderParts();
    if(sub === 'mekanik') renderMekanik();
    if(sub === 'kendaraan') renderKendaraan();
    if(sub === 'riwayat') renderRiwayat();
}
function navBack(){
    switchMainTab("home");
}

function previewDanProsesLogo(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        tempLogoBase64 = e.target.result;
        document.getElementById("imgSettingPreview").src = tempLogoBase64;
    };
    reader.readAsDataURL(file);
}
function simpanSettingBengkel() {
    db.setting.nama = document.getElementById("cfgNamaBengkel").value;
    db.setting.telp = document.getElementById("cfgTelpBengkel").value;
    if(tempLogoBase64) db.setting.logo = tempLogoBase64;
    saveDB();
    applyBannerLogo();
    alert("Tersimpan!");
    switchMainTab("home");
}

function renderKendaraan() {
    const list = document.getElementById("daftarKendaraanAktifList");
    list.innerHTML = "";
    if(db.servisAktif.length==0) list.innerHTML="<p style='text-align:center; padding:20px;'>Belum ada antrean</p>";
    db.servisAktif.forEach(s => {
        list.innerHTML += `<div class="card" onclick="bukaDetailServis('${s.id}')"><h4>${s.nopol}</h4><p>${s.motor}</p><small>Keluhan: ${s.diagnosis||'-'}</small></div>`;
    });
}
function simpanKendaraanBaru() {
    if(!document.getElementById("txtNamaMotor").value) return alert("Isi nama motor");
    db.servisAktif.push({id:"s"+Date.now(), motor:document.getElementById("txtNamaMotor").value, nopol:document.getElementById("txtNopol").value, diagnosis:"", mekanik:"", parts:[], jasa:0});
    saveDB();
    document.getElementById("formTambahKendaraan").style.display='none';
    document.getElementById("txtNamaMotor").value="";
    document.getElementById("txtNopol").value="";
    renderKendaraan();
}
function bukaDetailServis(id){
    activeDetailServisId=id;
    const s=db.servisAktif.find(x=>x.id===id);
    openSubPage('detail-servis');
    document.getElementById("detNopol").innerText=s.nopol;
    document.getElementById("detMotor").innerText=s.motor;
    document.getElementById("txtDetDiagnosis").value=s.diagnosis;
    document.getElementById("numDetJasa").value=s.jasa;
    document.getElementById("optDetMekanik").innerHTML='<option value="">Pilih</option>'+db.mekanik.map(m=>`<option ${s.mekanik===m.nama?'selected':''}>${m.nama}</option>`).join('');
    document.getElementById("optDetPart").innerHTML='<option value="">Pilih Part</option>'+db.parts.map(p=>`<option value="${p.id}">${p.nama}</option>`).join('');
    renderPartServis();
}
function renderPartServis(){
    const s=db.servisAktif.find(x=>x.id===activeDetailServisId);
    const box=document.getElementById("detPartTerpilihList");
    box.innerHTML="";
    s.parts.forEach(p=>{
        const meta=db.parts.find(x=>x.id===p.id);
        box.innerHTML+=`<div class="list-row"><span>${meta.nama} x${p.qty}</span><button class="btn-danger-sm" onclick="hapusPartServis('${p.id}')">Hapus</button></div>`
    });
}
function tambahPartKeServis(){
    const id=document.getElementById("optDetPart").value;
    if(!id)return;
    const s=db.servisAktif.find(x=>x.id===activeDetailServisId);
    const ex=s.parts.find(p=>p.id===id);
    if(ex)ex.qty++;
    else s.parts.push({id,qty:1});
    renderPartServis();
}
function hapusPartServis(id){
    const s=db.servisAktif.find(x=>x.id===activeDetailServisId);
    s.parts=s.parts.filter(p=>p.id!==id);
    renderPartServis();
}
function simpanDetailServisAktif(){
    const s=db.servisAktif.find(x=>x.id===activeDetailServisId);
    s.diagnosis=document.getElementById("txtDetDiagnosis").value;
    s.mekanik=document.getElementById("optDetMekanik").value;
    s.jasa=parseInt(document.getElementById("numDetJasa").value)||0;
    saveDB();
    alert("Tersimpan");
    navBack();
    renderKendaraan();
}

function renderParts() {
    const list = document.getElementById("daftarPartsList");
    list.innerHTML = "";
    db.parts.forEach(p => {
        list.innerHTML += `<div class="card"><div style="display:flex; justify-content:space-between;"><div><b>${p.nama}</b><br><small>Stok: ${p.stok}</small></div><span class="text-green">${formatRupiah(p.harga)}</span></div></div>`;
    });
}
function simpanPartBaru() {
    db.parts.push({id:"p"+Date.now(), nama:document.getElementById("txtPartNama").value, kode:document.getElementById("txtPartKode").value, harga:parseInt(document.getElementById("numPartHarga").value), stok:parseInt(document.getElementById("numPartStok").value)});
    saveDB();
    document.getElementById("formTambahPart").style.display='none';
    renderParts();
}

function renderMekanik() {
    const list = document.getElementById("daftarMekanikList");
    list.innerHTML = "";
    db.mekanik.forEach(m => {
        list.innerHTML += `<div class="card"><b>${m.nama}</b> <span class="badge">${m.status}</span></div>`;
    });
}
function simpanMekanikBaru() {
    db.mekanik.push({nama:document.getElementById("txtMekanikNama").value, status:"Ready"});
    saveDB();
    document.getElementById("formTambahMekanik").style.display='none';
    renderMekanik();
}

function renderRiwayat() {
    const list = document.getElementById("daftarRiwayatList");
    list.innerHTML = "";
    if(db.riwayat.length==0) list.innerHTML="<p style='text-align:center; padding:20px;'>Belum ada riwayat</p>";
    db.riwayat.forEach(r => {
        list.innerHTML += `<div class="card"><b>${r.nopol||'Penjualan Part'}</b> - ${formatRupiah(r.total)}<br><small>${r.tanggal}</small></div>`;
    });
}

function setKasirMode(mode) {
    currentKasirMode = mode;
    document.getElementById("modeServisBtn").className = mode === 'servis'? 'btn-primary' : 'btn-outline';
    document.getElementById("modePartBtn").className = mode === 'part'? 'btn-primary' : 'btn-outline';
    document.getElementById("formKasirServis").style.display = mode === 'servis'? "block" : "none";
    document.getElementById("formKasirPartDirect").style.display = mode === 'part'? "block" : "none";
    selectedServisId = "";
    directCart = [];
    hitungUlangTotalKasir();
}
function initKasirPage() {
    const sel = document.getElementById("optKendaraanServis");
    sel.innerHTML = `<option value="">Pilih Kendaraan</option>`;
    db.servisAktif.filter(s=>s.diagnosis).forEach(s => sel.innerHTML += `<option value="${s.id}">${s.nopol}</option>`);
    const selPart = document.getElementById("optPilihPartDirect");
    selPart.innerHTML = "";
    db.parts.forEach(p => selPart.innerHTML += `<option value="${p.id}">${p.nama} - ${formatRupiah(p.harga)}</option>`);
}
function addPartDirectToCart() {
    const id = document.getElementById("optPilihPartDirect").value;
    if(!id) return;
    const existing = directCart.find(item => item.id === id);
    if(existing) existing.qty++;
    else directCart.push({ id: id, qty: 1 });
    hitungUlangTotalKasir();
}
function updateDirectCartQty(id, val) {
    const item = directCart.find(i => i.id === id);
    if(!item) return;
    item.qty += val;
    if(item.qty <= 0) directCart = directCart.filter(i => i.id!== id);
    hitungUlangTotalKasir();
}
function hitungUlangTotalKasir() {
    const listContainer = document.getElementById("kasirItemsList");
    const lblTotal = document.getElementById("lblTotalBayar");
    listContainer.innerHTML = "";
    let grandTotal = 0;
    if (currentKasirMode === "servis" && selectedServisId) {
        const servis = db.servisAktif.find(s => s.id === selectedServisId);
        if (servis) {
            servis.parts.forEach(pRef =>{
                const p=db.parts.find(x=>x.id===pRef.id);
                grandTotal += (pRef.qty * p.harga);
                listContainer.innerHTML += `<div class="list-row"><span>${p.nama} x ${pRef.qty}</span><span>${formatRupiah(pRef.qty * p.harga)}</span></div>`;
            });
            grandTotal += servis.jasa;
            listContainer.innerHTML += `<div class="list-row"><span><strong>Jasa</strong></span><span><strong>${formatRupiah(servis.jasa)}</strong></span></div>`;
        }
    } else if (currentKasirMode === "part") {
        directCart.forEach(item => {
            const part = db.parts.find(p => p.id === item.id);
            if (part) {
                grandTotal += (item.qty * part.harga);
                listContainer.innerHTML += `<div class="list-row"><span>${part.nama}</span><div class="stock-control"><button class="btn-circle minus" onclick="updateDirectCartQty('${item.id}', -1)">-</button><span>${item.qty}</span><button class="btn-circle plus" onclick="updateDirectCartQty('${item.id}', 1)">+</button></div><span>${formatRupiah(item.qty * part.harga)}</span></div>`;
            }
        });
    }
    if(listContainer.innerHTML === "") listContainer.innerHTML = `<p style="text-align:center; color:#888;">Belum ada item</p>`;
    lblTotal.innerText = formatRupiah(grandTotal);
}
function prosesSimpanTransaksi() {
    let total = parseInt(document.getElementById("lblTotalBayar").innerText.replace(/[^0-9]/g, ''));
    if(total === 0) return alert("Belum ada item");
    if (currentKasirMode === "servis" && selectedServisId) {
        let index = db.servisAktif.findIndex(s => s.id === selectedServisId);
        let selesai = db.servisAktif.splice(index, 1)[0];
        selesai.total = total;
        selesai.tanggal = new Date().toLocaleString();
        selesai.isGajianPaid = false;
        db.riwayat.push(selesai);
        alert("Servis Selesai!");
    } else {
        db.riwayat.push({ type: "part", total: total, tanggal: new Date().toLocaleString(), isGajianPaid: true });
        directCart = [];
        alert("Penjualan Berhasil!");
    }
    saveDB();
    initKasirPage();
    hitungUlangTotalKasir();
    switchMainTab("home");
}
function loadActiveServiceToKasir() {
    selectedServisId = document.getElementById("optKendaraanServis").value;
    hitungUlangTotalKasir();
}

function renderLaporan() {
    let totalOmset = db.riwayat.reduce((sum, item) => sum + item.total, 0);
    document.getElementById("lapTotalOmset").innerText = formatRupiah(totalOmset);
    document.getElementById("lapJumlahServis").innerText = "Jumlah Transaksi: " + db.riwayat.length;

    const mekReport = {};
    db.riwayat.forEach(r => {
        if(r.mekanik && r.mekanik!== "-" &&!r.isGajianPaid) {
            mekReport[r.mekanik] = (mekReport[r.mekanik] || 0) + r.jasa;
        }
    });

    const mekList = document.getElementById("lapMekanikList");
    mekList.innerHTML = "";
    if(Object.keys(mekReport).length === 0) {
        mekList.innerHTML = `<p style="text-align:center; color:#999;">Semua jasa mekanik sudah digaji</p>`;
    } else {
        for(let mName in mekReport) {
            mekList.innerHTML += `
                <div class="list-row" style="cursor:pointer;" onclick="openDetailMekanik('${mName}')">
                    <span>🧑‍🔧 ${mName}</span>
                    <span class="text-green">${formatRupiah(mekReport[mName])}</span>
                </div>`;
        }
    }

    const prodReport = {};
    db.riwayat.forEach(r => {
        r.parts?.forEach(p => { prodReport[p.nama] = (prodReport[p.nama] || 0) + p.qty; });
    });
    const prodList = document.getElementById("lapProdukTerjualList");
    prodList.innerHTML = "";
    for(let pName in prodReport) {
        prodList.innerHTML += `<div class="list-row"><span>${pName}</span><span>${prodReport[pName]} pcs</span></div>`;
    }
}

function openDetailMekanik(namaMekanik) {
    openSubPage('detail-mekanik');
    document.getElementById('detMekanikNama').innerText = namaMekanik;

    const list = document.getElementById('detMekanikRiwayatList');
    list.innerHTML = "";
    let totalDetail = 0;

    const historiKerja = db.riwayat.filter(r => r.mekanik === namaMekanik &&!r.isGajianPaid);

    historiKerja.forEach(r => {
        totalDetail += r.jasa;
        list.innerHTML += `
            <div class="card" style="font-size:13px;">
                <div style="display:flex; justify-content:space-between;">
                    <span><b>${r.nopol}</b></span>
                    <span class="text-green">${formatRupiah(r.jasa)}</span>
                </div>
                <p style="color:#777; font-size:11px;">📅 ${r.tanggal}</p>
                <p>🛠️ ${r.diagnosis || 'Servis Umum'}</p>
            </div>
        `;
    });
    document.getElementById('detMekanikTotal').innerText = formatRupiah(totalDetail);
}

function resetGajianMingguan() {
    if(!confirm("Yakin mau reset pendapatan mekanik minggu ini? \nData transaksi tidak akan dihapus, hanya argo mekanik yg direset ke 0")) return;

    db.riwayat.forEach(r => {
        if (r.mekanik && r.mekanik!== "-") {
            r.isGajianPaid = true;
        }
    });

    saveDB();
    renderLaporan();
    alert("Pendapatan mekanik berhasil direset!");
}