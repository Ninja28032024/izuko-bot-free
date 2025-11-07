// commands/boa-noite.js
// VERSÃO CORRIGIDA - Sem dependência de getRandomEmoji

const moment = require('moment-timezone');

// Emojis para boa noite
const emojisBoaNoite = ['🌙', '🌛', '🌜', '⭐', '✨', '🌟', '💫', '🌠'];

function getRandomEmoji() {
    return emojisBoaNoite[Math.floor(Math.random() * emojisBoaNoite.length)];
}

module.exports = {
    name: 'boa-noite',
    isKeyword: true,
    
    async execute({ lux, msg, from, pushName }) {
        const agora = moment().tz('America/Sao_Paulo');
        const horaAtual = agora.hour();
        
        // Novo Intervalo: 18h às 23h59
        if (horaAtual >= 18 && horaAtual <= 23) {
            try {
                const emojiAleatorio = getRandomEmoji();
                const texto = `${emojiAleatorio} *BOA NOITE, ${pushName.toUpperCase()}!* ${emojiAleatorio}\n\nQue a noite traga descanso e a promessa de um amanhã vitorioso.`;
                await lux.sendMessage(from, { react: { text: getRandomEmoji(), key: msg.key } });
                await lux.sendMessage(from, { text: texto }, { quoted: msg });
                console.log(`[SAUDAÇÃO] Boa noite enviado para ${pushName}.`);
            } catch (error) {
                console.error(`[SAUDAÇÃO ERROR] Falha ao enviar 'Boa noite' para ${pushName}:`, error);
            }
        } else {
            // Lógica de Resposta Contextualizada
            let saudacaoCorreta = '';
            let emojiCorreto = getRandomEmoji(); // Emoji aleatório para a correção

            if (horaAtual >= 0 && horaAtual < 12) {
                saudacaoCorreta = 'BOM DIA';
            } else { // 12h a 17h59
                saudacaoCorreta = 'BOA TARDE';
            }

            try {
                const texto = `${getRandomEmoji()} ${pushName}, ainda não é hora de *BOA NOITE*. Já estamos na hora de *${saudacaoCorreta}*! ${emojiCorreto}`;
                await lux.sendMessage(from, { text: texto }, { quoted: msg });
                console.log(`[SAUDAÇÃO CORREÇÃO] Boa noite corrigido para ${saudacaoCorreta} para ${pushName}.`);
            } catch (error) {
                console.error(`[SAUDAÇÃO ERROR] Falha ao enviar correção de 'Boa noite' para ${pushName}:`, error);
            }
        }
    }
};
