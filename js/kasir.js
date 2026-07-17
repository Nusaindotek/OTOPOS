/* =====================================================
   OTOPOS KASIR
   File : kasir.js
===================================================== */



// ======================================
// BAYAR WORK ORDER
// ======================================

function bayarWorkOrder(id){

    const wo = getWorkOrder(id);

    if(!wo) return;

    hitungGrandTotal(id);

    omset += wo.grandTotal;

    selesaiCount++;

    wo.status = "Selesai";

    dataAntrean =
    dataAntrean.filter(
        item=>item.id!==id
    );

    renderUI();

    pesan(
        "Pembayaran berhasil"
    );

}



// ======================================
// BAYAR PENJUALAN LANGSUNG
// ======================================

function bayarLangsung(id){

    const trx =
    dataPesananLangsung.find(
        item=>item.id===id
    );

    if(!trx) return;

    omset += Number(trx.total);

    selesaiCount++;

    dataPesananLangsung =
    dataPesananLangsung.filter(
        item=>item.id!==id
    );

    renderUI();

    pesan(
        "Transaksi selesai"
    );

}



// ======================================
// BATAL PEMBAYARAN
// ======================================

function batalBayar(){

    pesan(
        "Pembayaran dibatalkan"
    );

}



// ======================================
// TOTAL TRANSAKSI
// ======================================

function totalTransaksiHariIni(){

    return omset;

}



// ======================================
// TOTAL MOTOR SELESAI
// ======================================

function totalMotorSelesai(){

    return selesaiCount;

}