// Lista de provedores gratuitos de IA conhecidos
// com suas configurações padrão para o OmniRoute

export interface FreeProvider {
  name: string;
  displayName: string;
  baseUrl: string;
  apiKeyEnv?: string;
  isFree: boolean;
  requiresApiKey: boolean;
  models: string[];
  description: string;
  category: 'text' | 'image' | 'embedding' | 'audio';
  difficulty: 'easy' | 'medium' | 'hard';
  docsUrl: string;
}

export interface ProviderSuggestion {
  provider: FreeProvider;
  status: 'not-connected' | 'connected' | 'partial';
  modelsConnected?: string[];
  recommendations: string[];
}

// Provedores gratuitos populares
export const FREE_PROVIDERS: FreeProvider[] = [
  {
    name: 'openai',
    displayName: 'OpenAI (Free Tier)',
    baseUrl: 'https://api.openai.com/v1',
    apiKeyEnv: 'OPENAI_API_KEY',
    isFree: true,
    requiresApiKey: true,
    models: [
      'gpt-3.5-turbo',
      'gpt-3.5-turbo-16k',
      'gpt-4o-mini',
    ],
    description: 'OpenAI oferece créditos gratuitos para novos usuários',
    category: 'text',
    difficulty: 'easy',
    docsUrl: 'https://platform.openai.com/docs/api-reference',
  },
  {
    name: 'anthropic',
    displayName: 'Anthropic (Free Tier)',
    baseUrl: 'https://api.anthropic.com/v1',
    apiKeyEnv: 'ANTHROPIC_API_KEY',
    isFree: true,
    requiresApiKey: true,
    models: [
      'claude-3-haiku-20240307',
      'claude-3-5-sonnet-20240620',
    ],
    description: 'Claude 3 Haiku e Sonnet têm uso gratuito limitado',
    category: 'text',
    difficulty: 'easy',
    docsUrl: 'https://docs.anthropic.com/en/docs',
  },
  {
    name: 'groq',
    displayName: 'Groq',
    baseUrl: 'https://api.groq.com/v1',
    apiKeyEnv: 'GROQ_API_KEY',
    isFree: true,
    requiresApiKey: true,
    models: [
      'llama-3.1-8b-instant',
      'llama-3.1-70b-versatile',
      'mixtral-8x7b-instruct-v0.1',
      'gemma-7b-it',
    ],
    description: 'Alta velocidade, vários modelos gratuitos',
    category: 'text',
    difficulty: 'easy',
    docsUrl: 'https://console.groq.com/docs',
  },
  {
    name: 'mistral',
    displayName: 'Mistral AI',
    baseUrl: 'https://api.mistral.ai/v1',
    apiKeyEnv: 'MISTRAL_API_KEY',
    isFree: true,
    requiresApiKey: true,
    models: [
      'mistral-tiny',
      'mistral-small',
      'mistral-medium',
    ],
    description: 'Modelos de código aberto com bom custo-benefício',
    category: 'text',
    difficulty: 'easy',
    docsUrl: 'https://docs.mistral.ai',
  },
  {
    name: 'google',
    displayName: 'Google Vertex AI',
    baseUrl: 'https://us-central1-aiplatform.googleapis.com/v1',
    apiKeyEnv: 'GOOGLE_API_KEY',
    isFree: true,
    requiresApiKey: true,
    models: [
      'gemini-1.5-flash',
      'gemini-1.0-pro',
    ],
    description: 'Gemini com créditos gratuitos mensais',
    category: 'text',
    difficulty: 'medium',
    docsUrl: 'https://cloud.google.com/vertex-ai',
  },
  {
    name: 'cohere',
    displayName: 'Cohere',
    baseUrl: 'https://api.cohere.ai/v1',
    apiKeyEnv: 'COHERE_API_KEY',
    isFree: true,
    requiresApiKey: true,
    models: [
      'command-r-plus',
      'command',
      'embed-english-v3.0',
    ],
    description: 'Modelos para texto e embeddings gratuitos',
    category: 'text',
    difficulty: 'easy',
    docsUrl: 'https://docs.cohere.com',
  },
  {
    name: 'fireworks',
    displayName: 'Fireworks AI',
    baseUrl: 'https://api.fireworks.ai/inference/v1',
    apiKeyEnv: 'FIREWORKS_API_KEY',
    isFree: true,
    requiresApiKey: true,
    models: [
      'accounts/fireworks/models/llama-v3p1-8b-instruct',
      'accounts/fireworks/models/mixtral-8x7b-instruct',
    ],
    description: 'Modelos de código aberto gratuitos',
    category: 'text',
    difficulty: 'medium',
    docsUrl: 'https://fireworks.ai',
  },
  {
    name: 'together',
    displayName: 'Together AI',
    baseUrl: 'https://api.together.xyz/v1',
    apiKeyEnv: 'TOGETHER_API_KEY',
    isFree: true,
    requiresApiKey: true,
    models: [
      'meta-llama/Llama-3.1-8B-Instruct',
      'mistralai/Mistral-7B-Instruct-v0.3',
      'Qwen/Qwen2-7B-Instruct',
    ],
    description: 'Acesso a centenas de modelos de código aberto',
    category: 'text',
    difficulty: 'medium',
    docsUrl: 'https://www.together.ai',
  },
  {
    name: 'litellm',
    displayName: 'LiteLLM',
    baseUrl: 'https://api.litellm.ai/v1',
    apiKeyEnv: 'LITELLM_API_KEY',
    isFree: false,
    requiresApiKey: true,
    models: [],
    description: 'Proxy para múltiplos provedores (requer configuração)',
    category: 'text',
    difficulty: 'hard',
    docsUrl: 'https://litellm.ai',
  },
  {
    name: 'openrouter',
    displayName: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    apiKeyEnv: 'OPENROUTER_API_KEY',
    isFree: true,
    requiresApiKey: true,
    models: [
      'openai/gpt-3.5-turbo',
      'anthropic/claude-3-haiku',
      'google/gemini-flash-1.5',
      'meta-llama/llama-3.1-8b-instruct',
    ],
    description: 'Gateway para vários provedores com créditos gratuitos',
    category: 'text',
    difficulty: 'easy',
    docsUrl: 'https://openrouter.ai',
  },
  {
    name: 'perplexity',
    displayName: 'Perplexity AI',
    baseUrl: 'https://api.perplexity.ai/v1',
    apiKeyEnv: 'PERPLEXITY_API_KEY',
    isFree: true,
    requiresApiKey: true,
    models: [
      'llama-3.1-sonar-large-128k-online',
      'llama-3.1-sonar-small-128k-online',
      'mistral-large-online',
    ],
    description: 'Modelos com busca online integrada',
    category: 'text',
    difficulty: 'easy',
    docsUrl: 'https://docs.perplexity.ai',
  },
  {
    name: 'nvidia',
    displayName: 'NVIDIA NIM',
    baseUrl: 'https://integrate.api.nvidia.com/v1',
    apiKeyEnv: 'NVIDIA_API_KEY',
    isFree: true,
    requiresApiKey: true,
    models: [
      'meta/llama3.1-8b-instruct',
      'meta/llama3.1-70b-instruct',
      'mistralai/mistral-large-2402',
    ],
    description: 'Modelos otimizados para NVIDIA',
    category: 'text',
    difficulty: 'medium',
    docsUrl: 'https://www.nvidia.com/en-us/ai-data-science/foundation-models/',
  },
  {
    name: 'huggingface',
    displayName: 'Hugging Face',
    baseUrl: 'https://api-inference.huggingface.co/models',
    apiKeyEnv: 'HUGGINGFACE_API_KEY',
    isFree: true,
    requiresApiKey: true,
    models: [
      'mistralai/Mistral-7B-Instruct-v0.3',
      'Qwen/Qwen2-7B-Instruct',
      'google/flan-t5-xxl',
    ],
    description: 'Hugging Face Inference API com modelos gratuitos',
    category: 'text',
    difficulty: 'medium',
    docsUrl: 'https://huggingface.co/inference-api',
  },
];

// Provedores gratuitos recomendados para combo econômico
export const RECOMMENDED_FREE_PROVIDERS = [
  'groq',
  'mistral',
  'openrouter',
  'together',
  'fireworks',
];

// Combo econômico sugerido
export const SUGGESTED_ECONOMIC_COMBO = {
  name: 'economico',
  description: 'Combo de provedores gratuitos para economia de tokens',
  providers: [
    { name: 'groq', models: ['llama-3.1-8b-instant', 'mixtral-8x7b-instruct-v0.1'] },
    { name: 'mistral', models: ['mistral-tiny', 'mistral-small'] },
    { name: 'openrouter', models: ['openai/gpt-3.5-turbo', 'anthropic/claude-3-haiku'] },
    { name: 'together', models: ['meta-llama/Llama-3.1-8B-Instruct'] },
  ],
};

// Combo balanceado sugerido (grátis + pagos como fallback)
export const SUGGESTED_BALANCED_COMBO = {
  name: 'balanceado',
  description: 'Combo balanceado com gratuitos primeiro e pagos como fallback',
  providers: [
    { name: 'groq', models: ['llama-3.1-8b-instant'] },
    { name: 'mistral', models: ['mistral-tiny'] },
    { name: 'openrouter', models: ['openai/gpt-3.5-turbo'] },
    { name: 'anthropic', models: ['claude-3-haiku-20240307'] },
  ],
};

// Verifica quais provedores gratuitos o usuário já tem
export function getMissingFreeProviders(connectedProviders: string[]): FreeProvider[] {
  const connectedProviderNames = connectedProviders.map(p => p.toLowerCase());
  return FREE_PROVIDERS.filter(
    provider => 
      !connectedProviderNames.includes(provider.name.toLowerCase()) &&
      provider.isFree
  );
}

// Gera instruções para conectar um provedor
export function getProviderConnectionInstructions(provider: FreeProvider): string[] {
  const instructions: string[] = [];
  
  instructions.push(`📌 ${provider.displayName}:`);
  instructions.push(`   Descrição: ${provider.description}`);
  
  if (provider.requiresApiKey) {
    instructions.push(`   🔑 Chave API: Crie em ${provider.docsUrl}`);
    instructions.push(`   📝 Adicione a variável de ambiente: ${provider.apiKeyEnv}`);
  }
  
  instructions.push(`   🌐 Base URL: ${provider.baseUrl}`);
  instructions.push(`   🤖 Modelos sugeridos: ${provider.models.slice(0, 2).join(', ')}`);
  instructions.push(`   📊 Dificuldade: ${provider.difficulty}`);
  
  if (provider.category === 'text') {
    instructions.push(`   💬 Tipo: Texto (Chat)`);
  } else {
    instructions.push(`   🎨 Tipo: ${provider.category}`);
  }
  
  return instructions;
}

// Gera um guia passo-a-passo para configuração inicial
export function getQuickSetupGuide(connectedProviders: string[]): string[] {
  const guide: string[] = [];
  const missingFreeProviders = getMissingFreeProviders(connectedProviders);
  
  guide.push('='.repeat(60));
  guide.push('🚀 GUIA RÁPIDO DE CONFIGURAÇÃO DE PROVEDORES GRATUITOS');
  guide.push('='.repeat(60));
  guide.push('');
  
  if (connectedProviders.length === 0) {
    guide.push('❌ Você não tem nenhum provedor conectado!');
    guide.push('');
    guide.push('📋 Siga estes passos para configurar provedores gratuitos:');
    guide.push('');
    
    // Sugerir os 3 mais fáceis
    const topFreeProviders = FREE_PROVIDERS.filter(p => p.isFree && p.difficulty === 'easy').slice(0, 3);
    
    topFreeProviders.forEach((provider, index) => {
      guide.push(`${index + 1}. ${provider.displayName}`);
      guide.push(`   - Criar conta: ${provider.docsUrl}`);
      guide.push(`   - Obter API Key`);
      guide.push(`   - Configurar no OmniRoute: http://localhost:20128`);
      guide.push('');
    });
  } else {
    guide.push(`✅ Você já tem ${connectedProviders.length} provedor(es) conectado(s)`);
    guide.push('');
    
    if (missingFreeProviders.length > 0) {
      guide.push(`💡 Recomendamos adicionar mais ${missingFreeProviders.length} provedor(es) gratuito(s):`);
      guide.push('');
      
      missingFreeProviders.slice(0, 3).forEach((provider, index) => {
        guide.push(`${index + 1}. ${provider.displayName}`);
        guide.push(`   - ${provider.description}`);
        guide.push(`   - ${provider.docsUrl}`);
        guide.push('');
      });
    } else {
      guide.push('✅ Parabéns! Você já tem todos os provedores gratuitos recomendados!');
      guide.push('');
    }
  }
  
  // Sugestão de combo
  guide.push('🎯 SUGESTÃO DE COMBO ECONÔMICO:');
  guide.push(`   Nome: ${SUGGESTED_ECONOMIC_COMBO.name}`);
  guide.push(`   Descrição: ${SUGGESTED_ECONOMIC_COMBO.description}`);
  guide.push('   Provedores: Groq, Mistral, OpenRouter, Together');
  guide.push('   Acesse: http://localhost:20128 → Combos → Novo Combo');
  guide.push('');
  
  guide.push('='.repeat(60));
  
  return guide;
}

// Gera configurações prontas para copia/cola
export function getProviderConfigs(providerNames: string[]): string {
  const configs: string[] = [];
  
  const providers = FREE_PROVIDERS.filter(p => 
    providerNames.some(name => p.name.toLowerCase() === name.toLowerCase())
  );
  
  providers.forEach(provider => {
    configs.push(`# ${provider.displayName}`);
    configs.push(`# Base URL: ${provider.baseUrl}`);
    configs.push(`# API Key: ${provider.apiKeyEnv || 'N/A'}`);
    configs.push(`# Modelos: ${provider.models.join(', ')}`);
    configs.push('');
  });
  
  return configs.join('\n');
}
