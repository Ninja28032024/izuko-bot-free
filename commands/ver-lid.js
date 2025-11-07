// commands/ver-lid.js

module.exports = {
    name: 'ver-lid',
    aliases: ['get-lid', 'revelar-lid'],
    execute: async ({ lux, from, msg, isOwner, args }) => {
        // 1. VERIFICAÇÃO DE PERMISSÃO (EXCLUSIVO DO MESTRE)
        // O comando encerra silenciosamente se não for o Dono, para não revelar sua existência.
        if (!isOwner) {
            return; 
        }

        // 2. VERIFICAR SE HÁ UMA MENÇÃO
        // O comando precisa de uma menção para saber de quem revelar o LID.
        const quotedInfo = msg.message.extendedTextMessage?.contextInfo;
        const mentions = quotedInfo?.mentionedJid;

        if (!mentions || mentions.length === 0) {
            return await lux.sendMessage(from, { text: 'Mestre, Vossa Majestade precisa marcar o alvo (@) para que eu possa revelar sua verdadeira identidade (LID).' }, { quoted: msg });
        }

        // 3. EXTRAIR O LID DO PRIMEIRO ALVO MARCADO
        // Pega o primeiro JID da lista de menções.
        const targetJid = mentions[0]; 

        // 4. REVELAR A IDENTIDADE
        // O JID obtido da menção já está no formato correto (ex: '55...1@s.whatsapp.net').
        // Para obter o LID, substituímos o final por '@lid'.
        const targetLid = targetJid.replace('@s.whatsapp.net', '@lid');

        const resposta = `
📜 *IDENTIDADE REVELADA* 📜

Mestre, a verdadeira identidade (LID) do alvo marcado é:

*${targetLid}*
        `.trim();

        await lux.sendMessage(from, { text: resposta }, { quoted: msg });
    }
};
