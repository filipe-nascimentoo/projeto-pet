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


    // Função para formatar a data
    function formatarData(data) {
        const partes = data.split('-');
        return `${partes[2]}/${partes[1]}/${partes[0]}`; // Formato DD/MM/YYYY
    }


    fetch('/admin/api/grafico')
        .then(response => response.json())
        .then(data => {
            const { datas, pessoas, pets, adocao } = data;

            // Formatando as datas para exibição no gráfico
            const categorias = datas.map(formatarData);

            const options = {
                series: [
                    { name: 'Pets', data: pets },
                    { name: 'Adoção', data: adocao },
                    { name: 'Pessoas', data: pessoas }
                ],
                chart: {
                    height: 350,
                    type: 'area',
                    toolbar: { show: false }
                },
                markers: { size: 4 },
                colors: ['#406DDE', '#2eca6a', '#ff771d'],
                fill: {
                    type: "gradient",
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0.3,
                        opacityTo: 0.4,
                        stops: [0, 90, 100]
                    }
                },
                dataLabels: { enabled: false },
                stroke: { curve: 'smooth', width: 2 },
                xaxis: { categories: categorias }
            };

            // Renderizar o gráfico
            const chart = new ApexCharts(document.querySelector("#grafico"), options);
            chart.render();
        })
        .catch(error => console.error('Erro ao carregar dados do gráfico:', error));


});