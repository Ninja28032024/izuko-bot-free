// commands/temporizador-gp.js
const fs = require('fs');
const path = require('path');
const { carregarAgendamentos } = require('../settings/lib/agendamento.js');

module.exports = {
    name: 'temporizador-gp',
    aliases: ['fgp', 'fechar-gp', 'tempogp', 'tmpgp'],
    execute: async ({ lux, from, msg, isGroup, sender, args, areJidsSameUser, settings }) => {
        // 1. VERIFICAÇÕES INICIAIS COM O TOM CORRETO
        if (!isGroup) {
            return await lux.sendMessage(from, { text: 'Mestre, este encantamento só pode ser conjurado na atmosfera de um grupo.' }, { quoted: msg });
        }

        const groupMeta = await lux.groupMetadata(from);
        const senderIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, sender))?.admin;
        const botIsAdmin = groupMeta.participants.find(p => p.id === settings.botLid)?.admin;

        if (!senderIsAdmin) {
            return await lux.sendMessage(from, { text: '❌ Apenas os guardiões (admins) deste clã podem ditar as leis do tempo.' }, { quoted: msg });
        }
        if (!botIsAdmin) {
            return await lux.sendMessage(from, { text: 'Mestre, preciso portar o selo de guardião (admin) para poder manipular os portões do tempo.' }, { quoted: msg });
        }

        const q = args.join(' ');
        if (!q || !q.includes('/')) {
            const exemplo = `*📌 Como usar, Mestre:*\n${settings.prefix}fechar-gp HH:MM/HH:MM\n\n*Exemplo de Decreto:*\n${settings.prefix}fechar-gp 22:00/08:00\n*(Fecha os portões às 22h e os abre às 8h)*`;
            return await lux.sendMessage(from, { text: exemplo }, { quoted: msg });
        }

        // 2. LÓGICA DE VALIDAÇÃO DE HORÁRIO
        let [horaFechar, horaAbrir] = q.split('/').map(h => h.trim());

        const validarHorario = (hora) => {
            hora = hora.replace(/\s+/g, '').toUpperCase();
            if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(hora)) return hora;

            const match12h = hora.match(/^([1-9]|1[0-2])(?::([0-5][0-9]))?([AP]M)$/);
            if (match12h) {
                let [_, h, m = '00', periodo] = match12h;
                h = parseInt(h);
                if (periodo === 'PM' && h < 12) h += 12;
                if (periodo === 'AM' && h === 12) h = 0;
                return `${String(h).padStart(2, '0')}:${String(m || '00').padStart(2, '0')}`;
            }
            return null;
        };

        horaFechar = validarHorario(horaFechar);
        horaAbrir = validarHorario(horaAbrir);

        if (!horaFechar || !horaAbrir) {
            const erroHorario = '❌ *Horários Inválidos, Mestre!*\n\nO encantamento requer um formato preciso. Use:\n\n• *Formato 24h:* `22:00/08:00`\n• *Formato 12h:* `10:00PM/8:00AM`';
            return await lux.sendMessage(from, { text: erroHorario }, { quoted: msg });
        }

        // 3. SALVAR O AGENDAMENTO
        const agendamento = {
            horaFechar,
            horaAbrir,
            grupo: from,
            criadoEm: new Date().toISOString(),
            criadoPor: sender.split('@')[0]
        };

        const pastaAgendamentos = './banco de dados/agendamentos';
        const caminhoArquivo = path.join(pastaAgendamentos, `agendamento-gp-${from}.json`);

        try {
            if (!fs.existsSync(pastaAgendamentos)) {
                fs.mkdirSync(pastaAgendamentos, { recursive: true });
            }
            fs.writeFileSync(caminhoArquivo, JSON.stringify(agendamento, null, 2));

            await carregarAgendamentos(lux);

            const sucesso = `✅ *DECRETO TEMPORAL ACEITO!*\n\nO tempo deste grupo agora obedece à sua vontade.\n\n🔒 *Selar Portões:* ${horaFechar}\n🔓 *Abrir Portões:* ${horaAbrir}\n\n*Fuso Horário de Referência:* São Paulo (UTC-3)`;
            await lux.sendMessage(from, { text: sucesso }, { quoted: msg });

        } catch (error) {
            console.error('Erro ao configurar agendamento:', error);
            await lux.sendMessage(from, { text: '❌ Mestre, uma anomalia temporal impediu a configuração do agendamento. Peço que tente novamente.' }, { quoted: msg });
        }
    }
};
