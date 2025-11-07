const fs = require('fs');

module.exports = {
    name: 'lid-bot',
    aliases: [],
    async execute({ lux, msg, from, isOwner }) {
        if (!isOwner) {
            return await lux.sendMessage(from, { text: 'Mestre, apenas o dono pode usar este comando.' }, { quoted: msg });
        }
        // A lógica de ler o settings.json já acontece no handler principal, então 'settings' está disponível.
        // No entanto, para garantir que o plugin seja autossuficiente, podemos reler aqui.
        const currentSettings = JSON.parse(fs.readFileSync('./settings/settings.json'));
        const botLid = currentSettings.botLid;

        if (botLid && botLid.trim() !== '') {
            await lux.sendMessage(from, { text: `Mestre, o LID que estou usando atualmente, conforme definido no settings.json, é:\n\n*${botLid}*` }, { quoted: msg });
        } else {
            await lux.sendMessage(from, { text: `Mestre, a propriedade "botLid" não está definida ou está vazia no seu arquivo settings.json.\n\nUse o comando *!lid-me* com o número do bot para descobrir o LID e adicioná-lo ao arquivo.` }, { quoted: msg });
        }
    }
};
