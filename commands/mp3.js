// Salvar como: commands/mp3.js

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'mp3',
    execute: async ({ lux, from, msg, args }) => {
        const link = args[0];
        if (!link || !link.includes('youtu')) {
            return await lux.sendMessage(from, { text: 'Mestre, forneça um link válido do YouTube para que eu possa capturar o áudio.' }, { quoted: msg });
        }

        await lux.sendMessage(from, { text: 'Iniciando o ritual de extração de áudio... Aguarde, Mestre. Isso pode levar um momento.' }, { quoted: msg });

        const tempDir = path.join(__dirname, '..', 'temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }

        const outputId = `audio_${Date.now()}`;
        const outputPath = path.join(tempDir, `${outputId}.mp3`);
        
        // Comando yt-dlp para extrair áudio em formato mp3, com a melhor qualidade de áudio
        const command = `yt-dlp -x --audio-format mp3 -o "${outputPath}" --audio-quality 0 "${link}"`;

        exec(command, async (error, stdout, stderr) => {
            if (error) {
                console.error(`Erro ao executar yt-dlp para áudio: ${error.message}`);
                fs.unlinkSync(outputPath); // Limpa o arquivo incompleto
                return await lux.sendMessage(from, { text: 'Mestre, houve uma falha no ritual. Não foi possível extrair o áudio. Verifique o link ou tente novamente.' }, { quoted: msg });
            }

            console.log(stdout);
            console.error(stderr);

            if (fs.existsSync(outputPath)) {
                await lux.sendMessage(from, {
                    audio: { url: outputPath },
                    mimetype: 'audio/mpeg'
                }, { quoted: msg });

                // Limpa o arquivo após o envio
                fs.unlinkSync(outputPath);
            } else {
                await lux.sendMessage(from, { text: 'Mestre, o ritual parece ter falhado silenciosamente. O arquivo final não foi encontrado.' }, { quoted: msg });
            }
        });
    }
};
