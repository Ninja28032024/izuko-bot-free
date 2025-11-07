// commands/bom-dia.js
// VERSÃO CORRIGIDA - Sem dependência de getRandomEmoji

const moment = require('moment-timezone');

// Emojis para bom dia
const emojisBomDia = ['☀️', '🌅', '🌄', '🌞', '🌻', '🌺', '🌸', '🌼'];

function getRandomEmoji() {
    return emojisBomDia[Math.floor(Math.random() * emojisBomDia.length)];
}

module.exports = {
    name: 'bom-dia',
    isKeyword: true,
    
    async execute({ lux, msg, from, pushName }) {
        const agora = moment().tz('America/Sao_Paulo');
        const horaAtual = agora.hour();
        
        // Novo Intervalo: 0h às 11h59
        if (horaAtual >= 0 && horaAtual < 12) {
            try {
                const emojiAleatorio = getRandomEmoji();
                const texto = `${emojiAleatorio} *BOM DIA, ${pushName.toUpperCase()}!* ${emojiAleatorio}\n\nQue o sol ilumine seu caminho e te traga a energia de um novo ciclo.`;
                await lux.sendMessage(from, { react: { text: getRandomEmoji(), key: msg.key } });
                await lux.sendMessage(from, { text: texto }, { quoted: msg });
                console.log(`[SAUDAÇÃO] Bom dia enviado para ${pushName}.`);
            } catch (error) {
                console.error(`[SAUDAÇÃO ERROR] Falha ao enviar 'Bom dia' para ${pushName}:`, error);
            }
        } else {
            // Lógica de Resposta Contextualizada
            let saudacaoCorreta = '';
            let emojiCorreto = getRandomEmoji(); // Emoji aleatório para a correção

            if (horaAtual >= 12 && horaAtual < 18) {
                saudacaoCorreta = 'BOA TARDE';
            } else { // 18h em diante
                saudacaoCorreta = 'BOA NOITE';
            }

            try {
                const texto = `${getRandomEmoji()} ${pushName}, ainda não é hora de *BOM DIA*. Já estamos na hora de *${saudacaoCorreta}*! ${emojiCorreto}`;
                await lux.sendMessage(from, { text: texto }, { quoted: msg });
                console.log(`[SAUDAÇÃO CORREÇÃO] Bom dia corrigido para ${saudacaoCorreta} para ${pushName}.`);
            } catch (error) {
                console.error(`[SAUDAÇÃO ERROR] Falha ao enviar correção de 'Bom dia' para ${pushName}:`, error);
            }
        }
    }
};
