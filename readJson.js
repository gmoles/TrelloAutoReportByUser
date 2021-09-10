import { writeFile } from 'fs';
import { Buffer } from 'buffer';

var fs = require("fs"); 

var reportItiActivities = [];

var vData = null;
var vSistema = null;
var vAtividadeRealizada = null;
var vIniAtividade = null;
var vFimAtividade = null;
var vPrazo = null;
var vStatus = null;
var vResponsavel = null;
var vObservacoes = null;


var activity = {
  data : null,
  sistema : null,
  atividadeRealizada : null,
  iniAtividade : null, 
  fimAtividade : null,
  prazo : null,
  status : null,
  responsavel : null,
  observacoes : null,
}

function Activities(data, sistema, atividadeRealizada, iniAtividade, fimAtividade, prazo, status, responsavel, observacoes) {
  this.data = data;
  this.sistema = sistema;
  this.atividadeRealizada = atividadeRealizada;
  this.iniAtividade = iniAtividade;
  this.fimAtividade = fimAtividade;
  this.prazo = prazo;
  this.status = status;
  this.responsavel = responsavel;
  this.observacoes = observacoes;
}

fs.readFile("./repositJson/my-file.json" , "utf8", function(err, data){
  if(err){
    return console.log("Erro ao ler arquivo");
  }
  
    var jsonData = JSON.parse(data); // faz o parse para json para o Objeto
    //Se pre\cisar em array use:
    //jsonData = Object.keys(jsonData);
    var actions = jsonData.actions.reverse();
    //date
    //type
    //list.name
    //card.id
    var cards   = jsonData.cards;
    //name
    //desc
    //due
    //dueComplete
    //labels
    //idmembers
    var members = jsonData.members;
    //id
    //initials
    //fullName
    var lists   = jsonData.lists;
    var labels  = jsonData.labels; 

    // Percorrer os membros do Quadro
    Object.keys(members).forEach(function(item){

      console.log(members[item].fullName);      
      
      // Buscar Cartões do Membro 
      cards.forEach((card) => {
        //console.log(card.id);
        //console.log(card.idMembers[0] );
        var idMemberCard = card.idMembers[0];

        if (typeof idMemberCard === "undefined"){
          //console.log('Card não pertence ao Membro')
        } else {
          
          if (idMemberCard === members[item].id && !card.closed){
            console.log("   Cartão " + card.name);
            
            //Verificar Movimentações de Cartão
            actions.forEach((action) => {
          
              //Verifica se a ação do quadro é referente aos cartões
              if (action.type.indexOf('updateCard') > -1 || action.type.indexOf('createCard') > -1){
                
                var idActionCard = action.data.card.id;
                
                //Verifica se a ação pertence ao Card
                if (card.id === idActionCard){
                  
                  //Tenta colocar na variavel o nome da Lista
                  try {
                    var listName = action.data.list.name;
                    var listNameBefore = "";
                  } catch ({ message }) {
                    console.log("        " + message);
                    try {
                      var listName =  action.data.listAfter.name;
                      var listNameBefore = action.data.listBefore.name;
                      
                    } catch ({ message }) {
                      console.log("        " + message);
                    }
                  }
                  console.log("        " + listName + " " + listNameBefore + " " + action.date);

                  if (listName === "Doing" && vData === null) {
                    try {
                      vSistema = card.labels[0].name;                                            
                    } catch ({ message }) {
                      vSistema = undefined;
                    }                    

                    vData = action.date;
                    vAtividadeRealizada = card.name;
                    vIniAtividade = action.date;
                    vStatus = "Pendente";
                    vResponsavel = members[item].fullName;
                    vObservacoes = card.desc;
                    
                  } else if( listName != "Doing" &&  vData != null) {
                      
                      vFimAtividade = action.date;
                      if (listName === "Done"){
                        vStatus = "Feito";
                      }
                                        
                      activity = new Activities(vData, vSistema, vAtividadeRealizada, vIniAtividade, vFimAtividade, vPrazo, vStatus, vResponsavel, vObservacoes);                  
                      reportItiActivities.push(activity);

                      //Zera as Variáveis
                      vData = null;
                      vSistema = null;
                      vAtividadeRealizada = null;
                      vIniAtividade = null;
                      vFimAtividade = null;
                      vPrazo = null;
                      vStatus = null;
                      vResponsavel = null;
                      vObservacoes = null;
                    }                  
                } //if (card.id === idActionCard)
              }
            });
            if (vData != null) {
              activity = new Activities(vData, vSistema, vAtividadeRealizada, vIniAtividade, vFimAtividade, vPrazo, vStatus, vResponsavel, vObservacoes);                  
              reportItiActivities.push(activity);
              
              //Zera as Variáveis
              vData = null;
              vSistema = null;
              vAtividadeRealizada = null;
              vIniAtividade = null;
              vFimAtividade = null;
              vPrazo = null;
              vStatus = null;
              vResponsavel = null;
              vObservacoes = null;

            }
          }       
        } 
    });
  })
  console.log(reportItiActivities);

  console.log("fim");


  const data = new Uint8Array(Buffer.from(reportItiActivities));
  writeFile('./repositJson/my-file.json', data, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
}); 


