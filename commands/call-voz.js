// commands/call-voz.js
const fs = require('fs' );
const path = require('path');

const dbPath = path.join(__dirname, '..', 'banco de dados', 'call_links.json');

// Funções auxiliares para ler e salvar o banco de dados
const readDB = () => JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
const saveDB = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

module.exports = {
    name: 'call-voz',
    aliases: ['callvoz', 'ligar-voz', 'voz'],
    execute: async ({ lux, from, msg, sender, pushName }) => {
        try {
            const db = readDB();

            // Verifica se o usuário já tem um link em uso (de voz ou vídeo)
            const userAlreadyInCall = [...db.voice, ...db.video].find(call => call.user === sender);
            if (userAlreadyInCall) {
                return await lux.sendMessage(from, { text: `Hmph. *${pushName}*, você já está com um portal de comunicação ativo. Libere-o com \`!liberar-call\` antes de abrir um novo.` }, { quoted: msg });
            }

            // Encontra o primeiro link de voz disponível
            const availableCall = db.voice.find(call => !call.inUse);

            if (!availableCall) {
                return await lux.sendMessage(from, { text: `*${pushName}*, todos os portais de voz estão ocupados no momento. Aguarde um guerreiro liberar o seu.` }, { quoted: msg });
            }

            // Marca o link como em uso e atribui ao usuário
            availableCall.inUse = true;
            availableCall.user = sender;
            saveDB(db);

            const response = `*PORTAL DE VOZ ABERTO* 🎙️\n\n*${pushName}*, sua trilha foi aberta. Use este portal para se comunicar.\n\n*Link:* ${availableCall.link}\n\nLembre-se de selar o portal com o comando \`!liberar-call\` ao terminar para que outros possam usá-lo.`;
            await lux.sendMessage(from, { text: response }, { quoted: msg });

        } catch (error) {
            console.error('Erro no comando !call-voz:', error);
            await lux.sendMessage(from, { text: 'Mestre, uma anomalia impediu a abertura do portal de voz. Verifique os pergaminhos (logs).' }, { quoted: msg });
        }
    }
};
