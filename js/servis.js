/* =====================================================
   OTOPOS WORK ORDER ENGINE
   File : servis.js
   Fungsi : Mengelola seluruh proses servis bengkel
===================================================== */



// ======================================
// GENERATE NOMOR WORK ORDER
// ======================================

function generateNomorWO(){

    const now = new Date();

    return "WO-" +
        now.getFullYear() +
        String(now.getMonth()+1).padStart(2,"0") +
        String(now.getDate()).padStart(2,"0") +
        "-" +
        Date.now().toString().slice(-5);

}



// ======================================
// BUAT WORK ORDER BARU
// ======================================

function buatWorkOrder(data){

    const wo = {

        id : generateID(dataAntrean),

        nomor : generateNomorWO(),

        status : "Menunggu",

        tanggal : new Date(),

        pelanggan : data.pelanggan || "",

        telepon : data.telepon || "",

        nopol : data.nopol,

        motor : data.motor,

        kilometer : data.kilometer || 0,

        keluhan : data.keluhan || [],

        diagnosa : [],

        jasa : [],

        part : [],

        mekanik : [],

        timeline : [],

        total : 0

    };


    tambahTimeline(
        wo,
        "Work Order dibuat"
    );


    dataAntrean.push(wo);

    renderUI();

    return wo;

}



// ======================================
// TAMBAH JASA
// ======================================

function tambahJasa(id,data){

    const wo = cariWO(id);

    if(!wo) return;


    wo.jasa.push({

        id : Date.now(),

        nama : data.nama,

        harga : Number(data.harga),

        fee : Number(data.fee || 0)

    });


    tambahTimeline(
        wo,
        "Tambah jasa : " + data.nama
    );


    hitungTotalWO(wo);

}



// ======================================
// TAMBAH PART
// ======================================

function tambahPart(id,data){

    const wo = cariWO(id);

    if(!wo) return;


    wo.part.push({

        id : Date.now(),

        nama : data.nama,

        qty : Number(data.qty),

        harga : Number(data.harga)

    });


    tambahTimeline(
        wo,
        "Tambah part : " + data.nama
    );


    hitungTotalWO(wo);

}



// ======================================
// TAMBAH MEKANIK
// ======================================

function tambahMekanikWO(id,data){

    const wo = cariWO(id);

    if(!wo) return;


    wo.mekanik.push({

        id : data.id,

        nama : data.nama,

        pekerjaan : data.pekerjaan || "",

        fee : Number(data.fee || 0)

    });


    tambahTimeline(
        wo,
        "Mekanik : " + data.nama
    );

}



// ======================================
// TAMBAH DIAGNOSA
// ======================================

function tambahDiagnosa(id,text){

    const wo = cariWO(id);

    if(!wo) return;


    wo.diagnosa.push(text);


    tambahTimeline(
        wo,
        "Diagnosa ditambah"
    );

}



// ======================================
// UBAH STATUS
// ======================================

function ubahStatusWO(id,status){

    const wo = cariWO(id);

    if(!wo) return;


    wo.status = status;


    tambahTimeline(
        wo,
        "Status menjadi : " + status
    );


    renderUI();

}



// ======================================
// HITUNG TOTAL
// ======================================

function hitungTotalWO(wo){

    let total = 0;


    wo.jasa.forEach(item=>{

        total += Number(item.harga);

    });


    wo.part.forEach(item=>{

        total +=
            Number(item.qty) *
            Number(item.harga);

    });


    wo.total = total;

}



// ======================================
// HITUNG TOTAL FEE MEKANIK
// ======================================

function hitungFeeMekanik(idMekanik){

    let total = 0;


    dataAntrean.forEach(wo=>{

        wo.mekanik.forEach(m=>{

            if(m.id===idMekanik){

                total += Number(m.fee);

            }

        });

    });


    return total;

}



// ======================================
// TIMELINE
// ======================================

function tambahTimeline(wo,aktivitas){

    wo.timeline.push({

        waktu : new Date(),

        aktivitas : aktivitas

    });

}



// ======================================
// CARI WORK ORDER
// ======================================

function cariWO(id){

    return dataAntrean.find(
        item=>item.id===id
    );

}



// ======================================
// DETAIL WORK ORDER
// ======================================

function getWorkOrder(id){

    return cariWO(id);

}



// ======================================
// SELESAIKAN
// ======================================

function selesaikanWorkOrder(id){

    const wo = cariWO(id);

    if(!wo) return;


    wo.status = "Ready Bayar";


    tambahTimeline(
        wo,
        "Pekerjaan selesai"
    );


    renderUI();

}



// ======================================
// BATALKAN
// ======================================

function batalkanWorkOrder(id){

    const wo = cariWO(id);

    if(!wo) return;


    wo.status = "Batal";


    tambahTimeline(
        wo,
        "Work Order dibatalkan"
    );


    renderUI();

}
/* =====================================================
   FILE    : js/servis/antrean.js
   AKSI    : FULL FILE
   VERSI   : 1.0.0
===================================================== */

/*
======================================================
MODUL ANTREAN SERVIS
======================================================

Tugas :

- Membuat Work Order baru
- Menampilkan antrean
- Mengubah status
- Menghapus antrean
- Mencari antrean
- Mengambil data berdasarkan ID

======================================================
*/


// =====================================================
// TAMBAH ANTREAN BARU
// =====================================================

function tambahAntrean(data){

    const wo = {

        id : generateID(dataAntrean),

        invoice : data.invoice || "",

        nopol : data.nopol || "",

        pelanggan : data.pelanggan || "",

        telepon : data.telepon || "",

        motor : data.motor || "",

        km : data.km || 0,

        mekanik : [],

        jasa : [],

        part : [],

        diskon : 0,

        ppn : 0,

        subtotal : 0,

        grandTotal : 0,

        status : "Antrean",

        tanggal : new Date(),

        catatan : data.catatan || ""

    };


    dataAntrean.push(wo);

    renderUI();

    return wo;

}



// =====================================================
// CARI ANTREAN BERDASARKAN ID
// =====================================================

function cariAntrean(id){

    return dataAntrean.find(
        item=>item.id===id
    );

}



// =====================================================
// INDEX ANTREAN
// =====================================================

function indexAntrean(id){

    return dataAntrean.findIndex(
        item=>item.id===id
    );

}



// =====================================================
// HAPUS ANTREAN
// =====================================================

function hapusAntrean(id){

    const index = indexAntrean(id);

    if(index===-1){

        return false;

    }

    dataAntrean.splice(index,1);

    renderUI();

    return true;

}



// =====================================================
// GANTI STATUS
// =====================================================

function ubahStatusAntrean(
    id,
    status
){

    const wo = cariAntrean(id);

    if(!wo){

        return;

    }

    wo.status = status;

    renderUI();

}



// =====================================================
// PINDAH KE PROSES
// =====================================================

function mulaiServis(id){

    ubahStatusAntrean(
        id,
        "Proses"
    );

}



// =====================================================
// PINDAH KE MENUNGGU PART
// =====================================================

function tungguPart(id){

    ubahStatusAntrean(
        id,
        "Menunggu Part"
    );

}



// =====================================================
// PINDAH KE QC
// =====================================================

function prosesQC(id){

    ubahStatusAntrean(
        id,
        "QC"
    );

}



// =====================================================
// SIAP BAYAR
// =====================================================

function siapBayar(id){

    ubahStatusAntrean(
        id,
        "Siap Bayar"
    );

}



// =====================================================
// TOTAL ANTREAN
// =====================================================

function totalAntrean(){

    return dataAntrean.length;

}



// =====================================================
// ANTREAN AKTIF
// =====================================================

function antreanAktif(){

    return dataAntrean.filter(
        item=>item.status!=="Selesai"
    );

}



// =====================================================
// ANTREAN SELESAI
// =====================================================

function antreanSelesai(){

    return dataAntrean.filter(
        item=>item.status==="Selesai"
    );

}



// =====================================================
// CARI BERDASARKAN NOPOL
// =====================================================

function cariNopol(keyword){

    keyword =
    keyword.toLowerCase();

    return dataAntrean.filter(

        item=>

        item.nopol
        .toLowerCase()
        .includes(keyword)

    );

}



// =====================================================
// CARI PELANGGAN
// =====================================================

function cariPelanggan(keyword){

    keyword =
    keyword.toLowerCase();

    return dataAntrean.filter(

        item=>

        item.pelanggan
        .toLowerCase()
        .includes(keyword)

    );

}



// =====================================================
// REFRESH
// =====================================================

function refreshAntrean(){

    renderAntrean();

    renderDashboard();

}
/* =====================================================
   FILE    : js/servis/detail.js
   AKSI    : FULL FILE
   VERSI   : 1.0.0
===================================================== */

/*
======================================================
MODUL DETAIL WORK ORDER

Mengelola seluruh informasi pada 1 Work Order.

- Ambil detail WO
- Update data pelanggan
- Update motor
- Update KM
- Update catatan
- Hitung subtotal
- Hitung grand total

======================================================
*/


// =====================================================
// AMBIL WORK ORDER
// =====================================================

function getWorkOrder(id){

    return cariAntrean(id);

}



// =====================================================
// UPDATE DATA PELANGGAN
// =====================================================

function updatePelanggan(id,data){

    const wo=getWorkOrder(id);

    if(!wo) return;

    wo.pelanggan=data.pelanggan;

    wo.telepon=data.telepon;

    wo.nopol=data.nopol;

    wo.motor=data.motor;

    wo.km=Number(data.km);

    renderUI();

}



// =====================================================
// UPDATE CATATAN
// =====================================================

function updateCatatan(id,catatan){

    const wo=getWorkOrder(id);

    if(!wo) return;

    wo.catatan=catatan;

}



// =====================================================
// HITUNG TOTAL JASA
// =====================================================

function totalJasa(id){

    const wo=getWorkOrder(id);

    if(!wo) return 0;

    let total=0;

    wo.jasa.forEach(item=>{

        total+=Number(item.harga);

    });

    return total;

}



// =====================================================
// HITUNG TOTAL PART
// =====================================================

function totalPart(id){

    const wo=getWorkOrder(id);

    if(!wo) return 0;

    let total=0;

    wo.part.forEach(item=>{

        total+=
        Number(item.harga)*
        Number(item.qty);

    });

    return total;

}



// =====================================================
// SUBTOTAL
// =====================================================

function hitungSubtotal(id){

    const wo=getWorkOrder(id);

    if(!wo) return 0;

    wo.subtotal=
        totalJasa(id)+
        totalPart(id);

    return wo.subtotal;

}



// =====================================================
// GRAND TOTAL
// =====================================================

function hitungGrandTotal(id){

    const wo=getWorkOrder(id);

    if(!wo) return 0;

    hitungSubtotal(id);

    const diskon=
        Number(wo.diskon||0);

    const ppn=
        Number(wo.ppn||0);

    wo.grandTotal=
        wo.subtotal-
        diskon+
        ppn;

    return wo.grandTotal;

}



// =====================================================
// SET DISKON
// =====================================================

function setDiskon(id,nilai){

    const wo=getWorkOrder(id);

    if(!wo) return;

    wo.diskon=Number(nilai);

    hitungGrandTotal(id);

    renderUI();

}



// =====================================================
// SET PPN
// =====================================================

function setPPN(id,nilai){

    const wo=getWorkOrder(id);

    if(!wo) return;

    wo.ppn=Number(nilai);

    hitungGrandTotal(id);

    renderUI();

}



// =====================================================
// RINGKASAN WORK ORDER
// =====================================================

function ringkasanWO(id){

    const wo=getWorkOrder(id);

    if(!wo) return null;

    hitungGrandTotal(id);

    return{

        invoice:wo.invoice,

        pelanggan:wo.pelanggan,

        nopol:wo.nopol,

        motor:wo.motor,

        mekanik:wo.mekanik.length,

        jasa:wo.jasa.length,

        part:wo.part.length,

        subtotal:wo.subtotal,

        grandTotal:wo.grandTotal,

        status:wo.status

    };

}
/* =====================================================
   FILE    : js/servis/jasa.js
   AKSI    : FULL FILE
   VERSI   : 1.0.0
===================================================== */

/*
======================================================
MODUL JASA SERVIS

Mengelola jasa pada Work Order.

- Tambah jasa
- Edit harga jasa
- Hapus jasa
- Total jasa
- Pendapatan mekanik

======================================================
*/


// =====================================================
// TAMBAH JASA
// =====================================================

function tambahJasa(id,data){

    const wo=getWorkOrder(id);

    if(!wo) return;

    const jasa={

        id:Date.now(),

        nama:data.nama,

        harga:Number(data.harga),

        keterangan:data.keterangan||"",

        mekanik:data.mekanik||[]

    };

    wo.jasa.push(jasa);

    hitungGrandTotal(id);

    renderUI();

}



// =====================================================
// EDIT HARGA JASA
// =====================================================

function editHargaJasa(
    id,
    jasaId,
    harga
){

    const wo=getWorkOrder(id);

    if(!wo) return;

    const jasa=
    wo.jasa.find(
        item=>item.id===jasaId
    );

    if(!jasa) return;

    jasa.harga=Number(harga);

    hitungGrandTotal(id);

    renderUI();

}



// =====================================================
// EDIT NAMA JASA
// =====================================================

function editNamaJasa(
    id,
    jasaId,
    nama
){

    const wo=getWorkOrder(id);

    if(!wo) return;

    const jasa=
    wo.jasa.find(
        item=>item.id===jasaId
    );

    if(!jasa) return;

    jasa.nama=nama;

    renderUI();

}



// =====================================================
// HAPUS JASA
// =====================================================

function hapusJasa(
    id,
    jasaId
){

    const wo=getWorkOrder(id);

    if(!wo) return;

    wo.jasa=
    wo.jasa.filter(
        item=>item.id!==jasaId
    );

    hitungGrandTotal(id);

    renderUI();

}



// =====================================================
// TOTAL JASA
// =====================================================

function jumlahJasa(id){

    const wo=getWorkOrder(id);

    if(!wo) return 0;

    return wo.jasa.length;

}



// =====================================================
// TOTAL NILAI JASA
// =====================================================

function nilaiJasa(id){

    const wo=getWorkOrder(id);

    if(!wo) return 0;

    let total=0;

    wo.jasa.forEach(item=>{

        total+=Number(item.harga);

    });

    return total;

}



// =====================================================
// TAMBAH MEKANIK KE JASA
// =====================================================

function tambahMekanikJasa(
    id,
    jasaId,
    mekanikId
){

    const wo=getWorkOrder(id);

    if(!wo) return;

    const jasa=
    wo.jasa.find(
        item=>item.id===jasaId
    );

    if(!jasa) return;

    if(!jasa.mekanik){

        jasa.mekanik=[];

    }

    if(
        !jasa.mekanik.includes(
            mekanikId
        )
    ){

        jasa.mekanik.push(
            mekanikId
        );

    }

}



// =====================================================
// HAPUS MEKANIK DARI JASA
// =====================================================

function hapusMekanikJasa(
    id,
    jasaId,
    mekanikId
){

    const wo=getWorkOrder(id);

    if(!wo) return;

    const jasa=
    wo.jasa.find(
        item=>item.id===jasaId
    );

    if(!jasa) return;

    jasa.mekanik=
    jasa.mekanik.filter(
        item=>item!==mekanikId
    );

}



// =====================================================
// PENDAPATAN MEKANIK
// =====================================================

function pendapatanMekanik(
    mekanikId
){

    let total=0;

    dataAntrean.forEach(wo=>{

        wo.jasa.forEach(jasa=>{

            if(
                jasa.mekanik &&
                jasa.mekanik.includes(
                    mekanikId
                )
            ){

                total+=
                Number(jasa.harga);

            }

        });

    });

    return total;

}



// =====================================================
// TOTAL JASA SEMUA WO
// =====================================================

function totalJasaSemuaWO(){

    let total=0;

    dataAntrean.forEach(wo=>{

        wo.jasa.forEach(item=>{

            total+=Number(item.harga);

        });

    });

    return total;

}