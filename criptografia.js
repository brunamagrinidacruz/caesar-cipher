const fs = require('fs');
const sha1 = require('./sha1');

const { caminho_do_arquivo } = require('./constrains.js');
const NAO_E_LETRA = 42;

const alfabeto = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 
                  'h', 'i', 'j', 'k', 'l', 'm','n', 
                  'o', 'p', 'q', 'r', 's', 't', 'u',
                  'v', 'w', 'x', 'y', 'z'];

function verificando_alfabeto(letra) {
  for (i in alfabeto) 
    if(alfabeto[i] == letra) return (parseInt(i));
  return NAO_E_LETRA;
}

exports.descriptografar = function(informacoes_criptografia, callback) {
    var cifrado = informacoes_criptografia.cifrado;

    for (i in cifrado) {
        var caractere = cifrado[i];
        var posicao_letra = verificando_alfabeto(caractere);

        if(posicao_letra == NAO_E_LETRA) { //Se for número ou pontuação (. -)
          informacoes_criptografia.decifrado += caractere;
        } else { 
          var indice = posicao_letra - informacoes_criptografia.numero_casas;
            if(indice < 0) { //Então deve voltar ao final do alfabeto
                informacoes_criptografia.decifrado += alfabeto[alfabeto.length + indice];
            } else {
               informacoes_criptografia.decifrado += alfabeto[indice];
            }
        }

    }

    informacoes_criptografia.resumo_criptografico = sha1.sha1(informacoes_criptografia.decifrado);
    fs.writeFile(caminho_do_arquivo, JSON.stringify(informacoes_criptografia), function(erro) {
      if(erro) throw erro;
      callback.call(null, informacoes_criptografia); 
    })
}
