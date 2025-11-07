// commands/alerta2.js
const { getGroupMetaData } = require('../settings/lib/group-utils'); // Assumindo que você tem uma função para obter metadados do grupo

// Caractere Zero Width Space (ZWSP) para criar a mensagem "invisível"
const ZWSP = String.fromCharCode(8203);

module.exports = {
    name: 'alerta2',
    aliases: [],
    description: 'Envia uma menção fantasma a todos os membros do grupo (apenas notificação).',
    usage: '<mensagem>',
    cooldown: 60,
    isGroup: true,
    isOwner: true, // Apenas o dono deve usar este comando

    async execute({ lux, msg, from, args }) {
        // Verificação de grupo mais robusta
        const isGroup = from.endsWith('@g.us');
        if (!isGroup) {
            return lux.sendMessage(from, { text: '❌ Este comando só pode ser usado em grupos.' }, { quoted: msg });
        }

        const messageText = args.join(' ').trim();
        if (!messageText) {
            return lux.sendMessage(from, { text: '❌ Por favor, forneça a mensagem que deseja enviar como alerta.' }, { quoted: msg });
        }

        await lux.sendMessage(from, { text: '⏳ Obtendo lista de membros do grupo...' }, { quoted: msg });

        try {
            // 1. Obter metadados do grupo para a lista de participantes
            // 1. Obter metadados do grupo para a lista de participantes
            // NOTA: A função getGroupMetaData é um placeholder, mas o lux.groupMetadata(from)
            // é o método Baileys correto para obter os metadados.
            const groupMetadata = await lux.groupMetadata(from);
            const participants = groupMetadata.participants;

            // 2. Extrair os JIDs de todos os participantes
            const mentionedJid = participants.map(p => p.id);

            // 3. Construir a mensagem fantasma
            // A mensagem será o ZWSP (invisível) seguido da mensagem real.
            // O ZWSP garante que o WhatsApp renderize a mensagem, mas o texto seja invisível.
            // A mensagem real é enviada como um texto normal, mas o que faz a menção é o array mentionedJid.
            // Para ser "fantasma" (invisível), o texto deve ser o ZWSP.
            const silentMessage = ZWSP + messageText;

            // 4. Enviar a mensagem
            await lux.sendMessage(from, {
                text: silentMessage,
                mentions: mentionedJid,
            });

            // 5. Confirmação (apenas para o dono do bot)
            await lux.sendMessage(from, { text: `✅ Alerta fantasma enviado com sucesso para ${participants.length} membros do grupo.` }, { quoted: msg });

        } catch (error) {
            console.error('Erro no comando alerta2:', error);
            await lux.sendMessage(from, { text: `❌ Ocorreu um erro ao enviar o alerta: ${error.message}` }, { quoted: msg });
        }
    }
};
