function load_data() {
    $.post("penjualan/load_data", {}, function (data) {
        console.log(data);
        $("#table2").DataTable().clear().destroy();
        $("#table2 > tbody").html('');
        $.each(data.penjualan, function (idx, val) {
            var hargaFormatted = formatNumber(val['set_harga']);
  
            html = '<tr>';
            html += '<td>' + val['id_penjualan'] + '</td>';
            html += '<td>' + val['nama_barang'] + '</td>';
            // html += '<td>' + val['kategoriBarang'] + '</td>';
            html += '<td>' + hargaFormatted + '</td>';
            html += '<td><button class="btn btn-warning btn-sm btn-edit" onclick="edit_table(' + val['id_penjualan'] + ')">Edit</button></td>';
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

  function formatNumber(num) {
    num = num.replace(/\D/g, '');
    
    return 'Rp ' + num.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  
  function load_barang(){
    $.post('penjualan/load_barang', function( res ){
        $("#txbarang").empty()
  
        $("#txbarang").append('<option value = "">Pilih Nama Barang</option>')
        $.each( res.load_barang , function ( i, v) {
            $("#txbarang").append('<option value = "'+ v.namaBarang+'">'+ v.namaBarang+'</option>')             
        }
        ) 
    }, 'json');
  }
  
  function add_barang() {
        let namaBarang = $("#txbarang").val();
        let harga = $("#txharga").val();
    
        if (namaBarang === "" || harga === "") {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'isi form dengan benar',
                showConfirmButton: false,
                timer: 3000
            });
        } else {
            $.post("penjualan/create", {
                txbarang: namaBarang, 
                txharga: harga,
            },
            function (data) {
                console.log(data.status);
                if (data.status === "error") {
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'error',
                        title: 'barang gagal ditambahkan! ',
                        showConfirmButton: false,
                        timer: 3000
                    });
                } else {
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'success',
                        title: 'barang berhasil ditambahkan!',
                        showConfirmButton: false,
                        timer: 3000
                    });
                    load_data();
                    load_barang();
                    reset_form(); 
                }
            }, 'json');
        }
        
  }

  function edit_table(id) {
    $.post('penjualan/edit_table', { id: id }, function (data) {
      if (data.status === 'ok') {
        $("#txbarang").val(data.data.nama_barang);
        $("#txharga").val(data.data.set_harga);
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

  function update_barang() {
    var id = $("#loginModal").data('id');
    let txbarang = $("#txbarang").val();
    let txharga = $("#txharga").val();

    if (txbarang === "" || txharga ==="") {
        $.alert({
          title: 'Alert!',
          content: 'Error',
      });
      } else {
        $.post('penjualan/update_data', { id: id, txbarang: txbarang, txharga:txharga }, function (data) {
          if (data.status === 'success') {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'barang berhasil diupdate!',
                showConfirmButton: false,
                timer: 3000
            });
            load_data();
            reset_form();
            $("#loginModal").modal('hide');
          } else {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'barang berhasil diupdate!',
                showConfirmButton: false,
                timer: 3000
            });
    
          }
        }, 'json');
      }
  }
  function reset_form(){
    $(".form-control").val('');
    $("#txdeskripsi").val('');
  }
  
  
  $(document).ready(function(){
    $(".alert-success").hide();
      $(".btn-add").click(function(){
        $("#loginModal").modal("show");
        $(".btn-editen").hide();
        $(".btn-submit").show();
        reset_form();
      });
      $(".btn-closed").click(function () {
        $("#loginModal").modal("hide");
      }
      )
      load_data();
      load_barang();
    });