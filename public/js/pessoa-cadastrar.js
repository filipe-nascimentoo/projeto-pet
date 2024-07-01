document.addEventListener('DOMContentLoaded', () => {
    listaPessoa()
})

// Adicionar um evento ao enviar o formulario
document.getElementById('cadastrar').addEventListener('submit', async (e) => {
    // bloqueia o evento padão(enviar o form via get)
    e.preventDefault();

    // captura dos elementos do form
    let cpf = document.getElementById('cpf')
    let nome = document.getElementById('nome')
    let email = document.getElementById('email')
    let rua = document.getElementById('rua')
    let numero = document.getElementById('numero')
    let bairro = document.getElementById('bairro')
    let complemento = document.getElementById('complemento')
    let cidade = document.getElementById('cidade')
    let estado = document.getElementById('estado')
    let cep = document.getElementById('cep')
    let rg = document.getElementById('rg')
    let telefone = document.getElementById('telefone')
    let data_nascimento = document.getElementById('data_nascimento')
    let senha = document.getElementById('senha')

    // envio dos dados ao backend fetch(api)
    await fetch('/pessoa/cadastrar', {
        method: 'POST',
        body: `cpf=${cpf.value}&nome=${nome.value}&email=${email.value}&rua=${rua.value}&numero=${numero.value}&bairro=${bairro.value}&complemento=${complemento.value}&cidade=${cidade.value}&estado=${estado.value}&cep=${cep.value}&rg=${rg.value}&telefone=${telefone.value}&data_nascimento=${data_nascimento.value}&senha=${senha.value}`,

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
                listaPessoa()
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
                text: 'Ocorreu um erro ao realizar o cadastro. Por favor, tente novamente mais tarde.',
            });
        });
})


// função que solicita os pets cadastrados ao backend
const listaPessoa = () => {
    fetch('/pessoa/listar')
        .then(response => response.json())
        .then(result => {
            let tabela = document.getElementById('dados')

            var table = $("#pessoas").DataTable();

            // Destroy the DataTable
            table.destroy();

            tabela.innerHTML = ``

            for (cont = 0; cont < result.length; cont++) {
                tabela.innerHTML += `
                <tr>
                    <td>${result[cont].id}</td>
                    <td>${result[cont].cpf}</td>
                    <td>${result[cont].nome}</td>
                    <td>${result[cont].email}</td>
                    <td>${result[cont].rua}</td>
                    <td>${result[cont].numero}</td>
                    <td>${result[cont].bairro}</td>
                    <td>${result[cont].complemento}</td>
                    <td>${result[cont].cidade}</td>
                    <td>${result[cont].estado}</td>
                    <td>${result[cont].cep}</td>
                    <td>${result[cont].rg}</td>
                    <td>${result[cont].telefone}</td>
                    <td>${result[cont].data_nascimento}</td>
                    <td>${result[cont].senha}</td>
                    <td><i class="fa-solid fa-trash" style="color: #ff0000; cursor: pointer;" onclick="deletar(${result[cont].id},'${result[cont].nome}')"></i></td>
                </tr>
             `
            }
            
            table = new DataTable('#pessoas', {
                scrollX: true,
                language: {
                    url: 'https://cdn.datatables.net/plug-ins/1.11.5/i18n/pt-BR.json'
                },
                columnDefs: [
                    {
                        targets: 13,
                        render: DataTable.render.date()
                    }
                ]
            });
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error,
            });
        });
}

const deletar = (id, nome) => {

    Swal.fire({
        title: `Deseja realmente deletar o usuario ${nome}?`,
        text: "Essa ação é irrevercivel",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Deletar"
    }).then((result) => {
        if (result.isConfirmed) {
            fetch('/pessoa/deletar', {
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
                    listaPessoa()
                })
        }
    });
}

// Função que consulta CEP na API (WebService) do VIACEP
const consultaCep = () => {
    let cep = document.getElementById('cep');

    if (cep.value == '') {
        alert('Informe o CEP');
        return;
    }

    fetch(`https://viacep.com.br/ws/${cep.value}/json/`)
        .then(response => response.json())
        .then(result => {
            if (!result.erro) {
                rua.value = result.logradouro;
                bairro.value = result.bairro;
                cidade.value = result.localidade;
                estado.value = result.uf;

                numero.focus()

                rua.disabled = true;
                bairro.disabled = true;
                cidade.disabled = true;
                estado.disabled = true;
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Oops...',
                    text: 'CEP Inválido',
                });
                rua.value = '';
                bairro.value = '';
                cidade.value = '';
                estado.value = '';

                
                rua.disabled = false;
                bairro.disabled = false;
                cidade.disabled = false;
                estado.disabled = false;
                
            }
        })
        .catch((error) => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'CEP não encontrado',
            });
        });
}