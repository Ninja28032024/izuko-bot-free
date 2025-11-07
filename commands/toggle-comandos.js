// commands/toggle-comandos.js
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'toggle-comandos',
    aliases: ['interruptor'],
    execute: async ({ lux, from, msg, isOwner }) => {
        if (!isOwner) {
            return await lux.sendMessage(from, { text: '❌ Apenas o Mestre pode operar o Interruptor de Emergência.' }, { quoted: msg });
        }

        const estadoPath = path.join(__dirname, '..', 'banco de dados', 'estado_comandos.json');
        let estadoAtual;

        try {
            // =================================================================
            // == A CORREÇÃO DEFINITIVA - A LÓGICA QUE FALTAVA
            // =================================================================
            // 1. Verifica se o arquivo existe.
            if (fs.existsSync(estadoPath)) {
                // Se existe, lê o estado atual.
                estadoAtual = JSON.parse(fs.readFileSync(estadoPath, 'utf-8'));
            } else {
                // Se NÃO existe, assume que os comandos estavam ATIVADOS e cria o arquivo.
                console.log('[Interruptor] Arquivo de estado não encontrado. Assumindo estado "ativado" e criando arquivo.');
                estadoAtual = { comandosAtivados: true };
            }
            // =================================================================

            // 2. Inverte o estado.
            const novoEstado = !estadoAtual.comandosAtivados;

            // 3. Salva o novo estado no arquivo.
            fs.writeFileSync(estadoPath, JSON.stringify({ comandosAtivados: novoEstado }, null, 2));

            // 4. Anuncia o novo estado para o Mestre.
            const mensagem = novoEstado
                ? '✅ *Interruptor ACIONADO.* Os comandos prefixados foram *REATIVADOS*. O arsenal está operacional.'
                : '❌ *Interruptor ACIONADO.* Os comandos prefixados foram *DESATIVADOS*. Apenas as funções de fundo e o próprio interruptor permanecem ativos.';
            
            await lux.sendMessage(from, { text: mensagem }, { quoted: msg });

        } catch (error) {
            console.error("Erro ao alternar estado dos comandos:", error);
            await lux.sendMessage(from, { text: 'Mestre, houve uma falha crítica ao tentar operar o Interruptor de Emergência.' }, { quoted: msg });
        }
    }
};