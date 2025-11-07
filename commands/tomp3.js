// commands/tomp3.js
const { downloadContentFromMessage, getContentType, delay } = require('@whiskeysockets/baileys');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'tomp3',
    aliases: ['toaudio'],
    execute: async ({ lux, from, msg }) => {
        let mediaMessage;

        // Verifica se a mensagem é uma resposta a um vídeo
        const quoted = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;
        if (quoted && getContentType(quoted) === 'videoMessage') {
            mediaMessage = quoted.videoMessage;
        } else {
            return await lux.sendMessage(from, { text: 'Mestre, para que eu possa extrair a alma sonora de um vídeo, Vossa Senhoria precisa respondê-lo com este comando.' }, { quoted: msg });
        }

        // Define caminhos para os arquivos temporários
        const tempDir = path.join(__dirname, '..', 'temp');
        fs.mkdirSync(tempDir, { recursive: true }); // Garante que o diretório temp exista
        const timestamp = Date.now();
        const videoPath = path.join(tempDir, `${timestamp}_input.mp4`);
        const audioPath = path.join(tempDir, `${timestamp}_output.mp3`);

        let loadingKey;

        try {
            // 1. Inicia a barra de progresso
            const progressBar = [
                '[■□□□□] 20%',
                '[■■□□□] 40%',
                '[■■■□□] 60%',
                '[■■■■□] 80%',
                '[■■■■■] 100%',
            ];
            
            const initialMessage = await lux.sendMessage(from, { text: `Iniciando o ritual de extração sonora...\n${progressBar[0]}` }, { quoted: msg });
            loadingKey = initialMessage.key;

            // 2. Faz o download do vídeo
            const stream = await downloadContentFromMessage(mediaMessage, 'video');
            const writeStream = fs.createWriteStream(videoPath);
            
            for await (const chunk of stream) {
                writeStream.write(chunk);
            }
            writeStream.end();
            
            await new Promise((resolve, reject) => {
                writeStream.on('finish', resolve);
                writeStream.on('error', reject);
            });

            await lux.sendMessage(from, { text: `Corpo material recebido. Isolando a alma sonora...\n${progressBar[1]}`, edit: loadingKey });
            await delay(500);

            // 3. Executa o FFmpeg para extrair o áudio
            // -i: arquivo de entrada
            // -vn: ignora o vídeo (video no)
            // -acodec libmp3lame: usa o codec MP3
            // -ab 128k: bitrate de 128kbps (boa qualidade para áudio)
            // -ar 44100: frequência de amostragem padrão
            // -y: sobrescreve o arquivo de saída se ele já existir
            const ffmpegCommand = `ffmpeg -i ${videoPath} -vn -acodec libmp3lame -ab 128k -ar 44100 -y ${audioPath}`;

            await new Promise((resolve, reject) => {
                exec(ffmpegCommand, (error, stdout, stderr) => {
                    if (error) {
                        console.error('Erro no FFmpeg:', stderr);
                        reject(new Error(`A extração falhou. O espírito do vídeo é instável.`));
                    } else {
                        resolve(stdout);
                    }
                });
            });

            await lux.sendMessage(from, { text: `Alma sonora isolada. Materializando em forma de áudio...\n${progressBar[3]}`, edit: loadingKey });
            await delay(500);

            // 4. Envia o áudio extraído
            await lux.sendMessage(from, {
                audio: { url: audioPath },
                mimetype: 'audio/mpeg'
            }, { quoted: msg });

            // 5. Edita a mensagem final de sucesso
            await lux.sendMessage(from, { text: `*RITUAL CONCLUÍDO* 🎶\n\nA alma sonora do vídeo foi extraída e materializada com sucesso, Mestre.`, edit: loadingKey });

        } catch (error) {
            console.error("Erro no comando !tomp3:", error);
            const errorMessage = `Mestre, o ritual de extração falhou. A essência do vídeo é corrupta ou os espíritos do som não responderam.\n\n*Motivo:* ${error.message}`;
            
            if (loadingKey) {
                await lux.sendMessage(from, { text: errorMessage, edit: loadingKey });
            } else {
                await lux.sendMessage(from, { text: errorMessage }, { quoted: msg });
            }
        } finally {
            // 6. Limpa os arquivos temporários, independentemente de sucesso ou falha
            if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
            if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
        }
    }
};
