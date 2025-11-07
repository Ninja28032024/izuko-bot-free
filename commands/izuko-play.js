// commands/izuko-play.js
const axios = require('axios');
const chalk = require('chalk');

// Função auxiliar para baixar a imagem como um Buffer
async function getBuffer(url) {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return Buffer.from(response.data, 'binary');
    } catch (error) {
        console.error(chalk.red(`Falha ao baixar a imagem para o buffer: ${url}`), error);
        return null;
    }
}

module.exports = {
    name: 'izuko-play',
    aliases: ['play', 'tocar', 'musica'], // Aliases personalizados
    execute: async ({ lux, from, msg, args, settings }) => {
        const query = args.join(' ');

        if (!query) {
            return await lux.sendMessage(from, { text: `Mestre, decrete sua ordem musical.\n\nUse:\n1. *${settings.prefix}play [nome da canção]*\n2. *${settings.prefix}play [link do Spotify]*` }, { quoted: msg });
        }

        // =================================================================
        // == LÓGICA 1: DOWNLOAD VIA LINK DO SPOTIFY (Mantida)
        // =================================================================
        if (query.match(/https?:\/\/open\.spotify\.com\/track\/[a-zA-Z0-9?=]+/ )) {
            await lux.sendMessage(from, { text: "Decifrando o selo musical do Spotify..." }, { quoted: msg });

            try {
                const apiUrl = `https://api.maher-zubair.tech/download/spotify?url=${encodeURIComponent(query )}`;
                const response = await axios.get(apiUrl);
                const data = response.data;

                if (!data || data.status !== 200 || !data.result?.download_url) {
                    return await lux.sendMessage(from, { text: "❌ Mestre, este selo do Spotify é inválido ou o encantamento da API falhou." }, { quoted: msg });
                }

                const { song, artists, album_name, release_date, thumbnail, download_url } = data.result;

                await lux.sendMessage(from, { 
                    image: { url: thumbnail }, 
                    caption: `📜 *Pergaminho Musical Encontrado*\n\n🎵 *Canção:* ${song}\n🎤 *Bardos:* ${artists}\n📀 *Crônica:* ${album_name}\n📅 *Era:* ${release_date}` 
                }, { quoted: msg });

                return await lux.sendMessage(from, { audio: { url: download_url }, mimetype: "audio/mpeg" }, { quoted: msg });

            } catch (e) {
                console.error(chalk.red('[IZUKO-PLAY - SPOTIFY LINK] Erro:'), e);
                return await lux.sendMessage(from, { text: "❌ Mestre, uma força sombria impediu o download via Spotify." }, { quoted: msg });
            }
        }

        // =================================================================
        // == LÓGICA 2: BUSCA POR NOME (API ATUALIZADA)
        // =================================================================
        else {
            await lux.sendMessage(from, { text: `Invocando a melodia de "*${query}*" dos reinos etéreos...` }, { quoted: msg });

            try {
                const apiUrl = `https://systemzone.store/api/play?text=${encodeURIComponent(query )}`;
                const response = await axios.get(apiUrl);
                const trackData = response.data;

                if (!trackData || trackData.status !== true || !trackData.download_url) {
                    return await lux.sendMessage(from, { text: `❌ Mestre, meus espiões astrais não encontraram a canção "*${query}*".` }, { quoted: msg });
                }

                // Extrai os dados da nova API
                const { title, author, duration, views, thumbnail, download_url } = trackData;

                // Envia a imagem com os detalhes da música
                await lux.sendMessage(from, { 
                    image: { url: thumbnail }, 
                    caption: `📜 *Canção Invocada com Sucesso*\n\n🎵 *Título:* ${title}\n🎤 *Bardo:* ${author}\n⏳ *Duração:* ${duration}\n👁️ *Visualizações:* ${new Intl.NumberFormat('pt-BR').format(views)}`
                }, { quoted: msg });

                // Envia o áudio da música
                return await lux.sendMessage(from, { 
                    audio: { url: download_url }, 
                    mimetype: "audio/mpeg" 
                }, { quoted: msg });

            } catch (error) {
                console.error(chalk.red("[IZUKO-PLAY - BUSCA] Erro:"), error);
                return await lux.sendMessage(from, { text: "⚠️ Mestre, o portal para o reino das melodias parece estar selado. Tente novamente mais tarde." }, { quoted: msg });
            }
        }
    }
};