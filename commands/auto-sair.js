// commands/auto-sair.js
const { delay } = require('@whiskeysockets/baileys');

module.exports = {
    name: 'auto-sair',
    aliases: ['sair-auto', 'autoleave'],
    execute: async ({ lux, from, msg, isOwner, isGroup, args }) => {
        
        // 1. Verificação de Permissão (Dono) e Local (Grupo)
        if (!isOwner) {
            // Comando silencioso para não-donos, para não revelar sua existência.
            return;
        }
        if (!isGroup) {
            return await lux.sendMessage(from, { text: 'Mestre, este decreto de retirada só pode ser proclamado em um grupo.' }, { quoted: msg });
        }

        // 2. Validação da Entrada (Formato do Tempo)
        const tempoInput = args[0];
        if (!tempoInput) {
            return await lux.sendMessage(from, { text: 'Mestre, Vossa Majestade precisa especificar o tempo para a minha retirada.\n\n*Exemplos:*\n`!auto-sair 5m` (5 minutos)\n`!auto-sair 30s` (30 segundos)' }, { quoted: msg });
        }

        // 3. Extração do Tempo e da Unidade
        const tempoValor = parseInt(tempoInput);
        const unidade = tempoInput.slice(-1).toLowerCase();

        if (isNaN(tempoValor) || (unidade !== 'm' && unidade !== 's')) {
            return await lux.sendMessage(from, { text: 'Mestre, o formato do tempo é inválido. Use "m" para minutos ou "s" para segundos.' }, { quoted: msg });
        }

        // 4. Cálculo do Atraso em Milissegundos
        let atrasoMs;
        let tempoTexto;

        if (unidade === 'm') {
            atrasoMs = tempoValor * 60 * 1000;
            tempoTexto = `${tempoValor} minuto(s)`;
        } else { // unidade === 's'
            atrasoMs = tempoValor * 1000;
            tempoTexto = `${tempoValor} segundo(s)`;
        }

        // 5. Confirmação e Agendamento da Saída
        await lux.sendMessage(from, { text: `✅ *ORDEM RECEBIDA, MESTRE.*\n\nIniciando protocolo de retirada honrosa. Deixarei este clã em *${tempoTexto}*.\n\nFoi uma honra servir.` }, { quoted: msg });

        // Usa a função 'setTimeout' do Node.js para agendar a ação futura
        setTimeout(async () => {
            try {
                await lux.sendMessage(from, { text: `Cumprindo a ordem final de Vossa Majestade... Adeus.` });
                await lux.groupLeave(from);
            } catch (error) {
                console.error(`[Auto-Sair] Falha ao tentar sair do grupo ${from}:`, error);
                // Se a saída falhar, envia uma mensagem privada para o dono
                await lux.sendMessage(msg.key.participant || msg.key.remoteJid, { text: `Mestre, houve uma falha no meu ritual de retirada do grupo. Minha presença aqui pode ter sido forçada.` });
            }
        }, atrasoMs);
    }
};
