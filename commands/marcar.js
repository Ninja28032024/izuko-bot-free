module.exports = {
    name: 'marcar',
    aliases: [],
    async execute({ lux, msg, from, isGroup, sender, areJidsSameUser }) {
        if (!isGroup) {
            return await lux.sendMessage(from, { text: 'Mestre, este comando só pode ser usado em grupos.' }, { quoted: msg });
        }
        const groupMeta = await lux.groupMetadata(from);
        const senderIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, sender))?.admin;

        if (!senderIsAdmin) {
            return await lux.sendMessage(from, { text: 'Mestre, apenas administradores podem usar este comando.' }, { quoted: msg });
        }

        const allParticipants = groupMeta.participants.map(p => p.id);
        let textMarcar = "*EU, IZUKO BOT ESTOU MARCANDO TODOS OS MEMBROS DESTE GRUPO*\n\n";
        textMarcar += allParticipants.map(jid => `@${jid.split('@')[0]}`).join('\n');
        await lux.sendMessage(from, { text: textMarcar, mentions: allParticipants }, { quoted: msg });
    }
};
