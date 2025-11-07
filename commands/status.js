// commands/status.js
const fs = require('fs');
const path = require('path');

// Função auxiliar para ler um arquivo JSON de configuração de forma segura.
const lerConfig = (nomeArquivo) => {
    const dbPath = path.join(__dirname, '..', 'banco de dados', nomeArquivo);
    if (!fs.existsSync(dbPath)) return {};
    try {
        return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    } catch (e) {
        return {};
    }
};

// Função para verificar o status de um comando específico para o grupo atual.
const getStatus = (config, groupId) => {
    return config[groupId] ? '✅ *ATIVADO*' : '❌ *DESATIVADO*';
};

module.exports = {
    name: 'status',
    aliases: [],
    execute: async ({ lux, from, msg, isGroup, sender, areJidsSameUser }) => {
        if (!isGroup) {
            return await lux.sendMessage(from, { text: 'Mestre, este relatório de inteligência só pode ser revelado dentro de um clã (grupo).' }, { quoted: msg });
        }

        const groupMeta = await lux.groupMetadata(from);
        const senderIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, sender))?.admin;

        if (!senderIsAdmin) {
            return await lux.sendMessage(from, { text: 'Apenas os generais (admins) deste clã podem solicitar um relatório de estado das defesas.' }, { quoted: msg });
        }

        // --- Coleta de Dados de Status ---

        // Comandos Anti-Link
        const antiLink1Status = getStatus(lerConfig('antilink.json'), from);
        const antiLink2Status = getStatus(lerConfig('antilink2.json'), from);
        const antiLink3Status = getStatus(lerConfig('antilink3.json'), from);
        const antiLink4Status = getStatus(lerConfig('antilink4.json'), from);
        const antiLink5Status = getStatus(lerConfig('antilink5.json'), from);

        // Comando Toggle-Rank
        const rankConfig = lerConfig('grupos_config.json');
        const isRankDesativado = rankConfig.rankingDesativado?.includes(from);
        const rankStatus = isRankDesativado ? '❌ *DESATIVADO*' : '✅ *ATIVADO*';

        // Comandos Anti-Privado (Configuração Global)
        const antiPvConfig = lerConfig('antipv_config.json');
        const antiPv1Status = antiPvConfig.nivel === 1 ? '✅ *ATIVADO*' : '❌ *DESATIVADO*';
        const antiPv2Status = antiPvConfig.nivel === 2 ? '✅ *ATIVADO*' : '❌ *DESATIVADO*';
        const antiPv3Status = antiPvConfig.nivel === 3 ? '✅ *ATIVADO*' : '❌ *DESATIVADO*';
        // Se nenhum estiver ativo, todos são 'DESATIVADO'
        const antiPvGeral = (antiPvConfig.nivel === 1 || antiPvConfig.nivel === 2 || antiPvConfig.nivel === 3) ? '' : ' (Nenhum protocolo ativo)';


        // --- Montagem da Mensagem de Resposta ---
        const resposta = `
📜 *RELATÓRIO DE INTELIGÊNCIA DO CLÃ* 📜

Saudações, General. Inspecionei as defesas e sistemas deste clã. A seguir, o estado individual de cada lei e protocolo que pode ser ativado ou desativado.

🛡️ *--- LEIS DE CONTROLE DE LINKS ---*
*!antilink (Nível 1):* ${antiLink1Status}
*!antilink2 (Nível 2):* ${antiLink2Status}
*!antilink3 (Nível 3):* ${antiLink3Status}
*!antilink4 (Nível 4):* ${antiLink4Status}
*!antilink5 (Nível 5):* ${antiLink5Status}

⚔️ *--- SISTEMA DE HONRA E PODER ---*
*!toggle-rank (Ranking):* ${rankStatus}

🔒 *--- DEFESAS DO QUARTEL-GENERAL (ANTI-PV) ---*
*(Configuração Global)*${antiPvGeral}
*!antipv (Nível 1 - Bloqueio):* ${antiPv1Status}
*!antipv2 (Nível 2 - Aviso):* ${antiPv2Status}
*!antipv3 (Nível 3 - Silêncio):* ${antiPv3Status}

Use este conhecimento para guiar suas próximas ordens. A vigilância é a chave para a vitória.
        `.trim();

        await lux.sendMessage(from, { text: resposta }, { quoted: msg });
    }
};
