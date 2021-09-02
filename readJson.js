var fs = require("fs");


fs.readFile("./repositJson/my-file.json" , "utf8", function(err, data){
  if(err){
    return console.log("Erro ao ler arquivo");
  }
  
    var jsonData = JSON.parse(data); // faz o parse para json para o Objeto
    //Se pre\cisar em array use:
    //jsonData = Object.keys(jsonData);
    var actions = jsonData.actions;
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
            
            if (idMemberCard === members[item].id){
              console.log("   Cartão " + card.name);
              
              // Verificar Movimentações de Cartão
              actions.forEach((action) => {
                //console.log(card.id);
                //console.log(card.idMembers[0] );

                //Verifica se a ação do quadro é referente aos cartões
                if (action.type.indexOf('updateCard') > -1){
                  
                  var idActionCard = action.data.card.id;
                  var listName = action.data.list.name;
          
                  if (typeof idActionCard === "undefined"){
                    //console.log('Card não pertence ao Membro')
                  } else { 
                      
                      if (idActionCard === card.id){
                        console.log("       Ação " + action.id 
                                             + " " + action.date 
                                             + " " + action.type);
                                             //+ " " + action.data.list.name);

                      }
                    }
                  }
              });
            }       
        }
    });
  })
});  