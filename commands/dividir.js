// Salvar como: commands/dividir.js
module.exports = {
    name: 'dividir',
    // Sem aliases, conforme ordenado.

    execute: async ({ lux, msg, from, args }) => {
        // Junta todos os argumentos para formar a expressão completa, ex: "5÷2"
        const expressao = args.join('');

        // Verifica se a expressão contém o operador de divisão '÷'
        if (!expressao.includes('÷')) {
            return await lux.sendMessage(from, { text: 'Sintaxe do jutsu incorreta, Mestre.\n\n*Invocação correta:* `dividir <número>÷<número>`\n*Exemplo:* `dividir 5÷2`' }, { quoted: msg });
        }

        // Divide a expressão nos dois números
        const numeros = expressao.split('÷');
        const dividendo = parseFloat(numeros[0]);
        const divisor = parseFloat(numeros[1]);

        // Valida se os operandos são números válidos e se não há divisão por zero
        if (isNaN(dividendo) || isNaN(divisor)) {
            return await lux.sendMessage(from, { text: 'Mestre, a essência numérica da expressão está corrompida. Verifique os números.' }, { quoted: msg });
        }

        if (divisor === 0) {
            return await lux.sendMessage(from, { text: 'Mestre, a divisão por zero é um tabu no universo dos números, um paradoxo que não pode ser resolvido.' }, { quoted: msg });
        }

        try {
            // Realiza o cálculo da divisão
            const resultado = dividendo / divisor;
            
            // Responde exatamente como ordenado: 5÷2 = 2.5
            await lux.sendMessage(from, { text: `${expressao} = ${resultado}` });

        } catch (error) {
            console.error("Erro no jutsu 'dividir':", error);
            await lux.sendMessage(from, { text: 'Mestre, uma anomalia no fluxo de chakra numérico impediu a conclusão da divisão.' }, { quoted: msg });
        }
    }
};
