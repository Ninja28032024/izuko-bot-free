// Salvar como: commands/cara-coroa.js
const fs = require('fs');
const path = require('path');
const { lerDB, salvarDB } = require('../settings/lib/ranking-logic.js'); // Importa as funções robustas

const cooldownDbPath = path.join(__dirname, '..', '..', 'banco de dados', 'cooldown_cara-coroa.json');

// Funções de leitura e escrita para o COOLDOWN (que é um arquivo separado)
const lerCooldownDB = () => {
    if (!fs.existsSync(cooldownDbPath)) return {};
    return JSON.parse(fs.readFileSync(cooldownDbPath, 'utf-8'));
};
const salvarCooldownDB = (dados) => {
    // Garante que o diretório exista antes de salvar
    const dirPath = path.dirname(cooldownDbPath);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(cooldownDbPath, JSON.stringify(dados, null, 2));
};

const LIMITE_USOS = 20;
const COOLDOWN_HORAS = 12;

module.exports = {
    name: 'cara-coroa',
    usage: '!cara-coroa <cara|coroa>',

    execute: async ({ lux, msg, from, isGroup, sender, pushName, args }) => {
        if (!isGroup) {
            return await lux.sendMessage(from, { text: 'Guerreiro, o Jogo do Destino só pode ser jogado na arena de um clã.' }, { quoted: msg });
        }

        const agora = Date.now();
        const cooldownDb = lerCooldownDB();

        if (!cooldownDb[sender]) {
            cooldownDb[sender] = { usos: 0, expiraEm: 0 };
        }

        // Se o tempo de cooldown já passou, reseta os usos.
        if (agora > cooldownDb[sender].expiraEm) {
            cooldownDb[sender].usos = 0;
        }

        // 1. Validar aposta do usuário
        const aposta = args[0]?.toLowerCase();
        if (!aposta || (aposta !== 'cara' && aposta !== 'coroa')) {
            return await lux.sendMessage(from, { text: `❌ Guerreiro, você deve escolher um lado! Use: *!cara-coroa cara* ou *!cara-coroa coroa*.` }, { quoted: msg });
        }

        if (cooldownDb[sender].usos >= LIMITE_USOS) {
            const tempoRestanteMs = cooldownDb[sender].expiraEm - agora;
            const horas = Math.floor(tempoRestanteMs / 3600000);
            const minutos = Math.floor((tempoRestanteMs % 3600000) / 60000);
            return await lux.sendMessage(from, { text: `*${pushName}*, sua sorte por hoje se esgotou. Você atingiu o limite de ${LIMITE_USOS} tentativas. Aguarde ${horas}h e ${minutos}m para desafiar o destino novamente.` }, { quoted: msg });
        }

        const rankingDb = lerDB(); // Usa a função robusta do ranking-logic.js
        if (!rankingDb[from]) rankingDb[from] = { membros: {} };
        if (!rankingDb[from].membros[sender]) rankingDb[from].membros[sender] = { nome: pushName, nivel: 1, xp: 0, pontos: 0 };
        
        const membro = rankingDb[from].membros[sender];

        // Lógica do jogo: 50/50
        const lados = ['cara', 'coroa'];
        const resultado = lados[Math.floor(Math.random() * lados.length)];
        const ganhou = aposta === resultado;
        let resposta;

        if (ganhou) {
            membro.xp += 1; // Ganha 1 de XP
            resposta = `🪙 *VITÓRIA!* 🪙\n\n*${pushName}*, você apostou em *${aposta.toUpperCase()}* e a moeda caiu em *${resultado.toUpperCase()}*.\n\n*Recompensa:* +1 XP (equivalente a 200 Pontos na conversão).`;
        } else {
            membro.xp = Math.max(0, membro.xp - 1); // Perde 1 de XP, sem ficar negativo
            resposta = `🪙 *DERROTA!* 🪙\n\n*${pushName}*, você apostou em *${aposta.toUpperCase()}* mas a moeda caiu em *${resultado.toUpperCase()}*.\n\n*Punição:* -1 XP.`;
        }

        // Atualiza o cooldown
        cooldownDb[sender].usos++;
        // Se for o primeiro uso do ciclo, define o tempo de expiração.
        if (cooldownDb[sender].usos === 1) {
            cooldownDb[sender].expiraEm = agora + (COOLDOWN_HORAS * 60 * 60 * 1000);
        }
        
        const usosRestantes = LIMITE_USOS - cooldownDb[sender].usos;
        resposta += `\n\n*Tentativas restantes neste ciclo:* ${usosRestantes}/${LIMITE_USOS}`;

        // Salva ambos os bancos de dados
        salvarDB(rankingDb); // Usa a função robusta do ranking-logic.js
        salvarCooldownDB(cooldownDb);

        await lux.sendMessage(from, { text: resposta }, { quoted: msg });
    }
};
