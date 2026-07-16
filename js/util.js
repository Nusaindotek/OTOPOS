/* =====================================================
   OTOPOS UTILITY FUNCTION
   File : util.js
   Fungsi : fungsi bantuan umum aplikasi
===================================================== */



// ======================================
// FORMAT RUPIAH
// ======================================

function formatRupiah(angka){

    return "Rp " + Number(angka)
        .toLocaleString("id-ID");

}






// ======================================
// TOGGLE MENU SETTING
// ======================================

function toggleSettingMenu(){

    const menu = document.getElementById(
        "settingMenu"
    );


    if(menu){

        menu.classList.toggle("hidden");

    }

}






// ======================================
// TUTUP MENU SAAT KLIK LUAR
// ======================================


document.addEventListener(
    "click",
    function(event){


        const menu =
            document.getElementById(
                "settingMenu"
            );


        const tombol =
            event.target.closest(
                "header"
            );



        if(
            menu &&
            !tombol
        ){

            menu.classList.add(
                "hidden"
            );

        }


    }
);







// ======================================
// MODAL SYSTEM
// ======================================


function bukaModal(id){

    const modal =
        document.getElementById(id);


    if(modal){

        modal.classList.remove(
            "hidden"
        );

    }

}




function tutupModal(id){

    const modal =
        document.getElementById(id);


    if(modal){

        modal.classList.add(
            "hidden"
        );

    }

}






// ======================================
// NOTIFIKASI
// ======================================


function pesan(text){

    alert(text);

}







// ======================================
// VALIDASI INPUT
// ======================================


function cekInput(value){

    if(
        value === null ||
        value.trim() === ""
    ){

        return false;

    }


    return true;

}







// ======================================
// HAPUS DATA DENGAN KONFIRMASI
// ======================================


function konfirmasiHapus(){

    return confirm(
        "Yakin ingin menghapus data ini?"
    );

}







// ======================================
// CARI DATA ARRAY
// ======================================


function cariData(
    array,
    keyword,
    field
){


    keyword =
        keyword.toLowerCase();



    return array.filter(
        item =>
            String(item[field])
            .toLowerCase()
            .includes(keyword)
    );


}






// ======================================
// RESET FORM
// ======================================


function resetForm(id){

    const form =
        document.getElementById(id);


    if(form){

        form.reset();

    }

}
