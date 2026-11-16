#!/bin/bash

# Easy-O-Route Start Script
# Inicia o OmniRoute
# Autor: Fernando Paulino (ferpa2505-art)

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo -e "${CYAN}============================================================${NC}"
echo -e "${CYAN}  🚀 Easy-O-Route Start Script${NC}"
echo -e "${CYAN}============================================================${NC}"
echo ""

# Check if OmniRoute is installed
if ! command -v omniroute &> /dev/null; then
    log_error "OmniRoute nao esta instalado!"
    log_info "Instale com: npm install -g omniroute"
    exit 1
fi

# Check if already running
if pgrep -x "omniroute" > /dev/null 2>&1; then
    log_info "OmniRoute ja esta rodando!"
    log_info "Acesse: http://localhost:20128"
    exit 0
fi

# Start OmniRoute
log_info "Iniciando OmniRoute..."
log_info "Acesse: http://localhost:20128"
log_info "Senha padrao: CHANGEME"
log_warn "TROQUE A SENHA no primeiro acesso!"
echo ""

# Start in background and log output
exec omniroute >> ~/.omniroute/omniroute.log 2>&1 &

# Wait a bit and check
sleep 3

if curl -s http://localhost:20128 > /dev/null 2>&1; then
    log_success "OmniRoute iniciado com sucesso!"
else
    log_error "Falha ao iniciar OmniRoute"
    log_info "Verifique o log: ~/.omniroute/omniroute.log"
    exit 1
fi

exit 0
