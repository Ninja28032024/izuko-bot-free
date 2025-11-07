// commands/marcar2.js
// Marca todos os membros do grupo EXCETO os administradores

module.exports = {
    name: 'marcar2',
    aliases: ['marcar-membros', 'tagmembros'],
    description: 'Marca todos os membros do grupo exceto os administradores',
    usage: '!marcar2 [mensagem opcional]',
    async execute({ lux, msg, from, args, isGroup, sender, areJidsSameUser }) {
        if (!isGroup) {
            return await lux.sendMessage(from, { 
                text: 'Mestre, este comando só pode ser usado em grupos.' 
            }, { quoted: msg });
        }

        // Buscar metadados do grupo
        const groupMeta = await lux.groupMetadata(from);
        
        // Verificar se o remetente é administrador
        const senderIsAdmin = groupMeta.participants.find(p => 
            areJidsSameUser(p.id, sender)
        )?.admin;

        if (!senderIsAdmin) {
            return await lux.sendMessage(from, { 
                text: 'Mestre, apenas administradores podem usar este comando.' 
            }, { quoted: msg });
        }

        // Filtrar apenas membros comuns (sem administradores)
        const membrosComuns = groupMeta.participants.filter(p => !p.admin).map(p => p.id);

        if (membrosComuns.length === 0) {
            return await lux.sendMessage(from, { 
                text: '⚠️ Não há membros comuns para marcar neste grupo (todos são administradores).' 
            }, { quoted: msg });
        }

        // Montar mensagem personalizada ou usar padrão
        const mensagemPersonalizada = args.join(' ');
        let textMarcar = '';
        
        if (mensagemPersonalizada) {
            textMarcar = `📢 *${mensagemPersonalizada}*\n\n`;
        } else {
            textMarcar = "*EU, IZUKO BOT ESTOU MARCANDO TODOS OS MEMBROS (EXCETO ADMINS) DESTE GRUPO*\n\n";
        }
        
        textMarcar += `👥 *Total de membros marcados:* ${membrosComuns.length}\n\n`;
        textMarcar += membrosComuns.map(jid => `@${jid.split('@')[0]}`).join('\n');

        await lux.sendMessage(from, { 
            text: textMarcar, 
            mentions: membrosComuns 
        }, { quoted: msg });
    }
};

