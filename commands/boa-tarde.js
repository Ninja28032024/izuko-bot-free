// commands/boa-tarde.js
// VERSÃO CORRIGIDA - Sem dependência de getRandomEmoji

const moment = require('moment-timezone');

// Emojis para boa tarde
const emojisBoaTarde = ['🌤️', '☀️', '🌞', '🌻', '🌺', '🌸', '🌼', '🌷'];

function getRandomEmoji() {
    return emojisBoaTarde[Math.floor(Math.random() * emojisBoaTarde.length)];
}

module.exports = {
    name: 'boa-tarde',
    isKeyword: true,
    
    async execute({ lux, msg, from, pushName }) {
        const agora = moment().tz('America/Sao_Paulo');
        const horaAtual = agora.hour();
        
        // Novo Intervalo: 12h às 17h59
        if (horaAtual >= 12 && horaAtual < 18) {
            try {
                const emojiAleatorio = getRandomEmoji();
                const texto = `${emojiAleatorio} *BOA TARDE, ${pushName.toUpperCase()}!* ${emojiAleatorio}\n\nA tarde avança, mas sua força é inabalável. Continue sua jornada com sabedoria.`;
                await lux.sendMessage(from, { react: { text: getRandomEmoji(), key: msg.key } });
                await lux.sendMessage(from, { text: texto }, { quoted: msg });
                console.log(`[SAUDAÇÃO] Boa tarde enviado para ${pushName}.`);
            } catch (error) {
                console.error(`[SAUDAÇÃO ERROR] Falha ao enviar 'Boa tarde' para ${pushName}:`, error);
            }
        } else {
            // Lógica de Resposta Contextualizada
            let saudacaoCorreta = '';
            let emojiCorreto = getRandomEmoji(); // Emoji aleatório para a correção

            if (horaAtual >= 0 && horaAtual < 12) {
                saudacaoCorreta = 'BOM DIA';
            } else { // 18h em diante
                saudacaoCorreta = 'BOA NOITE';
            }

            try {
                const texto = `${getRandomEmoji()} ${pushName}, ainda não é hora de *BOA TARDE*. Já estamos na hora de *${saudacaoCorreta}*! ${emojiCorreto}`;
                await lux.sendMessage(from, { text: texto }, { quoted: msg });
                console.log(`[SAUDAÇÃO CORREÇÃO] Boa tarde corrigido para ${saudacaoCorreta} para ${pushName}.`);
            } catch (error) {
                console.error(`[SAUDAÇÃO ERROR] Falha ao enviar correção de 'Boa tarde' para ${pushName}:`, error);
            }
        }
    }
};
