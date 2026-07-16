/* =====================================================
   OTOPOS MASTER PART
   File : part.js
   Fungsi : CRUD data sparepart
===================================================== */



// ======================================
// TAMPIL DATA PART
// ======================================

function tampilPart(){


    let hasil = `

MASTER PART

`;



    dataPart.forEach(
        item=>{


            hasil += `

---------------------

Kode :
${item.kode}


Nama :
${item.nama}


Kategori :
${item.kategori}


Harga :
${formatRupiah(item.harga)}


Stok :
${item.stok}


`;



        }
    );



    pesan(hasil);


}







// ======================================
// BUKA MASTER PART
// ======================================

function bukaDataPart(){


    tampilPart();


}







// ======================================
// TAMBAH PART
// ======================================


function tambahPart(data){



    const baru = {


        id:
        generateID(
            dataPart
        ),



        kode:
        data.kode,



        nama:
        data.nama,



        kategori:
        data.kategori,



        harga:
        Number(data.harga),



        stok:
        Number(data.stok)



    };



    dataPart.push(
        baru
    );



    pesan(
        "Part berhasil ditambahkan"
    );


}







// ======================================
// EDIT PART
// ======================================


function editPart(id,data){



    const part =
    dataPart.find(
        x=>x.id===id
    );



    if(!part){


        pesan(
            "Part tidak ditemukan"
        );


        return;

    }





    part.nama =
        data.nama;



    part.kategori =
        data.kategori;



    part.harga =
        Number(data.harga);



    part.stok =
        Number(data.stok);




    pesan(
        "Data part diperbarui"
    );


}







// ======================================
// TAMBAH STOK
// ======================================


function tambahStokPart(id,jumlah){



    const part =
    dataPart.find(
        x=>x.id===id
    );



    if(!part){

        return;

    }



    part.stok +=
        Number(jumlah);



    pesan(
        "Stok berhasil ditambahkan"
    );


}







// ======================================
// KURANGI STOK
// ======================================


function kurangiStokPart(id,jumlah){



    const part =
    dataPart.find(
        x=>x.id===id
    );



    if(!part){

        return;

    }



    if(
        part.stok < jumlah
    ){

        pesan(
            "Stok tidak mencukupi"
        );


        return;

    }




    part.stok -=
        Number(jumlah);



}







// ======================================
// HAPUS PART
// ======================================


function hapusPart(id){



    if(
        !konfirmasiHapus()
    ){

        return;

    }



    dataPart =
    dataPart.filter(
        x=>x.id!==id
    );



    pesan(
        "Part berhasil dihapus"
    );


}







// ======================================
// CARI PART
// ======================================


function cariPart(keyword){



    return cariData(

        dataPart,

        keyword,

        "nama"

    );


}







// ======================================
// AMBIL HARGA PART
// ======================================


function hargaPart(id){



    const part =
    dataPart.find(
        x=>x.id===id
    );



    if(part){

        return part.harga;

    }



    return 0;


}







// ======================================
// CEK STOK
// ======================================


function cekStokPart(id){



    const part =
    dataPart.find(
        x=>x.id===id
    );



    return part
        ? part.stok
        : 0;


}
