#!/bin/bash
CYAN='\033[0;36m'
NOCOLOR='\033[0m'

while :
do
echo -e "${CYAN} 
 💧 IZUKO BOT VIP V1.5 - VERSÃO OTIMIZADA
 🔒 OFUSCAÇÃO LEVE - BAIXO CONSUMO DE MEMÓRIA
 ⚡ AUTO RECONEXÃO ATIVADA
 📊 LIMITE DE MEMÓRIA: 512MB
 ⏳ AGUARDE O CARREGAMENTO...${NOCOLOR}"
node --max-old-space-size=512 main.js 
sleep 1      
done
