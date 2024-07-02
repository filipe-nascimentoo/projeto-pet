document.addEventListener('DOMContentLoaded', () => {
    listaPet()
})

// Adicionar um evento ao enviar o formulario
document.getElementById('cadastrar').addEventListener('submit', async (e) => {
    // bloqueia o evento padão(enviar o form via get)
    e.preventDefault();

    // captura dos elementos do form
    let nome = document.getElementById('nome')
    let raca = document.getElementById('raca')
    let porte = document.getElementById('porte')
    let data_nascimento = document.getElementById('data_nascimento')
    let cor = document.getElementById('cor')
    let sexo = document.getElementById('sexo')
    let castrado = document.getElementById('castrado').checked ? '1' : '0';
    let adotado = document.getElementById('adotado').checked ? '1' : '0';
    let observacao = document.getElementById('observacao')

    // envio dos dados ao backend fetch(api)
    await fetch('/pet/cadastrar', {
        method: 'POST',
        body: `nome=${nome.value}&raca=${raca.value}&porte=${porte.value}&data_nascimento=${data_nascimento.value}&cor=${cor.value}&sexo=${sexo.value}&castrado=${castrado}&adotado=${adotado}&observacao=${observacao.value}`,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        }
    })
        .then(response => response.json())
        .then(data => {
            // Exibe o SweetAlert2 com base na resposta do servidor
            if (data.resposta.includes('sucesso')) {
                Swal.fire({
                    icon: 'success',
                    title: 'Sucesso!',
                    text: data.resposta,
                });
                listaPet()
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: data.resposta,
                });
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ocorreu um erro ao cadastrar o pet. Por favor, tente novamente mais tarde.',
            });
        });
})


// função que solicita os pets cadastrados ao backend
const listaPet = () => {
    fetch('/pet/listar')
        .then(response => response.json())
        .then(result => {
            let tabela = document.getElementById('dados')

            var table = $("#pets").DataTable();

            // Destroy the DataTable
            table.destroy();

            tabela.innerHTML = ``

            for (cont = 0; cont < result.length; cont++) {
                tabela.innerHTML += `
                <tr>
                    <td>${result[cont].id}</td>
                    <td>${result[cont].nome}</td>
                    <td>${result[cont].raca}</td>
                    <td>${result[cont].porte}</td>
                    <td>${result[cont].data_nascimento}</td>
                    <td>${result[cont].observacao}</td>
                    <td>${result[cont].cor}</td>
                    <td>${result[cont].sexo == "M" ? 'Macho' : 'Fêmia'}</td>
                    <td>${result[cont].castrado == "1" ? 'Sim' : 'Não'}</td>
                    <td>${result[cont].adotado}</td>
                    <td><i class="fa-solid fa-trash" style="color: #ff0000; cursor: pointer;" onclick="deletar(${result[cont].id},'${result[cont].nome}')"></i></td>
                </tr>
             `
            }
            table = new DataTable('#pets', {
                scrollX: true,
                language: {
                    url: 'https://cdn.datatables.net/plug-ins/1.11.5/i18n/pt-BR.json'
                },
                columnDefs: [
                    {
                        targets: 4,
                        render: DataTable.render.date()
                    }
                ]
            });
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Não foi possivel realizar a requisição',
            });
        });
}

const deletar = (id, nome) => {

    Swal.fire({
        title: `Deseja realmente deletar o pet ${nome}?`,
        text: "Essa ação é irrevercivel",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Deletar"
    }).then((result) => {
        if (result.isConfirmed) {
            fetch('/pet/deletar', {
                method: 'DELETE',
                body: `id=${id}`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            })
                .then(response => response.json())
                .then(result => {
                    Swal.fire({
                        title: result.titulo,
                        text: result.resposta,
                        icon: result.icone
                    });
                    listaPet()
                })
        }
    });
}