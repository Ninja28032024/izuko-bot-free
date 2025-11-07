// commands/menu.js
const { getMenu } = require('../settings/lib/menus-lista.js');
const { promisify } = require('util');
const { exec } = require('child_process');
const execPromise = promisify(exec);
const fs = require('fs');
const path = require('path');

// Caminho para a pasta de imagens do menu
const MENU_IMG_DIR = path.join(__dirname, '..', 'banco de dados', 'menu img');
// Caminho para a pasta de áudios do menu
const MENU_AUDIO_DIR = path.join(__dirname, '..', 'banco de dados', 'audio menu');

module.exports = {
    name: 'menu',
    aliases: ['m', 'comandos'],
    
    execute: async ({ lux, from, msg, settings }) => {
        // Reage à mensagem do usuário
        await lux.sendMessage(from, {
            react: {
                text: "🍀",
                key: msg.key
            }
        });

        // =================================================================
        // == LÓGICA DE ÁUDIO ENCAMINHADO (Conversão para OGG 62k)
        // =================================================================
        try {
            if (fs.existsSync(MENU_AUDIO_DIR)) {
                const menuAudios = fs.readdirSync(MENU_AUDIO_DIR).filter(file => {
                    // Filtra apenas arquivos de áudio comuns (mp3, ogg, etc.)
                    return /\.(mp3|ogg|wav|opus|m4a)$/i.test(file);
                });

                if (menuAudios.length > 0) {
                    // Seleciona um áudio aleatório
                    const randomAudioFileName = menuAudios[Math.floor(Math.random() * menuAudios.length)];
                    const audioPath = path.join(MENU_AUDIO_DIR, randomAudioFileName);
                    const outputPath = path.join('/tmp', `menu_audio_${Date.now()}.ogg`);
                    
                    // Comando FFmpeg para converter para OGG com bitrate 62k
                    const ffmpegCommand = `ffmpeg -i "${audioPath}" -c:a libopus -b:a 62k -vbr on -y "${outputPath}"`;

                    try {
                        await execPromise(ffmpegCommand);
                        
                        // Envia o áudio convertido como nota de voz (PTT)
                        await lux.sendMessage(from, {
                            audio: { url: outputPath },
                            mimetype: 'audio/ogg; codecs=opus',
                            ptt: true, // Envia como nota de voz
                            contextInfo: {
                                forwardingScore: 999,
                                isForwarded: true
                            }
                        });
                        
                        // Limpa o arquivo temporário
                        fs.unlinkSync(outputPath);

                    } catch (ffmpegError) {
                        console.error(`[AVISO] Falha na conversão FFmpeg para OGG: ${ffmpegError.message}. Tentando enviar o original.`);
                        // Em caso de falha na conversão, envia o arquivo original (com mimetype padrão)
                        await lux.sendMessage(from, {
                            audio: { url: audioPath },
                            mimetype: 'audio/mp4', // MimeType padrão para o Baileys
                            ptt: true,
                            contextInfo: {
                                forwardingScore: 999,
                                isForwarded: true
                            }
                        });
                    }
                }
            }
        } catch (error) {
            console.log(`[AVISO] Falha ao enviar áudio do menu (${error.message}). Prosseguindo com o menu.`);
        }

        // =================================================================
        // == LÓGICA DE IMAGEM E LEGENDA (MENU PRINCIPAL)
        // =================================================================
        let imagePath = null;
        let menuImages = [];

        try {
            // 1. Lê a lista de arquivos na pasta
            if (fs.existsSync(MENU_IMG_DIR)) {
                menuImages = fs.readdirSync(MENU_IMG_DIR).filter(file => {
                    // Filtra apenas arquivos de imagem comuns
                    return /\.(jpe?g|png|webp)$/i.test(file);
                });
            }

            // 2. Verifica se há imagens
            if (menuImages.length === 0) {
                throw new Error("A pasta de imagens do menu está vazia.");
            }

            // 3. Seleciona uma imagem aleatória
            const randomFileName = menuImages[Math.floor(Math.random() * menuImages.length)];
            imagePath = path.join(MENU_IMG_DIR, randomFileName);

        } catch (error) {
            // Em caso de qualquer erro (pasta não existe, vazia, etc.), usa a imagem padrão
            console.log(`[AVISO] Falha ao carregar imagens do menu (${error.message}). Usando imagem padrão.`);
            imagePath = "https://files.catbox.moe/n2512l.jpg"; // Link de imagem padrão
        }

        const latencia = (Date.now() / 1000) - msg.messageTimestamp;

        const menuCaption = getMenu({
            prefix: settings.prefix,
            nomeBot: settings.nomeBot,
            versao: settings.versao,
            nomeDono: settings.nomeDono,
            ping: latencia 
        });

        // Envia a mensagem do menu com a imagem e a legenda
        await lux.sendMessage(from, { 
            image: { url: imagePath }, 
            caption: menuCaption 
        }, { quoted: msg });
    }
};
