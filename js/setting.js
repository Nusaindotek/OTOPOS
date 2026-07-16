/* =====================================================
   OTOPOS SETTING MENU CONTROL
   File : setting.js
   Fungsi : navigasi menu pengaturan
===================================================== */



// ======================================
// MENU SETTING
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

            modalMekanik();

            break;



        case "part":

            modalPart();

            break;



        case "supplier":

            modalSupplier();

            break;



        case "motor":

            modalMotor();

            break;



        case "tarif":

            modalTarif();

            break;



        case "user":

            modalUser();

            break;



        case "system":

            modalSystem();

            break;



        default:

            pesan(
                "Menu belum tersedia"
            );


    }


}









// ======================================
// MODAL SUPPLIER
// ======================================


function modalSupplier(){


tampilModal(`


<div class="modal-bg">


<div class="modal-box">


<div class="flex justify-between mb-4">

<h2 class="font-bold text-lg">
🏭 Supplier
</h2>


<button onclick="tutupSemuaModal()">
❌
</button>


</div>



<input id="sp-nama"
class="form-input mb-2"
placeholder="Nama Supplier">


<input id="sp-kontak"
class="form-input mb-2"
placeholder="Kontak">


<input id="sp-alamat"
class="form-input mb-3"
placeholder="Alamat">



<button onclick="simpanSupplier()"
class="bg-blue-600 text-white px-4 py-2 rounded">

Simpan

</button>


<hr class="my-4">


<div id="list-supplier"></div>


</div>


</div>


`);



renderSupplier();


}





function renderSupplier(){


const box =
document.getElementById(
"list-supplier"
);


if(!box)return;



box.innerHTML="";



dataSupplier.forEach(item=>{


box.innerHTML += `

<div class="border rounded p-3 mb-2">

<b>
${item.nama}
</b>

<br>

${item.kontak}


<button
onclick="hapusSupplier(${item.id})"
class="float-right text-red-600">

Hapus

</button>


</div>

`;


});


}






function simpanSupplier(){


tambahSupplier({

nama:
document.getElementById(
"sp-nama"
).value,


kontak:
document.getElementById(
"sp-kontak"
).value,


alamat:
document.getElementById(
"sp-alamat"
).value


});



renderSupplier();


}









// ======================================
// DATA MOTOR
// ======================================


function modalMotor(){


tampilModal(`


<div class="modal-bg">

<div class="modal-box">


<div class="flex justify-between">

<h2 class="font-bold text-lg">
🚲 Data Motor
</h2>


<button onclick="tutupSemuaModal()">
❌
</button>

</div>



<p class="mt-4 text-gray-500">

Data motor pelanggan

</p>



<div id="list-motor"
class="mt-3">

</div>


</div>

</div>


`);



renderMotor();


}




function renderMotor(){


const box =
document.getElementById(
"list-motor"
);


if(!box)return;


box.innerHTML="";


dataMotor.forEach(item=>{


box.innerHTML += `

<div class="border p-3 rounded mb-2">


<b>${item.nama}</b>

<br>

${item.motor}

<br>

${item.nopol}


</div>

`;


});


}









// ======================================
// TARIF JASA
// ======================================


function modalTarif(){


tampilModal(`

<div class="modal-bg">

<div class="modal-box">


<h2 class="font-bold text-lg">
💰 Tarif Jasa
</h2>


<div id="list-tarif"
class="mt-4">

</div>


</div>

</div>

`);


renderTarif();


}






function renderTarif(){


const box =
document.getElementById(
"list-tarif"
);


if(!box)return;



box.innerHTML="";



dataTarif.forEach(item=>{


box.innerHTML += `

<div class="border p-3 rounded mb-2">


<b>
${item.jasa}
</b>


<br>

${formatRupiah(item.harga)}


</div>


`;



});


}








// ======================================
// USER
// ======================================


function modalUser(){


tampilModal(`


<div class="modal-bg">

<div class="modal-box">


<h2 class="font-bold text-lg">
👤 Pengguna
</h2>



<div id="list-user"
class="mt-4">

</div>


</div>

</div>


`);



renderUser();


}





function renderUser(){


const box =
document.getElementById(
"list-user"
);


if(!box)return;



box.innerHTML="";



dataUser.forEach(item=>{


box.innerHTML += `

<div class="border p-3 rounded mb-2">

<b>
${item.nama}
</b>

<br>

${item.level}

</div>

`;



});


}








// ======================================
// SYSTEM
// ======================================


function modalSystem(){


tampilModal(`


<div class="modal-bg">

<div class="modal-box">


<h2 class="font-bold text-lg">
⚙️ Pengaturan Sistem
</h2>


<label class="form-label mt-4">
Nama Bengkel
</label>


<input 
class="form-input"
value="${settingSystem.namaBengkel}">



<label class="form-label mt-3">
Alamat
</label>


<input 
class="form-input"
value="${settingSystem.alamat}">



<button
class="bg-blue-600 text-white mt-4 px-4 py-2 rounded">

Simpan

</button>


</div>

</div>


`);


}
