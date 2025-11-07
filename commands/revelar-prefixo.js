// Salvar como: commands/revelar-prefixo.js

module.exports = {
    name: 'prefixo',
    isKeyword: true, // Marca este como um comando de palavra-chave

    execute: async ({ lux, from, msg, settings }) => {
        // O comando só é acionado se a mensagem contiver exatamente a palavra "prefixo"
        // A lógica de verificação já é tratada pelo 'keyword-handler.js'
        
        const prefixoAtual = settings.prefix;

        const resposta = `Mestre, você mencionou o selo de invocação. O selo que me desperta atualmente é: *${prefixoAtual}*`;

        await lux.sendMessage(from, { text: resposta }, { quoted: msg });
    }
};
