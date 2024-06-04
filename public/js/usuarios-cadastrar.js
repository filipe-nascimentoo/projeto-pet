const cadastrarLogin = () => {
    let form = document.getElementById('form-cadastrar')

    let nome = document.getElementById('nome')
    let telefone = document.getElementById('telefone')
    let email = document.getElementById('email')
    let senha = document.getElementById('senha')
    let confirmar = document.getElementById('confirmar')

    if (nome.value == '') {
        nome.style.border = '1px solid red'
    }

    if (telefone.value == '') {
        telefone.style.border = '1px solid red'
    }

    if (email.value == '') {
        email.style.border = '1px solid red'
    }

    if (senha.value == '') {
        senha.style.border = '1px solid red'
    }

    if (confirmar.value == '') {
        confirmar.style.border = '1px solid red'
    }

    if (senha != '') {
        if (senha.value != confirmar.value) {
            alert('Senha e confirmar senha estão com valoeres diferentes')
            return
        }
    }

    if (nome.value != '' && telefone.value != '' && email.value != '' && senha.value != '' && confirmar.value != '') {

        fetch(`/usuarios/cadastrar`, {
            method: "POST",
            body: `nome=${nome.value}&telefone=${telefone.value}&email=${email.value}&senha=${senha.value}&confirmar=${confirmar.value}`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        })
            .then(response => response.json())
            .then(result => {
                alert(result.MENSAGEM)
            })
    }
}