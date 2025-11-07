//commands > izuko-video.js
const axios = require("axios");
const { MessageType } = require("@whiskeysockets/baileys");
const fs = require("fs");
const path = require("path");

module.exports = {
    name: "izuko-video",
    description: "Baixa um vídeo do YouTube e o envia com informações e legenda personalizada.",
    async execute({ lux, msg, from, args, prefix }) {
        if (args.length === 0) {
            return lux.sendMessage(from, { text: `Mestre, para invocar o jutsu de vídeo, preciso do link! Use: ${prefix}izuko-video <link_do_youtube>` }, { quoted: msg });
        }

        const youtubeUrl = args[0];
        const apiUrl = `https://systemzone.store/api/ytmp4?text=${encodeURIComponent(youtubeUrl )}`;

        try {
            await lux.sendMessage(from, { text: "Mestre, estou concentrando meu chakra para buscar este vídeo. Por favor, aguarde..." }, { quoted: msg });

            const response = await axios.get(apiUrl);
            const videoData = response.data;

            if (!videoData.status) {
                return lux.sendMessage(from, { text: `❌ Mestre, não consegui encontrar o vídeo ou houve um erro na API: ${videoData.message || 'Erro desconhecido.'}` }, { quoted: msg });
            }

            const { title, author, duration, thumbnail, youtube_url, download_vid_url } = videoData;

            // Mensagem com a capa e informações
            const infoMessage = `
🌟 *Jutsu de Vídeo Ativado!* 🌟

🎬 *Título:* ${title}
👤 *Canal:* ${author}
⏱️ *Duração:* ${duration}
🔗 *Link do YouTube:* ${youtube_url}

Estou preparando o pergaminho do vídeo. Em breve ele será entregue!
`;

            await lux.sendMessage(from, {
                image: { url: thumbnail },
                caption: infoMessage
            }, { quoted: msg });

            // Envio do vídeo com legenda personalizada
            const videoCaption = `
🎉 *Seu vídeo chegou, Mestre!* 🎉

Assista e aprenda com a sabedoria dos antigos ninjas!

_Este vídeo foi invocado pelo Izuko BOT._
`;

            await lux.sendMessage(from, {
                video: { url: download_vid_url },
                caption: videoCaption
            }, { quoted: msg });

        } catch (error) {
            console.error("Erro ao processar o comando izuko-video:", error);
            await lux.sendMessage(from, { text: `❌ Mestre, um erro inesperado ocorreu ao tentar invocar o vídeo: ${error.message}` }, { quoted: msg });
        }
    },
};
