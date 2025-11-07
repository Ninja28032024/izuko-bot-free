module.exports = {
    name: 'ping',
    aliases: [],
    async execute({ lux, msg, from }) {
        const latencia = (Date.now() / 1000) - msg.messageTimestamp;
        await lux.sendMessage(from, { text: `*Latência:* ${latencia.toFixed(3)} segundos` }, { quoted: msg });
    }
};
