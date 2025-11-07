module.exports = {
    name: 'check',
    aliases: [],
    async execute({ lux, msg, from }) {
        await lux.sendMessage(from, { image: { url: "https://files.catbox.moe/nuih5c.jpeg" }, caption: "Olá Mestre! Estou ativo." }, { quoted: msg } );
    }
};
