document.addEventListener('DOMContentLoaded', () => {
    listaPet();
})

// Adicionar um evento ao enviar o formulario
document.getElementById('cadastrar').addEventListener('submit', async (e) => {
    // bloqueria o evento padrão(enviar o form via get)
    e.preventDefault();

    // captura dos dados elementos do form
    let form = document.getElementById('cadastrar')


    // captura todos os valores do formulário
    let dados = new FormData(form)

    // envio dos dados ao backend usando fetch(api)
    const response = await fetch('/pet/cadastrar', {
        method: 'POST',
        body: dados,
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
                listaPet();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: data.resposta,
                });
            }
            // reseta o formulário
            document.getElementById('cadastrar').reset();
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


// função que solicita os pets cadastrados ao backend
const listaPet = () => {
    fetch('/pet/api/listar')
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
                    <td class="text-center">${result[cont].id}</td>
                    <td>${result[cont].nome}</td>
                    <td>${result[cont].raca}</td>
                    <td>${result[cont].porte}</td>
                    <td class="text-center">${result[cont].data_nascimento}</td>
                    <td>${result[cont].observacao}</td>
                    <td>${result[cont].cor}</td>
                    <td>${result[cont].sexo == "M" ? 'Macho' : 'Fêmea'}</td>
                    <td class="text-center">${result[cont].castrado == "on" ? 'Sim' : 'Não'}</td>
                    <td class="text-center">${result[cont].adotado == "on" ? 'Sim' : 'Não'}</td>
                    <td class="text-center">
                        <i class="fa-solid fa-pen-to-square" style="color: #28a745; cursor: pointer;" onclick="atualizar(${result[cont].id})"></i>
                        <i class="fa-solid fa-trash" style="color: #ff0000; cursor: pointer;" onclick="deletar(${result[cont].id},'${result[cont].nome}')"></i>
                    </td>
                </tr>
             `
            }
            table = new DataTable('#pets', {
                fixedColumns: {
                    start: 1,
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
                text: `${error}`,
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
                    listaPet();
                })
        }
    });
}

const atualizar = (id) => {
    fetch('/pet/listar/id', {
        method: 'POST',
        body: `id=${id}`,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        }
    })
        .then(response => response.json())
        .then(result => {
            const data = new Date(result[0].data_nascimento);
            const dataFormatada = data.toISOString().split('T')[0];

            document.getElementById('atualizar_id').value = result[0].id;
            document.getElementById('atualizar_nome').value = result[0].nome;
            document.getElementById('atualizar_raca').value = result[0].raca;
            document.getElementById('atualizar_porte').value = result[0].porte;
            document.getElementById('atualizar_data_nascimento').value = dataFormatada;
            document.getElementById('atualizar_cor').value = result[0].cor;
            document.getElementById('atualizar_sexo').value = result[0].sexo;
            document.getElementById('atualizar_castrado').checked = result[0].castrado === 'on';
            document.getElementById('atualizar_adotado').checked = result[0].adotado === 'on';
            document.getElementById('atualizar_observacao').value = result[0].observacao;

            // Mostra o modal após preencher os dados
            new bootstrap.Modal(document.getElementById('atualizarModal')).show();
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `${error}`,
            });
        });
}

document.getElementById('atualizar').addEventListener('submit', async (e) => {
    // bloqueia o evento padão(enviar o form via get)
    e.preventDefault();

    // captura dos elementos do form
    let id = document.getElementById('atualizar_id')
    let nome = document.getElementById('atualizar_nome')
    let raca = document.getElementById('atualizar_raca')
    let porte = document.getElementById('atualizar_porte')
    let data_nascimento = document.getElementById('atualizar_data_nascimento')
    let cor = document.getElementById('atualizar_cor')
    let sexo = document.getElementById('atualizar_sexo')
    let castrado = document.getElementById('atualizar_castrado').checked ? 'on' : 'off';
    let adotado = document.getElementById('atualizar_adotado').checked ? 'on' : 'off';
    let observacao = document.getElementById('atualizar_observacao')

    await fetch('/pet/atualizar', {
        method: 'PUT',
        body: `nome=${nome.value}&raca=${raca.value}&porte=${porte.value}&data_nascimento=${data_nascimento.value}&cor=${cor.value}&sexo=${sexo.value}&castrado=${castrado}&adotado=${adotado}&observacao=${observacao.value}&id=${id.value}`,
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
                listaPet();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: data.resposta,
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

})