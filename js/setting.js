/* =====================================================
   OTOPOS SETTING MENU
   File : setting.js
   Fungsi : menu pengaturan aplikasi
===================================================== */



// ======================================
// BUKA MENU SETTING
// ======================================

function bukaMenu(menu){


    // tutup dropdown

    const dropdown =
        document.getElementById(
            "settingMenu"
        );


    if(dropdown){

        dropdown.classList.add(
            "hidden"
        );

    }



    switch(menu){


        case "mekanik":

            bukaDataMekanik();

            break;



        case "part":

            bukaDataPart();

            break;



        case "supplier":

            bukaDataSupplier();

            break;



        case "motor":

            bukaDataMotor();

            break;



        case "tarif":

            bukaDataTarif();

            break;



        case "user":

            bukaDataUser();

            break;



        case "system":

            bukaPengaturanSystem();

            break;



        default:

            pesan(
                "Menu tidak tersedia"
            );

    }


}







// ======================================
// MENU DATA MEKANIK
// ======================================

function bukaDataMekanik(){

    pesan(
        "Membuka Data Mekanik"
    );


    /*
       Nanti akan diganti
       dengan modal tabel mekanik
    */

}






// ======================================
// MENU MASTER PART
// ======================================

function bukaDataPart(){

    pesan(
        "Membuka Master Part"
    );


}







// ======================================
// MENU SUPPLIER
// ======================================

function bukaDataSupplier(){

    pesan(
        "Membuka Data Supplier"
    );


}







// ======================================
// DATA MOTOR
// ======================================

function bukaDataMotor(){

    pesan(
        "Membuka Data Motor Pelanggan"
    );


}







// ======================================
// TARIF JASA
// ======================================

function bukaDataTarif(){

    pesan(
        "Membuka Tarif Jasa"
    );


}







// ======================================
// USER
// ======================================

function bukaDataUser(){

    pesan(
        "Membuka Data Pengguna"
    );


}







// ======================================
// PENGATURAN SISTEM
// ======================================

function bukaPengaturanSystem(){

    pesan(
        "Membuka Pengaturan Sistem"
    );


}

