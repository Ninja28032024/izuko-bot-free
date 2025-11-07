// commands/velha-ia.js
// Sistema de IA para o Jogo da Velha com estratégia inteligente

const chalk = require('chalk');

module.exports = {
    /**
     * Calcula o melhor movimento para o bot usando estratégia inteligente
     * 
     * Ordem de prioridade:
     * 1. Se pode vencer, vence
     * 2. Se o jogador pode vencer, bloqueia
     * 3. Se pode pegar o centro, pega
     * 4. Se pode pegar um canto, pega
     * 5. Caso contrário, pega uma borda aleatória
     * 
     * @param {Array} board - Tabuleiro 3x3 atual
     * @param {String} simboloBot - Símbolo do bot ('O')
     * @param {String} simboloJogador - Símbolo do jogador ('X')
     * @returns {Number} Posição (1-9) do melhor movimento
     */
    calcularMelhorMovimento(board, simboloBot, simboloJogador) {
        try {
            // Obter todas as posições vazias
            const posicoes = obterPosicoeVazias(board);

            if (posicoes.length === 0) {
                console.warn(chalk.yellow('[VELHA-IA] Nenhuma posição vazia disponível'));
                return null;
            }

            // Estratégia 1: Se pode vencer, vence
            for (const pos of posicoes) {
                const boardCopy = copiarTabuleiro(board);
                fazerMovimentoIA(boardCopy, pos, simboloBot);
                if (verificarVencedorIA(boardCopy, simboloBot)) {
                    console.log(chalk.green(`[VELHA-IA] Estratégia: VENCER na posição ${pos}`));
                    return pos;
                }
            }

            // Estratégia 2: Se o jogador pode vencer, bloqueia
            for (const pos of posicoes) {
                const boardCopy = copiarTabuleiro(board);
                fazerMovimentoIA(boardCopy, pos, simboloJogador);
                if (verificarVencedorIA(boardCopy, simboloJogador)) {
                    console.log(chalk.yellow(`[VELHA-IA] Estratégia: BLOQUEAR na posição ${pos}`));
                    return pos;
                }
            }

            // Estratégia 3: Pegar o centro se disponível
            if (posicoes.includes(5)) {
                console.log(chalk.blue(`[VELHA-IA] Estratégia: CENTRO (posição 5)`));
                return 5;
            }

            // Estratégia 4: Pegar cantos aleatoriamente
            const cantos = posicoes.filter(p => [1, 3, 7, 9].includes(p));
            if (cantos.length > 0) {
                const posicao = cantos[Math.floor(Math.random() * cantos.length)];
                console.log(chalk.blue(`[VELHA-IA] Estratégia: CANTO (posição ${posicao})`));
                return posicao;
            }

            // Estratégia 5: Pegar borda aleatória
            const posicao = posicoes[Math.floor(Math.random() * posicoes.length)];
            console.log(chalk.blue(`[VELHA-IA] Estratégia: BORDA (posição ${posicao})`));
            return posicao;

        } catch (error) {
            console.error(chalk.red('[VELHA-IA] Erro ao calcular movimento:'), error);
            // Fallback: retornar primeira posição vazia
            const posicoes = obterPosicoeVazias(board);
            return posicoes.length > 0 ? posicoes[0] : null;
        }
    }
};

// ===== FUNÇÕES AUXILIARES =====

/**
 * Obtém todas as posições vazias do tabuleiro
 * @param {Array} board - Tabuleiro 3x3
 * @returns {Array} Array de números (1-9) das posições vazias
 */
function obterPosicoeVazias(board) {
    const posicoes = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === null) {
                posicoes.push(i * 3 + j + 1);
            }
        }
    }
    return posicoes;
}

/**
 * Copia o tabuleiro para não modificar o original
 * @param {Array} board - Tabuleiro original
 * @returns {Array} Cópia profunda do tabuleiro
 */
function copiarTabuleiro(board) {
    return JSON.parse(JSON.stringify(board));
}

/**
 * Faz um movimento no tabuleiro para a IA
 * @param {Array} board - Tabuleiro
 * @param {Number} posicao - Posição (1-9)
 * @param {String} simbolo - Símbolo ('X' ou 'O')
 */
function fazerMovimentoIA(board, posicao, simbolo) {
    const linha = Math.floor((posicao - 1) / 3);
    const coluna = (posicao - 1) % 3;
    board[linha][coluna] = simbolo;
}

/**
 * Verifica se há um vencedor no tabuleiro
 * @param {Array} board - Tabuleiro
 * @param {String} simbolo - Símbolo a verificar ('X' ou 'O')
 * @returns {Boolean} True se o símbolo venceu
 */
function verificarVencedorIA(board, simbolo) {
    // Verificar linhas
    for (let i = 0; i < 3; i++) {
        if (board[i][0] === simbolo && board[i][1] === simbolo && board[i][2] === simbolo) {
            return true;
        }
    }
    
    // Verificar colunas
    for (let j = 0; j < 3; j++) {
        if (board[0][j] === simbolo && board[1][j] === simbolo && board[2][j] === simbolo) {
            return true;
        }
    }
    
    // Verificar diagonal principal (↘)
    if (board[0][0] === simbolo && board[1][1] === simbolo && board[2][2] === simbolo) {
        return true;
    }
    
    // Verificar diagonal secundária (↙)
    if (board[0][2] === simbolo && board[1][1] === simbolo && board[2][0] === simbolo) {
        return true;
    }
    
    return false;
}

// Exportar função principal
module.exports.calcularMelhorMovimento = module.exports.calcularMelhorMovimento;

