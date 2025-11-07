module.exports = {
    name: 'alerta',
    aliases: [],
    async execute({ lux, msg, from, isGroup, sender, areJidsSameUser }) {
        if (!isGroup) {
            return await lux.sendMessage(from, { text: 'Mestre, este comando só pode ser usado em grupos.' }, { quoted: msg });
        }
        const groupMeta = await lux.groupMetadata(from, true);
        const senderIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, sender))?.admin;

        if (!senderIsAdmin) {
            return await lux.sendMessage(from, { text: 'Mestre, apenas administradores podem usar este comando.' }, { quoted: msg });
        }

        const quotedInfo = msg.message.extendedTextMessage?.contextInfo;
        if (!quotedInfo?.quotedMessage) {
            return await lux.sendMessage(from, { text: 'Mestre, você precisa responder à mensagem que deseja alertar.' }, { quoted: msg });
        }

        const messageToForward = {
            key: { remoteJid: from, id: quotedInfo.stanzaId, participant: quotedInfo.participant || undefined },
            message: quotedInfo.quotedMessage
        };
        const alertMessage = {
            forward: messageToForward,
            contextInfo: { mentionedJid: groupMeta.participants.map(p => p.id) }
        };

        await lux.sendMessage(from, alertMessage);
        await lux.sendMessage(from, { react: { text: "📢", key: msg.key } });
    }
};
