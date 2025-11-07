// Salvar como: commands/multiplicar.js
module.exports = {
    name: 'multiplicar',
    // Sem aliases, conforme ordenado.

    execute: async ({ lux, msg, from, args }) => {
        // Junta todos os argumentos para formar a expressão, ex: "2", "x", "2" -> "2 x 2"
        const expressaoCompleta = args.join(' ');

        // Verifica se a expressão contém o operador 'x' e tem o formato número x número
        if (!expressaoCompleta.includes('x') || !/^\d+(\.\d+)?\s*x\s*\d+(\.\d+)?$/.test(expressaoCompleta)) {
            return await lux.sendMessage(from, { text: 'Sintaxe do jutsu incorreta, Mestre.\n\n*Invocação correta:* `multiplicar <número> x <número>`\n*Exemplo:* `multiplicar 2 x 2`' }, { quoted: msg });
        }

        try {
            // Substitui o 'x' por '*' para que o eval() possa calcular
            const expressaoCalculavel = expressaoCompleta.replace('x', '*');
            const resultado = eval(expressaoCalculavel);

            // Responde exatamente como ordenado: 2 x 2 = 4
            await lux.sendMessage(from, { text: `${expressaoCompleta} = ${resultado}` });

        } catch (error) {
            console.error("Erro no jutsu 'multiplicar':", error);
            await lux.sendMessage(from, { text: 'Mestre, uma perturbação impediu a multiplicação dos elementos.' }, { quoted: msg });
        }
    }
};
