/* =====================================================
   OTOPOS WORK ORDER ENGINE
   File : workorder.js
===================================================== */



// =====================================================
// CARI WORK ORDER
// =====================================================

function cariWorkOrder(id){

    return dataWorkOrder.find(
        wo => wo.id === id
    );

}



// =====================================================
// HITUNG TOTAL WORK ORDER
// =====================================================

function hitungTotalWorkOrder(id){

    const wo = cariWorkOrder(id);

    if(!wo) return 0;


    let totalJasa = 0;
    let totalPart = 0;


    wo.jasa.forEach(item=>{

        totalJasa += Number(item.harga);

    });


    wo.part.forEach(item=>{

        totalPart +=
            Number(item.qty) *
            Number(item.harga);

    });


    wo.subtotalJasa = totalJasa;
    wo.subtotalPart = totalPart;

    wo.total =
        totalJasa +
        totalPart;

}



// =====================================================
// TAMBAH JASA
// =====================================================

function tambahJasaWO(id,data){

    const wo = cariWorkOrder(id);

    if(!wo) return;



    wo.jasa.push({

        id: Date.now(),

        nama:data.nama,

        harga:Number(data.harga)

    });



    tambahTimeline(

        id,

        "Tambah jasa : " +
        data.nama

    );



    hitungTotalWorkOrder(id);

    renderUI();

}



// =====================================================
// TAMBAH PART
// =====================================================

function tambahPartWO(id,data){

    const wo = cariWorkOrder(id);

    if(!wo) return;



    wo.part.push({

        id:Date.now(),

        kode:data.kode,

        nama:data.nama,

        qty:Number(data.qty),

        harga:Number(data.harga)

    });



    tambahTimeline(

        id,

        "Tambah part : " +
        data.nama

    );



    hitungTotalWorkOrder(id);

    renderUI();

}



// =====================================================
// TAMBAH MEKANIK
// =====================================================

function tambahMekanikWO(id,data){

    const wo = cariWorkOrder(id);

    if(!wo) return;



    wo.mekanik.push({

        id:data.id,

        nama:data.nama,

        persentase:data.persentase,

        fee:0

    });



    tambahTimeline(

        id,

        "Tambah mekanik : " +
        data.nama

    );



    hitungFeeMekanik(id);

    renderUI();

}



// =====================================================
// UPDATE STATUS
// =====================================================

function ubahStatusWO(id,status){

    const wo = cariWorkOrder(id);

    if(!wo) return;



    wo.status = status;



    tambahTimeline(

        id,

        "Status menjadi " +
        status

    );



    renderUI();

}



// =====================================================
// TIMELINE
// =====================================================

function tambahTimeline(id,text){

    const wo = cariWorkOrder(id);

    if(!wo) return;



    const jam = new Date();

    const waktu =
        jam.getHours()
        .toString()
        .padStart(2,"0")

        + ":"

        +

        jam.getMinutes()
        .toString()
        .padStart(2,"0");



    wo.timeline.push({

        waktu:waktu,

        aktivitas:text

    });

}



// =====================================================
// HITUNG FEE MEKANIK
// =====================================================

function hitungFeeMekanik(id){

    const wo = cariWorkOrder(id);

    if(!wo) return;



    const totalJasa =
        wo.subtotalJasa;



    wo.mekanik.forEach(m=>{

        m.fee =
            totalJasa *
            (m.persentase/100);

    });

}



// =====================================================
// SELESAIKAN WORK ORDER
// =====================================================

function selesaiWorkOrder(id){

    const wo = cariWorkOrder(id);

    if(!wo) return;



    hitungTotalWorkOrder(id);

    hitungFeeMekanik(id);



    omset += wo.total;

    selesaiCount++;



    tambahTimeline(

        id,

        "Pembayaran selesai"

    );



    wo.status = "Selesai";



    renderUI();

}