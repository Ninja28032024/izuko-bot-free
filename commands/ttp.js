// Salvar como: commands/ttp.js
module.exports = {
    name: 'ttp',
    // Sem aliases, conforme ordenado.

    execute: async ({ lux, msg, from, args }) => {
        const texto = args.join(' ');

        if (!texto) {
            return await lux.sendMessage(from, { text: 'Mestre, preciso das palavras que devo forjar em arte.' }, { quoted: msg });
        }

        // A chave da API selada diretamente no jutsu.
        const API_KEY_TED = 'matt12226';
        const url = `https://tedzinho.online/api/ttp/ttp?apikey=${API_KEY_TED}&texto=${encodeURIComponent(texto )}`;

        try {
            // A mesma lógica direta e eficiente do 'attp' é aplicada aqui.
            await lux.sendMessage(from, { 
                sticker: { url: url }
            }, { quoted: msg });

        } catch (error) {
            console.error("Erro no jutsu 'ttp':", error);
            await lux.sendMessage(from, { text: 'Mestre, o ritual de forja falhou. O poder da API externa pode estar instável ou o texto é complexo demais.' }, { quoted: msg });
        }
    }
};
