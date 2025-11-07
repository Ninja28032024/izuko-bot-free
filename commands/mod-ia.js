// commands/mod-ia.js
const { downloadContentFromMessage, getContentType } = require('@whiskeysockets/baileys');
const axios = require('axios');
const FormData = require('form-data');

// Função para fazer o upload para o Catbox.moe
async function uploadToCatbox(buffer) {
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    form.append('userhash', '');
    form.append('fileToUpload', buffer, {
        filename: `izuko-mod-ia-${Date.now()}.jpeg`,
    });

    try {
        const response = await axios.post('https://catbox.moe/user/api.php', form, {
            headers: { ...form.getHeaders( ) }
        });
        return response.data;
    } catch (error) {
        throw new Error(`A comunicação com os servidores do Catbox.moe falhou: ${error.message}`);
    }
}

module.exports = {
    name: 'mod-ia',
    aliases: ['ia-mod'],
    execute: async ({ lux, from, msg, args }) => {
        const prompt = args.join(' ');
        let mediaMessage;

        // Verifica se a mensagem é uma resposta a uma imagem
        const quoted = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;
        if (quoted && getContentType(quoted) === 'imageMessage') {
            mediaMessage = quoted.imageMessage;
        } else {
            return await lux.sendMessage(from, { text: 'Mestre, para que eu possa invocar a Inteligência Arcana, Vossa Senhoria precisa responder a uma imagem com este comando, seguido de sua ordem (prompt).' }, { quoted: msg });
        }

        if (!prompt) {
            return await lux.sendMessage(from, { text: 'Mestre, preciso de suas ordens. Diga-me como devo modificar a imagem após o comando.' }, { quoted: msg });
        }

        await lux.sendMessage(from, { text: 'Recebendo sua ordem... Invocando a Inteligência Arcana para remodelar a realidade. Aguarde...' }, { quoted: msg });

        try {
            // 1. Faz o download da imagem
            const stream = await downloadContentFromMessage(mediaMessage, 'image');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }

            // 2. Faz o upload da imagem para o Catbox.moe
            const imageUrl = await uploadToCatbox(buffer);

            // 3. Constrói a URL da API de modificação
            const apiUrl = `https://systemzone.store/api/gemini/nano-banana?prompt=${encodeURIComponent(prompt )}&imageUrl=${encodeURIComponent(imageUrl)}`;

            // 4. Chama a API
            const response = await axios.get(apiUrl);
            const data = response.data;

            if (!data || data.status !== true || !data.imagem) {
                throw new Error(data.mensagem || 'A API não retornou um resultado válido.');
            }

            // 5. Envia a imagem modificada com a legenda personalizada
            const caption = `*ORDEM EXECUTADA* 🎨\n\nMestre, a Inteligência Arcana obedeceu ao seu comando e remodelou a imagem conforme sua vontade.\n\n*Seu Decreto (Prompt):* \`\`\`${prompt}\`\`\``;

            await lux.sendMessage(from, {
                image: { url: data.imagem },
                caption: caption
            }, { quoted: msg });

        } catch (error) {
            console.error("Erro no comando !mod-ia:", error);
            await lux.sendMessage(from, { text: `Mestre, a invocação da IA falhou. A energia arcana está instável.\n\n*Motivo:* ${error.message}` }, { quoted: msg });
        }
    }
};
