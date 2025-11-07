// commands/legendabv.js
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'banco de dados', 'bemvindo_config.json');

// Funções para ler e salvar no DB (reutilizadas para consistência)
function lerBemvindoDB() {
    if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, JSON.stringify({}));
        return {};
    }
    return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
}

function salvarBemvindoDB(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

module.exports = {
    name: 'legendabv',
    aliases: ['setwelcome'],
    execute: async ({ lux, from, msg, body, isGroup, sender, areJidsSameUser, settings }) => {
        if (!isGroup) {
            return await lux.sendMessage(from, { text: 'Mestre, este pergaminho só pode ser escrito em um clã (grupo).' }, { quoted: msg });
        }

        const groupMeta = await lux.groupMetadata(from);
        const senderIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, sender))?.admin;

        if (!senderIsAdmin) {
            return await lux.sendMessage(from, { text: 'Apenas os generais (admins) podem ditar as palavras de boas-vindas.' }, { quoted: msg });
        }

        const db = lerBemvindoDB();
        const grupoConfig = db[from];

        if (!grupoConfig || !grupoConfig.ativo) {
            return await lux.sendMessage(from, { text: 'O ritual de boas-vindas está desativado. Ative-o com `!bemvindo on` antes de definir a legenda.' }, { quoted: msg });
        }

        const novaLegenda = body.substring(body.indexOf(' ') + 1);
        if (!novaLegenda || novaLegenda.toLowerCase() === 'legendabv') {
            return await lux.sendMessage(from, { 
                text: `Mestre, Vossa Senhoria precisa escrever as palavras a serem proferidas.\n\n*Exemplo:*\n\`${settings.prefix}legendabv Salve, @user! Bem-vindo ao clã @grupo!\`\n\n*Placeholders disponíveis:*\n\`@user\` - Marca o novo membro.\n\`@grupo\` - Exibe o nome do clã.` 
            }, { quoted: msg });
        }

        db[from].legenda = novaLegenda;
        salvarBemvindoDB(db);

        const resposta = `📜 *LEGENDA DE BOAS-VINDAS ATUALIZADA!*\n\nAs novas palavras foram gravadas no pergaminho sagrado e serão proferidas a cada novo guerreiro que se juntar a nós.`;
        await lux.sendMessage(from, { text: resposta }, { quoted: msg });
    }
};
