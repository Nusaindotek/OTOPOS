/* =====================================================
   OTOPOS RENDER SYSTEM
   File : render.js
   Fungsi : menampilkan data ke halaman
===================================================== */





// ======================================
// RENDER SEMUA TAMPILAN
// ======================================

function renderUI(){

    renderDashboard();

    renderAntrean();

    renderKasir();

}







// ======================================
// DASHBOARD
// ======================================


function renderDashboard(){


    const omset =
        document.getElementById(
            "omset-text"
        );


    const selesai =
        document.getElementById(
            "selesai-count"
        );



    if(omset){

        omset.innerText =
            formatRupiah(omsetGlobal());

    }



    if(selesai){

        selesai.innerText =
            selesaiCount + " Unit";

    }


}







// ======================================
// TOTAL OMSET
// ======================================


function omsetGlobal(){

    return omset;

}







// ======================================
// RENDER ANTREAN SERVIS
// ======================================


function renderAntrean(){


    const container =
        document.getElementById(
            "antrean-container"
        );


    if(!container) return;



    container.innerHTML="";



    if(dataAntrean.length===0){


        container.innerHTML = `

        <div class="
            text-center
            text-gray-400
            text-sm
            p-5
        ">
            Tidak ada antrean
        </div>

        `;


        return;

    }





    dataAntrean.forEach(
        item => {



        const div =
        document.createElement(
            "div"
        );



        div.className =
        `
        data-card
        border-red-200
        bg-red-50
        `;



        div.onclick =
        function(){

            bukaDetailServis(
                item.id
            );

        };




        div.innerHTML = `

            <div class="
                flex
                justify-between
            ">

                <b class="text-sm">
                    ${item.nopol}
                </b>


                <span class="
                    text-xs
                    text-red-600
                ">
                    ${item.status}
                </span>

            </div>


            <div class="
                text-xs
                text-gray-500
                mt-2
            ">

                ${item.motor}

            </div>


            <div class="
                text-xs
                font-bold
                text-gray-700
                mt-1
            ">

                ${item.mekanik}

            </div>


        `;



        container.appendChild(div);



    });


}








// ======================================
// RENDER KASIR
// ======================================


function renderKasir(){


    const container =
        document.getElementById(
            "pesanan-container"
        );



    if(!container) return;



    container.innerHTML="";




    if(
        dataPesananLangsung.length===0
    ){


        container.innerHTML = `

        <div class="
            text-center
            text-gray-400
            p-5
            text-sm
        ">
            Tidak ada transaksi
        </div>

        `;


        return;

    }






    dataPesananLangsung.forEach(
        item=>{


        const div =
        document.createElement(
            "div"
        );



        div.className =
        `
        data-card
        bg-green-50
        border-green-200
        `;



        div.onclick =
        ()=>bayarLangsung(
            item.id
        );




        div.innerHTML = `

        <div class="
            flex
            justify-between
        ">


            <b class="text-sm">
                ${item.nama}
            </b>


            <span class="
                text-xs
                text-green-600
            ">
                Bayar
            </span>


        </div>



        <div class="
            text-xs
            mt-2
            text-gray-500
        ">

            ${item.part}

        </div>



        <div class="
            text-sm
            font-bold
            mt-1
        ">

            ${formatRupiah(item.total)}

        </div>


        `;



        container.appendChild(div);



    });


}








// ======================================
// JALANKAN SAAT WEB DIBUKA
// ======================================


document.addEventListener(
    "DOMContentLoaded",
    function(){

        renderUI();

    }
);
