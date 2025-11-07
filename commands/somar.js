// Salvar como: commands/somar.js
module.exports = {
    name: 'somar',
    // Sem aliases, conforme ordenado.

    execute: async ({ lux, msg, from, args }) => {
        // Junta todos os argumentos para formar a expressão completa, ex: "2+2"
        const expressao = args.join('');

        // Verifica se a expressão contém o operador de soma e se tem o formato número+número
        if (!expressao.includes('+') || !/^\d+(\.\d+)?\+\d+(\.\d+)?$/.test(expressao)) {
            return await lux.sendMessage(from, { text: 'Sintaxe do jutsu incorreta, Mestre.\n\n*Invocação correta:* `somar <número>+<número>`\n*Exemplo:* `somar 2+2`' }, { quoted: msg });
        }

        try {
            // Usa a função eval() de forma segura, pois a expressão regular já validou o formato.
            const resultado = eval(expressao);
            
            // Responde exatamente como ordenado: 2+2 = 4
            await lux.sendMessage(from, { text: `${expressao} = ${resultado}` });

        } catch (error) {
            console.error("Erro no jutsu 'somar':", error);
            await lux.sendMessage(from, { text: 'Mestre, ocorreu uma anomalia no fluxo de chakra numérico. Não foi possível completar a soma.' }, { quoted: msg });
        }
    }
};
