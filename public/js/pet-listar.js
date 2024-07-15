document.addEventListener('DOMContentLoaded', () => {
    listaPet();
});

const listaPet = () => {
    fetch('/api/pet/listar')
        .then(response => response.json())
        .then(result => {
            let petList = document.getElementById('pet-list');
            petList.innerHTML = ''; // Limpa o conteúdo atual

            result.forEach(pet => {
                petList.innerHTML += `
                    <div class="card" style="width: 18rem;">
                        ${pet.imagem ? `<img src="/uploads/${pet.imagem}" alt="${pet.nome}" class="card-img-top mt-2">` : '<img src="https://placehold.co/600x400?text=Pet+sem+imagem" alt="${pet.nome}" class="card-img-top mt-2">'}
                        <div class="card-body">
                            <h5 class="card-title">${pet.nome}</h5>
                            <p class="card-text">
                                <ul>
                                    <li>Raça: ${pet.raca}</li>
                                    <li>Porte: ${pet.porte}</li>
                                </ul>
                            </p>
                        </div>
                    </div>
                `;
            });
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `${error}`,
            });
        });
};
