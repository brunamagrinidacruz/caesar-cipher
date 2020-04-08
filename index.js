const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const criptografia = require('./criptografia');

const { caminho_do_arquivo, token } = require('./constrains.js');

var url_receber = 'https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=' + token;
var url_enviar = 'https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=' + token;

function enviar_criptografia(informacoes_criptografia) {
   fs.readFile(caminho_do_arquivo, function(erro, answerFile){
        if(erro) throw erro;
        
        const form = new FormData();
        form.append('answer', answerFile, {
            filepath: caminho_do_arquivo,
            contentType: 'application/json',
        })
    
       axios.post(url_enviar, form, {
            headers: form.getHeaders()
        }).then(response => {
            console.log(response.status + " " + response.statusText);
            console.log(response.headers);
            console.log(response.data);
        }).catch(erro => {
            console.log(erro);
        })
    });
}

axios.get(url_receber)
    .then(function (response) {
        fs.writeFile(caminho_do_arquivo, JSON.stringify(response.data), function (err) {
            if (err) throw err;
            criptografia.descriptografar(response.data, function(informacoes_criptografia) {
                enviar_criptografia(informacoes_criptografia);
            });
          }); 
    })
    .catch(function (error) {
        console.log(error);
    });