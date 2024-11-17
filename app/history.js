function setTransactionId(pesan_id) {
    $('#Modal').data('pesan_id', pesan_id); 
}

function updateStatus() {
    let file_data = $('#tximg').prop('files')[0]; 
    let formData = new FormData();
    let pesan_id = $('#Modal').data('pesan_id'); 

    formData.append('tximg', file_data); 
    formData.append('pesan_id', pesan_id); 

    $.ajax({
        url: 'history/upload_photo',
        type: 'POST',
        data: formData, 
        processData: false, 
        contentType: false, 
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                Swal.fire("Berhasil", response.msg, "success");
            } else {
                Swal.fire("Error", response.msg, "error");
            }
        },
        error: function(xhr, status, error) {
            console.log(xhr.responseText);
            Swal.fire("Error", "Terjadi kesalahan saat meng-update status.", "error");
        }
    });
}



