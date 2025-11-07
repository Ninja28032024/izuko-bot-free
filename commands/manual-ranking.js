// commands/manual-ranking.js

module.exports = {
    name: 'manual-ranking',
    aliases: ['ajuda-rank', 'guia-rank'],
    execute: async ({ lux, from, msg }) => {
        const manualText = `
📜⚔️ O CAMINHO DO GUERREIRO: MANUAL DO SISTEMA DE RANKING ⚔️📜

Saudações, guerreiros! O Izuko BOT agora observa seus feitos e recompensa sua lealdade e atividade no clã. Sua jornada rumo à glória começa agora, e este pergaminho é seu guia.

-------------------------------------------

✨ COMO O PODER É FORJADO ✨

Sua ascensão é baseada em uma economia de poder com dois recursos principais: *XP* e *Pontos*.

1.  *XP (Experiência):*
    *É o poder bruto que você ganha por ser ativo.*
    *Como ganhar:* Envie qualquer tipo de mensagem (texto, áudio, figurinha, etc.) ou use um comando do bot. Cada ação lhe concede +2 de XP*.
    *Regra de Honra:** Para garantir que o poder seja ganho por mérito, você só pode ganhar XP **uma vez a cada 2 minutos*.

2.  *PONTOS:*
    *São a sua força de combate real, o recurso usado para subir de patente.*
    *Como ganhar:* Você deve "forjar" seu XP acumulado para transformá-lo em Pontos.*

-------------------------------------------

🔥 A FORJA DE PODER: CONVERTENDO XP EM PONTOS 🔥

Seu XP precisa ser convertido para que seu poder se manifeste. Isso acontece de duas formas:

*1. A Forja Manual (Seu Controle Estratégico)*
*Comando:* \`!converter-xp\`
*O que faz:* Converte TODO o seu XP acumulado em Pontos. Cada 1 de XP vale 200 Pontos. Use este comando para dar o impulso final e alcançar uma nova patente!

*2. A Conversão Automática (A Recompensa Explosiva)*
*O que acontece:* Quando você acumula *100 de XP*, o sistema automaticamente os converte em *20.000 Pontos* para você!
*O propósito:* É uma recompensa por sua atividade constante. Mesmo que esqueça de converter, o sistema garante que seu poder seja reconhecido com um grande bônus.

-------------------------------------------

🏆 A JORNADA DAS PATENTES 🏆

Seu objetivo é subir na hierarquia do clã. A cada *3.000 Pontos* que você acumula, sua patente sobe automaticamente!

*Exemplo:* Você está em "Bronze I" com 2.800 Pontos. Ao converter 2 de XP, você ganha 400 Pontos, totalizando 3.200. O sistema então deduz 3.000 Pontos, promove você para "Bronze II", e você já começa a nova jornada com 200 Pontos de vantagem!

As patentes são: Bronze, Prata, Platina, Ouro, Diamante, Esmeralda, Mestre, Mestre de Honra e, para os mais dedicados, o título supremo de *Lendário Místico*.

-------------------------------------------

📖 OS COMANDOS DO GUERREIRO 📖

Use estes comandos para guiar sua jornada:

*\`!rank\`*
_Mostra o Top 10 do grupo, exibindo os guerreiros mais poderosos e suas patentes._

*\`!level\`*
_Mostra SEU status pessoal: sua patente, seu XP acumulado e seus Pontos atuais._

*\`!converter-xp\`*
*O comando de ação! Use-o para forjar seu XP em Pontos e acelerar sua ascensão.*

-------------------------------------------

Agora que o caminho foi revelado, que sua jornada seja repleta de glória e poder. Forje seu destino, guerreiro!
        `;

        await lux.sendMessage(from, { text: manualText.trim() }, { quoted: msg });
    }
};