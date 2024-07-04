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


// função que solicita os usuarios cadastrados ao backend
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
                    <td class="text-center">${result[cont].id}</td>
                    <td>${result[cont].nome}</td>
                    <td>${result[cont].cpf}</td>
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
                    <td class="text-center">
                        <i class="fa-solid fa-pen-to-square" style="color: #28a745; cursor: pointer;" onclick="atualizar(${result[cont].id})"></i>
                        <i class="fa-solid fa-trash" style="color: #ff0000; cursor: pointer;" onclick="deletar(${result[cont].id},'${result[cont].nome}')"></i>
                    </td>
                </tr>
             `
            }

            table = new DataTable('#pessoas', {
                fixedColumns: {
                    start: 2,
                    end: 1
                },
                layout: {
                    topStart: {
                        buttons: [
                            {
                                extend: 'print',
                                exportOptions: {
                                    columns: ':visible'
                                },
                                text: '<i class="fa-solid fa-print fa-xl"></i>',
                                titleAttr: 'Imprimir'
                            },
                            {
                                extend: 'copyHtml5',
                                exportOptions: {
                                    columns: ':visible'
                                },
                                text: '<i class="fa-solid fa-copy fa-xl"></i>',
                                titleAttr: 'Copiar'
                            },
                            {
                                extend: 'excelHtml5',
                                exportOptions: {
                                    columns: ':visible'
                                },
                                text: '<i class="fa-solid fa-file-excel fa-xl"></i>',
                                titleAttr: 'Excel'
                            },
                            {
                                extend: 'csvHtml5',
                                exportOptions: {
                                    columns: ':visible'
                                },
                                text: '<i class="fa-sharp fa-solid fa-file-csv fa-xl"></i>',
                                titleAttr: 'CSV'
                            },
                            {
                                extend: 'pdfHtml5',
                                exportOptions: {
                                    columns: ':visible'
                                },
                                text: '<i class="fa-solid fa-file-pdf fa-xl"></i>',
                                titleAttr: 'PDF'
                            },
                            {
                                extend: 'colvis',
                                columnText: function (dt, idx, title) {
                                    return title;
                                }
                            }
                        ]
                    }
                },
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

const atualizar = (id) => {
    // listar os dados apenas do usuario selecionado
    fetch('/pessoa/listar/id', {
        method: 'POST',
        body: `id=${id}`,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        }
    })
        .then(response => response.json())
        .then(result => {
            // tratamento dos resultados
            // exibe os dados no console do devtools(debug)

            console.log('result', result)


            const data = new Date(result[0].data_nascimento)
            const dataFormatada = data.toISOString().split('T')[0];

            document.getElementById('atualizar_cpf').value = result[0].cpf
            document.getElementById('atualizar_nome').value = result[0].nome
            document.getElementById('atualizar_email').value = result[0].email
            document.getElementById('atualizar_rua').value = result[0].rua
            document.getElementById('atualizar_numero').value = result[0].numero
            document.getElementById('atualizar_bairro').value = result[0].bairro
            document.getElementById('atualizar_complemento').value = result[0].complemento
            document.getElementById('atualizar_cidade').value = result[0].cidade
            document.getElementById('atualizar_estado').value = result[0].estado
            document.getElementById('atualizar_cep').value = result[0].cep
            document.getElementById('atualizar_rg').value = result[0].rg
            document.getElementById('atualizar_telefone').value = result[0].telefone
            document.getElementById('atualizar_data_nascimento').value = dataFormatada
            document.getElementById('atualizar_senha').value = result[0].senha
            document.getElementById('atualizar_id').value = result[0].id
        })
}

document.getElementById('atualizar').addEventListener('submit', async (e) => {
    // bloqueia o evento padão(enviar o form via get)
    e.preventDefault();

    // captura dos elementos do form
    let id = document.getElementById('atualizar_id')
    let cpf = document.getElementById('atualizar_cpf')
    let nome = document.getElementById('atualizar_nome')
    let email = document.getElementById('atualizar_email')
    let rua = document.getElementById('atualizar_rua')
    let numero = document.getElementById('atualizar_numero')
    let bairro = document.getElementById('atualizar_bairro')
    let complemento = document.getElementById('atualizar_complemento')
    let cidade = document.getElementById('atualizar_cidade')
    let estado = document.getElementById('atualizar_estado')
    let cep = document.getElementById('atualizar_cep')
    let rg = document.getElementById('atualizar_rg')
    let telefone = document.getElementById('atualizar_telefone')
    let data_nascimento = document.getElementById('atualizar_data_nascimento')
    let senha = document.getElementById('atualizar_senha')

    await fetch('/pessoa/atualizar', {
        method: 'PUT',
        body: `cpf=${cpf.value}&nome=${nome.value}&email=${email.value}&rua=${rua.value}&numero=${numero.value}&bairro=${bairro.value}&complemento=${complemento.value}&cidade=${cidade.value}&estado=${estado.value}&cep=${cep.value}&rg=${rg.value}&telefone=${telefone.value}&data_nascimento=${data_nascimento.value}&senha=${senha.value}&id=${id.value}`,
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
                text: `${error}`,
            });
        });

})