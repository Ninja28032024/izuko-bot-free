# 💧 Izuko Bot - Versão Free

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-v22.13.0-green?style=for-the-badge&logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/WhatsApp-Bot-25D366?style=for-the-badge&logo=whatsapp" alt="WhatsApp">
  <img src="https://img.shields.io/badge/Versão-1.5_Free-blue?style=for-the-badge" alt="Versão">
  <img src="https://img.shields.io/badge/Licença-GPL--3.0-red?style=for-the-badge" alt="Licença">
</p>

> Bot multifuncional para WhatsApp com 144 comandos, sistema de ranking, moderação avançada e muito mais!

## 📋 Sobre este projeto

O **Izuko Bot** é um bot completo e poderoso para WhatsApp, desenvolvido para facilitar a administração de grupos e oferecer entretenimento aos membros. Esta é a **versão Free** com código ofuscado para proteção.

**⚠️ Aviso Legal:** Este projeto não possui qualquer vínculo oficial com o WhatsApp. Ele foi desenvolvido de forma independente para interações automatizadas por meio da plataforma. Não nos responsabilizamos por qualquer uso indevido deste bot. É de responsabilidade exclusiva do usuário garantir que sua utilização esteja em conformidade com os termos de uso do WhatsApp e a legislação vigente.

## ✨ Principais Funcionalidades

- ✅ **144 comandos funcionais** organizados por categoria
- 🏆 **Sistema de ranking** com XP, pontos e 23 patentes
- 🛡️ **5 níveis de proteção Anti-Link** configuráveis
- 🎮 **Jogos interativos** (Jogo da Velha, Cassino, Cara ou Coroa)
- ⚠️ **Sistema de advertências** e moderação automatizada
- 📥 **Download de mídias** de YouTube, Instagram e mais
- 🔧 **Arquitetura modular** fácil de expandir
- 💾 **Banco de dados JSON** simples e eficiente
- 🎨 **Código ofuscado** para proteção

## 🚀 Instalação

### Pré-requisitos

- Node.js v18 ou superior
- NPM ou Yarn
- Conta do WhatsApp

### Passo a passo

1. **Clone o repositório:**
```bash
git clone https://github.com/Ninja28032024/izuko-bot-free.git
cd izuko-bot-free
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure o bot:**
   - Edite o arquivo `settings/settings.json`
   - Defina seu número como dono
   - Personalize o nome do bot

4. **Inicie o bot:**
```bash
node main.js
```

ou

```bash
sh start.sh
```

5. **Escaneie o QR Code:**
   - Um QR Code aparecerá no terminal
   - Escaneie com seu WhatsApp
   - Aguarde a conexão ser estabelecida

## ⚙️ Configuração

Edite o arquivo `settings/settings.json`:

```json
{
  "prefix": "&",
  "ownerNumber": "SEU_NUMERO@lid",
  "botLid": "NUMERO_DO_BOT@lid",
  "nomeBot": "Izuko Bot",
  "nomeDono": "Seu Nome",
  "versao": "1.5"
}
```

| Parâmetro | Descrição |
|:----------|:----------|
| `prefix` | Caractere usado para invocar comandos (ex: `&menu`) |
| `ownerNumber` | JID do dono do bot (garante acesso a comandos restritos) |
| `botLid` | JID do próprio bot |
| `nomeBot` | Nome do bot que aparecerá nas mensagens |
| `nomeDono` | Nome do dono que aparecerá nas mensagens |
| `versao` | Versão atual do bot |

## 📁 Estrutura de Pastas

```
Izuko-Bot-Free/
├── commands/              # Todos os comandos do bot (144 arquivos)
├── banco de dados/        # Arquivos JSON de persistência
│   ├── admin_status/      # Status de administradores
│   ├── advertencias.json  # Registros de advertências
│   ├── ranking.json       # Sistema de ranking
│   └── ...                # Outros arquivos de dados
├── escanear/              # Módulos de monitoramento
│   └── scanner.js         # Scanner de eventos
├── settings/              # Configurações e bibliotecas
│   ├── lib/               # Lógica de negócios (20 arquivos)
│   └── settings.json      # Configurações globais
├── node_cache/            # Cache de mídias temporárias
├── temp/                  # Arquivos temporários
├── main.js                # Ponto de entrada principal
├── package.json           # Dependências do projeto
└── start.sh               # Script de inicialização
```

## 📚 Documentação Completa

Para uma documentação detalhada de todos os comandos e funcionalidades, acesse:

**🔗 [Documentação Online](https://ninja28032024.github.io/izuko-bot-docs/)**

A documentação inclui:
- Lista completa dos 144 comandos
- Exemplos de uso de cada comando
- Guia de configuração avançada
- Explicação do sistema de ranking
- Tutorial de moderação

## 🎮 Categorias de Comandos

### 👥 Comandos de Membros
`menu`, `ping`, `sticker`, `toimg`, `attp`, `ttp`, `somar`, `multiplicar`, `subtrair`, `dividir`, e mais...

### 👑 Comandos de Administração
`ban`, `promover`, `rebaixar`, `marcar`, `grupo-a`, `grupo-f`, `delete`, `descgp`, `nomegp`, `fotogp`, `linkgp`, e mais...

### 🛡️ Comandos de Moderação
`anti-link` (5 níveis), `antiflood`, `antiimg`, `mute`, `desmute`, `advertir`, `ver-advs`, `remover-advs`, `bemvindo`, e mais...

### 🏆 Comandos de Ranking
`level`, `rank`, `xp-me`, `add-pontos`, `add-xp`, `converter-xp`, `toggle-rank`, `backup-level`, e mais...

### 🎲 Comandos de Jogos
`velha`, `velha-jogar`, `cancelarvelha`, `cara-coroa`, `cassino`, `eununca`, e mais...

### 📥 Comandos de Download
`mp3`, `mp4`, `igdl`, `mediafire-doc`, `mega`, `tomp3`, `upload-catbox`, `upload-drive`, e mais...

### 🔧 Comandos do Dono
`bot-on`, `bot-off`, `restart`, `gpt-pv`, `setprefix`, `entrargp`, `auto-sair`, e mais...

## 🏆 Sistema de Ranking

O bot possui um sistema de gamificação completo:

- **XP:** Ganho ao interagir no grupo (2 XP por ação)
- **Conversão:** 100 XP = 20.000 Pontos (automático)
- **Subir de Nível:** 3.000 pontos = 1 nível

### Hierarquia de Patentes

Bronze I-III → Prata I-III → Platina I-III → Ouro I-III → Diamante I-III → Esmeralda I-III → Mestre I-III → Mestre de Honra → Lendário Místico

## 🛡️ Sistema de Moderação

### Anti-Link (5 Níveis)

| Nível | Comando | Ação |
|:------|:--------|:-----|
| 1 | `&anti-link` | Apaga a mensagem |
| 2 | `&anti-link2` | Aplica advertência |
| 3 | `&anti-link3` | Remove do grupo |
| 4 | `&anti-link4` | Bane permanentemente |
| 5 | `&anti-link5` | Silencia o usuário |

### Outros Sistemas

- **Anti-Flood:** Previne spam de mensagens
- **Anti-Imagem:** Impede envio de imagens
- **Sistema de Advertências:** 3 advertências = banimento automático
- **Sistema de Mute:** Silenciamento temporário ou permanente

## 🤝 Como Contribuir

O Izuko Bot é um projeto **open source** e sua contribuição é muito bem-vinda!

### 🚀 Como contribuir

- 🐛 **Reportar bugs** através das [Issues](https://github.com/Ninja28032024/izuko-bot-free/issues)
- ✨ **Sugerir novas funcionalidades**
- 🔧 **Contribuir com código** (novos comandos, correções, melhorias)
- ⭐ **Dar uma estrela** no repositório

### 📖 Antes de contribuir

1. Verifique as [Issues abertas](https://github.com/Ninja28032024/izuko-bot-free/issues)
2. Faça um fork do projeto
3. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
4. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
5. Push para a branch (`git push origin feature/MinhaFeature`)
6. Abra um Pull Request

## 🔒 Nota sobre o Código

O código desta versão foi **ofuscado para proteção**. Todas as funcionalidades permanecem intactas e funcionais. A ofuscação inclui:

- ✅ Control Flow Flattening
- ✅ String Array Encoding (Base64)
- ✅ Dead Code Injection
- ✅ Compact Mode
- ✅ String Array Threshold (75%)

## 📜 Licença

Este projeto está licenciado sob a **Licença Pública Geral GNU (GPL-3.0)**. Isso significa que:

✅ **Você pode:**
- Usar este código como quiser, seja para projetos pessoais ou comerciais
- Modificar o código para adaptá-lo às suas necessidades
- Compartilhar ou vender o código, mesmo modificado

⚠️ **Você deve:**
- Manter os créditos ao autor original (Ninja Dev's & Izuko)
- Tornar o código modificado disponível sob a mesma licença GPL-3.0

❌ **Você não pode:**
- Transformar este código em algo proprietário (fechado) e impedir outras pessoas de acessá-lo

Esta licença garante que todos tenham acesso ao código-fonte e podem colaborar livremente, promovendo o compartilhamento e o aprimoramento do projeto.

## 💬 Suporte

Para dúvidas, suporte ou reportar problemas:

- 📖 [Documentação Completa](https://ninja28032024.github.io/izuko-bot-docs/)
- 🐛 [Reportar Bug](https://github.com/Ninja28032024/izuko-bot-free/issues)
- 💡 [Sugerir Feature](https://github.com/Ninja28032024/izuko-bot-free/issues)

## 👨‍💻 Desenvolvido por

**Ninja Dev's & Izuko**

---

<p align="center">
  <strong>⭐ Se este projeto te ajudou, considere dar uma estrela! ⭐</strong>
</p>

<p align="center">
  Feito com 💙 por Ninja Dev's & Izuko
</p>
