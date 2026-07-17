function generateInvoice(){

    const now = new Date();

    const no =
        "INV-" +
        now.getFullYear() +
        (now.getMonth()+1) +
        now.getDate() +
        "-" +
        Date.now().toString().slice(-5);

    document.getElementById("invoice").value=no;

}

generateInvoice();