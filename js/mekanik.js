/* =====================================================
   OTOPOS MASTER MEKANIK
   File : mekanik.js
   Fungsi : CRUD data mekanik
===================================================== */



// ======================================
// TAMPIL DATA MEKANIK
// ======================================


function tampilMekanik(){


    let hasil = `

    DATA MEKANIK

    `;



    dataMekanik.forEach(
        item=>{


            hasil += `

-------------------------

ID :
${item.id}


Nama :
${item.nama}


Telepon :
${item.telepon}


Alamat :
${item.alamat}


Status :
${item.status}


`;



        }
    );



    pesan(hasil);



}








// ======================================
// BUKA DATA MEKANIK
// ======================================


function bukaDataMekanik(){


    tampilMekanik();



}








// ======================================
// TAMBAH MEKANIK
// ======================================


function tambahMekanik(data){



    const baru = {


        id:
        generateID(
            dataMekanik
        ),


        nama:
        data.nama,


        telepon:
        data.telepon,


        alamat:
        data.alamat,


        status:
        "Aktif"


    };




    dataMekanik.push(
        baru
    );




    pesan(
        "Mekanik berhasil ditambahkan"
    );



}








// ======================================
// EDIT MEKANIK
// ======================================


function editMekanik(id,data){



    const mekanik =
    dataMekanik.find(
        x=>x.id===id
    );



    if(!mekanik){

        pesan(
            "Data tidak ditemukan"
        );

        return;

    }




    mekanik.nama =
        data.nama;



    mekanik.telepon =
        data.telepon;



    mekanik.alamat =
        data.alamat;




    pesan(
        "Data mekanik diperbarui"
    );



}








// ======================================
// HAPUS MEKANIK
// ======================================


function hapusMekanik(id){



    if(
        !konfirmasiHapus()
    ){

        return;

    }




    dataMekanik =
    dataMekanik.filter(
        x=>x.id!==id
    );




    pesan(
        "Mekanik berhasil dihapus"
    );



}








// ======================================
// CARI MEKANIK
// ======================================


function cariMekanik(keyword){



    return cariData(

        dataMekanik,

        keyword,

        "nama"

    );


}







// ======================================
// PILIH MEKANIK UNTUK SERVIS
// ======================================


function daftarNamaMekanik(){



    return dataMekanik
    .filter(
        x=>x.status==="Aktif"
    )
    .map(
        x=>x.nama
    );


}
