// Salvar como: commands/mute3.js
const fs = require('fs');
const path = require('path');
const { verificarCooldown, iniciarCooldown } = require('../settings/lib/cooldown_control.js'); // NOVO: Importa o selo

const dbPath = path.join(__dirname, '..', 'banco de dados', 'sistemas_mute.json');

const lerMuteDB = () => {
    if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, JSON.stringify({}));
        return {};
    }
    return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
};

const salvarMuteDB = (data) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

module.exports = {
    name: 'mute3',
    aliases: ['silenciar3'],
    
    execute: async ({ lux, msg, from, isGroup, sender, args, areJidsSameUser, settings }) => {
        if (!isGroup) return;

        const groupMeta = await lux.groupMetadata(from);
        const senderIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, sender))?.admin;
        const botIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, settings.botLid))?.admin;
        const isSenderOwner = areJidsSameUser(sender, settings.ownerNumber);

        if (!senderIsAdmin) return await lux.sendMessage(from, { text: 'Apenas generais podem invocar este jutsu.' }, { quoted: msg });
        if (!botIsAdmin) return await lux.sendMessage(from, { text: 'Não tenho poder para executar esta ordem neste clã. Meus jutsus estão selados.' }, { quoted: msg });

        // --- NOVO: VERIFICAÇÃO DO SELO DE DELIBERAÇÃO ---
        if (!isSenderOwner) {
            const cooldown = verificarCooldown(sender, 'mute');
            if (!cooldown.podeUsar) {
                return await lux.sendMessage(from, { text: `⏳ *JUTSU EM RECARGA* ⏳\n\nGeneral, seu poder de silenciamento precisa de tempo para se restaurar. Aguarde *${cooldown.tempoRestante}* para invocar este jutsu novamente.` }, { quoted: msg });
            }
        }
        // --- FIM DA VERIFICAÇÃO ---

        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const mentions = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        let targetId = quoted ? msg.message.extendedTextMessage.contextInfo.participant : mentions?.[0];
        if (!targetId) {
            const commandParts = msg.message?.conversation?.split(' ') || msg.message?.extendedTextMessage?.text?.split(' ');
            targetId = commandParts.length > 1 ? commandParts[1].replace('@', '') + '@s.whatsapp.net' : null;
        }
        if (!targetId) return await lux.sendMessage(from, { text: 'Mestre, indique o alvo do jutsu.' }, { quoted: msg });
        
        const isTargetOwner = areJidsSameUser(targetId, settings.ownerNumber);
        if (isTargetOwner) return await lux.sendMessage(from, { text: '🛡️ *SELO DE IMUNIDADE ATIVADO* 🛡️\n\nInvocação negada. É uma heresia tentar silenciar o Mestre Supremo.' }, { quoted: msg });
        
        const targetIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, targetId))?.admin;
        if (targetIsAdmin) return await lux.sendMessage(from, { text: 'Não posso silenciar outro general.' }, { quoted: msg });

        const limite = parseInt(args.find(arg => !isNaN(parseInt(arg)))) || 8; 

        const db = lerMuteDB();
        if (!db[from]) db[from] = {};
        db[from][targetId] = { tipo: 3, infracoes: 0, limite: limite };
        salvarMuteDB(db);

        // --- NOVO: INICIA O COOLDOWN PARA O GENERAL ---
        if (!isSenderOwner) {
            iniciarCooldown(sender, 'mute');
        }
        // --- FIM DA INICIAÇÃO ---

        await lux.sendMessage(from, { 
            text: `⚖️ *JUTSU DE ADVERTÊNCIA E SILÊNCIO* ⚖️\n\nO guerreiro @${targetId.split('@')[0]} foi silenciado e está sob observação. Ele tem *${limite}* chances antes de ser exilado por insubordinação.`, 
            mentions: [targetId] 
        });
    }
};
