// commands/midia.js
const axios = require('axios');
const chalk = require('chalk');

module.exports = {
    name: 'midia',
    aliases: [], // Sem aliases, conforme ordenado
    execute: async ({ lux, from, msg, args, settings }) => {
        const query = args.join(' ');

        if (!query) {
            return await lux.sendMessage(from, { text: `Mestre, decrete sua ordem.\n\nEnvie um link (Instagram, TikTok, YouTube) ou o nome de uma canção.` }, { quoted: msg });
        }

        await lux.sendMessage(from, { text: '📜 Processando seu pedido, Mestre. Invocando os portais dimensionais...' }, { quoted: msg });

        // DETECÇÃO DE TIKTOK
        if (query.includes('tiktok.com')) {
            try {
                const apiUrl = `https://systemzone.store/api/tiktok?url=${encodeURIComponent(query )}`;
                const { data } = await axios.get(apiUrl);

                if (!data || data.status !== true) throw new Error('API do TikTok não retornou sucesso.');

                return await lux.sendMessage(from, {
                    video: { url: data.download_vid_url },
                    caption: `*Invocado por:* Izuko BOT\n*Fonte:* TikTok (@${data.author})`
                }, { quoted: msg });

            } catch (e) {
                console.error(chalk.red('[Mídia - TikTok] Erro:'), e);
                return await lux.sendMessage(from, { text: '❌ Mestre, o portal para o reino do TikTok parece estar selado.' }, { quoted: msg });
            }
        }

        // DETECÇÃO DE INSTAGRAM
        if (query.includes('instagram.com')) {
            try {
                const apiUrl = `https://systemzone.store/api/instagram?url=${encodeURIComponent(query )}`;
                const { data } = await axios.get(apiUrl);

                if (!data || data.status !== true) throw new Error('API do Instagram não retornou sucesso.');

                const caption = `*Invocado por:* Izuko BOT\n*Fonte:* Instagram (@${data.author_username})`;
                if (data.videos && data.videos.length > 0) {
                    for (const url of data.videos) await lux.sendMessage(from, { video: { url }, caption }, { quoted: msg });
                }
                if (data.images && data.images.length > 0) {
                    for (const url of data.images) await lux.sendMessage(from, { image: { url }, caption }, { quoted: msg });
                }
                return;

            } catch (e) {
                console.error(chalk.red('[Mídia - Instagram] Erro:'), e);
                return await lux.sendMessage(from, { text: '❌ Mestre, o portal para o reino do Instagram parece estar selado.' }, { quoted: msg });
            }
        }

        // PADRÃO: BUSCA DE MÚSICA (YOUTUBE)
        try {
            const apiUrl = `https://systemzone.store/api/play?text=${encodeURIComponent(query )}`;
            const { data } = await axios.get(apiUrl);

            if (!data || data.status !== true) throw new Error('API de música não retornou sucesso.');

            await lux.sendMessage(from, {
                image: { url: data.thumbnail },
                caption: `📜 *Canção Invocada*\n\n🎵 *Título:* ${data.title}\n🎤 *Bardo:* ${data.author}\n⏳ *Duração:* ${data.duration}`
            }, { quoted: msg });

            return await lux.sendMessage(from, { audio: { url: data.download_url }, mimetype: "audio/mpeg" }, { quoted: msg });

        } catch (e) {
            console.error(chalk.red('[Mídia - Música] Erro:'), e);
            return await lux.sendMessage(from, { text: '❌ Mestre, meus espiões astrais não encontraram a canção que Vossa Senhoria deseja.' }, { quoted: msg });
        }
    }
};
