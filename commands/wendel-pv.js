// commands/wendel-pv.js
const { salvarConfigGlobal, lerConfigGlobal } = require('../settings/lib/config-global.js');
const chalk = require('chalk');

module.exports = {
    name: 'wendel-pv',
    aliases: ['wendelpv', 'ativarwendel'],
    description: 'Ativa ou desativa o chat privado com a IA Wendel.',
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
        // Verifica se o remetente é admin ou dono
        const senderIsAdmin = groupMeta.participants.find(p => p.id === sender)?.admin;
        
        if (!senderIsAdmin && !isOwner) {
             return lux.sendMessage(from, { text: '❌ Apenas administradores do grupo ou o Mestre (dono do bot) podem usar este jutsu.' }, { quoted: msg });
        }

        // 3. Lógica de ativação/desativação
        const config = lerConfigGlobal();
        const novoStatus = !config.wendelPvAtivo;
        config.wendelPvAtivo = novoStatus;
        salvarConfigGlobal(config);

        // 4. Resposta para o grupo
        const statusTexto = novoStatus ? 'ATIVADO' : 'DESATIVADO';
        const emoji = novoStatus ? '✅' : '❌';
        const mensagemResposta = `${emoji} *SISTEMA WENDEL PV ${statusTexto}* ${emoji}\n\n` +
                                 `O chat privado com o Wendel foi *${statusTexto}* com sucesso.\n` +
                                 `Quando *ATIVADO*, o bot responderá a *qualquer* mensagem privada usando a persona do Wendel.`;

        await lux.sendMessage(from, { text: mensagemResposta }, { quoted: msg });
        
        console.log(chalk.green(`[WENDEL-PV] Sistema ${statusTexto} por ${pushName} em ${groupMeta.subject}.`));
    }
};
