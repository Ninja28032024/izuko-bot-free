// commands/ver-agendamento.js
const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');

module.exports = {
    name: 'ver-agendamento',
    aliases: ['veragendamento', 'consultar-agendamento'],
    execute: async ({ lux, from, msg, isGroup, sender, areJidsSameUser, settings }) => {
        // 1. VERIFICAÇÕES
        if (!isGroup) {
            return await lux.sendMessage(from, { text: 'Mestre, este encantamento só pode ser conjurado na atmosfera de um grupo.' }, { quoted: msg });
        }

        const groupMeta = await lux.groupMetadata(from);
        const senderIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, sender))?.admin;

        if (!senderIsAdmin) {
            return await lux.sendMessage(from, { text: '❌ Apenas os guardiões (admins) deste clã podem consultar as leis do tempo.' }, { quoted: msg });
        }

        // 2. LÓGICA DE CONSULTA
        const caminhoArquivo = path.join(__dirname, '..', 'banco de dados', 'agendamentos', `agendamento-gp-${from}.json`);

        if (!fs.existsSync(caminhoArquivo)) {
            return await lux.sendMessage(from, { text: '📜 Não há nenhuma lei do tempo decretada para este grupo.' }, { quoted: msg });
        }

        try {
            const data = fs.readFileSync(caminhoArquivo, 'utf-8');
            const agendamento = JSON.parse(data);

            // Formata a data de criação para um formato legível
            const dataCriacao = moment(agendamento.criadoEm).tz('America/Sao_Paulo').format('DD/MM/YYYY [às] HH:mm');

            const consulta = `
📜 *LEI DO TEMPO EM VIGOR* 📜

A vontade dos guardiões decretou o seguinte ciclo para este grupo:

🔒 *Selar Portões:* ${agendamento.horaFechar}
🔓 *Abrir Portões:* ${agendamento.horaAbrir}

*Decreto estabelecido por:* ${agendamento.criadoPor}
*Em:* ${dataCriacao}
            `.trim();

            await lux.sendMessage(from, { text: consulta }, { quoted: msg });

        } catch (error) {
            console.error('Erro ao consultar agendamento:', error);
            await lux.sendMessage(from, { text: '❌ Mestre, uma anomalia temporal me impediu de ler o pergaminho do tempo. O arquivo pode estar corrompido.' }, { quoted: msg });
        }
    }
};
