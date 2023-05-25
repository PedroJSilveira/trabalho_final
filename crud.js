//IMPLEMENTAÇÃO DOS CRUDs
const gerenTarefas = {
    usuarios: [],
    tarefas: []
}


//TAREFAS

//Create
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
}   

//CriaTarefa({nome: 'Trabalho', desc: 'Trabalho final de eng. software', prioridade: 10, prazo: '23/06', permissao: 'Grupo', categoria: 'Faculdade', criador: 'Pedro Junho'})

//Read
function leTodasTarefas(){
    gerenTarefas.tarefas.sort()
    return gerenTarefas.tarefas;
}

function leTarefa(nome= 'semvalor', prazo= 'semvalor'){
    if (nome === 'semvalor' && prazo === 'semvalor')
        return gerenTarefas.tarefas;
    else{
        if(nome!== 'semvalor'){
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
