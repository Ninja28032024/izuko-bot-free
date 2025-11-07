// Salvar como: commands/ativar-msg-tmp.js
module.exports = {
    name: 'ativar-msg-tmp',
    // Sem aliases, conforme ordenado.

    execute: async ({ lux, msg, from, isGroup, sender, args, areJidsSameUser, settings }) => {
        if (!isGroup) return await lux.sendMessage(from, { text: 'General, este decreto só pode ser proclamado em um clã.' }, { quoted: msg });

        const groupMeta = await lux.groupMetadata(from);
        const senderIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, sender))?.admin;
        const botIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, settings.botLid))?.admin;

        if (!senderIsAdmin) return await lux.sendMessage(from, { text: 'Apenas generais podem alterar as leis do tempo neste clã.' }, { quoted: msg });
        if (!botIsAdmin) return await lux.sendMessage(from, { text: 'Não tenho a patente necessária para executar este decreto.' }, { quoted: msg });

        const tempoArgs = args.join(' ').toLowerCase();
        let duracaoSegundos;
        let duracaoTexto;

        // Mapeia os argumentos para a duração em segundos que a API espera.
        switch (tempoArgs) {
            case '24 horas':
                duracaoSegundos = 86400; // 24 * 60 * 60
                duracaoTexto = '24 horas';
                break;
            case '7 dias':
            case '1 semana':
                duracaoSegundos = 604800; // 7 * 24 * 60 * 60
                duracaoTexto = '7 dias';
                break;
            case '90 dias':
                duracaoSegundos = 7776000; // 90 * 24 * 60 * 60
                duracaoTexto = '90 dias';
                break;
            default:
                // Se o argumento for inválido, envia o manual de uso.
                return await lux.sendMessage(from, { 
                    text: 'Sintaxe do jutsu incorreta, General.\n\n*Uso correto:* `ativar-msg-tmp <duração>`\n\n*Durações Válidas:*\n- 24 horas\n- 7 dias (ou 1 semana)\n- 90 dias' 
                }, { quoted: msg });
        }
        
        try {
            await lux.groupToggleEphemeral(from, duracaoSegundos);
            await lux.sendMessage(from, { text: `⏳ *LEI DA EFEMERIDADE ATIVADA* ⏳\n\nPor decreto de um general, as mensagens neste clã agora desaparecerão após *${duracaoTexto}*.` });
        } catch (e) {
            await lux.sendMessage(from, { text: 'General, uma anomalia impediu a alteração da lei da efemeridade.' }, { quoted: msg });
        }
    }
};
