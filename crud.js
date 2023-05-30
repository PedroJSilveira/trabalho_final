// Elementos do HTML
const divTarefa = document.querySelector('#tarefas')
const divTarefaConcluida = document.querySelector('#tarefas-concluidas')
const newTarefa = document.querySelector('#form-tarefa')
const updateTarefa = document.querySelector('#form-editar-tarefa')
const btnConcluida = document.querySelector('#tar-concluidas')
const dropNotifica = document.querySelector('#notificacoes')
const qtdNot = document.querySelector('#qtd-not')

// Elementos do Formulário de Criação
const tituloTarefa = document.querySelector('#titulo')
const descTarefa = document.querySelector('#desc')
const prazoTarefa = document.querySelector('#prazo')
const priTarefa = document.querySelector('#prioridade')
const permTarefa = document.querySelector('#permissao')
const catTarefa = document.querySelector('#categoria')
const criadorTarefa = document.querySelector('#criador')

// Elementos do formulário de Edição
const edTarefa = document.querySelector('#edTarefa')
const tituloEd = document.querySelector('#tituloEd')
const descEd = document.querySelector('#descEd')
const prazoEd = document.querySelector('#prazoEd')
const priEd = document.querySelector('#prioridadeEd')
const permEd = document.querySelector('#permissaoEd')
const catEd = document.querySelector('#categoriaEd')
const criadorEd = document.querySelector('#criadorEd')

let nConcluidas = '';
let concluidas = '';
let notifica = '';

//IMPLEMENTAÇÃO DOS CRUDs
const gerenTarefas = {
    usuarios: [],
    tarefas: []
}

mostraTarefas()

//TAREFAS
//Create
newTarefa.addEventListener('submit', (e) => {
    CriaTarefa({nome: tituloTarefa.value, desc: descTarefa.value, prioridade: priTarefa.value, prazo: prazoTarefa.value, permissao: permTarefa.value, categoria: catTarefa.value, criador: criadorTarefa.value})

    newTarefa.reset() 
})


function CriaTarefa(dados){
    gerenTarefas.tarefas.push(
    {
        nome: dados.nome,
        desc: dados.desc,
        prioridade: dados.prioridade,
        prazo: dados.prazo,
        permissao: dados.permissao,
        categoria: dados.categoria,
        criador: dados.criador,
        concluida:  false

    });
    if (dados.permissao === 'Grupo'){
        var nome = prompt("Digite um nome: ");
        var numero = prompt("Digite um número: ");
        var email = prompt("Digite um email: "); 
        CriaUsuario({nome: nome, numero: numero, email: email})
    }
    mostraTarefas()
} 

CriaTarefa({nome: 'Trabalho', desc: 'Trabalho final de eng. software', prioridade: 'Alta', prazo: '2023-06-04', permissao: 'Eu', categoria: 'UNIFEI', criador: 'Ana Maísa'})

CriaTarefa({nome: 'Trabalho Final', desc: 'Trabalho final de eng. software', prioridade: 'Alta', prazo: '2023-05-26', permissao: 'Eu', categoria: 'UNIFEI', criador: 'Ana Maísa'})

CriaTarefa({nome: 'Trabalho Final  1', desc: 'Trabalho final de eng. software', prioridade: 'Alta', prazo: '2023-06-22', permissao: 'Eu', categoria: 'UNIFEI', criador: 'Ana Maísa'})

//Read
function notificacoes(){
    dropNotifica.innerHTML = ''
    notifica = ''
    let qtd = 0
    let dados = ''

    for(let not of leTodasTarefas()){
        if(not.concluida == false){
            dados = verificaPrazo(not.prazo)
            if(dados.cor == 'text-bg-danger' || dados.cor == 'text-bg-warning'){
                notifica = notifica + `<li><a><p>${not.nome}</p><span class="badge rounded-pill ${dados.cor}">${not.prazo} | ${dados.msg}</span></a></li>`
                notifica = notifica + `<hr>`
                qtd++
            }
        }

    }

    if(notifica == ''){
        dropNotifica.innerHTML = '<p>Sem notificações...</p>'
    }else{
        dropNotifica.innerHTML = notifica
    }

    qtdNot.innerText = qtd
}

function mostraTarefas(){
    divTarefa.innerHTML = ''
    nConcluidas = ''
    let dadosPrazo = ''
    for(let tarefa of leTodasTarefas()){
        if(tarefa.concluida == false){
            dadosPrazo = verificaPrazo(tarefa.prazo)
            nConcluidas = nConcluidas + `<div class="d-flex card" style="width: 18rem;"> <div class="card-body"><h5 class="card-title">${tarefa.nome}</h5><span class="badge rounded-pill ${corPrioridade(tarefa.prioridade)}">${tarefa.prioridade}</span><p class="card-text">${tarefa.desc}</p><div class="flags"><span class="badge rounded-pill ${dadosPrazo.cor}">${tarefa.prazo} | ${dadosPrazo.msg}</span><span class="badge rounded-pill text-bg-primary">${tarefa.categoria}</span></div><div class="botoes"><a href="#" class="btn btn-success" onclick="concluida('${tarefa.nome}')">Finalizar</a><a data-bs-toggle="modal" data-bs-target="#editarModal" href="#" class="btn btn-primary" onclick="formUpTarefa('${tarefa.nome}')">Editar</a><a href="#" class="btn btn-danger" onclick="apagaTarefa('${tarefa.nome}')">Excluir</a></div></div></div>`

        }
    }
    if(nConcluidas == ''){
        divTarefa.innerHTML = '<h2>Sem tarefas...</h2>'
    }else{
        divTarefa.innerHTML = nConcluidas
    }

    notificacoes()
}

function corPrioridade(prioridade){
    if(prioridade == 'Alta'){
        return 'text-bg-danger'
    }

    if(prioridade == 'Média'){
        return 'text-bg-warning'
    }

    if(prioridade == 'Baixa'){
        return 'text-bg-success'
    }
}

function verificaPrazo(prazo){
    var date1 = new Date(prazo)
    var today = new Date(Date.now())

    var timeDiff = Math.abs(date1.getTime() - today.getTime())
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24))

    if(date1.getTime() < today.getTime()){
        return {cor: 'text-bg-danger', msg: `${diffDays} dias atrasado!`}
    }

    if(diffDays <= 7 && diffDays >= 3){
        return {cor: 'text-bg-warning', msg: `Faltam ${diffDays} dias!`}
    }

    if(diffDays <= 2){
        return {cor: 'text-bg-danger', msg: `Faltam ${diffDays} dias!`}
    }

    return {cor: 'text-bg-success', msg: `Faltam ${diffDays} dias...`}
}

function mostraConcluidas(){
    divTarefaConcluida.innerHTML = ''
    concluidas = ''
    for(let con of leTodasTarefas()){
        if(con.concluida == true){
            concluidas = concluidas + `<div class="d-flex card" style="width: 18rem;"> <div class="card-body"><h5 class="card-title">${con.nome}</h5><span class="badge rounded-pill text-bg-primary">${con.categoria}</span><p class="card-text">${con.desc}</p><a href="#" class="btn btn-success" onclick="voltar('${con.nome}')">Voltar</a></div></div>`
        }
    }

    if(concluidas == ''){
        divTarefaConcluida.innerHTML = '<p>Nenhuma tarefa concluída...</p>'
    }else{
        divTarefaConcluida.innerHTML = concluidas
    }
}

function voltar(nome){
    let tarefa = leTodasTarefas().filter(tarefaAtual => tarefaAtual.nome == nome)
    tarefa[0].concluida = false
    mostraTarefas()
    mostraConcluidas()
}

function concluida(nome){
    let tarefa = leTodasTarefas().filter(tarefaAtual => tarefaAtual.nome == nome)
    tarefa[0].concluida = true
    mostraTarefas()
    mostraConcluidas()
}


function leTodasTarefas(){
    gerenTarefas.tarefas.sort()
    return gerenTarefas.tarefas;
}

function leTarefa(nome= 'semvalor', prazo= 'semvalor'){
    if (nome === 'semvalor' && prazo === 'semvalor')
        return gerenTarefas.tarefas;
    else{
        if(nome !== 'semvalor'){
            const tarefa = leTodasTarefas().filter((tarefas) => {
                return tarefas.nome === nome;
            });
        }
        if(prazo !== 'semvalor') {
            const tarefaPrazo = leTodasTarefas().filter((tarefas) => {
            return tarefas.prazo === prazo;
            });
        }
    }
}
console.log(leTodasTarefas())


//Update
function formUpTarefa(nome) {
    let tarefa = leTodasTarefas().filter(tarefaAtual => tarefaAtual.nome == nome)

    edTarefa.innerText = tarefa[0].nome
    tituloEd.value = tarefa[0].nome
    descEd.value = tarefa[0].desc
    priEd.value = tarefa[0].prioridade
    prazoEd.value = tarefa[0].prazo
    permEd.value = tarefa[0].permissao
    catEd.value = tarefa[0].categoria
    criadorEd.value = tarefa[0].criador

}

updateTarefa.addEventListener('submit', (e) => {
    atualizaTarefa(edTarefa.innerText, tituloEd.value, descEd.value, priEd.value, prazoEd.value, permEd.value, catEd.value)
})

function atualizaTarefa(nome, newName, desc, prioridade, prazo, permissao, categoria){
    let atualizar = leTodasTarefas().find((tarefas) => tarefas.nome == nome)

    atualizar.nome = newName
    atualizar.desc = desc
    atualizar.prioridade = prioridade
    atualizar.prazo = prazo
    atualizar.permissao = permissao
    atualizar.categoria = categoria

    mostraTarefas()
}

//Delete
function apagaTarefa(nome){
    gerenTarefas.tarefas = leTodasTarefas().filter(tarefaAtual => tarefaAtual.nome != nome);

    mostraTarefas()
}


//USUARIO

//Create
function CriaUsuario(dados){
    gerenTarefas.usuarios.push(
    {
        nome: dados.nome,
        cpf: dados.cpf,
        email: dados.email,
        numero: dados.numero
    });
}   

//CriaUsuario({nome: 'Pedro Junho', cpf: '111222', email: 'xxxxxx@xxxx.com', numero: 'xxxxx-xxxx'})

//Read
function leTodosUsuarios(){
    return gerenTarefas.usuarios;
}

function leUsuario(nome){
    const usuario = leTodosUsuarios().filter((usuarioAtual)=>{
        return usuarioAtual.nome === nome
    });
}

console.log(leTodosUsuarios())


//Update
function atualizaUsuario(nome, email, numero){
    const atualizar= leTodosUsuarios().find((usuario) =>{
        return usuario.nome === nome;
    });

    atualizar.email = email
    atualizar.numero = numero
}

//Delete
function apagaUsuario(nome){
    const tarefa = leTodosUsuarios().filter((usuario)=> {
        return usuario.nome !== nome
    });
}
