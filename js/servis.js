/* =====================================================
   OTOPOS SERVICE FORM DESKTOP
   Tambahan : modal tambah servis
===================================================== */



// ======================================
// FORM TAMBAH SERVIS
// ======================================


function bukaModalTambahServis(){



    if(dataAntrean.length >= 5){


        pesan(
            "Antrean servis penuh (maksimal 5 motor)"
        );


        return;

    }



tampilModal(`


<div class="modal-bg">


<div class="modal-box">


<div class="flex justify-between mb-4">


<h2 class="font-bold text-lg">
🔴 Terima Motor Baru
</h2>


<button onclick="tutupSemuaModal()">
❌
</button>


</div>





<label class="form-label">
Nomor Polisi
</label>


<input 
id="srv-nopol"
class="form-input mb-3"
placeholder="B 1234 ABC">






<label class="form-label">
Tipe Motor
</label>


<input
id="srv-motor"
class="form-input mb-3"
placeholder="Honda Beat / Nmax">






<label class="form-label">
Mekanik
</label>


<select
id="srv-mekanik"
class="form-input mb-3">


</select>








<label class="form-label">
Jasa Servis
</label>


<input
id="srv-jasa"
class="form-input mb-3"
placeholder="Servis ringan">







<label class="form-label">
Sparepart
</label>


<input
id="srv-part"
class="form-input mb-3"
placeholder="Oli, busi, dll">







<label class="form-label">
Total Biaya
</label>


<input
id="srv-total"
type="number"
class="form-input mb-4"
placeholder="125000">





<button
onclick="simpanServisBaru()"

class="bg-red-600 text-white px-5 py-2 rounded-lg">

Masukkan Antrean

</button>




</div>


</div>



`);




isiMekanikForm();


}









// ======================================
// ISI DROPDOWN MEKANIK
// ======================================


function isiMekanikForm(){



const select =
document.getElementById(
"srv-mekanik"
);



if(!select)return;




select.innerHTML="";



daftarNamaMekanik()
.forEach(
nama=>{


select.innerHTML += `

<option>
${nama}
</option>

`;


});



}









// ======================================
// SIMPAN SERVIS
// ======================================


function simpanServisBaru(){



const nopol =
document.getElementById(
"srv-nopol"
).value;



const motor =
document.getElementById(
"srv-motor"
).value;



const mekanik =
document.getElementById(
"srv-mekanik"
).value;



const jasa =
document.getElementById(
"srv-jasa"
).value;



const part =
document.getElementById(
"srv-part"
).value;



const total =
document.getElementById(
"srv-total"
).value;





if(
!nopol ||
!motor ||
!total
){


    pesan(
    "Nomor polisi, motor dan total wajib diisi"
    );


    return;


}






tambahServis({


nopol:nopol,


motor:motor,


mekanik:mekanik,


jasa:[
jasa
],


part:[
part
],


total:total



});






tutupSemuaModal();



}
