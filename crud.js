//IMPLEMENTAÇÃO DOS CRUDs
const gerenTarefas = {
    usuarios: [],
    tarefas: []
}

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
        criador:dados.criador
    });
}   

CriaTarefa({nome: 'Trabalho', desc: 'Trabalho final de eng. software', prioridade: 10, prazo: 'HOJE', permissao: 'Apenas eu', categoria: 'Faculdade', criador: 'Pedro Junho'})
console.log(gerenTarefas.tarefas)

//Read
function leTarefa(){
    return gerenTarefas.tarefas;
}

//Update
function atualizaTarefa(){

}