// commands/id-gp.js
const { jidDecode } = require('@whiskeysockets/baileys');

module.exports = {
    name: 'id-gp',
    aliases: [], // Sem aliases, conforme solicitado
    description: 'Obtém o JID (ID) de um grupo a partir do link ou do grupo atual.',
    usage: '!id-gp <link do grupo> ou !id-gp (no grupo)',
    isGroup: false, // Pode ser usado no privado para verificar link

    async execute({ lux, msg, from, isGroup, args }) {
        let jid = '';
        let resposta = '';

        if (args.length === 0) {
            // Caso 1: Sem argumentos, usa o grupo atual
            if (!isGroup) {
                return await lux.sendMessage(from, { text: 'Mestre, para usar *!id-gp* sem um link, você deve estar em um grupo.' }, { quoted: msg });
            }
            jid = from;
            resposta = `✅ *JID do Grupo Atual:* \`${jid}\``;
        } else {
            // Caso 2: Com argumento, tenta extrair do link
            const link = args[0];
            const match = link.match(/(?:https?:\/\/)?chat\.whatsapp\.com\/(?:invite\/)?([a-zA-Z0-9-_]+)/);

            if (match) {
                const inviteCode = match[1];
                try {
                    const groupInfo = await lux.groupGetInviteInfo(inviteCode);
                    jid = groupInfo.id;
                    resposta = `✅ *JID do Grupo (Link):* \`${jid}\`\n*Nome:* ${groupInfo.subject}`;
                } catch (error) {
                    console.error('Erro ao obter info do grupo pelo link:', error);
                    return await lux.sendMessage(from, { text: '❌ Não foi possível obter o JID do grupo a partir deste link. Verifique se o link é válido.' }, { quoted: msg });
                }
            } else {
                return await lux.sendMessage(from, { text: '❌ Formato de link inválido. Use: *!id-gp <link do grupo>* ou *!id-gp* no grupo.' }, { quoted: msg });
            }
        }

        await lux.sendMessage(from, { text: resposta }, { quoted: msg });
    }
};
