// Salvar como: commands/mp4.js

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'mp4',
    execute: async ({ lux, from, msg, args }) => {
        const link = args[0];
        if (!link || !link.includes('youtu')) {
            return await lux.sendMessage(from, { text: 'Mestre, forneça um link válido do YouTube para que eu possa capturar o vídeo.' }, { quoted: msg });
        }

        await lux.sendMessage(from, { text: 'Iniciando o ritual de captura de vídeo... Aguarde, Mestre. A duração do vídeo influencia no tempo de espera.' }, { quoted: msg });

        const tempDir = path.join(__dirname, '..', 'temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }

        const outputId = `video_${Date.now()}`;
        const outputPath = path.join(tempDir, `${outputId}.mp4`);

        // Comando yt-dlp para baixar vídeo em até 720p, formato mp4. Ideal para WhatsApp.
        const command = `yt-dlp -f "bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/best[height<=720][ext=mp4]" -o "${outputPath}" "${link}"`;

        exec(command, async (error, stdout, stderr) => {
            if (error) {
                console.error(`Erro ao executar yt-dlp para vídeo: ${error.message}`);
                if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath); // Limpa o arquivo incompleto
                return await lux.sendMessage(from, { text: 'Mestre, houve uma falha no ritual. Não foi possível capturar o vídeo. O conteúdo pode ser muito longo ou estar protegido.' }, { quoted: msg });
            }

            console.log(stdout);
            console.error(stderr);

            if (fs.existsSync(outputPath)) {
                // Adicionar uma legenda com o título seria um aprimoramento futuro
                await lux.sendMessage(from, {
                    video: { url: outputPath },
                    caption: 'Mestre, o vídeo solicitado foi capturado com sucesso.'
                }, { quoted: msg });

                // Limpa o arquivo após o envio
                fs.unlinkSync(outputPath);
            } else {
                await lux.sendMessage(from, { text: 'Mestre, o ritual parece ter falhado silenciosamente. O arquivo final não foi encontrado.' }, { quoted: msg });
            }
        });
    }
};
