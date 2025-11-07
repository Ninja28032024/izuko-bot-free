
const { salvarConfigGlobal, lerConfigGlobal } = require('../settings/lib/config-global.js');
const chalk = require('chalk');

module.exports = {
    name: 'gpt-pv',
    aliases: ['gptpv'],
    description: 'Ativa ou desativa o sistema de resposta GPT em mensagens privadas.',
    usage: '',
    cooldown: 5,
    isAdmin: true, // Apenas administradores do grupo podem ativar/desativar
    isOwner: false,

    async execute({ lux, msg, from, isGroup, sender, pushName, args, isOwner, settings }) {
        // 1. Verifica se é grupo (o comando só funciona em grupo)
        if (!isGroup) {
            return lux.sendMessage(from, { text: 'Este comando só pode ser usado em grupos.' });
        }
        
        // 2. Verifica se o usuário é administrador do grupo (ou dono do bot)
        const groupMeta = await lux.groupMetadata(from);
        const senderIsAdmin = groupMeta.participants.find(p => p.id === sender)?.admin;
        
        if (!senderIsAdmin && !isOwner) {
             return lux.sendMessage(from, { text: '❌ Apenas administradores do grupo ou o Mestre (dono do bot) podem usar este jutsu.' }, { quoted: msg });
        }

        // 3. Lógica de ativação/desativação
        const config = lerConfigGlobal();
        const novoStatus = !config.gptPrivadoAtivo;
        config.gptPrivadoAtivo = novoStatus;
        salvarConfigGlobal(config);

        // 4. Resposta para o grupo
        const statusTexto = novoStatus ? 'ATIVADO' : 'DESATIVADO';
        const emoji = novoStatus ? '✅' : '❌';
        const mensagemResposta = `${emoji} *SISTEMA GPT-PV ${statusTexto}* ${emoji}\n\n` +
                                 `O sistema de resposta GPT para mensagens privadas foi *${statusTexto}* com sucesso.\n` +
                                 `Quando *ATIVADO*, o bot responderá a *qualquer* mensagem privada usando a API GPT.`;

        await lux.sendMessage(from, { text: mensagemResposta }, { quoted: msg });
        
        console.log(chalk.green(`[GPT-PV] Sistema ${statusTexto} por ${pushName} em ${groupMeta.subject}.`));
    }
};

