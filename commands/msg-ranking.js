// commands/msg-ranking.js
const { toggleRanking, isRankingAtivo } = require('../settings/lib/msg-ranking-logic.js');

module.exports = {
    name: 'msg-ranking',
    aliases: ['rankingmsg', 'contagemmsg'],
    description: 'Ativa ou desativa o sistema de contagem de mensagens por grupo.',
    usage: '!msg-ranking',
    isGroup: true,
    isAdmin: true,

    async execute({ lux, msg, from, isGroup, sender, areJidsSameUser }) {
        if (!isGroup) {
            return await lux.sendMessage(from, { text: 'Mestre, este comando só pode ser usado em grupos.' }, { quoted: msg });
        }

        const groupMeta = await lux.groupMetadata(from);
        const senderIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, sender))?.admin;

        if (!senderIsAdmin) {
            return await lux.sendMessage(from, { text: 'Mestre, apenas administradores podem ativar/desativar o ranking de mensagens.' }, { quoted: msg });
        }

        const novoEstado = toggleRanking(from);

        let mensagem = '';
        if (novoEstado) {
            mensagem = `✅ *RANKING DE MENSAGENS ATIVADO!*
            
O Izuko Bot agora está contando as mensagens de todos os participantes deste grupo.
Isso será usado para o sorteio e futuros rankings de atividade.`;
        } else {
            mensagem = `❌ *RANKING DE MENSAGENS DESATIVADO!*
            
O Izuko Bot parou de contar as mensagens neste grupo.
O sorteio não poderá mais usar a contagem de mensagens como critério de participação.`;
        }

        await lux.sendMessage(from, { text: mensagem }, { quoted: msg });
    }
};
