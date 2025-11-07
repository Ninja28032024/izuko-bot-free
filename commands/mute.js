// Salvar como: commands/mute.js
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
    name: 'mute',
    aliases: ['silenciar'],
    
    execute: async ({ lux, msg, from, isGroup, sender, args, areJidsSameUser, settings }) => {
        if (!isGroup) return await lux.sendMessage(from, { text: 'Mestre, este jutsu só pode ser invocado na arena de um clã (grupo).' }, { quoted: msg });

        const groupMeta = await lux.groupMetadata(from);
        const senderIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, sender))?.admin;
        const botIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, settings.botLid))?.admin;
        const isSenderOwner = areJidsSameUser(sender, settings.ownerNumber);

        if (!senderIsAdmin) return await lux.sendMessage(from, { text: 'Apenas os generais (admins) podem invocar o jutsu de silenciamento.' }, { quoted: msg });
        if (!botIsAdmin) return await lux.sendMessage(from, { text: 'Mestre, não possuo a patente de general neste clã. Meus jutsus de controle estão selados.' }, { quoted: msg });

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
        if (!targetId) return await lux.sendMessage(from, { text: 'Mestre, Vossa Senhoria precisa me indicar o alvo.' }, { quoted: msg });
        
        const isTargetOwner = areJidsSameUser(targetId, settings.ownerNumber);
        if (isTargetOwner) return await lux.sendMessage(from, { text: '🛡️ *SELO DE IMUNIDADE ATIVADO* 🛡️\n\nInvocação negada. A voz do Mestre Supremo é absoluta e não pode ser silenciada.' }, { quoted: msg });

        const targetIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, targetId))?.admin;
        if (targetIsAdmin) return await lux.sendMessage(from, { text: 'Não posso usar este jutsu contra um general. A hierarquia do clã é sagrada.' }, { quoted: msg });

        const tempo = parseInt(args.find(arg => !isNaN(parseInt(arg))));
        const unidade = args.find(arg => arg === 's' || arg === 'm');
        if (!tempo || !unidade) return await lux.sendMessage(from, { text: 'Sintaxe do jutsu incorreta, Mestre.\n\n*Uso correto:* `!mute @alvo <tempo> <s/m>`' }, { quoted: msg });

        const agora = Date.now();
        const duracaoMs = unidade === 's' ? tempo * 1000 : tempo * 60 * 1000;
        const expiraEm = agora + duracaoMs;

        const db = lerMuteDB();
        if (!db[from]) db[from] = {};
        db[from][targetId] = { tipo: 1, expiraEm: expiraEm };
        salvarMuteDB(db);

        // --- NOVO: INICIA O COOLDOWN PARA O GENERAL ---
        if (!isSenderOwner) {
            iniciarCooldown(sender, 'mute');
        }
        // --- FIM DA INICIAÇÃO ---

        const unidadeTexto = unidade === 's' ? 'segundos' : 'minutos';
        await lux.sendMessage(from, { 
            text: `⚔️ *JUTSU DE SILÊNCIO TEMPORÁRIO* ⚔️\n\nO guerreiro @${targetId.split('@')[0]} foi silenciado por ordem de um general. Sua voz será ignorada por *${tempo} ${unidadeTexto}*.`, 
            mentions: [targetId] 
        });
    }
};
