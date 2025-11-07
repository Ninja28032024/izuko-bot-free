// Salvar como: commands/ver-advs.js
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'banco de dados', 'advertencias.json');

const lerAdvertenciasDB = () => {
    try {
        if (fs.existsSync(dbPath)) {
            return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
        }
    } catch (e) { console.error("Erro ao ler advertencias.json:", e); }
    return {};
};

module.exports = {
    name: 'ver-advs',
    aliases: ['checar-advs'],

    execute: async ({ lux, msg, from, isGroup, sender, areJidsSameUser }) => {
        if (!isGroup) {
            return await lux.sendMessage(from, { text: 'Este jutsu de consulta só funciona dentro de um clã (grupo).' }, { quoted: msg });
        }

        const groupMeta = await lux.groupMetadata(from);
        const senderIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, sender))?.admin;

        if (!senderIsAdmin) {
            return await lux.sendMessage(from, { text: 'Apenas generais podem consultar os registros de disciplina.' }, { quoted: msg });
        }

        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const mentions = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        let targetId = quoted ? msg.message.extendedTextMessage.contextInfo.participant : mentions?.[0];

        if (!targetId) {
            return await lux.sendMessage(from, { text: 'General, indique o guerreiro cujos registros você deseja consultar.' }, { quoted: msg });
        }

        const db = lerAdvertenciasDB();
        const totalAdvs = db[from]?.[targetId] || 0;
        const targetName = targetId.split('@')[0];

        await lux.sendMessage(from, {
            text: `📋 *REGISTRO DISCIPLINAR* 📋\n\nO guerreiro @${targetName} possui *${totalAdvs}* advertência(s) registrada(s) neste clã.`,
            mentions: [targetId]
        });
    }
};
