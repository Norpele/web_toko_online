function load_data() {
    $.post("supplier/load_data",
        {
          
        },
        function (data) {
            console.log(data)
            $("#table2").DataTable().clear().destroy()
            $("#table2 > tbody").html('');
           $.each(data.supplier, function (idx, val) {
                html = '<tr>'
                html += '<td>' + val['id_supplier'] + '</td>'
                html += '<td>' + val['namaSupplier'] + '</td>'
                html += '<td>' + val['kontak'] + '</td>'
                html += '<td>' + val['alamat'] + '</td>'
                html += ' <td><button class="btn btn-warning btn-sm btn-edit" onclick="edit_table(' + val['id_supplier'] + ')">Edit</button></td>'
                html += '<td><button class="btn btn-danger btn-sm " onclick="delete_table(' + val['id_supplier'] + ')">Hapus</button></td>'
                html += '</tr>'
                $("#table2 > tbody").append(html);
            });
            
            $("#table2").DataTable({
                responsive: true,
                processing: true,
                pagingType: 'first_last_numbers',
                // order: [[0, 'asc']],
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
  
  function update_supplier() {
    var id = $("#loginModal").data('id');
    let txnama = $("#txnama").val();
    let txkontak = $("#txkontak").val();
    let txalamat = $("#txalamat").val();

    if (txnama === "" || txalamat ===""||txkontak ==="") {
        $.alert({
          title: 'Alert!',
          content: 'Error',
      });
      } else {
        $.post('supplier/update_data', { id: id, txnama: txnama, txkontak:txkontak, txalamat:txalamat }, function (data) {
          if (data.status === 'success') {
            alert(data.msg);
            load_data();
            $("#loginModal").modal('hide');
          } else {
            alert(data.msg);
    
          }
        }, 'json');
      }
  }
  
  function simpan_data() {
    let txnama = $("#txnama").val();
    let txkontak = $("#txkontak").val();
    let txalamat = $("#txalamat").val();

    if ( txnama === "" || txkontak === ""|| txalamat === "" ) {
        alert("Pastikan form diisi dengan benar!");
    } else {
        $.post("supplier/create", {  
          txnama : txnama,
          txkontak : txkontak,
          txalamat : txalamat
        },
        function (data) {
            console.log(data.status);
            if (data.status === "error") {
              Swal.fire({
                title: 'Error!',
                text: data.msg,
                icon: 'error',
                confirmButtonText: 'OK'
              });
            } else {
                alert(data.msg);
                $("#loginModal").modal('hide');
                $('.modal-backdrop').remove();
                $(".alert-success").show();
                setTimeout(function() {
                    $(".alert-success").fadeOut(); // Menghilangkan alert dengan animasi
                }, 2000);
                load_data();
                reset_form(); 
            }
        }, 'json');
    }
}
  
  function edit_table(id) {
    $.post('supplier/edit_table', { id: id }, function (data) {
      if (data.status === 'ok') {
        $("#txnama").val(data.data.namaSupplier);
        $("#txkontak").val(data.data.kontak);
        $("#txalamat").val(data.data.alamat);
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
        $.post('supplier/delete_table', { id: id }, function (data) {
          if (data.status === 'success') {
            Swal.fire({
              title: "Deleted!",
              text: data.msg,
              icon: "success"
            }).then(() => {
                load_data()
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
    $(".form-select").val('');
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
      load_data()
      load_Kategori();
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
    });