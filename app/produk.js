function load_data() {
  $.post("produk/load_data", {}, function (data) {
      console.log(data);
      $("#table2").DataTable().clear().destroy();
      $("#table2 > tbody").html('');
      $.each(data.produk, function (idx, val) {
          var hargaFormatted = formatNumber(val['hargaBarang']);
          var totalHarga = formatNumber(val['totalHarga']);

          html = '<tr>';
          html += '<td>' + val['id_barang'] + '</td>';
          html += '<td><img src="' + base_url + 'uploads/' + val.foto + '" width="250px" height="250px" alt="Gambar tidak tersedia"></td>';
          html += '<td>' + val['namaBarang'] + '</td>';
          html += '<td>' + val['kategoriBarang'] + '</td>';
          html += '<td>' + hargaFormatted + '</td>';
          html += '<td>' + val['stockBarang'] + '</td>';
          html += '<td>' + totalHarga + '</td>';
          html += '<td><button class="btn btn-primary btn-sm btn-supplier" onclick="select_sup(' + val['id_barang'] + ')">Supplier</button></td>';
          html += '<td><button class="btn btn-warning btn-sm btn-edit" onclick="edit_table(' + val['id_barang'] + ')">Edit</button></td>';
          html += '<td><button class="btn btn-danger btn-sm" onclick="delete_table(' + val['id_barang'] + ')">Hapus</button></td>';
          html += '</tr>';
          $("#table2 > tbody").append(html);
      });

      $("#table2").DataTable({
          responsive: true,
          processing: true,
          pagingType: 'first_last_numbers',
          dom:
              "<'row'<'col-3'l><'col-9'f>>" +
              "<'row dt-row'<'col-sm-12'tr>>" +
              "<'row'<'col-4'i><'col-8'p>>",
          "language": {
              "info": "Page _PAGE_ of _PAGES_",
              "lengthMenu": "_MENU_",
              "search": "",
              "searchPlaceholder": "Search.."
          }
      });
  }, 'json');
}

function select_sup(id_barang) {
  $('#checkbox-supplier-list').html('');

  // Ambil daftar supplier dari server
  $.post("produk/get_suppliers", { id_barang: id_barang }, function (data) {
      // Tambahkan radio button ke modal berdasarkan data yang diterima
      $.each(data.suppliers, function (idx, supplier) {
          var checked = supplier.is_selected ? 'checked' : ''; // Cek apakah supplier sudah dipilih
          var radioHtml = '<div class="form-check">';
          radioHtml += '<input class="form-check-input" type="radio" name="supplier_id" value="' + supplier.id_supplier + '" ' + checked + '>';
          radioHtml += '<label class="form-check-label">' + supplier.namaSupplier + '</label>'; // Hanya nama supplier
          radioHtml += '</div>';
          $('#checkbox-supplier-list').append(radioHtml);
      });

      // Simpan ID barang yang sedang diproses untuk digunakan nanti
      $('#supplierModal').data('id_barang', id_barang);

      // Tampilkan modal
      $('#supplierModal').modal('show');
  }, 'json');
}

$('#save-supplier').click(function() {
  var id_barang = $('#supplierModal').data('id_barang');
  var selectedSupplier = $("input[name='supplier_id']:checked").val(); // Ambil supplier yang dipilih

  // Kirim data supplier yang dipilih ke server
  $.post("produk/save_suppliers", {
      id_barang: id_barang,
      supplier: selectedSupplier // Hanya satu supplier yang dipilih
  }, function(response) {
      if (response.success) {
          // Tampilkan SweetAlert2 Toast jika berhasil
          Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'success',
              title: 'Supplier berhasil disimpan!',
              showConfirmButton: false,
              timer: 3000
          });

          // Sembunyikan modal
          $('#supplierModal').modal('hide');
      } else {
          // Tampilkan pesan error jika gagal
          Swal.fire({
              icon: 'error',
              title: 'Gagal menyimpan supplier!',
              text: 'Terjadi kesalahan saat menyimpan data.'
          });
      }
  }, 'json');
});




function formatNumber(num) {
  num = num.replace(/\D/g, '');
  
  return 'Rp ' + num.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function update_barang() {
  var id = $("#loginModal").data('id');
  let txnama = $("#txnama").val();
  let txdeskripsi = $("#txdeskripsi").val();
  let txkategori = $("#txkategori").val();
  let txharga = $("#txharga").val();
  let txstock = $("#txstock").val();
  let file_data = $('#tximg').prop('files')[0];  // Ambil file gambar baru
  let foto_lama = $("#imgPreview").attr('src').split('/').pop(); // Ambil nama file gambar lama
  let totalHarga = $("#txtotal").val(); 

  if (txnama === "" || txdeskripsi === "" || txkategori === "" || txharga === "" || txstock === "") {
      alert("Pastikan semua form diisi dengan benar!");
  } else {
      let formData = new FormData(); 
      formData.append('id', id);
      formData.append('txnama', txnama);
      formData.append('txdeskripsi', txdeskripsi);
      formData.append('txkategori', txkategori);
      formData.append('txharga', txharga);
      formData.append('txstock', txstock);
      formData.append('txtotal', totalHarga); 
      formData.append('foto_lama', foto_lama); // Kirim nama file foto lama

      if (file_data) { // Jika ada file baru yang diunggah
          formData.append('tximg', file_data); 
      }

      $.ajax({
          url: 'produk/update_table', 
          type: 'POST',
          data: formData,
          contentType: false, 
          processData: false, 
          dataType: 'json',
          success: function(data) {
              if (data.status === 'success') {
                Swal.fire({
                  title: "Berhasil!",
                  text: data.msg,
                  icon: "success"
                });
                  load_data();
                  $("#loginModal").modal('hide');
              } else {
                Swal.fire({
                  title: "Error!",
                  text: data.msg,
                  icon: "error"
                });
              }
          },
          error: function(xhr, status, error) {
              alert('Terjadi kesalahan saat mengupdate barang.');
          }
      });
  }
}



function jumlah() {
  // Ambil nilai dari input
  let harga = parseFloat($('#txharga').val()) || 0;
  let stock = parseFloat($('#txstock').val()) || 0;

  // Hitung total harga
  let total = harga * stock;

  // Tampilkan hasil di input total harga
  $('#txtotal').val(total.toFixed(2));
  $('#txharga, #txstock').on('input', jumlah);
}


function load_Kategori(){
  $.post('produk/load_Kategori', function( res ){
      $("#txkategori").empty()

      $("#txkategori").append('<option value = "">Pilih Kategori</option>')
      $.each( res.data_kategori , function ( i, v) {
          $("#txkategori").append('<option value = "'+ v.id_kategori+'">'+ v.kategoriBarang+'</option>')             
      }
      ) 
  }, 'json');
}


// function load_supplier(){
//   $.post('produk/load_supplier', function( res ){
//       $("#txnama").empty()
//       $("#txharga").empty()

//       $("#txnama").append('<option value = "">Pilih Barang</option>')
//       $.each( res.data_supplier , function ( i, v) {
//           $("#txnama").append('<option value = "'+ v.id_supplier+'">'+ v.barang+'</option>')
//           $("#txharga").val()             
//       }
//       )
//   }, 'json');
// }

function add_barang() {
  let namaBarang = $("#txnama").val();
  let deskripsiBarang = $("#txdeskripsi").val();
  let kategori = $("#txkategori").val();
  let hargaBarang = $("#txharga").val();
  let stockBarang = $("#txstock").val();
  let file_data = $('#tximg').prop('files')[0];
  let totalHarga = $("#txtotal").val(); 

  if (namaBarang === "" || deskripsiBarang === "" || kategori === "" || hargaBarang === "" || stockBarang === "") {
      alert("Pastikan form diisi dengan benar!");
  } else {
      let formData = new FormData(); 
      formData.append('txnama', namaBarang);
      formData.append('txdeskripsi', deskripsiBarang);
      formData.append('txkategori', kategori);
      formData.append('txharga', hargaBarang);
      formData.append('txstock', stockBarang);
      formData.append('tximg', file_data);
      formData.append('txtotal', totalHarga); 

      $.ajax({
          url: 'produk/upload_photo', 
          type: 'POST',
          data: formData,
          contentType: false, 
          processData: false, 
          dataType: 'json',
          success: function(data) {
              console.log(data.status);
              if (data.status === "error") {
                Swal.fire({
                  title: "Error!",
                  text: data.msg,
                  icon: "error"
                });
              } else {
                Swal.fire({
                  title: "Berhasil!",
                  text: data.msg,
                  icon: "success"
                });
                  load_data();
                  reset_form(); 
              }
          },
          error: function(xhr, status, error) {
              console.log(xhr.responseText);
              alert('Terjadi kesalahan saat meng-upload foto.');
          }
      });
  }
}

function edit_table(id) {
  $.post('produk/edit_table', { id: id }, function (data) {
    if (data.status === 'ok') {
      $("#txnama").val(data.data.namaBarang);
      $("#txdeskripsi").val(data.data.deskripsi);
      $("#txkategori").val(data.data.kategori_barang);
      $("#txharga").val(data.data.hargaBarang);
      $("#txstock").val(data.data.stockBarang);
      $("#txtotal").val(data.data.totalHarga);
      
      // Menampilkan gambar
      if (data.data.foto) {
        $("#imgPreview").attr("src", base_url + 'uploads/' + data.data.foto);
      } else {
        $("#imgPreview").attr("src", "");  // Hapus gambar jika tidak ada
      }
      $("#loginModal").data('id', id); 
      $("#loginModal").modal('show');
      $(".btn-submit").hide();
      $(".btn-editen").show();
    } else {
      Swal.fire({
        title: 'Error!',
        text: data.msg,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }, 'json');
}



function delete_table(id) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
      // Mengirim permintaan POST untuk menghapus data
      $.post('produk/delete_table', { id: id }, function (data) {
        if (data.status === 'success') {
          Swal.fire({
            title: "Deleted!",
            text: data.msg,
            icon: "success"
          }).then(() => {
            load_data(); // Reload data after deletion
          });
        } else {
          Swal.fire({
            title: "Error!",
            text: data.msg,
            icon: "error"
          });
        }
      }, 'json');
    }
  });
}


function reset_form(){
  $(".form-control").val('');
  $("#txdeskripsi").val('');
}

function desimal(input) {
  if (!input) return "";
  
  input = input.toString().replace(/,/g, ''); // Menghapus koma sebelumnya
  var parts = input.split(".");
  parts[0] = parts[0].split("").reverse().join("").replace(/(\d{3})(?!$)/g, "$1,").split("").reverse().join("");
  return parts.join(".");
}

$(document).ready(function(){
  $(".alert-success").hide();
    $(".btn-add").click(function(){
      $("#loginModal").modal("show");
      $(".btn-editen").hide();
      $(".btn-submit").show();
      $('#imgPreview').attr('src', ''); //memanggil gambar
      reset_form();
    });
    $(".btn-closed").click(function () {
      $("#loginModal").modal("hide");
    }
    )
    load_data();
    load_Kategori();
    updateJumlahBarang();

    $("#tximg").change(function() {
      var input = this;

      if (input.files && input.files[0]) {
          var reader = new FileReader();

          reader.onload = function(e) {
              $('#imgPreview').attr('src', e.target.result);
          }

          reader.readAsDataURL(input.files[0]); // Mengubah file menjadi Data URL
      }

      
  });

  $('.close, .btn-secondary').click(function() {
    $('#supplierModal').modal('hide'); // Menyembunyikan modal
});
  });