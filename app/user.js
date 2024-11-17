function showModal(namaBarang, deskripsi, harga, image, stockBarang, id_barang) {
    document.getElementById('modal-namaBarang').innerText = namaBarang;
    document.getElementById('modal-deskripsi').innerText = deskripsi;

    const modalHarga = document.getElementById('modal-harga');
    modalHarga.setAttribute('data-harga', harga);
    modalHarga.innerText = 'Rp. ' + parseInt(harga).toLocaleString('id-ID');

    document.getElementById('modal-image').src = image;
    document.getElementById('modal-stock').innerText = 'Stok tersedia: ' + stockBarang;

    const totalInput = document.getElementById('total-barang');
    totalInput.setAttribute('data-id-barang', id_barang);
    
    $('#buyModal').modal('show');
    reset_form()
}

function pesanBarang() {
    var id_barang = $('#total-barang').data('id'); // Ambil ID barang dari atribut data-id
    var qty = $('#total-barang').val(); // Ambil jumlah barang
    var harga = $('#modal-harga').text().replace('Rp. ', '').replace('.', ''); // Ambil harga dan hilangkan Rp.

    $.ajax({
        url: '<?= site_url("user/add_to_cart/") ?>' + id_barang,
        type: 'POST',
        data: {
            qty: qty,
            price: harga
        },
        success: function(response) {
            alert('Barang berhasil ditambahkan ke cart');
            $('#buyModal').modal('hide'); // Tutup modal setelah sukses
        },
        error: function() {
            alert('Gagal menambahkan barang ke cart');
        }
    });
}

function cek_stock(input) {
    const stockBarang = parseInt(document.getElementById('modal-stock').innerText.replace('Stok tersedia: ', '')); // Ambil stok dari modal
    const totalBarang = parseInt(input.value);

    if (totalBarang > stockBarang) {
        Swal.fire({
            title: 'Tidak Bisa Melebihi Stock!',
            text: 'Total Barang tidak bisa melebihi stock',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        input.value = stockBarang; 
    }
}

function jumlah() {
    let harga = parseFloat(document.getElementById('modal-harga').getAttribute('data-harga'));
    let totalBarang = parseInt(document.getElementById('total-barang').value);

    if (!isNaN(harga) && !isNaN(totalBarang)) {
        let jumlah = harga * totalBarang;
        document.getElementById('total-harga').value = 'Rp. ' + jumlah.toLocaleString('id-ID');
    }
}

function search_barang() {
    var keyword = $('#searchBarang').val(); 
    $.ajax({
        url: '<?= base_url("user/search_barang"); ?>',
        type: 'GET',
        data: { keyword: keyword }, 
        success: function(response) {
            var data = JSON.parse(response);
            var barangList = $('#barang-list'); 
            barangList.empty();

            // Tambahkan hasil pencarian ke daftar barang
            if (data.result.length > 0) {
                $.each(data.result, function(index, item) {
                    var card = `
                        <div class="col-md-3 col-sm-6 item" data-kategori="${item.kategori_barang}" style="margin-bottom: 20px;">
                            <div class="card mb-4 shadow" style="border-radius: 15px; overflow: hidden;">
                                <img src="<?= base_url('uploads/') ?>${item.foto}" class="card-img-top" alt="${item.namaBarang}" style="height: 200px; object-fit: cover;">
                                <div class="card-body" style="padding: 15px;">
                                    <h5 class="card-title text-center" style="color:#333; font-size: 1.1rem; font-weight: bold;">${item.nama_barang}</h5>
                                    <h5 class="text-center" style="color: #007bff; font-weight: bold; font-size: 1.2rem;">Rp. ${number_format(item.set_harga, 0, ',', '.')}</h5>
                                    ${item.stockBarang > 0 ? `<a href="<?= base_url('user/add_to_cart/') ?>${item.id_barang}" class="btn btn-outline-success w-100">Add to cart</a>` : '<div class="btn btn-outline-secondary w-100" disabled>Add to cart</div>'}
                                </div>
                            </div>
                        </div>`;
                    barangList.append(card);
                });
            } else {
                barangList.append('<p class="text-center">Tidak ada barang yang ditemukan.</p>');
            }
        },
        error: function() {
            alert('Terjadi kesalahan saat mencari barang.'); // Menangani kesalahan AJAX
        }
    });
}




function reset_form(){
    $(".form-control").val('');
    $("#txdeskripsi").val('');
  }


$(document).ready(function(){
    function load_kategori() {
        $.post(base_url+'user/load_kategori', function(res){
            $("#txkategori").empty(); 
            $("#txkategori").append('<option value="">Semua Kategori</option>'); 
        
            $.each(res.load_kategori, function(i, v) {
                $("#txkategori").append('<option value="'+ v.kategoriBarang +'">'+ v.kategoriBarang +'</option>');
            });
        }, 'json');
        
    }

    if ($('#error-message').length) {
        // Tampilkan pesan error
        $('#error-message').fadeIn();

        // Sembunyikan pesan setelah 5 detik (5000 ms)
        setTimeout(function() {
            $('#error-message').fadeOut();
        }, 5000);
    }

    $($(".btn-secondary")).click(function(){
        $('#buyModal').modal('hide');
      });
       
    load_kategori();
    total_harga()
});