// Salvar como: commands/attp.js
module.exports = {
    name: 'attp',
    // Sem aliases, conforme ordenado.

    execute: async ({ lux, msg, from, args }) => {
        const texto = args.join(' ');

        if (!texto) {
            return await lux.sendMessage(from, { text: 'Mestre, preciso das palavras que devo forjar em arte.' }, { quoted: msg });
        }

        // A chave da API selada diretamente no jutsu, como ordenado.
        const API_KEY_TED = 'matt12226';
        const url = `https://tedzinho.online/api/ttp/attp?apikey=${API_KEY_TED}&texto=${encodeURIComponent(texto )}`;

        try {
            // A biblioteca Baileys pode enviar stickers diretamente de uma URL se o formato for compatível (como .webp).
            // Isso elimina a necessidade de baixar o arquivo e usar ffmpeg.
            await lux.sendMessage(from, { 
                sticker: { url: url }
            }, { quoted: msg });

        } catch (error) {
            console.error("Erro no jutsu 'attp':", error);
            await lux.sendMessage(from, { text: 'Mestre, o ritual de forja falhou. O poder da API externa pode estar instável ou o texto é complexo demais.' }, { quoted: msg });
        }
    }
};
