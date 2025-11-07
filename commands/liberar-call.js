// commands/liberar-call.js
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'banco de dados', 'call_links.json');

// Funções auxiliares para ler e salvar o banco de dados
const readDB = () => JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
const saveDB = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

module.exports = {
    name: 'liberar-call',
    aliases: ['liberarcall', 'fechar-call'],
    execute: async ({ lux, from, msg, sender, pushName }) => {
        try {
            const db = readDB();

            // Encontra o link (de voz ou vídeo) que está em uso pelo usuário que enviou o comando
            const callInUse = [...db.voice, ...db.video].find(call => call.user === sender);

            if (!callInUse) {
                return await lux.sendMessage(from, { text: `*${pushName}*, você não possui nenhum portal de comunicação ativo para liberar.` }, { quoted: msg });
            }

            // Libera o link
            callInUse.inUse = false;
            callInUse.user = null;
            saveDB(db);

            await lux.sendMessage(from, { text: `✅ *PORTAL SELADO*\n\nObrigado, *${pushName}*. O portal de comunicação foi fechado e agora está disponível para outros guerreiros.` }, { quoted: msg });

        } catch (error) {
            console.error('Erro no comando !liberar-call:', error);
            await lux.sendMessage(from, { text: 'Mestre, o ritual para selar o portal falhou. Uma força desconhecida interveio.' }, { quoted: msg });
        }
    }
};
