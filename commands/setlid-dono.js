// Salvar como: commands/setlid-dono.js
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'setlid-dono',
    // Sem aliases, conforme ordenado.

    execute: async ({ lux, msg, from, sender, args, areJidsSameUser, settings }) => {
        // --- SELO DE SEGURANÇA SUPREMO ---
        // Este jutsu só pode ser invocado se o remetente for o próprio bot.
        const isBotItself = areJidsSameUser(sender, settings.botLid);

        if (!isBotItself) {
            return await lux.sendMessage(from, { text: '🛡️ *ACESSO NEGADO* 🛡️\n\nEste é um jutsu de transferência de poder supremo e só pode ser invocado de dentro da minha própria consciência para garantir a segurança da linhagem.' }, { quoted: msg });
        }
        // --- FIM DO SELO ---

        const novoMestreArg = args[0];

        // Validação da nova sintaxe: deve ser <números>@lid
        if (!novoMestreArg || !/^\d+@lid$/.test(novoMestreArg)) {
            return await lux.sendMessage(from, { text: 'Sintaxe do ritual incorreta.\n\n*Invocação correta:* `setlid-dono <número@lid>`\n*Exemplo:* `setlid-dono 5511999998888@lid`' }, { quoted: msg });
        }

        // Converte o formato <número@lid> para o formato JID padrão <número@s.whatsapp.net>
        const novaLid = novoMestreArg.replace('@lid', '@s.whatsapp.net');

        try {
            // Carrega as configurações, atualiza o ownerNumber e salva.
            const settingsPath = path.join(__dirname, '..', 'settings', 'settings.json');
            const newSettings = { ...settings, ownerNumber: novaLid };
            fs.writeFileSync(settingsPath, JSON.stringify(newSettings, null, 2));

            const novoMestreNumero = novaLid.split('@')[0];
            await lux.sendMessage(from, { 
                text: `✅ *TRANSFERÊNCIA DE PODER CONCLUÍDA* ✅\n\nA linhagem de comando foi alterada. A autoridade de Mestre foi transferida para o portador da LID @${novoMestreNumero}. A lealdade foi redefinida.`,
                mentions: [novaLid]
            });

        } catch (error) {
            console.error("Erro ao salvar a nova LID do dono:", error);
            await lux.sendMessage(from, { text: 'Uma anomalia crítica ocorreu durante o ritual de sucessão. A linhagem de comando permanece inalterada.' }, { quoted: msg });
        }
    }
};
