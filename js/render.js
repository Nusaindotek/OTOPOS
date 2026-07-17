/* =====================================================
   OTOPOS RENDER SYSTEM
   File : render.js
   Fungsi : Menampilkan seluruh data ke Dashboard
===================================================== */



// =====================================================
// RENDER SEMUA
// =====================================================

function renderUI(){

    renderDashboard();

    renderAntrean();

    renderKasir();

}



// =====================================================
// DASHBOARD
// =====================================================

function renderDashboard(){

    const omsetText =
        document.getElementById("omset-text");

    const selesaiText =
        document.getElementById("selesai-count");


    if(omsetText){

        omsetText.innerText =
            formatRupiah(omset);

    }


    if(selesaiText){

        selesaiText.innerText =
            selesaiCount + " Unit";

    }

}



// =====================================================
// RENDER WORK ORDER
// =====================================================

function renderAntrean(){

    const container =
        document.getElementById(
            "antrean-container"
        );

    if(!container) return;

    container.innerHTML = "";



    if(dataWorkOrder.length===0){

        container.innerHTML=`

        <div class="text-center text-gray-400 p-5">

            Tidak ada Work Order

        </div>

        `;

        return;

    }



    dataWorkOrder.forEach(wo=>{


        let warna="bg-red-50 border-red-300";

        if(wo.status==="Ready Bayar"){

            warna="bg-green-50 border-green-300";

        }

        else if(wo.status==="Menunggu Part"){

            warna="bg-yellow-50 border-yellow-300";

        }

        else if(wo.status==="QC"){

            warna="bg-blue-50 border-blue-300";

        }



        const card=document.createElement("div");

        card.className=
        `
        data-card
        border
        rounded-xl
        p-3
        cursor-pointer
        hover:shadow-lg
        ${warna}
        `;



        card.onclick=function(){

            bukaDetailServis(wo.id);

        };



        card.innerHTML=`

        <div class="flex justify-between">

            <div>

                <div class="font-bold">

                    ${wo.motor.nopol}

                </div>

                <div class="text-xs text-gray-500">

                    ${wo.motor.merk}
                    ${wo.motor.tipe}

                </div>

            </div>

            <div class="text-xs font-bold">

                ${wo.status}

            </div>

        </div>



        <hr class="my-2">



        <div class="text-xs">

            👤
            ${wo.pelanggan.nama}

        </div>


        <div class="text-xs mt-1">

            🔧
            ${wo.mekanik.map(x=>x.nama).join(", ")}

        </div>


        <div class="text-xs mt-1">

            Jasa :

            ${wo.jasa.length}

        </div>


        <div class="text-xs">

            Part :

            ${wo.part.length}

        </div>



        <div class="flex justify-between mt-3">

            <div class="text-sm font-bold">

                ${formatRupiah(wo.total)}

            </div>

            <div class="text-xs text-blue-600">

                ${wo.nomor}

            </div>

        </div>

        `;



        container.appendChild(card);



    });

}



// =====================================================
// KASIR
// =====================================================

function renderKasir(){

    const container =
        document.getElementById(
            "pesanan-container"
        );

    if(!container) return;

    container.innerHTML="";



    if(dataPesananLangsung.length===0){

        container.innerHTML=`

        <div class="text-center text-gray-400 p-5">

            Tidak ada transaksi

        </div>

        `;

        return;

    }



    dataPesananLangsung.forEach(item=>{


        const card=document.createElement("div");

        card.className=
        `
        data-card
        border
        border-green-200
        bg-green-50
        rounded-xl
        p-3
        cursor-pointer
        hover:shadow-lg
        `;



        card.onclick=function(){

            bayarLangsung(item.id);

        };



        card.innerHTML=`

        <div class="flex justify-between">

            <b>

                ${item.nama}

            </b>

            <span class="text-green-600">

                Bayar

            </span>

        </div>



        <div class="text-xs mt-2">

            ${item.part}

        </div>



        <div class="mt-2 font-bold">

            ${formatRupiah(item.total)}

        </div>

        `;



        container.appendChild(card);



    });

}



// =====================================================
// START
// =====================================================

document.addEventListener(

    "DOMContentLoaded",

    function(){

        renderUI();

    }

);