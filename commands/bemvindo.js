// commands/bemvindo.js
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'banco de dados', 'bemvindo_config.json');

// Função para ler o banco de dados de boas-vindas
function lerBemvindoDB() {
    if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, JSON.stringify({}));
        return {};
    }
    return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
}

// Função para salvar no banco de dados
function salvarBemvindoDB(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

module.exports = {
    name: 'bemvindo',
    aliases: ['welcome'],
    execute: async ({ lux, from, msg, args, isGroup, sender, areJidsSameUser }) => {
        if (!isGroup) {
            return await lux.sendMessage(from, { text: 'Mestre, este decreto só pode ser proclamado em um clã (grupo).' }, { quoted: msg });
        }

        const groupMeta = await lux.groupMetadata(from);
        const senderIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, sender))?.admin;

        if (!senderIsAdmin) {
            return await lux.sendMessage(from, { text: 'Apenas os generais (admins) podem alterar o ritual de boas-vindas.' }, { quoted: msg });
        }

        const db = lerBemvindoDB();
        const option = args[0]?.toLowerCase();

        if (option !== 'on' && option !== 'off') {
            return await lux.sendMessage(from, { text: 'Mestre, decrete sua vontade. Use `!bemvindo on` para ativar ou `!bemvindo off` para desativar o ritual.' }, { quoted: msg });
        }

        // Garante que a configuração do grupo exista
        if (!db[from]) {
            db[from] = { 
                ativo: false, 
                legenda: 'Honra e glória, @user! Sua jornada no clã @grupo começa agora. Que sua lâmina permaneça afiada.' 
            };
        }

        const isAtivando = option === 'on';
        db[from].ativo = isAtivando;
        salvarBemvindoDB(db);

        const mensagem = isAtivando
            ? '✅ *RITUAL DE BOAS-VINDAS ATIVADO!*\n\nOs novos guerreiros serão saudados com honra e poder.'
            : '❌ *RITUAL DE BOAS-VINDAS DESATIVADO!*\n\nOs novos guerreiros entrarão em silêncio.';

        await lux.sendMessage(from, { text: mensagem }, { quoted: msg });
    }
};
