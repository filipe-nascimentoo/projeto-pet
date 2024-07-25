document.addEventListener('DOMContentLoaded', function () {
    const stars = document.querySelectorAll('.rating input[type="radio"]');
    const ratingResult = document.getElementById('ratingResult');
    const loginLink = document.getElementById('loginLink');
    const logoutBtn = document.getElementById('logoutBtn');
    const inscrever = document.getElementById('inscrever');
    const userInfo = document.getElementById('userInfo'); // Elemento para exibir o nome do usuário

    // Function to check login status
    function checkLoginStatus() {
        fetch('/admin/check-login', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(result => {
            if (result.loggedIn) {
                // User is logged in
                inscrever.classList.add('d-none');
                loginLink.classList.add('d-none'); // Hide login link
                logoutBtn.classList.remove('d-none'); // Show logout button

                // Display user name
                if (result.user && userInfo) {
                    userInfo.textContent = `Olá, ${result.user.nome}`;
                    userInfo.classList.remove('d-none'); // Ensure userInfo is visible
                }
            } else {
                // User is not logged in
                inscrever.classList.remove('d-none');
                loginLink.classList.remove('d-none'); // Show login link
                logoutBtn.classList.add('d-none'); // Hide logout button
                userInfo.classList.add('d-none'); // Hide user info
            }
        })
        .catch(error => {
            console.error('Error checking login status:', error);
        });
    }

    // Check login status on page load
    checkLoginStatus();

    // Login form submission handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;

            fetch('/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, senha })
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    // Successful login
                    checkLoginStatus(); // Update navbar
                    window.location.href = '/admin/dashboard';
                } else {
                    // Failed login
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: result.message,
                    });
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `${error}`,
                });
            });
        });
    }

    // Logout button handling
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            fetch('/admin/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    // Successful logout
                    checkLoginStatus(); // Update navbar
                } else {
                    // Logout failed
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: result.message,
                    });
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `${error}`,
                });
            });
        });
    }
});