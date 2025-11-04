// commands/sortear.js
const { getSorteio, setSorteio, removerSorteio, gerarChaveAcesso, agendarFinalizacao } = require('../settings/lib/sorteio-logic.js');
const { getContagem, isRankingAtivo } = require('../settings/lib/msg-ranking-logic.js');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const moment = require('moment-timezone');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const sleep = promisify(setTimeout);

// --- CONFIGURAÇÃO ---
const TIMEZONE = 'America/Sao_Paulo';
const MIN_MESSAGES = 30; // Mínimo de mensagens para participar do sorteio

// --- FUNÇÕES DE UTILIDADE ---

/**
 * Converte um stream em um buffer.
 * @param {stream.Readable} stream - O stream a ser convertido.
 * @returns {Promise<Buffer>} O buffer resultante.
 */
const streamToBuffer = (stream) => new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
});

/**
 * Analisa o argumento do comando para extrair o prêmio e a duração.
 * @param {string[]} args - Argumentos do comando.
 * @returns {{premio: string, duracao: string, tempoEmMs: number, erro: string | null}}
 */
function parseArgs(args) {
    const fullArg = args.join(' ');
    const partes = fullArg.split('|').map(p => p.trim());

    if (partes.length !== 2) {
        return { premio: '', duracao: '', tempoEmMs: 0, erro: 'Formato incorreto. Use: !sortear <Prêmio> | <Duração (ex: 1h, 30m)>' };
    }

    const [premio, duracaoStr] = partes;
    const match = duracaoStr.match(/^(\d+)([hm])$/i);

    if (!match) {
        return { premio: '', duracao: '', tempoEmMs: 0, erro: 'Duração inválida. Use: 1h (1 hora) ou 30m (30 minutos).' };
    }

    const valor = parseInt(match[1]);
    const unidade = match[2].toLowerCase();
    let tempoEmMs = 0;

    if (unidade === 'h') {
        tempoEmMs = valor * 60 * 60 * 1000;
    } else if (unidade === 'm') {
        tempoEmMs = valor * 60 * 1000;
    }

    if (tempoEmMs < 60000) { // Mínimo de 1 minuto
        return { premio: '', duracao: '', tempoEmMs: 0, erro: 'A duração mínima para o sorteio é de 1 minuto.' };
    }

    return { premio, duracao: duracaoStr, tempoEmMs, erro: null };
}

/**
 * Filtra os participantes do grupo que enviaram pelo menos MIN_MESSAGES no dia.
 * @param {object} groupMeta - Metadados do grupo.
 * @returns {string[]} Array de JIDs dos participantes ativos.
 */
function getParticipantesAtivos(groupMeta, groupId) {
    const participantesAtivos = groupMeta.participants
        .map(p => p.id)
        .filter(jid => getContagem(groupId, jid) >= MIN_MESSAGES);
        
    return participantesAtivos;
}

/**
 * Monta a mensagem final do evento com todos os dados.
 * @param {object} sorteioData - Os dados do sorteio.
 * @param {object} groupMeta - Metadados do grupo.
 * @returns {string} A mensagem final.
 */
function montarMensagemFinal(sorteioData, groupMeta, from) {
    const dataEncerramento = moment(sorteioData.dataEncerramento).tz(TIMEZONE);
  const participantesAtivos = getParticipantesAtivos(groupMeta, from);
    
    // Dados de Data e Clima
    const diaSemana = dataEncerramento.format('dddd').charAt(0).toUpperCase() + dataEncerramento.format('dddd').slice(1);
    const horaExata = dataEncerramento.format('HH:mm:ss');
    const dataExata = dataEncerramento.format('DD/MM/YYYY');
    
    // Simulação de Estação do Ano (Hemisfério Sul)
    const mes = dataEncerramento.month() + 1;
    let estacao = '';
    if (mes >= 12 || mes <= 2) estacao = 'Verão';
    else if (mes >= 3 && mes <= 5) estacao = 'Outono';
    else if (mes >= 6 && mes <= 8) estacao = 'Inverno';
    else estacao = 'Primavera';

    const listaParticipantes = participantesAtivos
        .map(jid => `@${jid.split('@')[0]}`)
        .join('\n');

    return `
🎉 *SORTEIO ATIVO - ${sorteioData.premio.toUpperCase()}* 🎉

*Prêmio:* ${sorteioData.premio}
*Encerramento:* ${sorteioData.duracao}

*Dados do Evento:*
📅 *Dia da Semana:* ${diaSemana}
⏰ *Hora Exata (Brasília):* ${horaExata}
🗓️ *Data Exata:* ${dataExata}
❄️ *Estação:* ${estacao}

*Regras de Participação:*
- Apenas membros com *${MIN_MESSAGES}* ou mais mensagens no dia serão incluídos.
- *Chave de Acesso:* \`${sorteioData.chaveAcesso}\` (Guarde-a! Será solicitada ao vencedor)

*Participantes Ativos (${participantesAtivos.length}):*
${listaParticipantes}

_Boa sorte, seus sortudos! Izuko estará observando..._
`.trim();
}

const mensagensSarcasticas = [
    "Atenção, rebanho! O Mestre iniciou um sorteio. Sinceramente, duvido que algum de vocês tenha sorte o suficiente para ganhar.",
    "O prêmio é *${premio}* em *${duracao}*. Se você não for ativo o suficiente, nem perca seu tempo. Volte a ser irrelevante.",
    "Será mesmo que alguém *competente* terá a sorte de ganhar? Eu acho que não, kkk. Mas tentem, talvez o universo se compadeça.",
    "Estou filtrando os parasitas. Apenas os *ativos* serão considerados. Se você só manda 'bom dia', pode voltar a dormir.",
    "Preparando a lista de participantes. Se seu nome não aparecer, a culpa é da sua inatividade. Não me culpe, culpe sua preguiça.",
    "Quase pronto. Lembrem-se: o prêmio só será entregue se o Mestre for capaz de me fornecer o arquivo. Se não, é só um sonho molhado."
];

/**
 * Envia e edita a mensagem do sorteio com sarcasmo.
 * @param {object} lux - O socket do Baileys.
 * @param {string} from - O JID do grupo.
 * @param {object} sorteioData - Os dados do sorteio.
 * @param {object} groupMeta - Metadados do grupo.
 */
async function iniciarMensagemSarcástica(lux, from, sorteioData, groupMeta) {
    let mensagem = `🎉 *SORTEIO INICIADO!* ${sorteioData.premio} em ${sorteioData.duracao}. Preparando a mensagem sarcástica...`;
    
    // Envia a mensagem inicial e salva o ID
    let sentMsg = await lux.sendMessage(from, { text: mensagem });
    sorteioData.msgID = sentMsg.key.id;
    setSorteio(from, sorteioData);

    for (let i = 0; i < mensagensSarcasticas.length; i++) {
        await sleep(2000); // Espera 2 segundos entre as edições
        
        let textoEditado = mensagensSarcasticas[i]
            .replace(/\$\{premio\}/g, sorteioData.premio)
            .replace(/\$\{duracao\}/g, sorteioData.duracao);

        await lux.sendMessage(from, { text: textoEditado, edit: sentMsg.key });
    }
    
    // 5. Montar e enviar a mensagem final com a lista de participantes e a Chave
    const mensagemFinal = montarMensagemFinal(sorteioData, groupMeta, from);
    await lux.sendMessage(from, { text: mensagemFinal, edit: sentMsg.key, mentions: getParticipantesAtivos(groupMeta, from) });
    
    // 6. Atualizar o estado do sorteio com a lista final de participantes
    sorteioData.participantes = getParticipantesAtivos(groupMeta, from);
    setSorteio(from, sorteioData);
}

// --- LÓGICA PRINCIPAL DO COMANDO ---

module.exports = {
    name: 'sortear',
    aliases: ['sorteio'],
    description: 'Inicia um sorteio interativo e sarcástico no grupo.',
    usage: '!sortear <Prêmio> | <Duração (ex: 1h, 30m)>',
    isGroup: true,
    isAdmin: true,

    async execute({ lux, msg, from, args, isGroup, sender, areJidsSameUser, quotedMsg }) {
        if (!isGroup) {
            return await lux.sendMessage(from, { text: 'Mestre, este comando só pode ser usado em grupos.' }, { quoted: msg });
        }

        const groupMeta = await lux.groupMetadata(from);
        const senderIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, sender))?.admin;

        if (!senderIsAdmin) {
            return await lux.sendMessage(from, { text: 'Mestre, apenas administradores podem iniciar um sorteio.' }, { quoted: msg });
        }

        if (getSorteio(from)) {
            return await lux.sendMessage(from, { text: '❌ Já existe um sorteio ativo neste grupo. Finalize-o antes de iniciar um novo.' }, { quoted: msg });
        }

        const { premio, duracao, tempoEmMs, erro } = parseArgs(args);

        if (erro) {
            return await lux.sendMessage(from, { text: `❌ Erro: ${erro}\n\nExemplo de uso: !sortear Geladeira Duplex com freezer em cima | 1h` }, { quoted: msg });
        }

        if (!isRankingAtivo(from)) {
            return await lux.sendMessage(from, { text: '❌ O sistema de ranking de mensagens não está ativo neste grupo. Use *!msg-ranking* para ativá-lo antes de iniciar um sorteio.' }, { quoted: msg });
        }

        // 1. Lógica de Mídia (Prêmio)
        let premioMidia = null;
        let premioMidiaPath = null;
        let premioMidiaMime = null;

        if (quotedMsg && (quotedMsg.imageMessage || quotedMsg.videoMessage)) {
            const type = quotedMsg.imageMessage ? 'image' : 'video';
            premioMidiaMime = quotedMsg.imageMessage ? quotedMsg.imageMessage.mimetype : quotedMsg.videoMessage.mimetype;
            
            // Baixar a mídia e salvar temporariamente
            const stream = await downloadContentFromMessage(quotedMsg[type + 'Message'], type);
            const buffer = await streamToBuffer(stream);
            
            // Usar o ID da mensagem como nome de arquivo temporário
            premioMidiaPath = path.join('/tmp', `${msg.key.id}.${type === 'image' ? 'jpg' : 'mp4'}`);
            fs.writeFileSync(premioMidiaPath, buffer);
            
            premioMidia = {
                type: type,
                path: premioMidiaPath,
                mimetype: premioMidiaMime,
                isViewOnce: quotedMsg[type + 'Message'].viewOnce
            };
        }

        // 2. Interação com o Mestre sobre a entrega (apenas se não houver mídia marcada)
        let isEntregaAutomatica = !!premioMidia; // Se marcou mídia, a entrega é automática

        if (!premioMidia) {
            // Se não marcou mídia, pergunta ao Mestre se ele vai fornecer o arquivo
            const pergunta = `Mestre, este sorteio (*${premio}*) é algo pela qual eu posso entregar (foto, vídeo, documento, link, etc.)? Responda *sim* ou *não* no meu privado.`;
            await lux.sendMessage(sender, { text: pergunta });
            
            // NOTA: A resposta do Mestre será tratada no main.js, que chamará uma função de callback.
            // Por enquanto, assumimos que o Mestre responderá e o estado será atualizado.
            // Para simplificar a implementação no comando, vamos assumir 'não' por padrão se não houver mídia.
            isEntregaAutomatica = false;
        }

        // 3. Gerar Chave e Salvar Estado Inicial
        const chaveAcesso = gerarChaveAcesso();
        const dataEncerramento = Date.now() + tempoEmMs;

        const novoSorteio = {
            ativo: true,
            premio: premio,
            duracao: duracao,
            dataEncerramento: dataEncerramento,
            chaveAcesso: chaveAcesso,
            adminJID: sender,
            msgID: null, // ID da mensagem do evento (para edição)
            participantes: [], // JIDs dos participantes ativos
            midia: premioMidia, // Dados da mídia (se houver)
            entregaAutomatica: isEntregaAutomatica // Se o bot entregará o prêmio
        };

        setSorteio(from, novoSorteio);

        // 4. Iniciar a Mensagem Sarcástica
        await iniciarMensagemSarcástica(lux, from, novoSorteio, groupMeta);

        // 5. Agendar a finalização do sorteio
        agendarFinalizacao(lux, from, novoSorteio.dataEncerramento);
    }
};
