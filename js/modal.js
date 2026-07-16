/* =====================================================
   OTOPOS MODAL SYSTEM
   File : modal.js
   Fungsi : membuat tampilan popup desktop
===================================================== */



// ======================================
// CONTAINER MODAL
// ======================================


function tampilModal(html){


    const container =
        document.getElementById(
            "modal-container"
        );


    container.innerHTML = html;


}






// ======================================
// TUTUP MODAL
// ======================================


function tutupSemuaModal(){


    const container =
        document.getElementById(
            "modal-container"
        );


    if(container){

        container.innerHTML="";

    }


}







// ======================================
// MODAL MEKANIK
// ======================================


function modalMekanik(){


tampilModal(`


<div class="modal-bg">


<div class="modal-box">


<div class="flex justify-between mb-4">


<h2 class="font-bold text-lg">
👨‍🔧 Data Mekanik
</h2>


<button onclick="tutupSemuaModal()">
❌
</button>


</div>



<input id="mk-nama"
class="form-input mb-2"
placeholder="Nama Mekanik">


<input id="mk-telp"
class="form-input mb-2"
placeholder="Nomor Telepon">


<input id="mk-alamat"
class="form-input mb-4"
placeholder="Alamat">


<button onclick="simpanMekanik()"
class="bg-blue-600 text-white px-4 py-2 rounded">

Simpan

</button>



<hr class="my-4">


<div id="list-mekanik"></div>


</div>

</div>


`);



renderMekanik();



}








function renderMekanik(){


const box =
document.getElementById(
"list-mekanik"
);



if(!box) return;



box.innerHTML="";



dataMekanik.forEach(item=>{


box.innerHTML += `

<div class="border p-3 rounded mb-2">


<b>${item.nama}</b>

<br>

<span class="text-sm">
${item.telepon}
</span>


<button
onclick="hapusMekanik(${item.id})"
class="float-right text-red-600">

Hapus

</button>


</div>

`;


});


}








function simpanMekanik(){


tambahMekanik({

nama:
document.getElementById(
"mk-nama"
).value,


telepon:
document.getElementById(
"mk-telp"
).value,


alamat:
document.getElementById(
"mk-alamat"
).value


});


renderMekanik();


}







// ======================================
// MODAL PART
// ======================================


function modalPart(){


tampilModal(`


<div class="modal-bg">


<div class="modal-box">


<div class="flex justify-between">


<h2 class="font-bold text-lg">
📦 Master Part
</h2>


<button onclick="tutupSemuaModal()">
❌
</button>


</div>




<input id="pt-nama"
class="form-input mt-4 mb-2"
placeholder="Nama Part">


<input id="pt-harga"
class="form-input mb-2"
placeholder="Harga">


<input id="pt-stok"
class="form-input mb-3"
placeholder="Stok">



<button onclick="simpanPart()"
class="bg-green-600 text-white px-4 py-2 rounded">

Simpan Part

</button>



<hr class="my-4">


<div id="list-part"></div>



</div>


</div>


`);



renderPart();


}







function renderPart(){


const box =
document.getElementById(
"list-part"
);



if(!box)return;



box.innerHTML="";



dataPart.forEach(item=>{


box.innerHTML += `

<div class="border rounded p-3 mb-2">


<b>${item.nama}</b>

<br>

Harga :
${formatRupiah(item.harga)}

<br>

Stok :
${item.stok}



<button
onclick="hapusPart(${item.id})"
class="float-right text-red-600">

Hapus

</button>


</div>

`;

});


}







function simpanPart(){



tambahPart({

kode:
"PART"+Date.now(),


nama:
document.getElementById(
"pt-nama"
).value,


kategori:
"Umum",


harga:
document.getElementById(
"pt-harga"
).value,


stok:
document.getElementById(
"pt-stok"
).value


});



renderPart();


}
