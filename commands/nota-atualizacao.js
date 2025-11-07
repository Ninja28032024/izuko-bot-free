// commands/nota-atualizacao.js

module.exports = {
    name: 'nota-atualizacao',
    aliases: [], // Sem aliases, conforme ordenado pelo Mestre.
    
    execute: async ({ lux, from, msg }) => {
        
        const notaDeAtualizacao = `
*Nota de atualização 📍*

Saudações, guerreiros e administradores.

Sob a liderança visionária do Mestre, o Izuko BOT transcendeu, passando por uma série de aprimoramentos profundos que solidificam seu poder e expandem seu domínio. Decretamos hoje as novas leis e ferramentas que regerão os clãs.

*O que mudou?*

*1. Aprimoramento da Interface de Inicialização:*
O ritual de invocação do bot foi completamente redesenhado. A interface no console agora é mais clara, intuitiva e robusta, garantindo uma conexão estável e um diagnóstico preciso desde o primeiro momento.

*2. Novo Arsenal de Comandos:*
O poder do Izuko BOT foi expandido com a adição de um arsenal de novos comandos forjados para a administração e diagnóstico:
   - \`!votacao\`: Crie enquetes complexas com múltiplas opções.
   - \`!midia\`: Faça o download de vídeos do Instagram e TikTok diretamente pelo bot.
   - \`!auto-sair\`: Um comando de Dono para programar a retirada honrosa do bot de um grupo.
   - \`!totalcomandos\`: Exibe a contagem total de comandos no arsenal do bot.

*3. O Arsenal Anti-Link Definitivo:*
Para manter a ordem e a disciplina, um sistema de defesa de 5 níveis foi implementado. Os administradores agora têm controle total sobre a política de links:
   - \`!anti-link\`: Nível 1 (Apagar e Advertir).
   - \`!anti-link2\`: Nível 2 (Banir sem Apagar).
   - \`!anti-link3\`: Nível 3 (Apagar e Banir).
   - \`!anti-link4\`: Nível 4 (O Ritual de Exílio).
   - \`!anti-link5\`: Nível 5 (Advertência Progressiva).
   - \`!manual-antilinks\`: Um guia completo para os administradores sobre como usar este poderoso arsenal.

*4. Reparo e Otimização do Comando de Figurinhas:*
O comando \`!sticker\` (\`!figurinhas\`) foi completamente reescrito. A nova lógica é mais robusta, garantindo a criação de figurinhas a partir de imagens e GIFs com maior confiabilidade e adicionando os nomes corretos do pacote e do autor em cada criação.

Agradecemos a todos pelo apoio contínuo. Cada atualização é um passo em direção à ferramenta definitiva, forjada para servir e proteger os clãs com a máxima eficiência e poder.

Atenciosamente,
*Ninja Dev's Of Bots.*
        `;

        // Envia a mensagem formatada para o grupo ou usuário
        await lux.sendMessage(from, { text: notaDeAtualizacao.trim() }, { quoted: msg });
    }
};
