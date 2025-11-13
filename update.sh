#!/bin/bash

# =========================================
# IZUKO BOT - SISTEMA DE ATUALIZAÇÃO
# =========================================
# Autor: Ninja Team
# Repositório: https://github.com/Ninja28032024/izuko-bot-free.git
# Descrição: Atualiza commands, settings/lib e main.js mantendo conexão e dados
# =========================================

# Cores para o terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Configurações
REPO_URL="https://github.com/Ninja28032024/izuko-bot-free"
REPO_BRANCH="main"
TEMP_DIR="./temp_update"
BACKUP_DIR="./backup_$(date +%Y%m%d_%H%M%S)"

# Função para exibir o banner
show_banner() {
    clear
    echo -e "${CYAN}"
    echo "╔═══════════════════════════════════════════════════════════╗"
    echo "║                                                           ║"
    echo "║        ██╗███████╗██╗   ██╗██╗  ██╗ ██████╗              ║"
    echo "║        ██║╚══███╔╝██║   ██║██║ ██╔╝██╔═══██╗             ║"
    echo "║        ██║  ███╔╝ ██║   ██║█████╔╝ ██║   ██║             ║"
    echo "║        ██║ ███╔╝  ██║   ██║██╔═██╗ ██║   ██║             ║"
    echo "║        ██║███████╗╚██████╔╝██║  ██╗╚██████╔╝             ║"
    echo "║        ╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝              ║"
    echo "║                                                           ║"
    echo "║              SISTEMA DE ATUALIZAÇÃO AUTOMÁTICA            ║"
    echo "║                      Versão 2.0                           ║"
    echo "║                                                           ║"
    echo "╚═══════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Função para exibir barra de progresso
show_progress() {
    local current=$1
    local total=$2
    local task=$3
    local percent=$((current * 100 / total))
    local filled=$((percent / 2))
    local empty=$((50 - filled))
    
    printf "\r${CYAN}[${GREEN}"
    printf "%${filled}s" | tr ' ' '█'
    printf "${WHITE}"
    printf "%${empty}s" | tr ' ' '░'
    printf "${CYAN}] ${WHITE}%3d%% ${YELLOW}%s${NC}" "$percent" "$task"
}

# Função para verificar e instalar dependências
check_dependencies() {
    echo -e "\n${YELLOW}[1/7] Verificando dependências...${NC}"
    sleep 0.5
    
    # Verificar se curl ou wget está disponível
    if ! command -v curl &> /dev/null && ! command -v wget &> /dev/null; then
        echo -e "${YELLOW}Instalando curl...${NC}"
        if command -v apt-get &> /dev/null; then
            sudo apt-get update -qq && sudo apt-get install -y curl -qq
        elif command -v yum &> /dev/null; then
            sudo yum install -y curl -q
        else
            echo -e "${RED}❌ Não foi possível instalar curl automaticamente!${NC}"
            exit 1
        fi
    fi
    
    # Verificar se unzip está disponível
    if ! command -v unzip &> /dev/null; then
        echo -e "${YELLOW}Instalando unzip...${NC}"
        if command -v apt-get &> /dev/null; then
            sudo apt-get install -y unzip -qq
        elif command -v yum &> /dev/null; then
            sudo yum install -y unzip -q
        fi
    fi
    
    show_progress 1 7 "Dependências verificadas"
    sleep 0.3
}

# Função para criar backup
create_backup() {
    echo -e "\n\n${YELLOW}[2/7] Criando backup de segurança...${NC}"
    sleep 0.5
    
    mkdir -p "$BACKUP_DIR"
    
    if [ -f "main.js" ]; then
        cp main.js "$BACKUP_DIR/" 2>/dev/null
    fi
    
    if [ -d "commands" ]; then
        cp -r commands "$BACKUP_DIR/" 2>/dev/null
    fi
    
    if [ -d "settings/lib" ]; then
        mkdir -p "$BACKUP_DIR/settings"
        cp -r settings/lib "$BACKUP_DIR/settings/" 2>/dev/null
    fi
    
    show_progress 2 7 "Backup criado em: $BACKUP_DIR"
    sleep 0.3
}

# Função para baixar repositório (método alternativo sem Git)
download_repository() {
    echo -e "\n\n${YELLOW}[3/7] Baixando atualizações do repositório...${NC}"
    sleep 0.5
    
    # Remover diretório temporário se existir
    if [ -d "$TEMP_DIR" ]; then
        rm -rf "$TEMP_DIR"
    fi
    
    mkdir -p "$TEMP_DIR"
    
    # URL do ZIP do repositório
    ZIP_URL="${REPO_URL}/archive/refs/heads/${REPO_BRANCH}.zip"
    ZIP_FILE="$TEMP_DIR/repo.zip"
    
    # Baixar usando curl ou wget
    if command -v curl &> /dev/null; then
        curl -L -s "$ZIP_URL" -o "$ZIP_FILE"
    elif command -v wget &> /dev/null; then
        wget -q "$ZIP_URL" -O "$ZIP_FILE"
    else
        echo -e "\n${RED}❌ Erro: curl ou wget não encontrado!${NC}"
        exit 1
    fi
    
    if [ $? -eq 0 ] && [ -f "$ZIP_FILE" ]; then
        # Extrair ZIP
        unzip -q "$ZIP_FILE" -d "$TEMP_DIR"
        
        # Mover conteúdo para o diretório correto
        EXTRACTED_DIR=$(find "$TEMP_DIR" -maxdepth 1 -type d -name "izuko-bot-free-*" | head -n 1)
        if [ -n "$EXTRACTED_DIR" ]; then
            mv "$EXTRACTED_DIR"/* "$TEMP_DIR/" 2>/dev/null
            rm -rf "$EXTRACTED_DIR"
        fi
        
        rm -f "$ZIP_FILE"
        show_progress 3 7 "Repositório baixado com sucesso"
    else
        echo -e "\n${RED}❌ Erro ao baixar repositório!${NC}"
        exit 1
    fi
    sleep 0.3
}

# Função para atualizar arquivos
update_files() {
    echo -e "\n\n${YELLOW}[4/7] Atualizando arquivos do bot...${NC}"
    sleep 0.5
    
    # Atualizar main.js
    if [ -f "$TEMP_DIR/main.js" ]; then
        cp "$TEMP_DIR/main.js" ./main.js
        echo -e "${GREEN}  ✓ main.js atualizado${NC}"
    fi
    
    # Atualizar pasta commands
    if [ -d "$TEMP_DIR/commands" ]; then
        rm -rf ./commands
        cp -r "$TEMP_DIR/commands" ./commands
        echo -e "${GREEN}  ✓ Pasta commands atualizada${NC}"
    fi
    
    # Atualizar pasta settings/lib
    if [ -d "$TEMP_DIR/settings/lib" ]; then
        rm -rf ./settings/lib
        mkdir -p ./settings
        cp -r "$TEMP_DIR/settings/lib" ./settings/lib
        echo -e "${GREEN}  ✓ Pasta settings/lib atualizada${NC}"
    fi
    
    show_progress 4 7 "Arquivos atualizados"
    sleep 0.3
}

# Função para limpar arquivos temporários
cleanup() {
    echo -e "\n\n${YELLOW}[5/7] Limpando arquivos temporários...${NC}"
    sleep 0.5
    
    if [ -d "$TEMP_DIR" ]; then
        rm -rf "$TEMP_DIR"
    fi
    
    show_progress 5 7 "Arquivos temporários removidos"
    sleep 0.3
}

# Função para verificar integridade
verify_integrity() {
    echo -e "\n\n${YELLOW}[6/7] Verificando integridade dos arquivos...${NC}"
    sleep 0.5
    
    local errors=0
    
    if [ ! -f "main.js" ]; then
        echo -e "${RED}  ✗ main.js não encontrado${NC}"
        ((errors++))
    else
        echo -e "${GREEN}  ✓ main.js OK${NC}"
    fi
    
    if [ ! -d "commands" ]; then
        echo -e "${RED}  ✗ Pasta commands não encontrada${NC}"
        ((errors++))
    else
        echo -e "${GREEN}  ✓ Pasta commands OK${NC}"
    fi
    
    if [ ! -d "settings/lib" ]; then
        echo -e "${RED}  ✗ Pasta settings/lib não encontrada${NC}"
        ((errors++))
    else
        echo -e "${GREEN}  ✓ Pasta settings/lib OK${NC}"
    fi
    
    # Verificar se arquivos importantes foram preservados
    if [ -d "banco de dados/ninja-qr" ]; then
        echo -e "${GREEN}  ✓ Conexão preservada (ninja-qr)${NC}"
    fi
    
    if [ -f "settings/settings.json" ]; then
        echo -e "${GREEN}  ✓ Configurações preservadas${NC}"
    fi
    
    if [ $errors -eq 0 ]; then
        show_progress 6 7 "Integridade verificada - Tudo OK"
    else
        echo -e "\n${RED}❌ Foram encontrados $errors erro(s)!${NC}"
        echo -e "${YELLOW}Restaurando backup...${NC}"
        
        if [ -d "$BACKUP_DIR" ]; then
            cp -r "$BACKUP_DIR"/* ./
            echo -e "${GREEN}✓ Backup restaurado com sucesso${NC}"
        fi
        exit 1
    fi
    sleep 0.3
}

# Função para finalizar
finalize() {
    echo -e "\n\n${YELLOW}[7/7] Finalizando atualização...${NC}"
    sleep 0.5
    
    show_progress 7 7 "Atualização concluída"
    
    echo -e "\n\n${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                                                           ║${NC}"
    echo -e "${GREEN}║           ✓ ATUALIZAÇÃO CONCLUÍDA COM SUCESSO!            ║${NC}"
    echo -e "${GREEN}║                                                           ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
    
    echo -e "\n${CYAN}📦 Arquivos atualizados:${NC}"
    echo -e "  ${WHITE}• main.js${NC}"
    echo -e "  ${WHITE}• commands/ (todos os comandos)${NC}"
    echo -e "  ${WHITE}• settings/lib/ (bibliotecas)${NC}"
    
    echo -e "\n${CYAN}🔒 Arquivos preservados:${NC}"
    echo -e "  ${WHITE}• banco de dados/ (incluindo ninja-qr)${NC}"
    echo -e "  ${WHITE}• settings/settings.json${NC}"
    echo -e "  ${WHITE}• package.json${NC}"
    echo -e "  ${WHITE}• node_modules/${NC}"
    
    echo -e "\n${CYAN}💾 Backup salvo em:${NC} ${YELLOW}$BACKUP_DIR${NC}"
    
    echo -e "\n${PURPLE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${YELLOW}Para aplicar as atualizações, reinicie o bot:${NC}"
    echo -e "${WHITE}  npm start${NC} ou ${WHITE}node main.js${NC}"
    echo -e "${PURPLE}═══════════════════════════════════════════════════════════${NC}\n"
}

# Função para confirmar atualização
confirm_update() {
    echo -e "\n${YELLOW}⚠️  ATENÇÃO: Esta operação irá atualizar os seguintes arquivos:${NC}"
    echo -e "  ${WHITE}• main.js${NC}"
    echo -e "  ${WHITE}• commands/ (pasta completa)${NC}"
    echo -e "  ${WHITE}• settings/lib/ (pasta completa)${NC}"
    
    echo -e "\n${GREEN}✓ Os seguintes arquivos serão PRESERVADOS:${NC}"
    echo -e "  ${WHITE}• banco de dados/ (incluindo ninja-qr - sua conexão)${NC}"
    echo -e "  ${WHITE}• settings/settings.json${NC}"
    echo -e "  ${WHITE}• package.json${NC}"
    echo -e "  ${WHITE}• node_modules/${NC}"
    
    echo -e "\n${CYAN}📦 Um backup será criado automaticamente antes da atualização.${NC}"
    
    echo -e "\n${YELLOW}Deseja continuar? (s/n):${NC} "
    read -r response
    
    if [[ ! "$response" =~ ^[Ss]$ ]]; then
        echo -e "\n${RED}❌ Atualização cancelada pelo usuário.${NC}\n"
        exit 0
    fi
}

# =========================================
# EXECUÇÃO PRINCIPAL
# =========================================

show_banner

confirm_update

echo -e "\n${CYAN}Iniciando processo de atualização...${NC}\n"
sleep 1

check_dependencies
create_backup
download_repository
update_files
cleanup
verify_integrity
finalize

exit 0
