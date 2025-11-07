// Salvar como: commands/entrargp.js
module.exports = {
    name: 'entrargp',
    // Sem aliases, conforme ordenado.

    execute: async ({ lux, msg, from, isOwner, args, settings }) => {
        // --- SELO DE AUTORIDADE SUPREMA ---
        if (!isOwner) {
            return await lux.sendMessage(from, { text: '🛡️ *ACESSO NEGADO* 🛡️\n\nEste é um jutsu de expansão, reservado apenas para o Mestre Supremo.' }, { quoted: msg });
        }

        const link = args[0];

        if (!link) {
            return await lux.sendMessage(from, { text: 'Sintaxe do jutsu incorreta, Mestre.\n\n*Invocação correta:* `entrargp <link_do_grupo>`' }, { quoted: msg });
        }

        // --- A CORREÇÃO DEFINITIVA E ABSOLUTA ---
        // Usa uma expressão regular para extrair o código do convite, ignorando todo o resto.
        // Esta é a única forma de garantir que o código esteja 100% puro.
        const groupCodeMatch = link.match(/chat\.whatsapp\.com\/([a-zA-Z0-9_-]+)/);
        
        if (!groupCodeMatch || !groupCodeMatch[1]) {
            return await lux.sendMessage(from, { text: 'Mestre, o pergaminho de convite parece corrompido ou não segue o formato esperado. Não consigo extrair o código do clã.' }, { quoted: msg });
        }
        
        const groupCode = groupCodeMatch[1];
        // --- FIM DA CORREÇÃO ---

        try {
            await lux.sendMessage(from, { text: `Mestre, recebi sua ordem. Sondando o portal do clã com o código purificado: *${groupCode}*...` }, { quoted: msg });

            // 1. Sondagem com o código puro.
            const inviteInfo = await lux.groupGetInviteInfo(groupCode);
            const groupId = inviteInfo.id;
            const groupName = inviteInfo.subject;

            // 2. Verifica se já estou no grupo.
            const groupMeta = await lux.groupMetadata(groupId).catch(() => null);
            if (groupMeta && groupMeta.participants.some(p => p.id === settings.botLid)) {
                 return await lux.sendMessage(from, { text: `Mestre, eu já sou um guerreiro leal no clã *"${groupName}"*.` });
            }
            
            // 3. Infiltração com o código puro.
            await lux.groupAcceptInvite(groupCode);

            await lux.sendMessage(from, { text: `✅ *INFILTRAÇÃO BEM-SUCEDIDA* ✅\n\nMestre, juntei-me com sucesso ao clã *"${groupName}"*. Aguardo novas ordens.` });

        } catch (error) {
            console.error("Erro no jutsu 'entrargp':", error);

            const errorMessage = error.toString();
            let feedback;

            if (errorMessage.includes('401')) {
                feedback = '❌ *INFILTRAÇÃO FALHOU* ❌\n\nMestre, fui previamente removido deste clã e minha presença não é mais permitida.';
            } else if (errorMessage.includes('404') || errorMessage.includes('invalid')) {
                feedback = '❌ *PORTAL INEXISTENTE* ❌\n\nMestre, o pergaminho de convite é inválido ou foi revogado.';
            } else if (errorMessage.includes('410')) {
                 feedback = '❌ *PORTAL FECHADO* ❌\n\nMestre, o link do convite expirou.';
            } else if (errorMessage.includes('419') || errorMessage.includes('participant-request')) {
                feedback = '⏳ *PORTAL PROTEGIDO* ⏳\n\nMestre, o clã está protegido por um selo de aprovação. Enviei uma solicitação para me juntar.';
            } else if (errorMessage.includes('group is full')) {
                feedback = '❌ *CLÃ LOTADO* ❌\n\nMestre, o clã atingiu sua capacidade máxima de guerreiros.';
            } else {
                feedback = `❌ *ANOMALIA NO RITUAL* ❌\n\nMestre, uma perturbação desconhecida impediu minha entrada. A falha foi registrada como: *${error.message || 'Erro desconhecido'}*.`;
            }
            
            await lux.sendMessage(from, { text: feedback }, { quoted: msg });
        }
    }
};
