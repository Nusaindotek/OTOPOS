// =====================================================
// DETAIL WORK ORDER
// =====================================================

function bukaDetailServis(id){

    const wo = cariWorkOrder(id);

    if(!wo) return;



    let html = `

<div class="modal-bg">

<div class="modal-box max-w-5xl">

<div class="flex justify-between items-center mb-4">

<div>

<h2 class="text-xl font-bold">

${wo.nomor}

</h2>

<div class="text-sm text-gray-500">

Status :
<b>${wo.status}</b>

</div>

</div>

<button
onclick="tutupSemuaModal()"
class="text-red-600 text-xl">

✖

</button>

</div>



<div class="grid grid-cols-2 gap-4">



<!-- ================= DATA MOTOR ================= -->

<div class="border rounded p-3">

<h3 class="font-bold mb-2">

DATA KENDARAAN

</h3>

<table class="text-sm w-full">

<tr>

<td>No Polisi</td>

<td>${wo.motor.nopol}</td>

</tr>

<tr>

<td>Motor</td>

<td>

${wo.motor.merk}
${wo.motor.tipe}

</td>

</tr>

<tr>

<td>Pemilik</td>

<td>

${wo.pelanggan.nama}

</td>

</tr>

<tr>

<td>HP</td>

<td>

${wo.pelanggan.hp}

</td>

</tr>

</table>

</div>



<!-- ================= TOTAL ================= -->

<div class="border rounded p-3 bg-green-50">

<h3 class="font-bold mb-2">

TOTAL

</h3>

<div>

Jasa :
${formatRupiah(wo.subtotalJasa)}

</div>

<div>

Part :
${formatRupiah(wo.subtotalPart)}

</div>

<hr class="my-2">

<div class="font-bold text-lg">

${formatRupiah(wo.total)}

</div>

</div>

</div>



<!-- ================================================= -->

<div class="grid grid-cols-3 gap-4 mt-5">



<!-- ================= MEKANIK ================= -->

<div class="border rounded p-3">

<div class="flex justify-between mb-3">

<b>MEKANIK</b>

<button
onclick="modalTambahMekanik(${wo.id})"
class="text-blue-600">

+ Tambah

</button>

</div>

<div id="list-mekanik-wo">

`;



    wo.mekanik.forEach(m=>{

        html += `

<div class="border rounded p-2 mb-2">

<div class="font-bold">

${m.nama}

</div>

<div class="text-xs">

${m.persentase} %

</div>

<div class="text-xs text-green-700">

Fee :

${formatRupiah(m.fee)}

</div>

</div>

`;

    });



html += `

</div>

</div>



<!-- ================= JASA ================= -->

<div class="border rounded p-3">

<div class="flex justify-between mb-3">

<b>JASA</b>

<button
onclick="modalTambahJasa(${wo.id})"
class="text-blue-600">

+ Tambah

</button>

</div>

`;



wo.jasa.forEach(j=>{

html += `

<div class="border rounded p-2 mb-2">

<div>

${j.nama}

</div>

<div class="text-green-700">

${formatRupiah(j.harga)}

</div>

</div>

`;

});



html += `

</div>



<!-- ================= PART ================= -->

<div class="border rounded p-3">

<div class="flex justify-between mb-3">

<b>PART</b>

<button
onclick="modalTambahPart(${wo.id})"
class="text-blue-600">

+ Tambah

</button>

</div>

`;



wo.part.forEach(p=>{

html += `

<div class="border rounded p-2 mb-2">

<div>

${p.nama}

</div>

<div class="text-xs">

${p.qty} x

${formatRupiah(p.harga)}

</div>

</div>

`;

});



html += `

</div>

</div>



<!-- ================= TIMELINE ================= -->

<div class="border rounded p-3 mt-5">

<div class="font-bold mb-2">

TIMELINE

</div>

`;



wo.timeline.forEach(t=>{

html += `

<div class="text-sm border-b py-1">

${t.waktu}

-

${t.aktivitas}

</div>

`;

});



html += `

</div>



<div class="flex gap-2 mt-5 flex-wrap">

<button
onclick="ubahStatusWO(${wo.id},'Menunggu Part')"
class="bg-yellow-500 text-white px-4 py-2 rounded">

Menunggu Part

</button>

<button
onclick="ubahStatusWO(${wo.id},'QC')"
class="bg-blue-600 text-white px-4 py-2 rounded">

QC

</button>

<button
onclick="ubahStatusWO(${wo.id},'Ready Bayar')"
class="bg-green-600 text-white px-4 py-2 rounded">

Ready Bayar

</button>

<button
onclick="selesaiWorkOrder(${wo.id})"
class="bg-red-600 text-white px-4 py-2 rounded">

Selesaikan

</button>

</div>

</div>

</div>

`;



    tampilModal(html);

}