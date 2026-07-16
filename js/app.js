/* =====================================================
   OTOPOS APPLICATION DATABASE
   File : app.js
   Fungsi : Menyimpan data utama aplikasi
===================================================== */


// ================================
// DATA SISTEM
// ================================


let omset = 720000;

let selesaiCount = 6;



// ================================
// DATA ANTREAN SERVIS
// ================================


let dataAntrean = [

    {
        id: 1,

        nopol: "B 1234 ABC",

        motor: "Honda Beat",

        mekanik: "Mas Joko",

        jasa: [
            "Servis Ringan",
            "Setting Karbu"
        ],

        part: [
            "Oli MPX2",
            "Busi NGK"
        ],

        total:125000,

        status:"Proses"
    },


    {
        id:2,

        nopol:"F 5678 XY",

        motor:"Yamaha NMax",

        mekanik:"Kang Dani",

        jasa:[
            "Ganti Kampas Rem"
        ],

        part:[
            "Kampas Rem Depan"
        ],

        total:95000,

        status:"Proses"
    },


    {
        id:3,

        nopol:"D 9012 EF",

        motor:"Suzuki Nex",

        mekanik:"Asep Knalpot",

        jasa:[
            "Tambal Ban"
        ],

        part:[
            "Cairan Tubeless"
        ],

        total:45000,

        status:"Proses"
    }

];





// ================================
// DATA KASIR LANGSUNG
// ================================


let dataPesananLangsung = [

    {
        id:101,

        nama:"Budi",

        part:"Oli SPX2",

        total:65000

    },


    {
        id:102,

        nama:"Andi",

        part:"Busi Champion",

        total:20000

    }

];






// ================================
// MASTER MEKANIK
// ================================


let dataMekanik = [

    {
        id:1,

        nama:"Mas Joko",

        telepon:"08123456789",

        alamat:"Jakarta",

        status:"Aktif"

    },


    {
        id:2,

        nama:"Kang Dani",

        telepon:"08234567890",

        alamat:"Bandung",

        status:"Aktif"

    },


    {
        id:3,

        nama:"Asep Knalpot",

        telepon:"08345678901",

        alamat:"Depok",

        status:"Aktif"

    }

];







// ================================
// MASTER PART
// ================================


let dataPart = [

    {
        id:1,

        kode:"OLI001",

        nama:"Oli MPX2",

        kategori:"Oli",

        harga:45000,

        stok:20

    },


    {
        id:2,

        kode:"BRK001",

        nama:"Kampas Rem Depan",

        kategori:"Rem",

        harga:55000,

        stok:15

    },


    {
        id:3,

        kode:"BUS001",

        nama:"Busi NGK",

        kategori:"Elektrik",

        harga:25000,

        stok:30

    }

];







// ================================
// SUPPLIER
// ================================


let dataSupplier = [

    {
        id:1,

        nama:"PT Oli Jaya",

        kontak:"081111111",

        alamat:"Jakarta"

    }

];







// ================================
// DATA MOTOR PELANGGAN
// ================================


let dataMotor = [];







// ================================
// TARIF JASA
// ================================


let dataTarif = [

    {
        id:1,

        jasa:"Servis Ringan",

        harga:80000

    },


    {
        id:2,

        jasa:"Turun Mesin",

        harga:450000

    },


    {
        id:3,

        jasa:"Tambal Ban",

        harga:20000

    }

];







// ================================
// USER APLIKASI
// ================================


let dataUser = [

    {
        id:1,

        nama:"Admin",

        username:"admin",

        level:"Administrator"

    }

];






// ================================
// KONFIGURASI
// ================================


let settingSystem = {

    namaBengkel:"Bengkel Maju Motor",

    alamat:"Jakarta",

    telepon:"08123456789",

    notaFooter:"Terima kasih sudah menggunakan jasa kami"

};





// ================================
// ID GENERATOR
// ================================


function generateID(array){

    if(array.length === 0){

        return 1;

    }


    return Math.max(
        ...array.map(item=>item.id)
    ) + 1;

}
