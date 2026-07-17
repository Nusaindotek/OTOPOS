/* =====================================================
   OTOPOS
   Version : 1.0.0
   File : util.js
   Module : Core Utility
   Fungsi : Helper yang digunakan seluruh sistem
===================================================== */



// ======================================
// FORMAT RUPIAH
// ======================================

function formatRupiah(angka){

    angka = Number(angka) || 0;

    return "Rp " +
        angka.toLocaleString(
            "id-ID"
        );

}



// ======================================
// FORMAT TANGGAL
// ======================================

function formatTanggal(tanggal = new Date()){

    return tanggal.toLocaleDateString(
        "id-ID",
        {
            day:"2-digit",
            month:"2-digit",
            year:"numeric"
        }
    );

}



// ======================================
// FORMAT JAM
// ======================================

function formatJam(tanggal = new Date()){

    return tanggal.toLocaleTimeString(
        "id-ID",
        {
            hour:"2-digit",
            minute:"2-digit"
        }
    );

}



// ======================================
// POPUP PESAN
// ======================================

function pesan(teks){

    alert(teks);

}



// ======================================
// KONFIRMASI
// ======================================

function konfirmasi(teks){

    return confirm(teks);

}



// ======================================
// KONFIRMASI HAPUS
// ======================================

function konfirmasiHapus(){

    return confirm(
        "Yakin ingin menghapus data ini?"
    );

}



// ======================================
// DOM HELPER
// ======================================

function getEl(id){

    return document.getElementById(id);

}



function setHTML(id, html){

    const el = getEl(id);

    if(el){

        el.innerHTML = html;

    }

}



function showElement(id){

    const el = getEl(id);

    if(el){

        el.classList.remove("hidden");

    }

}



function hideElement(id){

    const el = getEl(id);

    if(el){

        el.classList.add("hidden");

    }

}



// ======================================
// VALIDASI
// ======================================

function isEmpty(value){

    if(value === null) return true;

    if(value === undefined) return true;

    if(value.toString().trim()===""){

        return true;

    }

    return false;

}



// ======================================
// GENERATE NOMOR INVOICE
// ======================================

function generateInvoice(){

    const now = new Date();

    return "INV-" +

        now.getFullYear() +

        String(
            now.getMonth()+1
        ).padStart(2,"0") +

        String(
            now.getDate()
        ).padStart(2,"0") +

        "-" +

        Date.now()
            .toString()
            .slice(-5);

}



// ======================================
// TOGGLE MENU SETTING
// ======================================

function toggleSettingMenu(){

    const menu =
        getEl(
            "settingMenu"
        );

    if(!menu) return;

    menu.classList.toggle(
        "hidden"
    );

}



// ======================================
// TUTUP MENU SETTING
// SAAT KLIK DI LUAR MENU
// ======================================

document.addEventListener(
    "click",
    function(e){

        const menu =
            getEl("settingMenu");

        if(!menu) return;

        if(
            !menu.contains(e.target) &&
            !e.target.closest("button")
        ){

            menu.classList.add(
                "hidden"
            );

        }

    }
);