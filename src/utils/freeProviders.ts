// Provedores de IA conhecidos pelo Easy-O-Route, com as configurações usadas no OmniRoute.
// Lista conferida em outubro/novembro de 2026 (os mesmos provedores do livro "IA Barata de Verdade").
// Cotas e planos gratuitos mudam: confirme sempre no site de cada provedor.

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
  /** Pedaços de texto que identificam este provedor entre as conexões do OmniRoute. */
  aliases: string[];
}

export interface ProviderSuggestion {
  provider: FreeProvider;
  status: 'not-connected' | 'connected' | 'partial';
  modelsConnected?: string[];
  recommendations: string[];
}

export const FREE_PROVIDERS: FreeProvider[] = [
  {
    name: 'mistral',
    displayName: 'Mistral AI',
    baseUrl: 'https://api.mistral.ai/v1',
    apiKeyEnv: 'MISTRAL_API_KEY',
    isFree: true,
    requiresApiKey: true,
    models: ['codestral-latest', 'ministral-14b-latest'],
    description: 'Rápido e bom em código; plano gratuito com limites por minuto',
    category: 'text',
    difficulty: 'easy',
    docsUrl: 'https://console.mistral.ai',
    aliases: ['mistral'],
  },
  {
    name: 'nvidia',
    displayName: 'NVIDIA NIM',
    baseUrl: 'https://integrate.api.nvidia.com/v1',
    apiKeyEnv: 'NVIDIA_API_KEY',
    isFree: true,
    requiresApiKey: true,
    models: ['nvidia/nemotron-3-ultra-550b-a55b', 'minimaxai/minimax-m3.1-flash'],
    description: 'Inferência gratuita com modelos gigantes (pode ser lenta; a lista automática do painel pode vir desatualizada)',
    category: 'text',
    difficulty: 'medium',
    docsUrl: 'https://build.nvidia.com',
    aliases: ['nvidia'],
  },
  {
    name: 'gemini',
    displayName: 'Google Gemini (AI Studio)',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    apiKeyEnv: 'GEMINI_API_KEY',
    isFree: true,
    requiresApiKey: true,
    models: ['gemini-flash-lite-latest', 'gemini-3.6-flash'],
    description: 'Textos longos (1 milhão de tokens de contexto), com cota diária gratuita',
    category: 'text',
    difficulty: 'easy',
    docsUrl: 'https://aistudio.google.com',
    aliases: ['gemini'],
  },
  {
    name: 'groq',
    displayName: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    apiKeyEnv: 'GROQ_API_KEY',
    isFree: true,
    requiresApiKey: true,
    models: ['openai/gpt-oss-120b'],
    description: 'Muito rápido, mas recusa pedidos grandes (erro 413): deixe no fim da fila',
    category: 'text',
    difficulty: 'easy',
    docsUrl: 'https://console.groq.com',
    aliases: ['groq'],
  },
  {
    name: 'cloudflare',
    displayName: 'Cloudflare Workers AI',
    baseUrl: 'https://api.cloudflare.com/client/v4/accounts/SEU_ACCOUNT_ID/ai/v1',
    apiKeyEnv: 'CLOUDFLARE_API_TOKEN',
    isFree: true,
    requiresApiKey: true,
    models: ['@cf/zai-org/glm-4.7-flash'],
    description: 'Reserva gratuita; pede o ID da conta e um token. Atenção: alguns modelos têm só 24 mil tokens de contexto',
    category: 'text',
    difficulty: 'medium',
    docsUrl: 'https://dash.cloudflare.com',
    aliases: ['cloudflare'],
  },
  {
    name: 'openrouter',
    displayName: 'OpenRouter (modelos :free)',
    baseUrl: 'https://openrouter.ai/api/v1',
    apiKeyEnv: 'OPENROUTER_API_KEY',
    isFree: true,
    requiresApiKey: true,
    models: ['nvidia/nemotron-3-ultra-550b-a55b:free'],
    description: 'Variedade de modelos gratuitos, mas com limite diário baixo',
    category: 'text',
    difficulty: 'easy',
    docsUrl: 'https://openrouter.ai',
    aliases: ['openrouter'],
  },
  {
    name: 'ollama-cloud',
    displayName: 'Ollama Cloud',
    baseUrl: 'https://ollama.com',
    apiKeyEnv: 'OLLAMA_API_KEY',
    isFree: true,
    requiresApiKey: true,
    models: ['gemma4:31b', 'nemotron-3-super'],
    description: 'Plano gratuito limitado; alguns modelos exigem plano pago',
    category: 'text',
    difficulty: 'medium',
    docsUrl: 'https://ollama.com',
    aliases: ['ollama-cloud', 'ollama cloud'],
  },
  {
    name: 'zai',
    displayName: 'Z.AI (GLM)',
    baseUrl: 'https://api.z.ai/api/paas/v4',
    apiKeyEnv: 'ZAI_API_KEY',
    isFree: true,
    requiresApiKey: true,
    models: ['glm-4.7-flash'],
    description: 'Modelo gratuito, mas instável (erro 529 de sobrecarga em parte das tentativas): deixe perto do fim',
    category: 'text',
    difficulty: 'medium',
    docsUrl: 'https://z.ai',
    aliases: ['z.ai', 'z. ai', 'zai'],
  },
  {
    name: 'deepseek',
    displayName: 'DeepSeek (pago)',
    baseUrl: 'https://api.deepseek.com/v1',
    apiKeyEnv: 'DEEPSEEK_API_KEY',
    isFree: false,
    requiresApiKey: true,
    models: ['deepseek-v4-pro'],
    description: 'Raciocínio barato, mas exige saldo na conta: use só como última reserva',
    category: 'text',
    difficulty: 'easy',
    docsUrl: 'https://platform.deepseek.com',
    aliases: ['deepseek'],
  },
];

// Provedores gratuitos recomendados para começar o combo econômico
export const RECOMMENDED_FREE_PROVIDERS = [
  'mistral',
  'nvidia',
  'gemini',
  'groq',
  'cloudflare',
  'openrouter',
];

// Combo econômico sugerido (gratuitos grandes na frente, Groq por último)
export const SUGGESTED_ECONOMIC_COMBO = {
  name: 'economico',
  description: 'Combo de provedores gratuitos para economia de tokens',
  providers: [
    { name: 'mistral', models: ['codestral-latest'] },
    { name: 'gemini', models: ['gemini-flash-lite-latest'] },
    { name: 'nvidia', models: ['nvidia/nemotron-3-ultra-550b-a55b'] },
    { name: 'openrouter', models: ['nvidia/nemotron-3-ultra-550b-a55b:free'] },
    { name: 'groq', models: ['openai/gpt-oss-120b'] },
  ],
};

// Combo balanceado sugerido (gratuitos primeiro, um pago como última reserva)
export const SUGGESTED_BALANCED_COMBO = {
  name: 'balanceado',
  description: 'Combo balanceado com gratuitos primeiro e um pago como última reserva',
  providers: [
    { name: 'mistral', models: ['codestral-latest'] },
    { name: 'gemini', models: ['gemini-flash-lite-latest'] },
    { name: 'nvidia', models: ['nvidia/nemotron-3-ultra-550b-a55b'] },
    { name: 'deepseek', models: ['deepseek-v4-pro'] },
  ],
};

// Regra de ouro dos combos (a mesma do livro)
export const COMBO_TIPS = [
  'Gratuitos na frente e pagos por último: o dinheiro só sai quando todo o resto falha',
  'Quem aguenta pedidos grandes vem primeiro (o Groq recusa pedidos grandes: deixe no fim)',
  'Só ponha no combo modelos com contexto de 100 mil tokens ou mais: um único passo pequeno trava o combo inteiro',
  'Revise o combo a cada duas ou três semanas: modelos gratuitos aparecem e somem',
];

/** Este provedor aparece entre as conexões do OmniRoute? (compara nome e id, sem diferenciar maiúsculas) */
export function isProviderConnected(provider: FreeProvider, connected: string[]): boolean {
  const names = connected.map(c => c.toLowerCase());
  return provider.aliases.some(alias => names.some(n => n.includes(alias.toLowerCase())));
}

// Verifica quais provedores gratuitos o usuário ainda não tem
export function getMissingFreeProviders(connectedProviders: string[]): FreeProvider[] {
  return FREE_PROVIDERS.filter(
    provider => provider.isFree && !isProviderConnected(provider, connectedProviders)
  );
}

// Gera instruções para conectar um provedor
export function getProviderConnectionInstructions(provider: FreeProvider): string[] {
  const instructions: string[] = [];

  instructions.push(`📌 ${provider.displayName}:`);
  instructions.push(`   Descrição: ${provider.description}`);

  if (provider.requiresApiKey) {
    instructions.push(`   🔑 Chave API: crie em ${provider.docsUrl}`);
    instructions.push('   📝 Cole a chave só no painel do OmniRoute (Provedores → Adicionar)');
  }

  instructions.push(`   🌐 Base URL: ${provider.baseUrl}`);
  instructions.push(`   🤖 Modelos sugeridos: ${provider.models.slice(0, 2).join(', ')}`);
  instructions.push(`   📊 Dificuldade: ${provider.difficulty}`);

  if (provider.category === 'text') {
    instructions.push('   💬 Tipo: Texto (Chat)');
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
      guide.push('   - Gerar a chave de API');
      guide.push('   - Colar a chave no OmniRoute: http://localhost:20128 → Provedores');
      guide.push('');
    });
  } else {
    guide.push(`✅ Você já tem ${connectedProviders.length} provedor(es) conectado(s)`);
    guide.push('');

    if (missingFreeProviders.length > 0) {
      guide.push(`💡 Você ainda pode adicionar ${missingFreeProviders.length} provedor(es) gratuito(s):`);
      guide.push('');

      missingFreeProviders.slice(0, 3).forEach((provider, index) => {
        guide.push(`${index + 1}. ${provider.displayName}`);
        guide.push(`   - ${provider.description}`);
        guide.push(`   - ${provider.docsUrl}`);
        guide.push('');
      });
    } else {
      guide.push('✅ Parabéns! Você já tem todos os provedores gratuitos que o Easy-O-Route conhece!');
      guide.push('');
    }
  }

  // Sugestão de combo
  guide.push('🎯 SUGESTÃO DE COMBO ECONÔMICO:');
  guide.push(`   Nome: ${SUGGESTED_ECONOMIC_COMBO.name}`);
  guide.push(`   Descrição: ${SUGGESTED_ECONOMIC_COMBO.description}`);
  guide.push('   Provedores: Mistral, Gemini, NVIDIA, OpenRouter, Groq (nesta ordem)');
  guide.push('   Acesse: http://localhost:20128 → Combinações → Criar Combo');
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
