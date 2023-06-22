// Elementos do HTML
const divTarefa = document.querySelector('#tarefas')
const divTarefaConcluida = document.querySelector('#tarefas-concluidas')
const newTarefa = document.querySelector('#form-tarefa')
const updateTarefa = document.querySelector('#form-editar-tarefa')
const btnConcluida = document.querySelector('#tar-concluidas')
const dropNotifica = document.querySelector('#notificacoes')
const qtdNot = document.querySelector('#qtd-not')

// Categorias
const confCat = document.querySelector('#confCat')
const formCat = document.querySelector('#form-categoria')
const listCat = document.querySelector('#conf-cat')
const nomeCat = document.querySelector('#nome')
const corCat = document.querySelector('#cores')
const formEdCat = document.querySelector('#form-ed-categoria')
const edNomeCat = document.querySelector('#edNome')
const edCorCat = document.querySelector('#edCores')
const edCategoria = document.querySelector('#edCategoria')

// Elementos do Formulário de Criação
const tituloTarefa = document.querySelector('#titulo')
const descTarefa = document.querySelector('#desc')
const prazoTarefa = document.querySelector('#prazo')
const priTarefa = document.querySelector('#prioridade')
const permTarefa = document.querySelector('#permissao')
const catTarefa = document.querySelector('#categoria')

// Elementos do formulário de Edição
const edTarefa = document.querySelector('#edTarefa')
const tituloEd = document.querySelector('#tituloEd')
const descEd = document.querySelector('#descEd')
const prazoEd = document.querySelector('#prazoEd')
const priEd = document.querySelector('#prioridadeEd')
const permEd = document.querySelector('#permissaoEd')
const catEd = document.querySelector('#categoriaEd')
const criadorEd = document.querySelector('#criadorEd')

// Relatório
const relatorio = document.querySelector('#relatorio')

// Nome do usuário 
const logado = document.querySelector("#logado");
const user = document.querySelector("#criador");
const userLogado = JSON.parse(localStorage.getItem("userLogado"));
const usuario = userLogado.nome;

logado.innerHTML = `Olá ${usuario}`;
user.innerHTML = usuario;      // Nome do Criador da Tarefa


let nConcluidas = '';
let concluidas = '';
let notifica = '';

//IMPLEMENTAÇÃO DOS CRUDs
const db_user = [];
let dbCat = [];

// Relatório
relatorio.addEventListener('click', (e) => {
    let qtdCon = 0
    let qtdNCon = 0
    let qtdCat = 0
    let tarefaCat = 0
    let categs = []
    var today = new Date(Date.now())

    relat = `<h1>Relatório Geral de Tarefas</h1> <br/> <h3>${today}</h3> </br></br><p>Nome: ${usuario}<p> </br><hr></br>`

    const options = {
        margin: [10, 10, 10, 10],
        filename: "Relatório.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait"}
    }

    // Quantidade de Categorias
    for (let categ of readCategorias()){
        qtdCat++
        categs.push(categ.nome)
    }

    relat = relat + `<h4>Informações Gerais</h4><p>Quantidade de categorias: ${qtdCat}</p> </br>`

    // Quantidade 
    for(let tarefa of readTasks()){
        let user_permissao = tarefa.permissao.split(";")

        if(tarefa.concluida == false && (tarefa.criador == usuario) || user_permissao.includes(usuario)){
            qtdNCon++
        }

        if(tarefa.concluida == true && (tarefa.criador == usuario) || user_permissao.includes(usuario)){
            qtdCon++
        }
    }

    relat = relat + `<p>Tarefas concluídas: ${qtdCon}</p></br><p>Terefas NÃO concluídas: ${qtdNCon}</p></br> <hr> </br> <h4>Tarefas por categoria</h4> </br>`

    for(let categoria of categs){
        tarefaCat = 0
        for(let tarefa of readTasks()){
            let user_permissao = tarefa.permissao.split(";")
            
            console.log(categoria)
            console.log(tarefa.categoria)

            if(((tarefa.criador == usuario) || user_permissao.includes(usuario)) && tarefa.categoria.trim() == categoria){
                tarefaCat++
            }
        }

        relat = relat + `<p>Quantidade de tarefas na categoria ${categoria}: ${tarefaCat}</p> </br>`
    }


    html2pdf().set(options).from(relat).save()
})

// CATEGORIAS
// Create

const getCat = () => JSON.parse(localStorage.getItem('dbCat')) ?? []
const setCat = (dbCat) =>  localStorage.setItem("dbCat", JSON.stringify(dbCat))

formCat.addEventListener('submit', (e) => {
    createCat({nome: nomeCat.value, cor: corCat.value, user: `${usuario}`})

    mostraCategorias()
    formCat.reset() 
})

const createCat = (categoria) => {
    dbCat = getCat()
    dbCat.push(categoria)
    console.log(dbCat)
    setCat(dbCat)
}

// Read
const readCategorias = () => getCat()

let categExists = []

if(readCategorias().length == 0){
    createCat({nome: 'Sem Categoria', cor: 'grey', user: 'Todos'})
}else{
    for(let catExt of readCategorias()){
        categExists.push(catExt.nome)
    }

    if(!(categExists.includes('Sem Categoria'))){
        createCat({nome: 'Sem Categoria', cor: 'grey', user: 'Todos'})
    }
}

confCat.addEventListener('click', (e) => {
    mostraCategorias()
})

function mostraCategorias(){
    listCat.innerHTML = ''
    let categorias = ''
    console.log(usuario)
    for(let categoria of readCategorias()){
        if(categoria.nome != 'Sem Categoria' && categoria.user == usuario){
            categorias = categorias + `<button type="button" style="background-color: ${categoria.cor}; display: flex;" class="list-group-item list-group-item-action"><span data-bs-toggle="modal" data-bs-target="#edCategoriaModal" class="editar" onclick="formUpCat('${categoria.nome}')"><i class="fa-sharp fa-solid fa-pen"></i></span><span class="lixo" onclick="apagaCategoria('${categoria.nome}')"><i class="fa-sharp fa-solid fa-trash"></i></span>${categoria.nome}</button>`
        }
    }

    if(categorias == ''){
        listCat.innerHTML = '<h2>Sem Categoria...</h2>'
    }else{
        listCat.innerHTML = categorias
    }
}

function corCategoria(nome){
    let categ = readCategorias().filter(catg => catg.nome == nome.trim())
  
    return categ[0].cor
}

// Update
function formUpCat(nome){
    let cat = readCategorias().filter(catAtual => catAtual.nome == nome)

    edCategoria.innerText = cat[0].nome
    edNomeCat.value = cat[0].nome
    edCorCat.value = cat[0].cor
}

formEdCat.addEventListener('submit', (e) => {

    const newCat = {
        nome: edNomeCat.value,
        cor: edCorCat.value,
        user: usuario
    }


    atualizaCategoria(edCategoria.innerText, newCat)

})

function atualizaCategoria(nome, newCat){
    let atualizar = readCategorias().find((categoria) => categoria.nome == nome)
    const index = findIndex(readCategorias(), atualizar)

    dbCat = readCategorias()
    dbCat[index] = newCat
    setCat(dbCat)

    mostraCategorias()
}

//Delete
function apagaCategoria(nome){

    for(let trf of readTasks()){
        console.log(trf.categoria)
        if(trf.categoria.trim() == nome){
            const newTask = {
                nome: trf.nome,
                desc: trf.desc,
                prioridade: trf.prioridade,
                prazo: trf.prazo,
                permissao: trf.permissao,
                categoria: 'Sem Categoria',
                criador: trf.criador,
                concluida: trf.concluida
            }
            atualizaTarefa(trf.nome, newTask)
        }
    }
    

    let excluir = readCategorias().find((categoria) => categoria.nome == nome)

    const index = findIndex(readCategorias(), excluir)

    dbCat = readCategorias()
    dbCat.splice(index, 1)
    setCat(dbCat)

    mostraCategorias()
    mostraTarefas()
}

//TAREFAS
//Create
const getTasks = () => JSON.parse(localStorage.getItem('dbTasks')) ?? []
const setTasks = (dbTasks) =>  localStorage.setItem("dbTasks", JSON.stringify(dbTasks))

newTarefa.addEventListener('submit', (e) => {
    createTask({nome: tituloTarefa.value, desc: descTarefa.value, prioridade: priTarefa.value, prazo: prazoTarefa.value, permissao: permTarefa.value, categoria: catTarefa.value,criador: usuario, concluida: false})

    mostraTarefas()
    newTarefa.reset() 
})

const createTask = (task) => {
    dbTasks = getTasks()
    dbTasks.push(task)
   setTasks(dbTasks)
}

function carregaCategorias(tipo){
    let div
    if (tipo == 'criar'){
        div = catTarefa
    }else{
        div = catEd
    }

    div.innerHTML = ''
    let cats = '<option selected disabled value="">Escolha...</option>'
    for(let categoria of readCategorias()){
        if(categoria.user == usuario || categoria.user == 'Todos'){
            cats = cats + `<option value="${categoria.nome} ">${categoria.nome}</option>`
        }
    }
   
    div.innerHTML = cats
}


//Read
const readTasks = () => getTasks()

function mostraTarefas(){
    divTarefa.innerHTML = ''
    nConcluidas = ''
    let dadosPrazo = ''
    for(let tarefa of readTasks()){
        let user_permissao = tarefa.permissao.split(";")

        if(tarefa.concluida == false && (tarefa.criador == usuario) || user_permissao.includes(usuario)){
            dadosPrazo = verificaPrazo(tarefa.prazo)
            nConcluidas = nConcluidas + `<div class="d-flex card" style="width: 18rem;"> <div class="card-body"><h5 class="card-title">${tarefa.nome}</h5><span class="badge rounded-pill ${corPrioridade(tarefa.prioridade)}">${tarefa.prioridade}</span><p class="card-text">${tarefa.desc}</p><div class="flags"><span class="badge rounded-pill ${dadosPrazo.cor}">${tarefa.prazo} | ${dadosPrazo.msg}</span><span class="badge rounded-pill" style="background-color: ${corCategoria(tarefa.categoria)}">${tarefa.categoria}</span></div><div class="botoes"><a href="#" class="btn btn-success" onclick="concluida('${tarefa.nome}')">Finalizar</a><a data-bs-toggle="modal" data-bs-target="#editarModal" href="#" class="btn btn-primary" onclick="formUpTarefa('${tarefa.nome}'); carregaCategorias('editar')">Editar</a><a href="#" class="btn btn-danger" onclick="apagaTarefa('${tarefa.nome}')">Excluir</a></div></div></div>`
        }
    }
    if(nConcluidas == ''){
        divTarefa.innerHTML = '<h2>Sem tarefas...</h2>'
    }else{
        divTarefa.innerHTML = nConcluidas
    }

    notificacoes()
}

mostraTarefas()

function notificacoes(){
    dropNotifica.innerHTML = ''
    notifica = ''
    let qtd = 0
    let dados = ''

    for(let not of readTasks()){
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
    for(let con of readTasks()){
        let user_permissao = con.permissao.split(";")
        if(con.concluida == true && (con.criador == usuario || user_permissao.includes(usuario))){
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
    let tarefa = readTasks().filter(tarefaAtual => tarefaAtual.nome == nome)
    tarefa[0].concluida = false

    atualizaTarefa(tarefa[0].nome, tarefa[0])

    mostraTarefas()
    mostraConcluidas()
}

function concluida(nome){
    let tarefa = readTasks().filter(tarefaAtual => tarefaAtual.nome == nome)
    
    tarefa[0].concluida = true

    atualizaTarefa(tarefa[0].nome, tarefa[0])
    mostraTarefas()
    mostraConcluidas()
}


//Update

function formUpTarefa(nome) {
    let tarefa = readTasks().filter(tarefaAtual => tarefaAtual.nome == nome)

    edTarefa.innerText = tarefa[0].nome
    tituloEd.value = tarefa[0].nome
    descEd.value = tarefa[0].desc
    priEd.value = tarefa[0].prioridade
    prazoEd.value = tarefa[0].prazo
    permEd.value = tarefa[0].permissao
    catEd.value = tarefa[0].categoria
    criadorEd.innerHTML = tarefa[0].criador
    

}

updateTarefa.addEventListener('submit', (e) => {

    const newTask = {
        nome: tituloEd.value,
        desc: descEd.value,
        prioridade: priEd.value,
        prazo: prazoEd.value,
        permissao: permEd.value,
        categoria: catEd.value,
        criador:criadorEd.innerHTML,
        concluida: false
    }


    atualizaTarefa(edTarefa.innerText, newTask)

})

function findIndex(list, obj) {
    return list.findIndex((current) =>
        Object.keys(current).every((key) => obj[key] === current[key])
    );
}

function atualizaTarefa(nome, newTask){
    let atualizar = readTasks().find((tarefas) => tarefas.nome == nome)
    const index = findIndex(readTasks(), atualizar)

    dbTasks = readTasks()
    dbTasks[index] = newTask
    setTasks(dbTasks)

    mostraTarefas()
}


//Delete
function apagaTarefa(nome){
    let excluir = readTasks().find((tarefas) => tarefas.nome == nome)
    const index = findIndex(readTasks(), excluir)

    dbTasks = readTasks()
    dbTasks.splice(index, 1)
    setTasks(dbTasks)

    mostraTarefas()
}

