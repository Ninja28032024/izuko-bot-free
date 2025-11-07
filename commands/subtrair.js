// Salvar como: commands/subtrair.js
module.exports = {
    name: 'subtrair',
    // Sem aliases, conforme ordenado.

    execute: async ({ lux, msg, from, args }) => {
        // Junta todos os argumentos para formar a expressão, ex: "8", "-", "4" -> "8 - 4"
        const expressaoCompleta = args.join(' ');

        // Verifica se a expressão contém o operador '-' e tem o formato número - número
        if (!expressaoCompleta.includes('-') || !/^\d+(\.\d+)?\s*-\s*\d+(\.\d+)?$/.test(expressaoCompleta)) {
            return await lux.sendMessage(from, { text: 'Sintaxe do jutsu incorreta, Mestre.\n\n*Invocação correta:* `subtrair <número> - <número>`\n*Exemplo:* `subtrair 8 - 4`' }, { quoted: msg });
        }

        try {
            // A expressão já está em um formato que o eval() entende
            const resultado = eval(expressaoCompleta);

            // Responde exatamente como ordenado: 8 - 4 = 4
            await lux.sendMessage(from, { text: `${expressaoCompleta} = ${resultado}` });

        } catch (error) {
            console.error("Erro no jutsu 'subtrair':", error);
            await lux.sendMessage(from, { text: 'Mestre, a essência numérica não pôde ser subtraída como ordenado.' }, { quoted: msg });
        }
    }
};
