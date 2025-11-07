// commands/encerrar-sorteio.js
const { getSorteio, removerSorteio } = require('../settings/lib/sorteio-logic.js');

module.exports = {
    name: 'encerrar-sorteio',
    aliases: ['cancelarsorteio', 'pararsorteio'],
    description: 'Cancela um sorteio ativo no grupo antes do tempo.',
    usage: '!encerrar-sorteio',
    isGroup: true,
    isAdmin: true,

    async execute({ lux, msg, from, isGroup, sender, areJidsSameUser }) {
        if (!isGroup) {
            return await lux.sendMessage(from, { text: 'Mestre, este comando só pode ser usado em grupos.' }, { quoted: msg });
        }

        const groupMeta = await lux.groupMetadata(from);
        const senderIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, sender))?.admin;

        if (!senderIsAdmin) {
            return await lux.sendMessage(from, { text: 'Mestre, apenas administradores podem encerrar um sorteio.' }, { quoted: msg });
        }

        const sorteioAtivo = getSorteio(from);

        if (!sorteioAtivo) {
            return await lux.sendMessage(from, { text: '❌ Não há sorteio ativo neste grupo para ser encerrado.' }, { quoted: msg });
        }

        // 1. Remover o sorteio do banco de dados
        removerSorteio(from);

        // 2. Enviar mensagem de confirmação
        const mensagemCancelamento = `
❌ *SORTEIO CANCELADO!* ❌

O sorteio do prêmio *${sorteioAtivo.premio}* foi cancelado pelo administrador @${sender.split('@')[0]}.

_Izuko está desapontado com a falta de emoção._
        `.trim();

        await lux.sendMessage(from, { text: mensagemCancelamento, mentions: [sender] }, { quoted: msg });
    }
};
