#!/bin/bash

# Easy-O-Route Setup Script
# Facilitador de Configuracao do OmniRoute
# Autor: Fernando Paulino (ferpa2505-art)
# Versao: 1.0.0

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_title() {
    echo ""
    echo -e "${CYAN}============================================================${NC}"
    echo -e "${CYAN}  $1${NC}"
    echo -e "${CYAN}============================================================${NC}"
    echo ""
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    log_error "Nao execute este script como root!"
    exit 1
fi

# Display banner
log_title "🚀 Easy-O-Route Setup Script"
echo -e "${CYAN}✨ O Facilitador Definitivo para Configuracao do OmniRoute${NC}"
echo ""

# Step 1: Check Node.js
log_title "1. Verificando Node.js"

if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    NPM_VERSION=$(npm --version)
    log_info "Node.js: $NODE_VERSION"
    log_info "npm: $NPM_VERSION"
    
    # Check version
    if [[ ! $NODE_VERSION =~ ^v22\. || ! $NODE_VERSION =~ ^v24\. ]]; then
        log_warn "Recomendado: Node.js 22.x ou 24.x (LTS)"
    fi
else
    log_error "Node.js nao encontrado!"
    log_info "Instale o Node.js em: https://nodejs.org"
    exit 1
fi

# Step 2: Install OmniRoute
log_title "2. Instalando OmniRoute"

if command -v omniroute &> /dev/null; then
    INSTALLED_VERSION=$(omniroute --version 2>&1 || true)
    log_info "OmniRoute ja esta instalado (versao: $INSTALLED_VERSION)"
    
    read -p "Deseja reinstalar? (s/n) [n]: " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        FORCE_INSTALL=true
    fi
else
    FORCE_INSTALL=true
fi

if [ "$FORCE_INSTALL" = true ]; then
    log_info "Instalando OmniRoute..."
    
    # Try standard install
    if npm install -g omniroute --force; then
        log_success "OmniRoute instalado com sucesso!"
    else
        log_info "Tentando com --allow-scripts..."
        npm install -g omniroute --allow-scripts=omniroute,keytar,onnxruntime-node,@parcel/watcher,@swc/core,protobufjs,esbuild --force
        log_success "OmniRoute instalado com sucesso!"
    fi
fi

# Step 3: Verify installation
log_title "3. Verificando Instalacao"

if command -v omniroute &> /dev/null; then
    VERSION=$(omniroute --version 2>&1 || true)
    log_success "OmniRoute instalado: $VERSION"
else
    log_error "Falha ao instalar OmniRoute"
    exit 1
fi

# Step 4: Start OmniRoute
log_title "4. Iniciando OmniRoute"

read -p "Deseja iniciar o OmniRoute agora? (s/n) [s]: " -n 1 -r
echo

if [[ $REPLY =~ ^[Ss]$ || -z $REPLY ]]; then
    log_info "Para iniciar o OmniRoute manualmente, execute:"
    log_info "  omniroute"
    log_info ""
    log_info "Acesse o painel em: http://localhost:20128"
    log_info ""
    log_warn "Senha padrao: CHANGEME"
    log_warn "TROQUE A SENHA no primeiro acesso!"
else
    log_info "Para iniciar o OmniRoute manualmente, execute: omniroute"
fi

# Step 5: Configure autostart
log_title "5. Configurando Inicio Automatico (Opcional)"

read -p "Deseja configurar inicio automatico? (s/n) [n]: " -n 1 -r
echo

if [[ $REPLY =~ ^[Ss]$ ]]; then
    if omniroute autostart enable; then
        log_success "Inicio automatico configurado!"
    else
        log_warn "Nao foi possivel configurar inicio automatico"
        log_info "Tente manualmente: omniroute autostart enable"
    fi
fi

# Step 6: Doctor check
log_title "6. Check-up Inicial"

log_info "Executando omniroute doctor..."
echo ""
omniroute doctor || true
echo ""

# Summary
log_title "✅ Setup Concluido"

echo ""
log_info "📋 Resumo:"
log_info ""
log_info "  Node.js:     $(node --version 2>&1 || echo 'Nao instalado')"
log_info "  npm:         $(npm --version 2>&1 || echo 'Nao instalado')"
log_info "  OmniRoute:   $(omniroute --version 2>&1 || echo 'Nao instalado')"
echo ""
log_info "Próximos passos:"
log_info "  1. Inicie o OmniRoute: omniroute"
log_info "  2. Acesse: http://localhost:20128"
log_info "  3. Troque a senha padrao (CHANGEME)"
log_info "  4. Conecte seus provedores"
log_info "  5. Crie seus combos"
echo ""

log_success "✅ Configuracao inicial concluida!"
echo ""

exit 0
