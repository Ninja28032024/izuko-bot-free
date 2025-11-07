// Salvar como: commands/guia-mute.js

module.exports = {
    name: 'guia-mute',
    // Sem aliases, como ordenado pelo Mestre.

    execute: async ({ lux, from, msg, isGroup, sender, areJidsSameUser, settings }) => {
        if (!isGroup) {
            return await lux.sendMessage(from, { text: 'Mestre, este pergaminho só pode ser revelado na atmosfera de um clã (grupo).' }, { quoted: msg });
        }

        const groupMeta = await lux.groupMetadata(from);
        const senderIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, sender))?.admin;

        if (!senderIsAdmin) {
            return await lux.sendMessage(from, { text: 'Apenas os generais (admins) deste clã podem consultar os segredos da Trilogia do Silêncio.' }, { quoted: msg });
        }

        // --- CORREÇÃO DEFINITIVA: Construindo a string de forma segura ---
        const manualText = 
            '📜 *MANUAL SAGRADO: A TRILOGIA DO SILÊNCIO* 📜\n\n' +
            'Saudações, General.\n\n' +
            'Este pergaminho detalha os três jutsus de silenciamento que Vossa Senhoria pode invocar para manter a ordem e a disciplina no clã. Cada jutsu possui um nível de severidade e um propósito distinto. Use este poder com sabedoria.\n\n' +
            'A hierarquia é absoluta: *nenhum jutsu de silêncio pode ser usado contra outro general.*\n\n' +
            '---' + '\n\n' +
            '*NÍVEL 1: O SELO TEMPORÁRIO (`' + settings.prefix + 'mute`)*\n\n' +
            'Este jutsu silencia um guerreiro por um período determinado de tempo. Durante este período, todas as suas mensagens serão apagadas instantaneamente.\n\n' +
            '*Invocação:*\n' +
            '```' + settings.prefix + 'mute @alvo <tempo> <s/m>```\n\n' +
            '*Sintaxe:*\n' +
            '- `@alvo`: Marque o usuário ou responda a uma de suas mensagens.\n' +
            '- `<tempo>`: Um número (ex: 5, 10, 30).\n' +
            '- `<s/m>`: \'s\' para segundos ou \'m\' para minutos.\n\n' +
            '*Exemplo de Decreto:*\n' +
            '```' + settings.prefix + 'mute @guerreiro_rebelde 10 m```\n' +
            '_(O alvo ficará silenciado por 10 minutos.)_\n\n' +
            '---' + '\n\n' +
            '*NÍVEL 2: O SELO PERMANENTE (`' + settings.prefix + 'mute2`)*\n\n' +
            'Este jutsu impõe um silêncio por tempo indeterminado. A voz do guerreiro só será restaurada quando um general invocar o contra-jutsu de libertação.\n\n' +
            '*Invocação:*\n' +
            '```' + settings.prefix + 'mute2 @alvo```\n\n' +
            '*Propósito:*\n' +
            'Para infrações graves que exigem uma intervenção direta de um general para serem perdoadas.\n\n' +
            '---' + '\n\n' +
            '*NÍVEL 3: O CAMINHO PARA O EXÍLIO (`' + settings.prefix + 'mute3`)*\n\n' +
            'Este é o jutsu de advertência final. Ele silencia o guerreiro e o coloca sob observação. Cada mensagem que ele tentar enviar contará como uma infração. Ao atingir o limite, ele será exilado (banido) do clã automaticamente.\n\n' +
            '*Invocação:*\n' +
            '```' + settings.prefix + 'mute3 @alvo [limite]```\n\n' +
            '*Sintaxe:*\n' +
            '- `[limite]`: O número de chances que o guerreiro terá antes do exílio. Se não for especificado, o padrão é *8 chances*.\n\n' +
            '*Exemplo de Decreto:*\n' +
            '```' + settings.prefix + 'mute3 @insubordinado 5```\n' +
            '_(O alvo será silenciado. Se ele tentar falar 5 vezes, será banido na quinta tentativa.)_\n\n' +
            '---' + '\n\n' +
            '*O CONTRA-JUTSU: A LIBERTAÇÃO (`' + settings.prefix + 'desmute`)*\n\n' +
            'Este é o jutsu universal para quebrar qualquer um dos três selos de silêncio e restaurar a voz de um guerreiro.\n\n' +
            '*Invocação:*\n' +
            '```' + settings.prefix + 'desmute @alvo```\n\n' +
            '*Aliases:* `' + settings.prefix + 'libertar`, `' + settings.prefix + 'perdoar`\n\n' +
            'Use estes jutsus para garantir que a honra e a ordem do nosso clã permaneçam inabaláveis.';

        await lux.sendMessage(from, { text: manualText }, { quoted: msg });
    }
};
