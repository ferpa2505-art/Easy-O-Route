// OmniRoute constants
export const OMNIROUTE = {
  NAME: 'OmniRoute',
  VERSION: '3.8.54',
  URL: 'https://github.com/diegosouzapw/OmniRoute',
  LOCAL_URL: 'http://localhost:20128',
  API_BASE: 'http://localhost:20128/v1',
  DEFAULT_PORT: 20128,
  CONFIG_DIR: '.omniroute',
  DEFAULT_PASSWORD: 'CHANGEME',
};

// Easy-O-Route constants
export const EASY_OROUTE = {
  NAME: 'Easy-O-Route',
  VERSION: '1.0.1',
  DESCRIPTION: 'Facilitador de Configuracao do OmniRoute',
  AUTHOR: 'Fernando Paulino (ferpa2505-art)',
  REPOSITORY: 'https://github.com/ferpa2505-art/Easy-O-Route',
  LICENSE: 'MIT',
};

// Provider constants
export const PROVIDERS = {
  // Free providers
  MISTRAL: {
    id: 'mistral',
    name: 'Mistral',
    url: 'https://console.mistral.ai',
    models: ['codestral-latest', 'mistral-tiny', 'mistral-small', 'mistral-medium'],
    requiresPayment: false,
    successRate: '95%',
  },
  NVIDIA: {
    id: 'nvidia',
    name: 'NVIDIA',
    url: 'https://build.nvidia.com',
    models: ['llama-3.2-90b', 'llama-3.2-11b', 'llama-3.2-3b', 'llama-3.2-1b'],
    requiresPayment: false,
    successRate: '81%',
  },
  GROQ: {
    id: 'groq',
    name: 'Groq',
    url: 'https://console.groq.com',
    models: ['llama-3.1-70b', 'llama-3.1-8b', 'mixtral-8x7b'],
    requiresPayment: false,
    successRate: '10%',
    note: 'Recusa pedidos grandes (erro 413)',
  },
  GOOGLE: {
    id: 'google',
    name: 'Google Gemini',
    url: 'https://aistudio.google.com',
    models: ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash'],
    requiresPayment: false,
    note: 'Cota diária',
  },
  CLOUDFLARE: {
    id: 'cloudflare',
    name: 'Cloudflare Workers AI',
    url: 'https://dash.cloudflare.com',
    models: ['llama-3.1-8b', 'llama-2-7b'],
    requiresPayment: false,
    note: 'Pede ID da conta e token',
  },
  OPENROUTER: {
    id: 'openrouter',
    name: 'OpenRouter',
    url: 'https://openrouter.ai',
    models: ['mistralai/mistral-7b-instruct', 'openai/gpt-3.5-turbo'],
    requiresPayment: false,
    successRate: '25%',
    note: 'Limite diário baixo',
  },
  OLLAMA_CLOUD: {
    id: 'ollama-cloud',
    name: 'Ollama Cloud',
    url: 'https://ollama.com',
    models: ['llama-3.2-3b', 'llama-3.1-8b'],
    requiresPayment: false,
    note: 'Plano gratuito limitado',
  },
  
  // Paid providers
  DEEPSEEK: {
    id: 'deepseek',
    name: 'DeepSeek',
    url: 'https://platform.deepseek.com',
    models: ['deepseek-chat', 'deepseek-coder'],
    requiresPayment: true,
    note: 'Raciocínio barato, exige saldo',
  },
  ANTHROPIC: {
    id: 'anthropic',
    name: 'Anthropic',
    url: 'https://console.anthropic.com',
    models: ['claude-haiku-5.5', 'claude-sonnet-5.5', 'claude-opus-5.5'],
    requiresPayment: true,
    note: 'Ultimate reserva',
  },
};

// Combo strategies
export const STRATEGIES = {
  PRIORITY: 'priority',
  ROUND_ROBIN: 'round-robin',
  LEAST_USED: 'least-used',
  COST_OPTIMIZED: 'cost-optimized',
  RANDOM: 'random',
};

// Error codes
export const ERROR_CODES = {
  RATE_LIMIT: 429,
  PAYLOAD_TOO_LARGE: 413,
  SERVER_OVERLOADED: 529,
  SERVER_ERROR: 503,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
};

// Default combo templates
export const DEFAULT_COMBOS = {
  economico: {
    name: 'economico',
    description: 'Combo econômico - Gratuitos na frente, pagos por último',
    strategy: STRATEGIES.PRIORITY,
    models: [
      'mistral/codestral-latest',
      'nvidia/llama-3.2-90b',
      'google/gemini-1.5-flash',
      'openrouter/mistralai/mistral-7b-instruct',
      'groq/llama-3.1-70b',
      'cloudflare/llama-3.1-8b',
      'deepseek/deepseek-chat',
      'anthropic/claude-haiku-5.5',
    ],
  },
  rapido: {
    name: 'rapido',
    description: 'Combo rápido - Somente gratuitos e rápidos',
    strategy: STRATEGIES.PRIORITY,
    models: [
      'mistral/codestral-latest',
      'groq/llama-3.1-70b',
      'openrouter/mistralai/mistral-7b-instruct',
      'cloudflare/llama-3.1-8b',
    ],
  },
  melhores: {
    name: 'melhores',
    description: 'Combo de qualidade - Modelos fortes para código',
    strategy: STRATEGIES.PRIORITY,
    models: [
      'mistral/codestral-latest',
      'nvidia/llama-3.2-90b',
      'google/gemini-1.5-pro',
      'deepseek/deepseek-coder',
      'anthropic/claude-sonnet-5.5',
      'anthropic/claude-haiku-5.5',
    ],
  },
};

// File paths
export const PATHS = {
  CONFIG: '.omniroute/config.json',
  API_KEYS: '.omniroute/api_keys.json',
  PROVIDERS: '.omniroute/providers.json',
  COMBOS: '.omniroute/combos.json',
  BACKUPS: '.omniroute/backups',
};

// Messages
export const MESSAGES = {
  WELCOME: 'Bem-vindo ao Easy-O-Route!',
  SUCCESS: 'Operação concluída com sucesso!',
  ERROR: 'Ocorreu um erro:',
  WARNING: 'Atenção:',
  INFO: 'Informação:',
  GOODBYE: 'Até logo!',
  
  // Setup
  SETUP_START: 'Iniciando configuração do OmniRoute...',
  SETUP_COMPLETE: 'Configuração concluída!',
  SETUP_SKIP: 'Configuração pulada.',
  
  // Providers
  PROVIDER_ADD_SUCCESS: 'Provedor adicionado com sucesso!',
  PROVIDER_REMOVE_SUCCESS: 'Provedor removido com sucesso!',
  PROVIDER_TEST_SUCCESS: 'Conexão testada com sucesso!',
  PROVIDER_NOT_FOUND: 'Provedor não encontrado.',
  
  // API Keys
  API_KEY_ADD_SUCCESS: 'Chave API adicionada com sucesso!',
  API_KEY_REMOVE_SUCCESS: 'Chave API removida com sucesso!',
  API_KEY_NOT_FOUND: 'Chave API não encontrada.',
  
  // Combos
  COMBO_CREATE_SUCCESS: 'Combo criado com sucesso!',
  COMBO_DELETE_SUCCESS: 'Combo deletado com sucesso!',
  COMBO_NOT_FOUND: 'Combo não encontrado.',
  COMBO_ALREADY_EXISTS: 'Combo já existe.',
  
  // Backup
  BACKUP_CREATE_SUCCESS: 'Backup criado com sucesso!',
  BACKUP_RESTORE_SUCCESS: 'Backup restaurado com sucesso!',
  BACKUP_DELETE_SUCCESS: 'Backup deletado com sucesso!',
  BACKUP_NOT_FOUND: 'Backup não encontrado.',
  
  // Validation
  VALIDATION_SUCCESS: 'Configuração válida!',
  VALIDATION_FAILED: 'Configuração inválida:',
};

// Help texts
export const HELP = {
  DESCRIPTION: 'Facilitador de Configuracao do OmniRoute - CLI para gerenciar provedores, combos e chaves API',
  
  COMMANDS: {
    SETUP: 'Configuração inicial do OmniRoute',
    API: 'Gerenciar chaves API',
    PROVIDER: 'Gerenciar provedores',
    COMBO: 'Gerenciar combos',
    BACKUP: 'Gerenciar backups',
    VALIDATE: 'Validar configuração',
    STATUS: 'Status do OmniRoute',
    VERSION: 'Versão do Easy-O-Route',
  },
  
  EXAMPLES: {
    SETUP: 'easy-o-route setup',
    API_ADD: 'easy-o-route api add --provider mistral --key SUA_CHAVE',
    API_LIST: 'easy-o-route api list',
    PROVIDER_LIST: 'easy-o-route provider list',
    PROVIDER_TEST: 'easy-o-route provider test mistral',
    COMBO_CREATE: 'easy-o-route combo create economico --strategy priority --models "mistral/codestral-latest,nvidia/llama-3.2-90b"',
    BACKUP_CREATE: 'easy-o-route backup create',
    VALIDATE: 'easy-o-route validate',
    STATUS: 'easy-o-route status',
    VERSION: 'easy-o-route version',
  },
};
