/* =====================================================
   OTOPOS CASHIER SYSTEM
   File : kasir.js
   Fungsi : transaksi penjualan bengkel
===================================================== */



// ======================================
// BUKA MENU PENJUALAN
// ======================================

function bukaModalJualLangsung(){


    pesan(
        "Form Penjualan Langsung"
    );


}







// ======================================
// TAMBAH PENJUALAN LANGSUNG
// ======================================


function tambahPenjualan(data){


    const transaksi = {


        id:
        generateID(
            dataPesananLangsung
        ),


        nama:
        data.nama || "Pembeli Umum",


        part:
        data.part,


        total:
        Number(data.total),


        tanggal:
        new Date()
        .toLocaleDateString(
            "id-ID"
        )


    };



    dataPesananLangsung.push(
        transaksi
    );



    renderUI();



    pesan(
        "Transaksi berhasil ditambahkan"
    );



}








// ======================================
// PROSES BAYAR
// ======================================


function bayarLangsung(id){



    const index =
    dataPesananLangsung.findIndex(
        x=>x.id===id
    );



    if(index === -1){

        return;

    }



    const transaksi =
    dataPesananLangsung[index];




    let bayar =
    confirm(

        "Bayar transaksi\n\n" +

        transaksi.nama +

        "\n" +

        transaksi.part +

        "\n\n" +

        formatRupiah(
            transaksi.total
        )

    );




    if(!bayar){

        return;

    }





    omset +=
    transaksi.total;



    selesaiCount++;





    dataPesananLangsung.splice(
        index,
        1
    );



    renderUI();




    pesan(

        "Pembayaran diterima\n" +

        formatRupiah(
            transaksi.total
        )

    );



}








// ======================================
// HAPUS TRANSAKSI
// ======================================


function hapusTransaksi(id){



    if(
        !konfirmasiHapus()
    ){

        return;

    }



    dataPesananLangsung =
    dataPesananLangsung.filter(
        x=>x.id!==id
    );



    renderUI();



}








// ======================================
// TOTAL PENJUALAN HARI INI
// ======================================


function totalPenjualanHariIni(){


    let total = 0;



    dataPesananLangsung.forEach(
        item=>{

            total +=
            item.total;

        }
    );



    return total;


}








// ======================================
// CARI TRANSAKSI
// ======================================


function cariTransaksi(keyword){



    return cariData(

        dataPesananLangsung,

        keyword,

        "nama"

    );


}
