module.exports = {
    name: 'lid-me',
    aliases: [],
    async execute({ lux, msg, from, isGroup, sender }) {
        if (!isGroup) {
            return await lux.sendMessage(from, { text: 'Este comando só pode ser usado em grupos.' }, { quoted: msg });
        }
        await lux.sendMessage(from, { text: `Sua identidade (LID) neste grupo é:\n\n${sender}` }, { quoted: msg });
    }
};
