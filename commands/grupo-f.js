module.exports = {
    name: 'grupo-f',
    aliases: ['fechargp', 'gp-f'],
    async execute({ lux, msg, from, isGroup, sender, settings, areJidsSameUser }) {
        if (!isGroup) {
            return await lux.sendMessage(from, { text: 'Mestre, este comando só pode ser usado em grupos.' }, { quoted: msg });
        }

        const botLid = settings.botLid;
        if (!botLid || botLid.trim() === '') {
            return await lux.sendMessage(from, { text: 'Mestre, o LID do bot não está configurado. Não consigo verificar minhas permissões.' }, { quoted: msg });
        }

        const groupMeta = await lux.groupMetadata(from);
        const senderIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, sender))?.admin;
        const botIsAdmin = groupMeta.participants.find(p => p.id === botLid)?.admin;

        if (!senderIsAdmin) {
            return await lux.sendMessage(from, { text: 'Mestre, apenas administradores podem fechar o portão.' }, { quoted: msg });
        }
        if (!botIsAdmin) {
            return await lux.sendMessage(from, { text: 'Mestre, eu preciso ser um administrador para poder alterar as configurações do grupo.' }, { quoted: msg });
        }

        await lux.groupSettingUpdate(from, 'announcement');
        await lux.sendMessage(from, { text: '🤫 *Grupo Fechado!* Mestre, o silêncio foi imposto. Apenas administradores podem falar agora.' }, { quoted: msg });
    }
};
