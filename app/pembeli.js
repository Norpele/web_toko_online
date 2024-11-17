function load_data() {
    $.post("pemesan/load_data", {}, function (data) {
        console.log(data);
    
        $("#table2").DataTable().clear().destroy();
        $("#table2 > tbody").html('');
        
        $.each(data.pembeli, function (idx, val) {
            let statusButton = '';
            
            // Check pesan_status and assign button HTML accordingly
            if (val['pesan_status'] == '0') {
                statusButton = '<button class="btn btn-danger" onclick="confirmUpdateStatus(' + val['pesan_id'] + ')">Belum Diproses</button>';
            } else if (val['pesan_status'] == '1') {
                statusButton = '<span class="badge bg-warning">diproses</span>';
            } else if (val['pesan_status'] == '2') {
                statusButton = '<span class="badge bg-primary">Dikirim</span>';
            } else if (val['pesan_status'] == '3') {
                statusButton = '<span class="badge bg-success">Selesai</span>';
            }

            let html = '<tr>';
            html += '<td>' + val['pesan_id'] + '</td>';
            html += '<td>' + val['pesan_id_user'] + '</td>';
            html += '<td>' + val['username'] + '</td>';
            html += '<td>' + val['email'] + '</td>';
            html += '<td>' + val['tanggal'] + '</td>';
            html += '<td>' + val['alamat'] + '</td>';
            html += '<td>' + val['no_transaksi'] + '</td>';
            let imagePath = val.bukti_pembayaran ? 'uploads/' + val.bukti_pembayaran : 'path/to/default-image.jpg';
            html += `<td><img src="${imagePath}" width="250px" height="250px" alt="Belum Lunas"></td>`;
            html += '<td>' + statusButton + '</td>';
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
            language: {
                info: "Page _PAGE_ of _PAGES_",
                lengthMenu: "_MENU_",
                search: "",
                searchPlaceholder: "Search.."
            }
        });
    }, 'json');
}

function confirmUpdateStatus(pesan_id, current_status) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You want to update the status?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update it!'
    }).then((result) => {
        if (result.isConfirmed) {
            const new_status = current_status < 3 ? current_status + 1 : 3;
            updateStatus(pesan_id, new_status);
        }
    });
}


function updateStatus(pesan_id, status) {
    $.post("pemesan/update_status", { pesan_id: pesan_id, status: status }, function(response) {
        if (response.success) {
            Swal.fire(
                'Updated!',
                'The status has been updated.',
                'success'
            );
            load_data();
        } else {
            Swal.fire(
                'Failed!',
                'Failed to update status.',
                'error'
            );
        }
    }, 'json');
}


load_data();
