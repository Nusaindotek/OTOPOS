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