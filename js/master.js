/* =====================================================
   OTOPOS MASTER DATA
   File : master.js
   Fungsi : supplier, motor, tarif, user, sistem
===================================================== */



// =====================================================
// SUPPLIER
// =====================================================


function bukaDataSupplier(){

    tampilSupplier();

}



function tampilSupplier(){


    let hasil = `
DATA SUPPLIER

`;



    dataSupplier.forEach(item=>{


        hasil += `

------------------

Nama:
${item.nama}

Kontak:
${item.kontak}

Alamat:
${item.alamat}


`;

    });



    pesan(hasil);


}





function tambahSupplier(data){


    dataSupplier.push({

        id:
        generateID(dataSupplier),

        nama:
        data.nama,

        kontak:
        data.kontak,

        alamat:
        data.alamat

    });


    pesan(
        "Supplier berhasil ditambahkan"
    );

}







function hapusSupplier(id){


    if(!konfirmasiHapus()){

        return;

    }


    dataSupplier =
    dataSupplier.filter(
        x=>x.id!==id
    );


    pesan(
        "Supplier dihapus"
    );

}







// =====================================================
// DATA MOTOR PELANGGAN
// =====================================================


function bukaDataMotor(){


    tampilMotor();


}





function tampilMotor(){


    let hasil = `
DATA MOTOR PELANGGAN

`;



    dataMotor.forEach(item=>{


        hasil += `

------------------

Nama:
${item.nama}

Nopol:
${item.nopol}

Motor:
${item.motor}


`;

    });



    pesan(hasil);


}







function tambahMotor(data){



    dataMotor.push({

        id:
        generateID(dataMotor),

        nama:
        data.nama,

        nopol:
        data.nopol,

        motor:
        data.motor


    });



    pesan(
        "Data motor ditambahkan"
    );

}







// =====================================================
// TARIF JASA
// =====================================================


function bukaDataTarif(){


    tampilTarif();


}





function tampilTarif(){


    let hasil = `
TARIF JASA

`;



    dataTarif.forEach(item=>{


        hasil += `

----------------

${item.jasa}

Harga:
${formatRupiah(item.harga)}


`;

    });



    pesan(hasil);


}







function tambahTarif(data){



    dataTarif.push({

        id:
        generateID(dataTarif),

        jasa:
        data.jasa,

        harga:
        Number(data.harga)

    });



    pesan(
        "Tarif jasa ditambahkan"
    );

}








function editTarif(id,harga){



    const tarif =
    dataTarif.find(
        x=>x.id===id
    );



    if(tarif){


        tarif.harga =
        Number(harga);



        pesan(
            "Harga jasa diperbarui"
        );

    }


}








// =====================================================
// USER APLIKASI
// =====================================================


function bukaDataUser(){


    tampilUser();


}





function tampilUser(){


    let hasil = `
DATA USER

`;



    dataUser.forEach(item=>{


        hasil += `

----------------

Nama:
${item.nama}

Username:
${item.username}

Level:
${item.level}


`;

    });



    pesan(hasil);


}







function tambahUser(data){



    dataUser.push({

        id:
        generateID(dataUser),

        nama:
        data.nama,

        username:
        data.username,

        level:
        data.level


    });



    pesan(
        "User berhasil dibuat"
    );


}







function hapusUser(id){



    dataUser =
    dataUser.filter(
        x=>x.id!==id
    );



    pesan(
        "User dihapus"
    );

}








// =====================================================
// PENGATURAN SISTEM
// =====================================================


function bukaPengaturanSystem(){


    let hasil = `

PENGATURAN SISTEM


Nama Bengkel:
${settingSystem.namaBengkel}


Alamat:
${settingSystem.alamat}


Telepon:
${settingSystem.telepon}


Footer Nota:
${settingSystem.notaFooter}


`;



    pesan(hasil);


}







function simpanPengaturan(data){



    settingSystem.namaBengkel =
        data.nama;


    settingSystem.alamat =
        data.alamat;


    settingSystem.telepon =
        data.telepon;


    settingSystem.notaFooter =
        data.footer;



    pesan(
        "Pengaturan berhasil disimpan"
    );


}
