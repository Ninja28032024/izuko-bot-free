// commands/linkgp.js
module.exports = {
    name: 'linkgp',
    aliases: ['link', 'gplink', 'linkdogrupo'],
    execute: async ({ lux, from, msg, isGroup, sender, areJidsSameUser, settings }) => {
        // 1. VERIFICAÇÃO DE AMBIENTE
        if (!isGroup) {
            return await lux.sendMessage(from, { text: 'Mestre, este pergaminho só pode ser invocado dentro de um clã (grupo).' }, { quoted: msg });
        }

        // 2. VERIFICAÇÃO DE PERMISSÕES
        const groupMeta = await lux.groupMetadata(from);
        const senderIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, sender))?.admin;
        const botIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, settings.botLid))?.admin;

        // Apenas Admins podem usar o comando
        if (!senderIsAdmin) {
            return await lux.sendMessage(from, { text: 'Apenas os generais (admins) deste clã podem solicitar a chave de acesso.' }, { quoted: msg });
        }

        // O Bot precisa ser admin para ter o poder de criar o link
        if (!botIsAdmin) {
            return await lux.sendMessage(from, { text: 'Mestre, preciso portar o selo de guardião (admin) para poder forjar o link de convite.' }, { quoted: msg });
        }

        // 3. EXECUÇÃO
        try {
            // Pede à API do WhatsApp para gerar o código de convite do grupo
            const inviteCode = await lux.groupInviteCode(from);
            const inviteLink = `https://chat.whatsapp.com/${inviteCode}`;

            const resposta = `📜 *CHAVE DO CLÃ FORJADA* 📜

General, conforme sua ordem, forjei o portal de acesso para este domínio.

Use este link com sabedoria para convocar novos guerreiros:
${inviteLink}`;

            await lux.sendMessage(from, { text: resposta }, { quoted: msg } );

        } catch (error) {
            console.error("Erro ao gerar link do grupo:", error);
            await lux.sendMessage(from, { text: 'Mestre, uma força sombria me impede de forjar o link de convite. Verifique minhas permissões ou tente novamente.' }, { quoted: msg });
        }
    }
};
