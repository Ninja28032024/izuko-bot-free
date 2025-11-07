// commands/cassino-rank.js
const fs = require('fs');
const path = require('path');
const { isRankingAtivo } = require('../settings/lib/ranking-logic.js'); // Importa a função de verificação

// Carrega as charadas do banco de dados
const charadasPath = path.join(__dirname, '..', 'banco de dados', 'charadas.json');
const charadas = JSON.parse(fs.readFileSync(charadasPath, 'utf-8'));

module.exports = {
    name: 'cassino-rank',
    aliases: ['aposta-rank', 'charada-rank'],
    execute: async ({ lux, from, msg, sender, pushName, cassinoState }) => {
        // =================================================================
        // == NOVA VERIFICAÇÃO DE RANKING ATIVO
        // =================================================================
        if (!isRankingAtivo(from)) {
            return await lux.sendMessage(from, { text: '📜 O sistema de ranking está desativado neste grupo. Use `!toggle-rank` para ativá-lo.' }, { quoted: msg });
        }
        // =================================================================

        // Verifica se já existe um jogo ativo neste grupo
        if (cassinoState.has(from)) {
            return await lux.sendMessage(from, { text: `Calma, *${pushName}*! Já existe um desafio da Esfinge em andamento neste grupo. Aguarde o desfecho.` }, { quoted: msg });
        }

        // Seleciona uma charada aleatória
        const charada = charadas[Math.floor(Math.random() * charadas.length)];

        // Monta o texto da pergunta com as opções
        let textoCharada = `🎲 *CASSINO DA ESFINGE* 🎲\n\n*${pushName}*, sua astúcia será testada! Decifre o enigma ou pague o preço.\n\n*Charada:* ${charada.pergunta}\n\n*Alternativas:*\na) ${charada.opcoes.a}\nb) ${charada.opcoes.b}\nc) ${charada.opcoes.c}\n\nResponda com a letra da alternativa correta (ex: "a"). Você tem 30 segundos!`;

        // Armazena o estado do jogo atual
        cassinoState.set(from, {
            tipo: 'charada', // <-- CORREÇÃO: Adiciona o tipo de jogo
            jogador: sender,
            respostaCorreta: charada.resposta.toLowerCase(),
            timeout: setTimeout(() => {
                if (cassinoState.has(from)) {
                    lux.sendMessage(from, { text: `⏳ O tempo se esgotou, *${pushName}*! A Esfinge não espera por ninguém. O desafio foi cancelado.` });
                    cassinoState.delete(from);
                }
            }, 30000) // 30 segundos para responder
        });

        await lux.sendMessage(from, { text: textoCharada }, { quoted: msg });
    }
};
