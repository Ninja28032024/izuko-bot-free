const fs = require('fs');

module.exports = {
    name: 'delete',
    aliases: ['d', 'deletar'],
    async execute({ lux, msg, from, isGroup, sender, settings, areJidsSameUser }) {
        if (!isGroup) { return await lux.sendMessage(from, { text: 'Mestre, este comando só pode ser usado em grupos.' }, { quoted: msg }); }

        const botLid = settings.botLid;
        if (!botLid || botLid.trim() === '') { return await lux.sendMessage(from, { text: 'Mestre, o LID do bot não está configurado. Não consigo verificar minhas permissões.' }, { quoted: msg }); }

        const groupMeta = await lux.groupMetadata(from);
        const senderIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, sender))?.admin;
        const botIsAdmin = groupMeta.participants.find(p => p.id === botLid)?.admin;

        if (!senderIsAdmin) { return await lux.sendMessage(from, { text: 'Mestre, apenas administradores podem apagar as palavras alheias.' }, { quoted: msg }); }
        if (!botIsAdmin) { return await lux.sendMessage(from, { text: 'Mestre, eu preciso ser um administrador para poder executar esta ordem.' }, { quoted: msg }); }

        const quotedInfo = msg.message.extendedTextMessage?.contextInfo;
        if (!quotedInfo?.quotedMessage) { return await lux.sendMessage(from, { text: 'Mestre, por favor, responda à mensagem que deseja que eu apague.' }, { quoted: msg }); }

        const keyToDelete = { remoteJid: from, id: quotedInfo.stanzaId, participant: quotedInfo.participant };
        await lux.sendMessage(from, { delete: keyToDelete });
    }
};
