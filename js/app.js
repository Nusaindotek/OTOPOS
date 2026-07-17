/* =====================================================
   OTOPOS APPLICATION DATABASE
   File : app.js
   Fungsi : Database Utama OTOPOS
===================================================== */



// =====================================================
// DASHBOARD
// =====================================================

let omset = 720000;

let selesaiCount = 6;



// =====================================================
// DATABASE WORK ORDER
// =====================================================

let dataWorkOrder = [

    {

        id : 1,

        nomor : "WO-20260001",

        status : "Proses",

        tanggal : new Date(),

        pelanggan : {
            nama : "Budi",
            telepon : "08123456789"
        },

        motor : {
            nopol : "B 1234 ABC",
            merk : "Honda",
            tipe : "Beat",
            kilometer : 12000
        },

        keluhan : [
            "Servis Berkala"
        ],

        diagnosa : [

        ],

        jasa : [

            {
                nama : "Servis Ringan",
                harga : 80000,
                fee : 40000
            },

            {
                nama : "Setting Karbu",
                harga : 20000,
                fee : 10000
            }

        ],

        part : [

            {
                nama : "Oli MPX2",
                qty : 1,
                harga : 45000
            }

        ],

        mekanik : [

            {
                id : 1,
                nama : "Mas Joko",
                pekerjaan : "Servis",
                fee : 50000
            }

        ],

        timeline : [

            {
                waktu : new Date(),
                aktivitas : "Work Order dibuat"
            }

        ],

        total : 145000

    },



    {

        id : 2,

        nomor : "WO-20260002",

        status : "Proses",

        tanggal : new Date(),

        pelanggan : {
            nama : "Andi",
            telepon : ""
        },

        motor : {
            nopol : "F 5678 XY",
            merk : "Yamaha",
            tipe : "NMAX",
            kilometer : 5000
        },

        keluhan : [
            "Rem depan bunyi"
        ],

        diagnosa : [

        ],

        jasa : [

            {
                nama : "Ganti Kampas Rem",
                harga : 40000,
                fee : 20000
            }

        ],

        part : [

            {
                nama : "Kampas Rem Depan",
                qty : 1,
                harga : 55000
            }

        ],

        mekanik : [

            {
                id : 2,
                nama : "Kang Dani",
                pekerjaan : "Rem",
                fee : 20000
            }

        ],

        timeline : [

            {
                waktu : new Date(),
                aktivitas : "Work Order dibuat"
            }

        ],

        total : 95000

    }

];



/* =====================================================
   KOMPATIBILITAS VERSI LAMA

   Sementara render.js masih memakai dataAntrean.

   Nantinya bagian ini akan dihapus.
===================================================== */

let dataAntrean = dataWorkOrder.map(item => ({

    id : item.id,

    nomor : item.nomor,

    nopol : item.motor.nopol,

    motor : item.motor.tipe,

    mekanik : item.mekanik.length
        ? item.mekanik.map(x=>x.nama).join(", ")
        : "-",

    jasa : item.jasa,

    part : item.part,

    total : item.total,

    status : item.status

}));



// =====================================================
// PENJUALAN LANGSUNG
// =====================================================

let dataPesananLangsung = [

    {

        id : 101,

        nama : "Budi",

        part : "Oli SPX2",

        total : 65000

    },

    {

        id : 102,

        nama : "Andi",

        part : "Busi Champion",

        total : 20000

    }

];



// =====================================================
// MASTER MEKANIK
// =====================================================

let dataMekanik = [

    {

        id : 1,

        nama : "Mas Joko",

        telepon : "08123456789",

        alamat : "Jakarta",

        status : "Aktif",

        persentase : 80

    },

    {

        id : 2,

        nama : "Kang Dani",

        telepon : "08234567890",

        alamat : "Bandung",

        status : "Aktif",

        persentase : 80

    },

    {

        id : 3,

        nama : "Asep Knalpot",

        telepon : "08345678901",

        alamat : "Depok",

        status : "Aktif",

        persentase : 80

    }

];



// =====================================================
// MASTER PART
// =====================================================

let dataPart = [

    {

        id : 1,

        kode : "OLI001",

        nama : "Oli MPX2",

        kategori : "Oli",

        hargaBeli : 35000,

        harga : 45000,

        stok : 20,

        stokMinimum : 5,

        supplier : "PT Oli Jaya"

    },

    {

        id : 2,

        kode : "BRK001",

        nama : "Kampas Rem Depan",

        kategori : "Rem",

        hargaBeli : 45000,

        harga : 55000,

        stok : 15,

        stokMinimum : 3,

        supplier : "PT Rem Indonesia"

    }

];



// =====================================================
// SUPPLIER
// =====================================================

let dataSupplier = [];



// =====================================================
// DATA MOTOR
// =====================================================

let dataMotor = [];



// =====================================================
// TARIF JASA
// =====================================================

let dataTarif = [

    {

        id : 1,

        jasa : "Servis Ringan",

        harga : 80000,

        feeDefault : 40000

    },

    {

        id : 2,

        jasa : "Turun Mesin",

        harga : 450000,

        feeDefault : 225000

    }

];



// =====================================================
// USER
// =====================================================

let dataUser = [

    {

        id : 1,

        nama : "Administrator",

        username : "admin",

        level : "Administrator"

    }

];



// =====================================================
// PENGATURAN
// =====================================================

let settingSystem = {

    namaBengkel : "Bengkel Maju Motor",

    alamat : "Jakarta",

    telepon : "08123456789",

    notaFooter : "Terima kasih telah mempercayakan kendaraan Anda."

};



// =====================================================
// GENERATOR ID
// =====================================================

function generateID(array){

    if(array.length===0){

        return 1;

    }

    return Math.max(...array.map(x=>x.id))+1;

}