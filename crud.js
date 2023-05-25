// Elementos do HTML
const divTarefa = document.querySelector('#tarefas')
const newTarefa = document.querySelector('#form-tarefa')

// Elementos do Formulário
const tituloTarefa = document.querySelector('#titulo')
const descTarefa = document.querySelector('#desc')
const prazoTarefa = document.querySelector('#prazo')
const priTarefa = document.querySelector('#prioridade')
const permTarefa = document.querySelector('#permissao')
const catTarefa = document.querySelector('#categoria')
const criadorTarefa = document.querySelector('#criador')
let todas = '';

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
        criador: dados.criador

    });
    if (dados.permissao === 'Grupo'){
        var nome = prompt("Digite um nome: ");
        var numero = prompt("Digite um número: ");
        var email = prompt("Digite um email: "); 
        CriaUsuario({nome: nome, numero: numero, email: email})
    }
    mostraTarefas()
}   

CriaTarefa({nome: 'Trabalho', desc: 'Trabalho final de eng. software', prioridade: 10, prazo: '23/06', permissao: 'Eu', categoria: 'Faculdade', criador: 'Pedro Junho'})

CriaTarefa({nome: 'Trabalho 2', desc: 'Trabalho final de eng. software', prioridade: 10, prazo: '23/06', permissao: 'Eu', categoria: 'Faculdade', criador: 'Pedro Junho'})

//Read
function mostraTarefas(){
    divTarefa.innerHTML = ''
    todas = ''
    for(let tarefa of leTodasTarefas()){
        nome = tarefa.nome
        todas = todas + `<div class="d-flex card" style="width: 18rem;"> <div class="card-body"><h5 class="card-title">${tarefa.nome}</h5><p class="card-text">${tarefa.desc}</p><p>${tarefa.prazo}</p><a href="#" class="btn btn-success">Finalizar</a><a data-bs-toggle="modal" data-bs-target="#editarModal" href="#" class="btn btn-primary">Editar</a><a href="#" class="btn btn-danger" onclick="apagaTarefa('Trabalho')">Excluir</a></div></div>`
    }
    divTarefa.innerHTML = todas
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
apagaTarefa('Trabalho')
console.log(leTodasTarefas())


//Update


function atualizaTarefa(nome, newName, desc, prioridade, prazo, permissao, categoria){
    const atualizar= leTodasTarefas().find((tarefas) =>{
        return tarefas.nome === nome;
    });
    atualizar.nome = newName
    atualizar.desc = desc
    atualizar.prioridade = prioridade
    atualizar.prazo = prazo
    atualizar.permissao = permissao
    atualizar.categoria = categoria
}

//Delete
function apagaTarefa(nome){
    const tarefa = leTodasTarefas().filter((tarefaAtual)=> {
        return tarefaAtual.nome !== nome
    });
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
