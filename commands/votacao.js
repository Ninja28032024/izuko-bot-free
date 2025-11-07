// commands/votacao.js
const chalk = require('chalk');

module.exports = {
    name: 'votacao',
    aliases: [], // Sem aliases, conforme ordenado
    execute: async ({ lux, from, msg, isGroup, sender, args, areJidsSameUser, settings, votacoesAtivas }) => {
        // 1. VERIFICAÇÕES
        if (!isGroup) {
            return await lux.sendMessage(from, { text: 'Mestre, este comando só pode ser usado em grupos.' }, { quoted: msg });
        }
        const groupMeta = await lux.groupMetadata(from);
        const senderIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, sender))?.admin;
        if (!senderIsAdmin) {
            return await lux.sendMessage(from, { text: '❌ Apenas guardiões (admins) podem iniciar uma votação.' }, { quoted: msg });
        }

        const q = args.join(' ');
        const partes = q.split('|').map(p => p.trim());

        if (partes.length < 4) { // Pergunta, 2 opções, tempo
            return await lux.sendMessage(from, { text: `*Formato Incorreto, Mestre.*\n\nUse: \`${settings.prefix}votacao Pergunta | Opção 1 | Opção 2 | ... | Tempo (ex: 5m)\`` }, { quoted: msg });
        }

        // 2. EXTRAÇÃO DOS DADOS
        const tempoStr = partes.pop();
        const pergunta = partes.shift();
        const opcoes = partes;

        const tempoMatch = tempoStr.match(/^(\d+)([smh])$/); // s para segundos, m para minutos, h para horas
        if (!tempoMatch) {
            return await lux.sendMessage(from, { text: '❌ *Formato de tempo inválido!* Use "s" para segundos, "m" para minutos ou "h" para horas. Ex: `5m`.' }, { quoted: msg });
        }

        let tempoMs = parseInt(tempoMatch[1]);
        if (tempoMatch[2] === 's') tempoMs *= 1000;
        if (tempoMatch[2] === 'm') tempoMs *= 60 * 1000;
        if (tempoMatch[2] === 'h') tempoMs *= 60 * 60 * 1000;

        // 3. CRIAÇÃO DA ENQUETE
        try {
            const { key } = await lux.sendMessage(from, { poll: { name: pergunta, values: opcoes, selectableCount: 1 } });
            
            // Armazena a votação no Map global
            votacoesAtivas.set(key.id, {
                id: key.id,
                opcoes: opcoes,
                votos: new Array(opcoes.length).fill(0), // Inicia com 0 votos
                chatId: from,
                expiraEm: Date.now() + tempoMs
            });

            console.log(chalk.green(`[Votação] Nova enquete criada: ${key.id}. Expira em ${tempoStr}.`));

            // 4. AGENDAMENTO DO RESULTADO
            setTimeout(async () => {
                const votacaoFinal = votacoesAtivas.get(key.id);
                if (!votacaoFinal) return; // Votação já pode ter sido encerrada

                const maxVotos = Math.max(...votacaoFinal.votos);
                const vencedores = votacaoFinal.opcoes.filter((_, index) => votacaoFinal.votos[index] === maxVotos);

                let resultado = `
📊 *VOTAÇÃO ENCERRADA!* 📊

*Pergunta:* ${pergunta}

*Resultado:*
`;
                votacaoFinal.opcoes.forEach((opt, index) => {
                    resultado += `\n- ${opt}: *${votacaoFinal.votos[index]} voto(s)*`;
                });

                if (vencedores.length === 1) {
                    resultado += `\n\n*Opção Vencedora:* ${vencedores[0]}`;
                } else {
                    resultado += `\n\n*Houve um empate entre:* ${vencedores.join(', ')}`;
                }

                await lux.sendMessage(from, { text: resultado });
                votacoesAtivas.delete(key.id); // Limpa a votação da memória

            }, tempoMs);

        } catch (error) {
            console.error(chalk.red('[Votação] Erro ao criar enquete:'), error);
            await lux.sendMessage(from, { text: 'Mestre, houve uma falha ao tentar criar a votação.' }, { quoted: msg });
        }
    }
};
