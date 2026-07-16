/* =====================================================
   OTOPOS SERVICE SYSTEM
   File : servis.js
   Fungsi : proses data servis bengkel
===================================================== */



// ======================================
// BUKA FORM TAMBAH SERVIS
// ======================================

function bukaModalTambahServis(){


    if(dataAntrean.length >= 5){

        pesan(
            "Antrean penuh! Maksimal 5 motor."
        );

        return;

    }



    pesan(
        "Form Tambah Servis"
    );


}







// ======================================
// TAMBAH SERVIS BARU
// ======================================


function tambahServis(data){


    const servisBaru = {


        id:
        generateID(dataAntrean),


        nopol:
        data.nopol,


        motor:
        data.motor,


        mekanik:
        data.mekanik,


        jasa:
        data.jasa,


        part:
        data.part,


        total:
        Number(data.total),


        status:
        "Proses"


    };



    dataAntrean.push(
        servisBaru
    );



    renderUI();



    pesan(
        "Motor berhasil masuk antrean"
    );


}








// ======================================
// DETAIL SERVIS
// ======================================


function bukaDetailServis(id){



    const item =
    dataAntrean.find(
        x=>x.id===id
    );



    if(!item){

        return;

    }



    let detail = `

Nomor Polisi :
${item.nopol}


Motor :
${item.motor}


Mekanik :
${item.mekanik}


Jasa :
${item.jasa.join(", ")}


Part :
${item.part.join(", ")}


Total :
${formatRupiah(item.total)}

`;



    let lanjut =
    confirm(
        detail +
        "\n\nSelesaikan servis?"
    );



    if(lanjut){

        selesaiServis(
            id
        );

    }


}







// ======================================
// SELESAI SERVIS
// ======================================


function selesaiServis(id){



    const index =
    dataAntrean.findIndex(
        x=>x.id===id
    );



    if(index === -1){

        return;

    }




    const item =
    dataAntrean[index];



    omset +=
    item.total;



    selesaiCount++;



    dataAntrean.splice(
        index,
        1
    );



    renderUI();



    pesan(
        "Servis selesai. Pembayaran masuk " 
        +
        formatRupiah(item.total)
    );



}







// ======================================
// HAPUS SERVIS
// ======================================


function hapusServis(id){



    if(
        !konfirmasiHapus()
    ){

        return;

    }



    dataAntrean =
    dataAntrean.filter(
        x=>x.id!==id
    );



    renderUI();


}







// ======================================
// CARI SERVIS
// ======================================


function cariServis(keyword){



    return cariData(
        dataAntrean,
        keyword,
        "nopol"
    );


}
