// Salvar como: commands/baixar.js

module.exports = {
    name: 'baixar',
    aliases: [],
    execute: async ({ lux, from, msg }) => {
        const guia = `Mestre, o Jutsu de Captura de Mídia requer que o senhor especifique o formato desejado.

*Para capturar um vídeo:*
\`!mp4 <link do YouTube>\`

*Para capturar apenas o áudio (música):*
\`!mp3 <link do YouTube>\`

Forneça o link do conteúdo que deseja trazer para este domínio.`;

        await lux.sendMessage(from, { text: guia }, { quoted: msg });
    }
};
