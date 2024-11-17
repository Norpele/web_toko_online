$(document).ready(function() {
    $(".btn-register").click(function(e) {
        e.preventDefault(); 

        var username = $('#username').val();
        var email = $('#email').val();
        var password = $('#password').val();
        var emailPattern = /^[a-zA-Z0-9._%+-]+@(gmail\.com|apple\.com)$/;

        if (username === '' || email === '' || password === '') {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Please fill in all fields.',
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        // Validasi email harus menggunakan @gmail.com atau @apple.com
        if (!emailPattern.test(email)) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Email must be from gmail.com or apple.com.',
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        $.post("regAcc/add_account", {
                username: username,
                email: email,
                password: password
            },
            function(response) {
                if (response.error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Create Account Error!',
                        text: response.error,
                        showConfirmButton: false,
                        timer: 3000
                    });
                } else {
                    Swal.fire({
                        icon: 'success',
                        title: 'Create Account Success!',
                        text: response.success,
                        showConfirmButton: false,
                        timer: 3000
                    });
                    window.location.href = 'user'; // halaman yang dituju
                }
            }, 'json');
    });

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
    
    
});