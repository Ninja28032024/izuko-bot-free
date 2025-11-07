// commands/guia-velha.js
// Comando tutorial para ensinar como usar o Jogo da Velha
// VERSÃO ATUALIZADA - APENAS MULTIPLAYER

const chalk = require('chalk');

module.exports = {
    name: 'guia-velha',
    aliases: ['tutorial-velha', 'como-jogar-velha', 'ajuda-velha', 'help-velha'],
    description: 'Tutorial completo sobre como jogar Jogo da Velha',
    usage: '!guia-velha [página]',
    
    async execute({ lux, from, msg, args, sender, pushName, isGroup, settings }) {
        try {
            // Obter número da página (padrão: 1)
            const pagina = parseInt(args[0]) || 1;

            // Validar página (agora são 4 páginas)
            if (pagina < 1 || pagina > 4) {
                return await lux.sendMessage(from, { 
                    text: `❌ Página inválida! Use números de 1 a 4.\n\nExemplo: ${settings.prefix}guia-velha 1` 
                }, { quoted: msg });
            }

            // Gerar conteúdo da página
            const conteudo = gerarPagina(pagina, settings.prefix);

            await lux.sendMessage(from, { text: conteudo }, { quoted: msg });

            console.log(chalk.blue(`[GUIA-VELHA] ${pushName} visualizou página ${pagina}`));

        } catch (error) {
            console.error(chalk.red('[GUIA-VELHA] Erro ao executar comando:'), error);
            await lux.sendMessage(from, { 
                text: '❌ Erro ao exibir o guia. Tente novamente.' 
            }, { quoted: msg });
        }
    }
};

// ===== FUNÇÕES AUXILIARES =====

function gerarPagina(pagina, prefix) {
    const paginas = {
        1: `📖 *GUIA COMPLETO - JOGO DA VELHA* 📖

*Página 1/4 - INTRODUÇÃO*

Bem-vindo ao Jogo da Velha do Izuko Bot! 🎮

Este é um jogo clássico onde você pode:
✅ Desafiar outros USUÁRIOS do grupo
✅ Acompanhar suas ESTATÍSTICAS
✅ Ver o RANKING do grupo

*Como funciona:*
• Você marca um número (1-9) no tabuleiro
• O objetivo é fazer 3 símbolos iguais em linha
• Pode ser na horizontal, vertical ou diagonal
• Dois jogadores se enfrentam: X vs O

*Próximos passos:*
Digite ${prefix}guia-velha 2 para aprender a jogar!`,

        2: `📖 *GUIA COMPLETO - JOGO DA VELHA* 📖

*Página 2/4 - COMO JOGAR*

*PASSO 1: Desafiar Outro Usuário*
Digite: ${prefix}velha @João

O bot envia um desafio para João:
\`\`\`
1️⃣ 2️⃣ 3️⃣ 
4️⃣ 5️⃣ 6️⃣ 
7️⃣ 8️⃣ 9️⃣ 
\`\`\`

👤 *Você* desafiou @João para jogar!

⭕ @João, responda com:
✅ ${prefix}aceitar
❌ ${prefix}rejeitar

⏳ Tempo limite: 5 minutos

---

*PASSO 2: Aguardar Resposta*

Se João digitar: ${prefix}aceitar
→ O jogo começa! Você é ❌ (X) e joga primeiro.

Se João digitar: ${prefix}rejeitar
→ O desafio é cancelado.

Se ninguém responder em 5 minutos:
→ O desafio é cancelado automaticamente.

---

*PASSO 3: Fazer Jogadas*

Quando for sua vez, digite apenas o número (1-9):
Exemplo: 5

Seu símbolo (❌ ou ⭕) vai para a posição escolhida!

---

*PASSO 4: Alternando Turnos*

Você digita um número (1-9)
João digita um número (1-9)
Repete até alguém vencer ou empatar!

Digite ${prefix}guia-velha 3 para ver os resultados possíveis!`,

        3: `📖 *GUIA COMPLETO - JOGO DA VELHA* 📖

*Página 3/4 - RESULTADOS POSSÍVEIS*

*CENÁRIO 1: VOCÊ VENCE* ✅

Você consegue fazer 3 símbolos em linha:
\`\`\`
❌ ❌ ❌ 
⭕ ⭕ 6️⃣ 
7️⃣ 8️⃣ 9️⃣ 
\`\`\`

Bot responde:
🎉 *VOCÊ VENCEU!* 🎉
⚔️ Parabéns! Você conquistou a vitória!

Suas estatísticas são atualizadas:
• +1 Vitória
• +1 Partida jogada

---

*CENÁRIO 2: OPONENTE VENCE* ❌

O oponente consegue fazer 3 símbolos em linha:
\`\`\`
⭕ ⭕ ⭕ 
❌ ❌ 6️⃣ 
7️⃣ 8️⃣ 9️⃣ 
\`\`\`

Bot responde:
🎉 *JOÃO VENCEU!* 🎉
⚔️ Parabéns! Você conquistou a vitória!

Suas estatísticas são atualizadas:
• +1 Derrota
• +1 Partida jogada

---

*CENÁRIO 3: EMPATE* 🤝

Todas as posições preenchidas, ninguém venceu:
\`\`\`
❌ ⭕ ❌ 
⭕ ❌ ⭕ 
⭕ ❌ ❌ 
\`\`\`

Bot responde:
🤝 *EMPATE!* 🤝
Ambos jogaram muito bem! Ninguém conseguiu vencer.

Estatísticas de ambos são atualizadas:
• +1 Empate
• +1 Partida jogada

---

*CENÁRIO 4: TIMEOUT* ⏰

Se passar 5 minutos sem jogadas:

Bot responde:
⏰ *TEMPO ESGOTADO!*
O jogo foi cancelado por inatividade.

Nenhuma estatística é atualizada.

Digite ${prefix}guia-velha 4 para ver os comandos auxiliares!`,

        4: `📖 *GUIA COMPLETO - JOGO DA VELHA* 📖

*Página 4/4 - COMANDOS E DICAS*

*COMANDOS DISPONÍVEIS:*

🎮 *Iniciar Jogo*
${prefix}velha @usuário
Desafia outro jogador do grupo.

✅ *Aceitar Desafio*
${prefix}aceitar
Quando alguém te desafiar, use este comando!

❌ *Rejeitar Desafio*
${prefix}rejeitar
Se não quiser jogar, rejeite o desafio!

⛔ *Cancelar Jogo*
${prefix}cancelarvelha
Cancela o jogo em andamento.

📊 *Ver Estatísticas*
${prefix}velha-stats
Veja suas estatísticas pessoais:
• Total de partidas
• Vitórias, derrotas e empates
• Taxa de vitória

🏆 *Ver Ranking*
${prefix}velha-rank
Veja o ranking do grupo com os Top 10 jogadores.

📖 *Ver Guia*
${prefix}guia-velha [página]
Exibe este guia (páginas 1-4).

---

*DICAS ESTRATÉGICAS:*

✅ *Centro é Chave*
A posição 5 (centro) é estratégica!
Quem controla o centro tem vantagem.

✅ *Cantos são Fortes*
Posições 1, 3, 7 e 9 (cantos) são poderosas.
Crie ameaças a partir dos cantos!

✅ *Crie Ameaças Duplas*
Tente criar duas formas de vencer ao mesmo tempo.
Seu oponente só pode bloquear uma!

✅ *Bloqueie o Oponente*
Sempre fique atento às jogadas do adversário.
Se ele tem 2 símbolos em linha, bloqueie!

✅ *Pratique Bastante*
Quanto mais jogar, melhor ficará!
Desafie diferentes pessoas para aprender.

---

*REGRAS IMPORTANTES:*

⚠️ Apenas um jogo por grupo de cada vez
⚠️ Não pode desafiar a si mesmo
⚠️ Tempo limite de 5 minutos por jogo
⚠️ Apenas números de 1-9 são aceitos
⚠️ Não pode jogar em posição ocupada

---

*RESUMO DOS COMANDOS:*
${prefix}velha @usuário - Desafiar jogador
${prefix}aceitar - Aceitar desafio
${prefix}rejeitar - Rejeitar desafio
${prefix}cancelarvelha - Cancelar jogo
${prefix}velha-stats - Ver estatísticas
${prefix}velha-rank - Ver ranking
${prefix}guia-velha [1-4] - Ver guia

Divirta-se e boa sorte! 🎮🍀`
    };

    return paginas[pagina] || paginas[1];
}
