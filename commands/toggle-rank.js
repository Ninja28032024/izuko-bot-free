const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '..', 'banco de dados', 'grupos_config.json');

// Função auxiliar para ler a configuração
function lerConfig() {
    if (!fs.existsSync(configPath)) {
        // Se o arquivo não existe, cria com uma estrutura vazia
        fs.writeFileSync(configPath, JSON.stringify({ rankingDesativado: [] }, null, 2));
        return { rankingDesativado: [] };
    }
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
}

// Função auxiliar para salvar a configuração
function salvarConfig(config) {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

module.exports = {
    name: 'toggle-rank',
    aliases: ['togglerank', 'ligar-rank', 'desligar-rank'],
    execute: async ({ lux, from, msg, isGroup, sender, areJidsSameUser }) => {
        if (!isGroup) {
            return await lux.sendMessage(from, { text: 'Mestre, este comando só funciona em grupos.' }, { quoted: msg });
        }

        // 1. VERIFICAR SE O USUÁRIO É ADMIN
        const groupMeta = await lux.groupMetadata(from);
        const senderIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, sender))?.admin;

        if (!senderIsAdmin) {
            return await lux.sendMessage(from, { text: '❌ Apenas administradores podem alterar as regras do ranking neste clã.' }, { quoted: msg });
        }

        // 2. LER A CONFIGURAÇÃO ATUAL
        const config = lerConfig();
        const isDesativado = config.rankingDesativado.includes(from);

        // 3. ALTERNAR O ESTADO
        if (isDesativado) {
            // Se está desativado, vamos ativar (remover da lista)
            config.rankingDesativado = config.rankingDesativado.filter(id => id !== from);
            salvarConfig(config);
            await lux.sendMessage(from, { text: '✅ *SISTEMA DE RANKING ATIVADO!*\n\nA contagem de poder foi restaurada neste grupo.' }, { quoted: msg });
        } else {
            // Se está ativo, vamos desativar (adicionar à lista)
            config.rankingDesativado.push(from);
            salvarConfig(config);
            await lux.sendMessage(from, { text: '❌ *SISTEMA DE RANKING DESATIVADO!*\n\nA contagem de poder foi suspensa neste grupo.' }, { quoted: msg });
        }
    }
};
