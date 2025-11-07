// Salvar como: commands/anti-link2.js
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'banco de dados', 'antilink_config_2.json');

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
    name: 'anti-link2',
    aliases: ['antilink2'],
    execute: async ({ lux, from, msg, isGroup, sender, areJidsSameUser }) => {
        if (!isGroup) return await lux.sendMessage(from, { text: 'Mestre, este decreto só pode ser proclamado em grupos.' }, { quoted: msg });

        const groupMeta = await lux.groupMetadata(from);
        const senderIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, sender))?.admin;
        if (!senderIsAdmin) return await lux.sendMessage(from, { text: 'Mestre, apenas os generais (admins) podem decretar a lei marcial.' }, { quoted: msg });

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
            ? '🚨 *LEI MARCIAL ATIVADA!* 🚨\nMestre, o protocolo Anti-Link (Nível 2: Banir) foi ativado.'
            : '✅ *LEI MARCIAL DESATIVADA!* ✅\nMestre, o protocolo Anti-Link (Nível 2: Banir) foi desativado.';

        await lux.sendMessage(from, { text: mensagem }, { quoted: msg });
    }
};
