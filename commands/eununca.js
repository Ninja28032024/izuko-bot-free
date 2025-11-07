const fs = require('fs');
const path = require('path');

// As variáveis do jogo são gerenciadas no 'comandos.js' principal
// e passadas para a execução se necessário, ou podem ser importadas.
// Para este modelo, vamos assumir que o handler principal gerencia o estado.

module.exports = {
    name: 'eununca',
    aliases: [],
    // A função execute agora recebe um objeto com todas as variáveis de estado do jogo
    async execute({ lux, msg, from, isGroup, euNuncaState }) {
        if (!isGroup) {
            return await lux.sendMessage(from, { text: 'Mestre, esta brincadeira só está disponível em grupos.' }, { quoted: msg });
        }
        if (euNuncaState.euNuncaPerguntas.length === 0) {
            return await lux.sendMessage(from, { text: 'Mestre, não consegui carregar as perguntas. Verifique os logs.' }, { quoted: msg });
        }

        let perguntaSelecionada;
        const chanceRepetir = Math.random(); // Gera um número entre 0 e 1

        // 30% de chance de repetir a última pergunta, se houver uma
        if (chanceRepetir <= 0.3 && euNuncaState.ultimaPergunta) {
            perguntaSelecionada = euNuncaState.ultimaPergunta;
        } else {
            // 70% de chance de pegar uma nova
            if (euNuncaState.perguntasDisponiveis.length === 0) {
                // Se não há mais perguntas novas, reseta a lista
                console.log('[Eu Nunca] Todas as perguntas foram usadas. Reiniciando ciclo.');
                euNuncaState.perguntasDisponiveis = [...euNuncaState.euNuncaPerguntas];
                euNuncaState.perguntasUsadas = [];
            }
            
            const index = Math.floor(Math.random() * euNuncaState.perguntasDisponiveis.length);
            perguntaSelecionada = euNuncaState.perguntasDisponiveis[index];

            // Move a pergunta da lista de disponíveis para a de usadas
            euNuncaState.perguntasDisponiveis.splice(index, 1);
            euNuncaState.perguntasUsadas.push(perguntaSelecionada);
        }
        
        // Armazena a pergunta atual para a próxima rodada
        euNuncaState.ultimaPergunta = perguntaSelecionada;

        await lux.sendMessage(from, {
            poll: {
                name: perguntaSelecionada,
                values: ['Eu já', 'Eu nunca'],
                selectableCount: 2 // Permite selecionar ambas as opções se desejado
            }
        });
    }
};
