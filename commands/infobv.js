// commands/infobv.js (versão atualizada)
module.exports = {
    name: 'infobv',
    aliases: ['infobemvindo', 'helpbv'],
    execute: async ({ lux, from, msg, isGroup, sender, areJidsSameUser, settings }) => {
        // ... (verificações de admin permanecem as mesmas)

        const manualText = `
📜 *MANUAL DO RITUAL DE BOAS-VINDAS* 📜

Saudações, General. Este pergaminho detalha como Vossa Senhoria pode decretar e personalizar a saudação aos novos guerreiros.

... (texto inicial permanece o mesmo) ...

*Exemplo de Decreto:*
\`\`\`${settings.prefix}legendabv Honra e glória, @user! Sua jornada no clã @grupo começa às @hora de uma @dia.\`\`\`

*Variáveis de Poder (Placeholders):*
Para tornar a saudação pessoal e poderosa, use as seguintes variáveis em sua mensagem:

- \`@user\`: Marca o novo guerreiro.
- \`@grupo\`: O nome deste clã.
- \`@hora\`: A hora da entrada (Ex: 14:32).
- \`@data\`: A data da entrada (Ex: 15/10/2025).
- \`@dia\`: O dia da semana (Ex: Quarta-feira).
- \`@numerouser\`: O número de telefone do membro.
- \`@lid\`: A ID completa do membro no WhatsApp.
- \`@desc\`: A descrição (recado) deste clã.
- \`@membros\`: A contagem total de membros no clã.

-------------------------------------------

Use este poder para fortalecer a identidade e a disciplina do clã. A primeira impressão é uma arma, e agora ela está em seu arsenal.
        `;

        await lux.sendMessage(from, { text: manualText.trim() }, { quoted: msg });
    }
};
