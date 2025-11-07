const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'add-eununca',
    aliases: [],
    async execute({ lux, msg, from, isGroup, sender, args, isOwner, areJidsSameUser, euNuncaState }) {
        if (!isGroup) {
            return await lux.sendMessage(from, { text: 'Mestre, este comando só pode ser usado em grupos.' }, { quoted: msg });
        }
        
        const groupMeta = await lux.groupMetadata(from);
        const senderIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, sender))?.admin;

        if (!isOwner && !senderIsAdmin) {
            return await lux.sendMessage(from, { text: 'Mestre, apenas o dono e administradores podem adicionar novas perguntas.' }, { quoted: msg });
        }

        const novaPergunta = args.join(' ');
        if (!novaPergunta) {
            return await lux.sendMessage(from, { text: 'Mestre, por favor, escreva a pergunta que deseja adicionar após o comando.' }, { quoted: msg });
        }

        const jsonPath = path.join(__dirname, '..', 'banco de dados', 'eununca.json'); // Corrigido o caminho
        
        // Lê o arquivo, adiciona a nova pergunta e salva
        const perguntasAtuais = [...euNuncaState.euNuncaPerguntas];
        perguntasAtuais.push(novaPergunta);
        fs.writeFileSync(jsonPath, JSON.stringify(perguntasAtuais, null, 2));

        // Atualiza as listas em memória para a nova pergunta estar disponível imediatamente
        euNuncaState.euNuncaPerguntas.push(novaPergunta);
        euNuncaState.perguntasDisponiveis.push(novaPergunta);

        await lux.sendMessage(from, { text: `✅ Mestre, a pergunta foi adicionada com sucesso ao jogo!` }, { quoted: msg });
    }
};
