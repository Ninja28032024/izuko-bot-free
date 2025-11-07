// commands/add-charada-cassino.js
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'add-charada-cassino',
    aliases: [], // Sem aliases, conforme ordenado pelo Mestre.
    execute: async ({ lux, from, msg, isOwner, body }) => {
        // 1. VERIFICAÇÃO DE PERMISSÃO (DONO)
        if (!isOwner) {
            // Comando silencioso para usuários normais.
            return;
        }

        // 2. EXTRAÇÃO DO CONTEÚDO DO COMANDO
        // Remove o nome do comando e o prefixo para obter apenas os dados.
        const dadosBrutos = body.substring(body.indexOf(' ') + 1);

        // 3. PARSING DOS DADOS USANDO O DELIMITADOR "|"
        const partes = dadosBrutos.split('|').map(p => p.trim());

        // Valida se temos o número correto de partes (pergunta, 3 alternativas, resposta)
        if (partes.length !== 5) {
            const exemplo = '`!add-charada-cassino x- Pergunta aqui | a- Alternativa A | b- Alternativa B | c- Alternativa C | b`';
            return await lux.sendMessage(from, { text: `❌ *Estrutura Inválida, Mestre.*\n\nO encantamento requer 5 partes separadas por "|".\n\n*Formato Correto:*\n${exemplo}` }, { quoted: msg });
        }

        // 4. PROCESSAMENTO E VALIDAÇÃO DE CADA PARTE
        try {
            const novaCharada = {};
            let respostaFinal = '';

            // Processa a pergunta (x-)
            if (partes[0].toLowerCase().startsWith('x-')) {
                novaCharada.pergunta = partes[0].substring(2).trim();
            } else {
                throw new Error('A primeira parte deve ser a pergunta, começando com "x-".');
            }

            // Processa as alternativas (a-, b-, c-)
            novaCharada.opcoes = {};
            if (partes[1].toLowerCase().startsWith('a-')) {
                novaCharada.opcoes.a = partes[1].substring(2).trim();
            } else {
                throw new Error('A segunda parte deve ser a alternativa A, começando com "a-".');
            }

            if (partes[2].toLowerCase().startsWith('b-')) {
                novaCharada.opcoes.b = partes[2].substring(2).trim();
            } else {
                throw new Error('A terceira parte deve ser a alternativa B, começando com "b-".');
            }

            if (partes[3].toLowerCase().startsWith('c-')) {
                novaCharada.opcoes.c = partes[3].substring(2).trim();
            } else {
                throw new Error('A quarta parte deve ser a alternativa C, começando com "c-".');
            }

            // Processa a resposta final
            const resposta = partes[4].toLowerCase().trim();
            if (['a', 'b', 'c'].includes(resposta)) {
                novaCharada.resposta = resposta;
            } else {
                throw new Error('A última parte deve ser a letra da resposta correta (a, b ou c).');
            }

            // Valida se todos os campos foram preenchidos
            if (!novaCharada.pergunta || !novaCharada.opcoes.a || !novaCharada.opcoes.b || !novaCharada.opcoes.c) {
                throw new Error('Todos os campos (pergunta e alternativas) devem ter conteúdo.');
            }

            // 5. SALVA A NOVA CHARADA NO BANCO DE DADOS
            const charadasPath = path.join(__dirname, '..', 'banco de dados', 'charadas.json');
            const charadas = JSON.parse(fs.readFileSync(charadasPath, 'utf-8'));
            charadas.push(novaCharada);
            fs.writeFileSync(charadasPath, JSON.stringify(charadas, null, 2));

            await lux.sendMessage(from, { text: '✅ *ENIGMA FORJADO COM SUCESSO!*\n\nA nova charada foi adicionada ao repertório da Esfinge.' }, { quoted: msg });

        } catch (error) {
            // Envia uma mensagem de erro específica se a validação falhar
            await lux.sendMessage(from, { text: `❌ *FALHA NA FORJA, MESTRE.*\n\n*Motivo:* ${error.message}` }, { quoted: msg });
        }
    }
};
