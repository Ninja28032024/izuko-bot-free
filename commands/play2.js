// commands/play2.js
const axios = require('axios');
const chalk = require('chalk');

module.exports = {
    name: 'play2',
    aliases: ['scplay', 'soundcloud'],
    
    execute: async ({ lux, from, msg, args, pushName }) => {
        const query = args.join(' ');
        const apiURL = 'https://systemzone.store/api/soundcloud';

        if (!query) {
            return lux.sendMessage(from, { text: 'Mestre ' + pushName + ', você deve fornecer o nome da música ou o link do SoundCloud que deseja tocar. Exemplo: `!play2 Carol of the bells`' }, { quoted: msg });
        }

        await lux.sendMessage(from, { react: { text: "🎶", key: msg.key } });
        await lux.sendPresenceUpdate('composing', from);

        try {
            const urlCompleta = `${apiURL}?text=${encodeURIComponent(query)}`;
            
            const response = await axios.get(urlCompleta);

            const data = response.data;

            if (data.status === 'sucesso') {
                const { title, author, duration, thumbnail, download_url, sc_url } = data;

                const caption = `
🎵 *JUTSU SONORO INVOCADO!* 🎵

*Título:* ${title}
*Artista:* ${author}
*Duração:* ${duration}
*Fonte:* SoundCloud
*Link:* ${sc_url}

Mestre, estou concentrando meu chakra para enviar o áudio. Por favor, aguarde...
                `.trim();

                // 1. Enviar a imagem de capa (thumbnail) com a legenda
                await lux.sendMessage(from, {
                    image: { url: thumbnail },
                    caption: caption
                }, { quoted: msg });

                // 2. Enviar o áudio
                await lux.sendMessage(from, {
                    audio: { url: download_url },
                    mimetype: 'audio/mp4', // MimeType padrão para áudio
                    fileName: `${title}.mp3`,
                    contextInfo: {
                        externalAdReply: {
                            title: title,
                            body: author,
                            mediaType: 2,
                            thumbnailUrl: thumbnail,
                            sourceUrl: sc_url
                        }
                    }
                });

                await lux.sendMessage(from, { react: { text: "✅", key: msg.key } });

            } else if (data.error) {
                await lux.sendMessage(from, { text: `❌ *JUTSU FALHOU!* ❌\n\nO oráculo do SoundCloud retornou um erro: ${data.error}` }, { quoted: msg });
            } else {
                await lux.sendMessage(from, { text: `❌ *JUTSU FALHOU!* ❌\n\nNão foi possível encontrar a música ou o link fornecido.` }, { quoted: msg });
            }

        } catch (error) {
            console.error(chalk.red('[PLAY2 ERROR] Erro ao buscar no SoundCloud:'), error.message);
            await lux.sendMessage(from, { text: `❌ Mestre, um erro inesperado ocorreu ao tentar invocar o jutsu sonoro: ${error.message}` }, { quoted: msg });
        }
        
        await lux.sendPresenceUpdate('paused', from);
    }
};
