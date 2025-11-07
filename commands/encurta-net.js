// commands/encurta-net.js
const axios = require('axios');

module.exports = {
    name: 'encurta-net',
    aliases: ['encurtar', 'shorten'],
    description: 'Encurta uma URL usando a API do encurtador.dev.',
    usage: '<link_a_encurtar>',
    cooldown: 5,
    isOwner: false,

    async execute({ lux, msg, from, args, prefix }) {
        const longUrl = args.join(' ').trim();
        
        if (!longUrl) {
            return lux.sendMessage(from, { text: `❌ Por favor, forneça o link que deseja encurtar. Ex: \`${prefix}encurta-net https://seulinkmuitolongo.com/pagina\`` }, { quoted: msg });
        }

        // Validação básica de URL
        if (!longUrl.startsWith('http')) {
            return lux.sendMessage(from, { text: '❌ O link deve começar com "http://" ou "https://".' }, { quoted: msg });
        }

        await lux.sendMessage(from, { text: '⏳ Encurtando o link...' }, { quoted: msg });

        const endpoint = 'https://api.encurtador.dev/encurtamentos';

        try {
            const response = await axios.post(endpoint, {
                url: longUrl
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200 || response.status === 201) {
                const shortUrl = response.data.urlEncurtada;
                
                const mensagemResposta = `✅ *Link Encurtado com Sucesso* ✅\n\n` +
                                         `🔗 *Original:* ${longUrl}\n` +
                                         `✂️ *Curto:* ${shortUrl}\n\n` +
                                         `O link foi encurtado usando o serviço encurtador.dev.`;
                
                await lux.sendMessage(from, { text: mensagemResposta }, { quoted: msg });
            } else {
                // Trata erros da API
                const erroMsg = response.data.mensagem || `Erro desconhecido ao encurtar. Status: ${response.status}`;
                await lux.sendMessage(from, { text: `❌ Falha ao encurtar o link: ${erroMsg}` }, { quoted: msg });
            }

        } catch (error) {
            console.error('Erro no comando encurta-net:', error.message);
            await lux.sendMessage(from, { text: `❌ Ocorreu um erro de comunicação com o serviço de encurtamento: ${error.message}` }, { quoted: msg });
        }
    }
};
