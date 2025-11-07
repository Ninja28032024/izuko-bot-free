// commands/manual-antilinks.js

module.exports = {
    name: 'manual-antilinks',
    aliases: [], // Sem aliases, conforme ordenado
    execute: async ({ lux, from, msg, isGroup, sender, areJidsSameUser }) => {
        
        if (!isGroup) {
            return await lux.sendMessage(from, { text: 'Mestre, este pergaminho só pode ser revelado em um grupo.' }, { quoted: msg });
        }

        // Verifica se o autor da mensagem é um administrador do grupo
        const groupMeta = await lux.groupMetadata(from);
        const senderIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, sender))?.admin;

        if (!senderIsAdmin) {
            return await lux.sendMessage(from, { text: 'Mestre, apenas os generais (admins) deste clã podem consultar os protocolos de defesa.' }, { quoted: msg });
        }

        const manualText = `
📜 *MANUAL DOS PROTOCOLOS DE DEFESA ANTI-LINK* 📜

Saudações, General. Eu, Izuko BOT, fui forjado para manter a ordem e a disciplina. A seguir, detalho os cinco níveis de defesa que Vossa Senhoria pode decretar para proteger este clã contra o envio de links por membros comuns.

Cada nível é ativado e desativado usando o mesmo comando. Use-o uma vez para ativar, e novamente para desativar.

-------------------------------------------

🛡️ *NÍVEL 1: A MURALHA (Comando: !anti-link)* 🛡️

*Ação:* Aniquilação da Mensagem.
*Descrição:* Este é o protocolo de defesa padrão. Ao ser ativado, qualquer mensagem contendo um link enviada por um membro comum será *instantaneamente apagada.* Uma advertência será emitida, mas o membro não sofrerá outra punição. É a defesa ideal para manter a limpeza sem ser excessivamente punitivo.

-------------------------------------------

🚨 *NÍVEL 2: A LEI MARCIAL (Comando: !anti-link2)* 🚨

*Ação:* Exílio Imediato.
*Descrição:* Um protocolo severo para clãs que exigem disciplina máxima. Ao ser ativado, o membro comum que enviar um link será *imediatamente banido* do grupo. A mensagem contendo o link permanecerá como prova da transgressão.

-------------------------------------------

🔥 *NÍVEL 3: A SENTENÇA SUPREMA (Comando: !anti-link3)* 🔥

*Ação:* Exílio e Aniquilação.
*Descrição:* A combinação das duas leis anteriores. O membro transgressor será *imediatamente banido*, e a mensagem contendo o link será *apagada em seguida*. Não deixa rastros da infração, apenas a ausência do infrator.

-------------------------------------------

☠️ *NÍVEL 4: O RITUAL DE EXÍLIO (Comando: !anti-link4)* ☠️

*Ação:* Punição Exemplar Coreografada.
*Descrição:* Este protocolo não é apenas uma punição, é uma demonstração de poder. Ao detectar um link, eu seguirei uma sequência dramática: fecharei o grupo, apagarei a mensagem, anunciarei o banimento, banirei o membro, reabrirei o grupo e, por fim, proclamarei a sentença a todos, desafiando outros a cometerem o mesmo erro. É a escolha ideal para deixar uma mensagem clara e intimidadora.

-------------------------------------------

⚖️ *NÍVEL 5: A LEI DA REINCIDÊNCIA (Comando: !anti-link5)* ⚖️

*Ação:* Advertência Progressiva.
*Descrição:* O mais justo e sofisticado dos protocolos. Cada membro tem 4 chances.
*1ª a 4ª Vez:* A mensagem com o link é apagada, e eu emito uma advertência, informando quantas chances restam.
*5ª Vez:* A paciência se esgota. O ritual do Nível 4 é iniciado, e o membro é banido de forma exemplar.
    Este protocolo é ideal para grupos que desejam educar antes de punir.

-------------------------------------------

Use estes poderes com sabedoria, General. A ordem do clã está em suas mãos.
        `;

        await lux.sendMessage(from, { text: manualText.trim() }, { quoted: msg });
    }
};
