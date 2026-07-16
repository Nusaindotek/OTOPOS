let state = {
    jenis: 'Perbaikan',
    partsTerpilih: [],
    data: JSON.parse(localStorage.getItem('otopos_data')) || {
        mekanik: [{nama:'RAHUL'}, {nama:'WOWO'}],
        part: [{nama:'Oli'}, {nama:'Busi'}, {nama:'Kampas Rem'}],
        riwayat: []
    }
};

function navigateTo(page) {
    document.body.className = 'view-' + page;
    if(page === 'kasir') renderKasir();
    if(page === 'stok') renderList('list-stok', state.data.part);
    if(page === 'riwayat') renderList('list-riwayat', state.data.riwayat);
    if(page === 'mekanik') renderList('list-mekanik', state.data.mekanik);
}

function setJenis(j) {
    state.jenis = j;
    state.partsTerpilih = []; // Reset part jika ganti mode
    renderKasir();
}

function tambahPart() {
    let p = document.getElementById('select-part-list').value;
    state.partsTerpilih.push(p);
    renderKasir();
}

function renderKasir() {
    // Tampilan tombol aktif
    document.getElementById('btn-perbaikan').className = (state.jenis === 'Perbaikan') ? 'btn btn-primary' : 'btn btn-secondary';
    document.getElementById('btn-part').className = (state.jenis === 'Part') ? 'btn btn-primary' : 'btn btn-secondary';
    
    // Tampilkan/Sembunyikan elemen
    document.getElementById('div-mekanik').style.display = (state.jenis === 'Perbaikan') ? 'block' : 'none';
    document.getElementById('div-biaya').style.display = (state.jenis === 'Perbaikan') ? 'block' : 'none';
    
    // Isi Dropdown Part
    let select = document.getElementById('select-part-list');
    select.innerHTML = state.data.part.map(p => `<option value="${p.nama}">${p.nama}</option>`).join('');
    
    // Isi Dropdown Mekanik
    document.getElementById('kasir-mekanik').innerHTML = state.data.mekanik.map(m => `<option value="${m.nama}">${m.nama}</option>`).join('');
    
    // Tampilkan Part terpilih
    document.getElementById('div-part-terpilih').innerHTML = state.partsTerpilih.map(p => `<span class="tag">${p}</span>`).join('');
}

function renderList(id, data) {
    document.getElementById(id).innerHTML = data.map(i => `<div class="card">${i.nama || i.biaya + ' (Rp)'}</div>`).join('');
}

function simpanTransaksi() {
    let trans = {
        nama: document.getElementById('kasir-nama').value,
        jenis: state.jenis,
        parts: state.partsTerpilih,
        biaya: state.jenis === 'Perbaikan' ? document.getElementById('kasir-biaya').value : 0
    };
    state.data.riwayat.push(trans);
    localStorage.setItem('otopos_data', JSON.stringify(state.data));
    alert('Tersimpan!');
    state.partsTerpilih = [];
    renderKasir();
}