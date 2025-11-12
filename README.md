# 🥷 Izuko Bot Free - Versão 2.0

<div align="center">
  <img src="https://files.catbox.moe/3ed8q5.jpg" alt="Izuko Bot Banner" width="100%">
</div>

## 📋 Sobre o Projeto

**Izuko Bot Free** é um bot multifuncional para WhatsApp desenvolvido em Node.js utilizando a biblioteca Baileys. Esta é a versão gratuita e open-source do projeto, oferecendo uma ampla gama de funcionalidades para administração de grupos, moderação, jogos, integração com IA e muito mais.

## ✨ Características Principais

- 🛡️ **Sistemas de Moderação**: Anti-link, Anti-flood, Anti-imagem, Sistema de Mute
- 🎮 **Jogos Interativos**: Jogo da Velha, Cara ou Coroa, Eu Nunca, Sorteios
- 📊 **Sistema de Ranking**: XP, Níveis e Ranking de Mensagens
- 🤖 **Integração com IA**: GPT e Wendel IA para conversas inteligentes
- 🎵 **Download de Mídia**: YouTube, Instagram, SoundCloud e mais
- 🎨 **Criação de Figurinhas**: Conversão de imagens e vídeos
- 📤 **Upload de Arquivos**: Catbox, Google Drive, Telegraph
- ⚙️ **Comandos de Administração**: Promote, Demote, Ban, Configurações de Grupo
- 🎉 **Sistema de Boas-Vindas**: Mensagens personalizadas para novos membros
- 📅 **Agendamento**: Agende mensagens e tarefas

## 🚀 Instalação

### Pré-requisitos

- **Node.js** v20.x (obrigatório)
- **FFmpeg** (para processamento de áudio/vídeo)
- **Git**

### Passos de Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/Ninja28032024/izuko-bot-free.git
cd izuko-bot-free
```
2. **Instale as dependências** ⚠️ **IMPORTANTE**

```bash
npm install
```

> ⚠️ **ATENÇÃO**: Este passo é **OBRIGATÓRIO**! Sem executar `npm install`, você receberá o erro:
> `Error: Cannot find module '@whiskeysockets/baileys'`
>
> O repositório não inclui a pasta `node_modules/` (que contém as dependências). Você **DEVE** executar `npm install` para baixar e instalar todos os módulos necessários.

3. **Configure o bot**

Edite o arquivo `settings/settings.json`:
```json
{
  "prefix": "&",
  "ownerNumber": "SEU_LID@lid",
  "botLid": "BOT_LID@lid",
  "nomeBot": "Izuko Bot",
  "nomeDono": "Seu Nome",
  "versao": "2.0"
}
```

4. **Inicie o bot**
```bash
node main.js
```

ou

```bash
sh start.sh
```

## 📚 Documentação

Para documentação completa sobre todos os comandos e funcionalidades, consulte a [Documentação Completa](DOCUMENTACAO_IZUKO_BOT_VIP.md).

## 🎯 Comandos Principais

### Administração
- `&promote @usuario` - Promove um membro a administrador
- `&demote @usuario` - Remove privilégios de administrador
- `&ban @usuario` - Remove um membro do grupo
- `&grupo-f` / `&grupo-a` - Fecha/Abre o grupo

### Moderação
- `&antilink` - Ativa/desativa proteção contra links
- `&antiflood` - Ativa/desativa proteção contra spam
- `&antiimg` - Ativa/desativa bloqueio de imagens
- `&mute @usuario 10m` - Silencia um usuário

### Jogos
- `&velha @oponente` - Inicia jogo da velha
- `&cara-coroa` - Joga cara ou coroa
- `&eununca` - Inicia o jogo "Eu Nunca"
- `&sortear` - Cria um sorteio

### Mídia
- `&play música` - Baixa música do YouTube
- `&sticker` - Cria figurinha (marque a mídia)
- `&toimg` - Converte figurinha em imagem
- `&tomp3` - Converte vídeo em áudio

### Utilidades
- `&menu` - Exibe o menu completo
- `&ping` - Verifica latência do bot
- `&status` - Mostra status do bot
- `&upload` - Faz upload de mídia

## 🛠️ Tecnologias Utilizadas

- **@whiskeysockets/baileys** - Biblioteca para WhatsApp Web
- **axios** - Cliente HTTP
- **chalk** - Colorização de logs
- **fluent-ffmpeg** - Manipulação de áudio/vídeo
- **sharp** - Processamento de imagens
- **moment-timezone** - Manipulação de datas
- **node-cron** - Agendamento de tarefas

## 📝 Estrutura do Projeto

```
izuko-bot-free/
├── main.js                    # Arquivo principal
├── package.json               # Dependências
├── start.sh                   # Script de inicialização
├── commands/                  # Comandos do bot
├── settings/
│   ├── settings.json          # Configurações
│   └── lib/                   # Bibliotecas auxiliares
├── banco de dados/            # Armazenamento de dados
├── escanear/                  # Scanner de membros
├── node_cache/                # Cache temporário
└── temp/                      # Arquivos temporários
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abrir um Pull Request

## 📄 Licença

Este projeto é distribuído sob a licença ISC.

## 👨‍💻 Desenvolvedor

**Ninja Dev's Of Bots**

## ⚠️ Aviso Legal

Este bot é fornecido "como está", sem garantias de qualquer tipo. O uso deste bot é de sua responsabilidade. Certifique-se de respeitar os Termos de Serviço do WhatsApp ao utilizar bots.

## 🌟 Apoie o Projeto

Se este projeto foi útil para você, considere dar uma ⭐ no repositório!

---

<div align="center">
  <strong>Desenvolvido com ❤️ por Ninja Dev's Of Bots</strong>
</div>
