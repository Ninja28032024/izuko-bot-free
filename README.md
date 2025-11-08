# 💧 Izuko Bot VIP - Free Edition

<p align="center">
  <img src="https://files.catbox.moe/liglfb.jpg" alt="Izuko Bot" width="800"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-v20+-green?style=for-the-badge&logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/WhatsApp-Bot-25D366?style=for-the-badge&logo=whatsapp" alt="WhatsApp">
  <img src="https://img.shields.io/badge/Versão-1.5_Free-blue?style=for-the-badge" alt="Versão">
  <img src="https://img.shields.io/badge/Licença-GPL--3.0-red?style=for-the-badge" alt="Licença">
</p>

> Bot multifuncional para WhatsApp com 144 comandos, sistema de ranking, moderação avançada e muito mais!

## 📋 Sumário

1. [Sobre o projeto](#-sobre-este-projeto)
2. [Principais Funcionalidades](#-principais-funcionalidades)
3. [Instalação](#-instalação)
   - [Instalação no Termux](#instalação-no-termux)
   - [Instalação em VPS (Debian/Ubuntu)](#instalação-em-vps-debianubuntu)
   - [Instalação no Windows](#instalação-no-windows)
4. [Configuração](#️-configuração)
5. [Estrutura de Pastas](#-estrutura-de-pastas)
6. [Documentação Completa](#-documentação-completa)
7. [Categorias de Comandos](#-categorias-de-comandos)
8. [Sistema de Ranking](#-sistema-de-ranking)
9. [Sistema de Moderação](#️-sistema-de-moderação)
10. [Como Contribuir](#-como-contribuir)
11. [Licença](#-licença)

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

- Node.js v18 ou superior (recomendado v20+)
- NPM ou Yarn
- Git
- FFmpeg (para processamento de mídia)
- Conta do WhatsApp

### Instalação no Termux

1. **Abra o Termux e atualize os pacotes:**

_Não tem o Termux? [Clique aqui e baixe a última versão](https://www.mediafire.com/file/wxpygdb9bcb5npb/Termux_0.118.3_Dev_Gui.apk) ou [clique aqui e baixe versão da Play Store](https://play.google.com/store/apps/details?id=com.termux) caso a versão do MediaFire não funcione._

```sh
pkg upgrade -y && pkg update -y
```

2. **Instale as dependências necessárias:**

```sh
pkg install git -y && pkg install nodejs-lts -y && pkg install ffmpeg -y && pkg install imagemagick -y
```

3. **Habilite o acesso à pasta storage:**

```sh
termux-setup-storage
```

4. **Navegue até a pasta desejada:**

Pastas mais utilizadas:
- `/sdcard`
- `/storage/emulated/0`
- `/storage/emulated/0/Download`

```sh
cd /sdcard
```

5. **Clone o repositório:**

```sh
git clone https://github.com/Ninja28032024/izuko-bot-free.git
```

6. **Entre na pasta:**

```sh
cd izuko-bot-free
```

7. **Instale as dependências do Node.js:**

```sh
npm install
```

8. **Configure o bot:**

Edite o arquivo `settings/settings.json` com seus dados (veja seção de [Configuração](#️-configuração))

9. **Inicie o bot:**

```sh
node main.js
```

ou use o script de auto-reconexão:

```sh
sh start.sh
```

10. **Escaneie o QR Code:**
- Um QR Code aparecerá no terminal
- Abra o WhatsApp > Aparelhos conectados > Conectar um aparelho
- Escaneie o QR Code
- Aguarde a conexão ser estabelecida

### Instalação em VPS (Debian/Ubuntu)

1. **Atualize o sistema:**

```sh
sudo apt update && sudo apt upgrade -y
```

2. **Instale o Node.js v20:**

```sh
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

3. **Instale as dependências do sistema:**

```sh
sudo apt install git ffmpeg imagemagick -y
```

4. **Clone o repositório:**

```sh
git clone https://github.com/Ninja28032024/izuko-bot-free.git
cd izuko-bot-free
```

5. **Instale as dependências do Node.js:**

```sh
npm install
```

6. **Configure o bot:**

Edite o arquivo `settings/settings.json` com seus dados

7. **Inicie o bot:**

```sh
node main.js
```

**Para manter o bot rodando em background (opcional):**

Instale o PM2:
```sh
sudo npm install -g pm2
```

Inicie o bot com PM2:
```sh
pm2 start main.js --name IzukoBot
pm2 save
pm2 startup
```

Comandos úteis do PM2:
```sh
pm2 status          # Ver status
pm2 logs IzukoBot   # Ver logs
pm2 restart IzukoBot # Reiniciar
pm2 stop IzukoBot   # Parar
```

### Instalação no Windows

1. **Instale o Node.js:**

Baixe e instale o [Node.js v20+](https://nodejs.org/)

2. **Instale o Git:**

Baixe e instale o [Git](https://git-scm.com/)

3. **Instale o FFmpeg:**

- Baixe o [FFmpeg](https://ffmpeg.org/download.html)
- Extraia e adicione ao PATH do Windows
- Ou use o Chocolatey: `choco install ffmpeg`

4. **Abra o CMD ou PowerShell e clone o repositório:**

```sh
git clone https://github.com/Ninja28032024/izuko-bot-free.git
cd izuko-bot-free
```

5. **Instale as dependências:**

```sh
npm install
```

6. **Configure o bot:**

Edite o arquivo `settings/settings.json` com seus dados

7. **Inicie o bot:**

```sh
node main.js
```

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

### Parâmetros de Configuração

| Parâmetro | Descrição | Exemplo |
|:----------|:----------|:--------|
| `prefix` | Caractere usado para invocar comandos | `&`, `/`, `!` |
| `ownerNumber` | JID do dono do bot (garante acesso a comandos restritos) | `5511999999999@lid` |
| `botLid` | JID do próprio bot | `5511888888888@lid` |
| `nomeBot` | Nome do bot que aparecerá nas mensagens | `Izuko Bot` |
| `nomeDono` | Nome do dono que aparecerá nas mensagens | `Seu Nome` |
| `versao` | Versão atual do bot | `1.5` |

**Como obter o JID (LID):**
1. Inicie o bot pela primeira vez
2. Envie uma mensagem para o bot
3. O JID será exibido nos logs do console
4. Formato: `5511999999999@lid` (número + @lid)

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

## 🛠️ Tecnologias Utilizadas

Este projeto utiliza as seguintes dependências:

- **[@whiskeysockets/baileys](https://github.com/WhiskeySockets/Baileys)** - Biblioteca principal para WhatsApp
- **[axios](https://axios-http.com/)** `v1.12.2` - Cliente HTTP para requisições
- **[chalk](https://github.com/chalk/chalk)** `v4.1.2` - Estilização de logs no console
- **[cheerio](https://cheerio.js.org/)** `v1.1.2` - Parser HTML para web scraping
- **[fluent-ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg)** `v2.1.3` - Processamento de mídia
- **[form-data](https://github.com/form-data/form-data)** `v4.0.4` - Envio de formulários multipart
- **[googleapis](https://github.com/googleapis/google-api-nodejs-client)** `v162.0.0` - Integração com Google Drive
- **[megajs](https://github.com/qgustavor/mega)** `v1.3.9` - Download de arquivos do Mega
- **[moment-timezone](https://momentjs.com/timezone/)** `v0.5.45` - Manipulação de datas e fusos horários
- **[node-cache](https://github.com/node-cache/node-cache)** `v5.1.2` - Sistema de cache em memória
- **[node-cleanup](https://github.com/jtlapp/node-cleanup)** `v2.1.2` - Gerenciamento de limpeza ao encerrar
- **[node-cron](https://github.com/node-cron/node-cron)** `v4.2.1` - Agendamento de tarefas
- **[node-webpmux](https://github.com/Secreto31126/node-webpmux)** `v3.2.0` - Manipulação de stickers WebP
- **[pino](https://github.com/pinojs/pino)** `v7.11.0` - Sistema de logging estruturado
- **[sharp](https://sharp.pixelplumbing.com/)** `v0.34.4` - Processamento de imagens

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
- Compartilhar o código de forma gratuita

⚠️ **Você deve:**
- Manter os créditos ao autor original (Ninja Dev's & Izuko)
- Tornar o código modificado disponível sob a mesma licença GPL-3.0

❌ **Você não pode:**
- Transformar este código em algo proprietário (fechado) e impedir outras pessoas de acessá-lo
- Vender este código ou versões modificadas sem consentimento expresso do autor original

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
