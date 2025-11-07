# 🔥 Izuko Bot VIP V1.5 - Versão Otimizada

## ⚠️ VERSÃO OTIMIZADA PARA BAIXO CONSUMO DE MEMÓRIA

Esta é a **versão VIP otimizada** do Izuko Bot, especialmente configurada para funcionar em servidores com recursos limitados (512MB - 1GB RAM).

## 🎯 Diferenças desta Versão

### ✅ Otimizações Aplicadas

- **Ofuscação Leve**: Apenas arquivos críticos ofuscados (main.js + 9 comandos admin)
- **Limite de Memória**: Configurado para usar no máximo 512MB RAM
- **Comandos Não-Críticos**: Mantidos sem ofuscação para reduzir consumo
- **Performance**: ~70% menos consumo de memória vs versão totalmente ofuscada

### 🔒 Arquivos Protegidos

- ✅ `main.js` (ofuscação leve)
- ✅ `ban.js` (comando crítico)
- ✅ `promote.js` / `demote.js` (comandos admin)
- ✅ `anti-link.js` / `antiflood.js` (moderação)
- ✅ `bot-on.js` / `bot-off.js` (controle)
- ✅ `setprefix.js` / `restart.js` (configuração)

### 📊 Consumo de Recursos

| Versão | Memória RAM | CPU | Recomendação |
|--------|-------------|-----|--------------|
| **Totalmente Ofuscada** | 1GB+ | Alta | Servidores dedicados |
| **Otimizada (esta)** | 512MB | Média | VPS compartilhadas |
| **Original** | 256MB | Baixa | Desenvolvimento |

## 🎯 Requisitos

- **Node.js 20.x** (obrigatório)
- **RAM**: Mínimo 512MB disponível
- **FFmpeg** (para processamento de mídia)

## 📦 Instalação

```bash
# 1. Verificar Node.js
node --version  # Deve ser v20.x.x

# 2. Instalar dependências
npm install

# 3. Configurar
# Edite: settings/settings.json

# 4. Executar (com limite de memória)
npm start

# OU usar start.sh
bash start.sh
```

## 🚀 Comandos de Execução

### Opção 1: NPM (Recomendado)
```bash
npm start
# Executa com limite de 512MB automático
```

### Opção 2: Node Direto
```bash
node --max-old-space-size=512 main.js
# Limite manual de memória
```

### Opção 3: PM2 (Produção)
```bash
npm run pm2:start
# Reinicia automaticamente se ultrapassar 512MB
```

### Opção 4: Start.sh
```bash
bash start.sh
# Auto-reconexão + limite de memória
```

## ⚙️ Configurações de Memória

O bot está configurado para:

- **Limite de Heap**: 512MB (`--max-old-space-size=512`)
- **Restart Automático**: Se ultrapassar 512MB (PM2)
- **Garbage Collection**: Otimizado para Node.js 20

## 🔧 Solução de Problemas

### Erro "Killed"
Se ainda ocorrer, aumente o limite:
```bash
node --max-old-space-size=768 main.js
```

### Servidor com Menos de 512MB
Use a versão original (não ofuscada):
```bash
# Baixe a versão free do GitHub
git clone https://github.com/Ninja28032024/izuko-bot-free.git
```

### Verificar Uso de Memória
```bash
# Durante execução
ps aux | grep node
# Ou use htop
htop
```

## 📚 Documentação

Consulte `DOCUMENTACAO_IZUKO_BOT_VIP.md` para detalhes completos sobre comandos e funcionalidades.

## 🆚 Comparação de Versões

| Recurso | VIP Otimizada | VIP Completa | Free |
|---------|---------------|--------------|------|
| Ofuscação | Parcial (críticos) | Total (145 arquivos) | Nenhuma |
| Memória RAM | 512MB | 1GB+ | 256MB |
| Proteção | Média | Alta | Baixa |
| Performance | Alta | Média | Alta |
| Servidor | VPS compartilhada | Dedicado | Qualquer |

---

**Versão:** 1.5 VIP (Otimizada)  
**Node.js:** 20.x  
**Consumo:** 512MB RAM  
**Desenvolvido por:** Mestre Ninja Devs Of Bots
