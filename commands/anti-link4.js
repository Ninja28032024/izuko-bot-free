// Salvar como: commands/anti-link4.js
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'banco de dados', 'antilink_config_4.json');

function lerDB() {
    if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, JSON.stringify({ gruposAtivos: [] }));
        return { gruposAtivos: [] };
    }
    return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
}

function salvarDB(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

module.exports = {
    name: 'anti-link4',
    aliases: ['antilink4'],
    execute: async ({ lux, from, msg, isGroup, sender, areJidsSameUser }) => {
        if (!isGroup) return await lux.sendMessage(from, { text: 'Mestre, este decreto só pode ser proclamado em grupos.' }, { quoted: msg });

        const groupMeta = await lux.groupMetadata(from);
        const senderIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, sender))?.admin;
        if (!senderIsAdmin) return await lux.sendMessage(from, { text: 'Mestre, apenas os generais (admins) podem decretar o Ritual de Exílio.' }, { quoted: msg });

        const db = lerDB();
        const grupoId = from;
        const index = db.gruposAtivos.indexOf(grupoId);
        let novoEstado;

        if (index === -1) {
            db.gruposAtivos.push(grupoId);
            novoEstado = true;
        } else {
            db.gruposAtivos.splice(index, 1);
            novoEstado = false;
        }
        
        salvarDB(db);

        const mensagem = novoEstado
            ? '☠️ *RITUAL DE EXÍLIO ATIVADO!* ☠️\nMestre, o protocolo Anti-Link (Nível 4: Ritual de Banimento) foi ativado.'
            : '✅ *RITUAL DE EXÍLIO DESATIVADO!* ✅\nMestre, o protocolo Anti-Link (Nível 4) foi desativado.';

        await lux.sendMessage(from, { text: mensagem }, { quoted: msg });
    }
};
