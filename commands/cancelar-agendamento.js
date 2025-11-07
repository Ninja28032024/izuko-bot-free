// commands/cancelar-agendamento.js
const fs = require('fs');
const path = require('path');
const { carregarAgendamentos } = require('../settings/lib/agendamento.js');

module.exports = {
    name: 'cancelar-agendamento',
    aliases: ['cancelaragendamento', 'remover-agendamento'],
    execute: async ({ lux, from, msg, isGroup, sender, areJidsSameUser, settings }) => {
        // 1. VERIFICAÇÕES
        if (!isGroup) {
            return await lux.sendMessage(from, { text: 'Mestre, este encantamento só pode ser conjurado na atmosfera de um grupo.' }, { quoted: msg });
        }

        const groupMeta = await lux.groupMetadata(from);
        const senderIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, sender))?.admin;
        const botIsAdmin = groupMeta.participants.find(p => p.id === settings.botLid)?.admin;

        if (!senderIsAdmin) {
            return await lux.sendMessage(from, { text: '❌ Apenas os guardiões (admins) deste clã podem anular as leis do tempo.' }, { quoted: msg });
        }
        if (!botIsAdmin) {
            return await lux.sendMessage(from, { text: 'Mestre, preciso portar o selo de guardião (admin) para poder executar esta anulação.' }, { quoted: msg });
        }

        // 2. LÓGICA DE CANCELAMENTO
        const caminhoArquivo = path.join(__dirname, '..', 'banco de dados', 'agendamentos', `agendamento-gp-${from}.json`);

        if (!fs.existsSync(caminhoArquivo)) {
            return await lux.sendMessage(from, { text: '📜 Não há nenhuma lei do tempo para ser anulada neste grupo.' }, { quoted: msg });
        }

        try {
            // Remove o arquivo de configuração do agendamento
            fs.unlinkSync(caminhoArquivo);

            // Recarrega o sistema de agendamento para que ele "esqueça" do grupo removido
            await carregarAgendamentos(lux);

            await lux.sendMessage(from, { text: '✅ *DECRETO ANULADO!*\n\nA lei do tempo foi revogada. O controle sobre os portões deste grupo volta a ser manual.' }, { quoted: msg });

        } catch (error) {
            console.error('Erro ao cancelar agendamento:', error);
            await lux.sendMessage(from, { text: '❌ Mestre, uma anomalia temporal impediu a anulação do decreto. Por favor, tente novamente.' }, { quoted: msg });
        }
    }
};
