// commands/igdl.js
const axios = require('axios');
const chalk = require('chalk');

module.exports = {
    name: 'igdl',
    aliases: ['instagram', 'instadl'],
    execute: async ({ lux, from, msg, args, settings }) => {
        const link = args[0];

        // 1. VERIFICAÇÃO INICIAL
        if (!link || !link.includes('instagram.com')) {
            return await lux.sendMessage(from, { text: `Mestre, para que eu possa invocar uma mídia do reino do Instagram, preciso que me forneça o link do post.\n\n*Exemplo:* \`${settings.prefix}igdl https://www.instagram.com/...\`` }, { quoted: msg } );
        }

        await lux.sendMessage(from, { text: '📜 Decifrando o selo do Instagram... Aguarde um momento, Mestre.' }, { quoted: msg });

        try {
            // 2. CHAMADA DA API
            // Usaremos uma API que corresponde à estrutura de resposta que Vossa Majestade forneceu.
            const apiUrl = `https://systemzone.store/api/instagram?url=${encodeURIComponent(link )}`;
            const response = await axios.get(apiUrl);
            const data = response.data;

            // 3. VALIDAÇÃO DA RESPOSTA
            if (!data || data.status !== true) {
                return await lux.sendMessage(from, { text: '❌ Mestre, o encantamento falhou. Não foi possível encontrar a mídia neste link ou o post é privado.' }, { quoted: msg });
            }

            // 4. PROCESSAMENTO E ENVIO DAS MÍDIAS
            const { author_username, videos, images } = data;
            const caption = `*Invocado por:* Izuko BOT\n*Fonte:* Instagram (@${author_username})`;

            // Envia os vídeos encontrados
            if (videos && videos.length > 0) {
                for (const videoUrl of videos) {
                    // Usamos um bloco try/catch para cada envio, para o caso de um link falhar
                    try {
                        await lux.sendMessage(from, { 
                            video: { url: videoUrl },
                            caption: caption
                        }, { quoted: msg });
                    } catch (e) {
                        console.error(chalk.red(`[IGDL] Falha ao enviar vídeo: ${videoUrl}`), e);
                        await lux.sendMessage(from, { text: `Mestre, houve uma falha ao baixar um dos vídeos.` }, { quoted: msg });
                    }
                }
            }

            // Envia as imagens encontradas
            if (images && images.length > 0) {
                for (const imageUrl of images) {
                    try {
                        await lux.sendMessage(from, { 
                            image: { url: imageUrl },
                            caption: caption
                        }, { quoted: msg });
                    } catch (e) {
                        console.error(chalk.red(`[IGDL] Falha ao enviar imagem: ${imageUrl}`), e);
                        await lux.sendMessage(from, { text: `Mestre, houve uma falha ao baixar uma das imagens.` }, { quoted: msg });
                    }
                }
            }

            // Se não encontrou nem vídeo nem imagem (caso raro se status for true)
            if ((!videos || videos.length === 0) && (!images || images.length === 0)) {
                await lux.sendMessage(from, { text: 'Mestre, a API confirmou o post, mas não retornou nenhuma mídia para download.' }, { quoted: msg });
            }

        } catch (error) {
            console.error(chalk.red('[IGDL] Erro na API:'), error);
            await lux.sendMessage(from, { text: '❌ Mestre, o portal para o reino do Instagram parece estar selado. A API não respondeu.' }, { quoted: msg });
        }
    }
};
