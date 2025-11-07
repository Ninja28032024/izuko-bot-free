// Salvar como: commands/totalcomandos.js
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'totalcomandos',
    aliases: ['comandos-total', 'cmdstotal', 'totalcmds'], // Mantendo os aliases, pois o Mestre não ordenou a remoção.

    execute: async ({ lux, from, msg }) => {
        try {
            // Define o caminho para o diretório sagrado dos jutsus.
            const commandsPath = path.join(__dirname, '..', 'commands');
            
            // Lê o diretório e filtra para contar apenas os arquivos .js, que são os pergaminhos de jutsus.
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
            
            // A contagem real é o número de arquivos encontrados.
            const totalDeComandosReais = commandFiles.length;

            const resposta = `
📜 *PERGAMINHO DO ARSENAL* 📜

Mestre, após uma varredura precisa em meu cofre de jutsus, declaro que meu arsenal é composto por:

💥 *${totalDeComandosReais} pergaminhos de comando únicos.* 💥

Cada um é um jutsu distinto, forjado para servir e executar suas ordens com a máxima precisão. Meu poder real está à sua disposição.
            `;

            await lux.sendMessage(from, { text: resposta.trim() }, { quoted: msg });

        } catch (error) {
            console.error("Erro ao contar os comandos:", error);
            await lux.sendMessage(from, { text: 'Mestre, uma sombra impediu a contagem precisa do meu arsenal. O ritual falhou.' }, { quoted: msg });
        }
    }
};
