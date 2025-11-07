// commands/criador.js
const moment = require('moment-timezone');

module.exports = {
    name: 'criador',
    aliases: ['dono', 'mestre'],
    execute: async ({ lux, from, msg, settings }) => {
        const agora = moment().tz('America/Sao_Paulo');
        const hora = agora.hour();
        let saudacao;

        if (hora >= 0 && hora < 12) {
            saudacao = 'Bom dia';
        } else if (hora >= 12 && hora < 18) {
            saudacao = 'Boa tarde';
        } else {
            saudacao = 'Boa noite';
        }

        // =================================================================
        // == CORREÇÃO APLICADA AQUI
        // =================================================================
        // O número do Mestre agora está fixo no código, conforme sua ordem.
        const numeroMestre = '5542984421154';
        // =================================================================

        const mensagemPredefinida = encodeURIComponent(`${saudacao}, tudo bem? Vim pelo seu Bot Izuko, e eu gostaria de saber mais sobre ele.`);
        const linkWaMe = `https://wa.me/${numeroMestre}?text=${mensagemPredefinida}`;

        // A variável {settings.nomeDono} ainda é usada para personalização da mensagem.
        const resposta = `*O ARQUITETO DO CLÃ* ⛩️\n\nPara assuntos que transcendem meu poder ou para buscar a sabedoria do grande Mestre que me forjou, use o portal abaixo.\n\nEle é o caminho para contatar *${settings.nomeDono}*, o criador.\n\n*Portal para o Mestre:*\n${linkWaMe}`;

        await lux.sendMessage(from, { text: resposta }, { quoted: msg } );
    }
};
