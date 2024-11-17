document.getElementById("see-password").addEventListener('change', function() {
    var password = document.getElementById("password");
    var icon = document.getElementById("toggle-icon");

    if (this.checked) {
        password.type = "text"; 
        icon.classList.remove('fa-eye');  
        icon.classList.add('fa-eye-slash');
    } else {
        password.type = "password";  
        icon.classList.remove('fa-eye-slash');  
        icon.classList.add('fa-eye');
    }
});

$('#login-button').click(function(event) {
    let username = $("#username").val();
    let password = $("#password").val();

    if(username === "" || password === ""){
        Swal.fire({
            icon: 'error',
            title: 'Lengkapi fieldnya!',
            text: "lengkapi username atau password",
            showConfirmButton: false,
            timer: 3000
        });
    } else {
        $.post("login/cek_login", {
            username: username,
            password: password,
        }).done(function(response) {
            response = JSON.parse(response);
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Login Berhasil',
                    text: 'Selamat datang, ' + username,
                    showConfirmButton: true,
                    timer: 3000
                }).then(() => {
                    window.location.href = response.redirect; 
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Login Gagal',
                    text: response.message,
                    showConfirmButton: true,
                    timer: 3000
                });
            }
        });
        fail(function() {
            Swal.fire({
                icon: 'error',
                title: 'Server Error',
                text: 'Silahkan coba lagi nanti',
                showConfirmButton: true,
                timer: 3000
            });
        });
    }
});
$(document).ready(function(){
    
});