// escanear/scanner.js (versão aprimorada)
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone'); // Biblioteca de tempo

async function vigiarEntradaDeMembros(lux, update) {
    const { id, participants, action } = update;
    
    const bemvindoDBPath = path.join(__dirname, '..', 'banco de dados', 'bemvindo_config.json');
    if (!fs.existsSync(bemvindoDBPath)) return;

    try {
        const db = JSON.parse(fs.readFileSync(bemvindoDBPath, 'utf-8'));
        const grupoConfig = db[id];

        if (!grupoConfig || !grupoConfig.ativo) return;

        if (action === 'add') {
            const groupMeta = await lux.groupMetadata(id);
            const nomeGrupo = groupMeta.subject;
            const descGrupo = groupMeta.desc?.toString() || 'Sem descrição';
            const totalMembros = groupMeta.participants.length;

            // --- INÍCIO DAS NOVAS VARIÁVEIS ---
            const agora = moment().tz('America/Sao_Paulo');
            const hora = agora.format('HH:mm');
            const data = agora.format('DD/MM/YYYY');
            const dia = agora.format('dddd'); // 'dddd' para o nome completo do dia

            for (const participant of participants) {
                let profilePicUrl;
                try {
                    profilePicUrl = await lux.profilePictureUrl(participant, 'image');
                } catch {
                    profilePicUrl = 'https://files.catbox.moe/n33hp2.jpeg'; // Imagem padrão
                }

                const numeroUser = participant.split('@' )[0];

                // --- SUBSTITUIÇÃO DE TODAS AS VARIÁVEIS ---
                const legendaFinal = grupoConfig.legenda
                    .replace(/@user/g, `@${numeroUser}`)
                    .replace(/@grupo/g, nomeGrupo)
                    .replace(/@hora/g, hora)
                    .replace(/@data/g, data)
                    .replace(/@dia/g, dia)
                    .replace(/@numerouser/g, numeroUser)
                    .replace(/@lid/g, participant)
                    .replace(/@desc/g, descGrupo)
                    .replace(/@membros/g, totalMembros);

                await lux.sendMessage(id, {
                    image: { url: profilePicUrl },
                    caption: legendaFinal,
                    mentions: [participant]
                });
            }
        }
    } catch (error) {
        if (!error.message?.includes('rate-overlimit')) {
            console.error(chalk.red("[Boas-Vindas] Erro ao saudar novo membro:"), error);
        }
    }
}

module.exports = { vigiarEntradaDeMembros };
