import { Command } from 'commander';
import { execSync } from 'child_process';
import {
  logInfo,
  logSuccess,
  logError,
  logWarn,
  logTitle,
  logSection,
  logItem,
} from '../utils/logger';
import {
  FREE_PROVIDERS,
  RECOMMENDED_FREE_PROVIDERS,
  SUGGESTED_ECONOMIC_COMBO,
  getMissingFreeProviders,
  getQuickSetupGuide,
  COMBO_TIPS,
  FreeProvider,
} from '../utils/freeProviders';
import { extractJson, maskEmails } from '../utils/omniroute';

export const providersCommand = new Command('providers')
  .description('Gerenciar e sugerir provedores de IA (gratuito/pago)')
  .option('-f, --free-only', 'Mostrar apenas provedores gratuitos')
  .option('-r, --recommended', 'Mostrar apenas provedores recomendados')
  .option('-l, --list-all', 'Listar todos os provedores conhecidos')
  .option('-s, --setup-guide', 'Mostrar guia de configuração rápida')
  .option('-c, --check', 'Verificar provedores conectados e sugerir melhorias')
  .option('-a, --add <provider>', 'Mostrar instruções para adicionar um provedor específico')
  .action(async (options) => {
    try {
      if (options.setupGuide) {
        // Mostrar guia de configuração
        await showSetupGuide();
        return;
      }

      if (options.check) {
        // Verificar provedores conectados
        await checkConnectedProviders();
        return;
      }

      if (options.add) {
        // Mostrar instruções para provedor específico
        const wanted = String(options.add).toLowerCase();
        const provider = FREE_PROVIDERS.find(
          p => p.name.toLowerCase() === wanted || p.aliases.some(a => a.toLowerCase() === wanted)
        );
        
        if (provider) {
          showProviderInstructions(provider);
        } else {
          logError(`Provedor "${options.add}" não encontrado na lista de provedores conhecidos`);
          logInfo('Use --list-all para ver todos os provedores disponíveis');
          logInfo('ou --recommended para ver os recomendados');
        }
        return;
      }

      // Opção padrão: listar provedores
      if (options.listAll) {
        listAllProviders();
      } else if (options.recommended) {
        listRecommendedProviders();
      } else if (options.freeOnly) {
        listFreeProviders();
      } else {
        // Mostrar resumo
        showProviderSummary();
      }

    } catch (error: any) {
      logError(`Erro: ${error.message}`);
      process.exit(1);
    }
  });

// Mostrar resumo dos provedores
function showProviderSummary(): void {
  logTitle('📋 RESUMO DE PROVEDORES DE IA');
  
  logSection('Estatísticas');
  logItem('Total de provedores conhecidos', FREE_PROVIDERS.length.toString());
  logItem('Provedores gratuitos', 
    FREE_PROVIDERS.filter(p => p.isFree).length.toString()
  );
  logItem('Provedores recomendados', RECOMMENDED_FREE_PROVIDERS.length.toString());
  logItem('Provedores de texto', 
    FREE_PROVIDERS.filter(p => p.category === 'text').length.toString()
  );
  logItem('Provedores de imagem', 
    FREE_PROVIDERS.filter(p => p.category === 'image').length.toString()
  );
  
  logSection('Comandos disponíveis');
  logInfo('--free-only    : Listar apenas provedores gratuitos');
  logInfo('--recommended  : Listar apenas provedores recomendados');
  logInfo('--list-all     : Listar todos os provedores');
  logInfo('--setup-guide  : Mostrar guia de configuração rápida');
  logInfo('--check        : Verificar provedores conectados');
  logInfo('--add <nome>   : Mostrar instruções para um provedor específico');
  
  logSection('Provedores mais populares');
  const popularProviders = FREE_PROVIDERS.filter(p => p.isFree && p.difficulty === 'easy').slice(0, 5);
  popularProviders.forEach(p => {
    logItem(p.displayName, `(${p.category}) - ${p.description}`);
  });
  
  logSuccess('\n✅ Use easy-o-route providers --help para mais opções');
}

// Listar todos os provedores
function listAllProviders(): void {
  logTitle('🌍 TODOS OS PROVEDORES DE IA CONHECIDOS');
  
  // Agrupar por categoria
  const byCategory: Record<string, FreeProvider[]> = {};
  FREE_PROVIDERS.forEach(provider => {
    if (!byCategory[provider.category]) {
      byCategory[provider.category] = [];
    }
    byCategory[provider.category].push(provider);
  });
  
  Object.entries(byCategory).forEach(([category, providers]) => {
    logSection(`📁 ${category.toUpperCase()} (${providers.length})`);
    providers.forEach(provider => {
      const freeBadge = provider.isFree ? '🆓' : '💳';
      const diffBadge = provider.difficulty === 'easy' ? '✅' : 
                        provider.difficulty === 'medium' ? '⚠️' : '❌';
      logItem(`${freeBadge} ${provider.displayName}`, 
        `${diffBadge} ${provider.description} | ${provider.baseUrl}`
      );
    });
  });
  
  logSuccess(`\n✅ Total: ${FREE_PROVIDERS.length} provedores`);
}

// Listar apenas provedores gratuitos
function listFreeProviders(): void {
  logTitle('🆓 PROVEDORES GRATUITOS');
  
  const freeProviders = FREE_PROVIDERS.filter(p => p.isFree);
  
  logSection(`Total: ${freeProviders.length} provedores gratuitos`);
  
  freeProviders.forEach((provider, index) => {
    const diffBadge = provider.difficulty === 'easy' ? '✅ Fácil' : 
                      provider.difficulty === 'medium' ? '⚠️ Médio' : '❌ Avançado';
    
    logItem(`${index + 1}. ${provider.displayName}`, 
      `${diffBadge} | API: ${provider.apiKeyEnv || 'N/A'} | URL: ${provider.baseUrl}`
    );
    logInfo(`   Modelos: ${provider.models.slice(0, 3).join(', ')}...`);
    logInfo(`   Site: ${provider.docsUrl}`);
    logInfo('');
  });
  
  logSection('💡 DICAS');
  logInfo('1. Comece com provedores de "Dificuldade: Fácil"');
  logInfo('2. Mistral, Gemini e OpenRouter são ótimos para começar; NVIDIA e Cloudflare pedem um pouco mais de configuração');
  logInfo('3. Todos pedem uma chave de API (gratuita): cole só no painel do OmniRoute');
  logInfo('4. Configure no painel: http://localhost:20128');
  logInfo('5. Cotas e limites gratuitos mudam: confira sempre no site de cada provedor');
}

// Listar provedores recomendados
function listRecommendedProviders(): void {
  logTitle('⭐ PROVEDORES RECOMENDADOS (GRATUITOS)');
  
  const recommended = FREE_PROVIDERS.filter(p => 
    RECOMMENDED_FREE_PROVIDERS.includes(p.name) && p.isFree
  );
  
  logSection(`Recomendados para combo econômico: ${recommended.length} provedores`);
  
  recommended.forEach((provider, index) => {
    logItem(`${index + 1}. ${provider.displayName}`, provider.description);
    logInfo(`   🔗 ${provider.docsUrl}`);
    logInfo(`   🤖 Modelos populares: ${provider.models.slice(0, 2).join(', ')}`);
    logInfo('');
  });

  logSection('🎯 POR QUE ESTES?');
  logInfo('Mistral: rápido e bom em código');
  logInfo('NVIDIA NIM: modelos gigantes gratuitos (podem ser lentos)');
  logInfo('Gemini: textos longos, com cota diária gratuita');
  logInfo('Groq: muito rápido, mas recusa pedidos grandes (deixe no fim da fila)');
  logInfo('Cloudflare: reserva gratuita (confira o contexto de cada modelo)');
  logInfo('OpenRouter: variedade de modelos :free, com limite diário baixo');

  logSection('💡 COMO CONFIGURAR');
  logInfo('1. Crie conta em cada provedor (digite o endereço no navegador)');
  logInfo('2. Gere a chave de API');
  logInfo('3. Cole a chave no OmniRoute: http://localhost:20128 → Provedores → Adicionar');
  logInfo('4. Teste a conexão (botão Test ou: omniroute providers test-all)');
  logInfo('5. Monte o combo com gratuitos na frente e pagos por último');
}

// Mostrar instruções para um provedor específico
function showProviderInstructions(provider: FreeProvider): void {
  logTitle(`📖 COMO CONFIGURAR: ${provider.displayName.toUpperCase()}`);
  
  logSection('📋 INFORMAÇÕES');
  logItem('Nome', provider.name);
  logItem('Descrição', provider.description);
  logItem('URL Base', provider.baseUrl);
  logItem('Categoria', provider.category);
  logItem('Dificuldade', provider.difficulty);
  
  if (provider.apiKeyEnv) {
    logItem('Variável de Ambiente', provider.apiKeyEnv);
  }
  
  logSection('🤖 MODELOS DISPONÍVEIS');
  provider.models.forEach(model => {
    logInfo(`- ${model}`);
  });
  
  logSection('🔗 LINKS ÚTEIS');
  logItem('Documentação', provider.docsUrl);
  
  logSection('✅ PASSO A PASSO');
  
  const steps = [
    `1. Acesse ${provider.docsUrl} (digite o endereço no navegador)`,
    '2. Crie uma conta (se não tiver)',
    '3. Gere a chave de API e copie (ela costuma aparecer uma única vez)',
    `4. Configure no OmniRoute (http://localhost:20128):`,
    `   - Acesse: Provedores → Adicionar`,
    `   - Escolha o provedor: ${provider.displayName}`,
    `   - Base URL (se o painel pedir): ${provider.baseUrl}`,
    '   - Cole a chave de API só nesse campo (nunca em chats ou prints)',
    '5. Salve e teste a conexão',
    `6. Modelos para o combo: ${provider.models.slice(0, 3).join(', ')} (confira o contexto: 100 mil tokens ou mais)`,
  ];
  
  steps.forEach(step => logInfo(step));
  
  logSection('💡 DICAS');
  if (provider.difficulty === 'easy') {
    logSuccess('Este provedor é fácil de configurar!');
  } else if (provider.difficulty === 'medium') {
    logWarn('Este provedor pode requerer configuração adicional');
  } else {
    logError('Este provedor requer configuração avançada');
  }
  
  if (provider.isFree) {
    logSuccess('Gratuito!');
  } else {
    logWarn('Requer plano pago');
  }
  
  logSuccess('\n✅ Pronto! Agora você pode usar este provedor no OmniRoute');
}

// Verificar provedores conectados e sugerir melhorias
async function checkConnectedProviders(): Promise<void> {
  logTitle('🔍 VERIFICAÇÃO DE PROVEDORES CONECTADOS');
  
  let connectedProviders: string[] = [];
  
  try {
    const providersOutput = execSync('omniroute providers list --json 2>&1').toString();
    const data = extractJson(providersOutput) as
      | { providers?: unknown[]; connections?: unknown[] }
      | unknown[]
      | null;
    const list = (Array.isArray(data) ? data : data?.providers || data?.connections || []) as Array<
      Record<string, unknown>
    >;
    const active = list.filter(p => p.isActive !== false && p.active !== false);
    // nome + id, para reconhecer provedores como "Cloudflare" (id cloudflare-ai)
    connectedProviders = active.map(p => `${p.name || ''} ${p.provider || p.id || ''}`);

    if (active.length > 0) {
      logSection('✅ PROVEDORES CONECTADOS');
      Array.from(new Set(active.map(p => maskEmails(String(p.name || p.provider || p.id || ''))))).forEach(n =>
        logSuccess(`  ✓ ${n}`)
      );
      logInfo('');
    }
  } catch (error: any) {
    const errorStr = error.message || '';
    if (errorStr.includes('401') || errorStr.includes('403') || errorStr.includes('Unauthorized')) {
      logWarn('OmniRoute requer autenticação para listar provedores');
      logInfo('   Configure sua senha no painel: http://localhost:20128');
    } else {
      logWarn('Não foi possível listar provedores conectados');
      logInfo('   Verifique se o OmniRoute está rodando: omniroute status');
    }
  }
  
  // Verificar quais provedores gratuitos faltam
  const missingFreeProviders = getMissingFreeProviders(connectedProviders);
  
  if (connectedProviders.length === 0) {
    logSection('❌ NENHUM PROVEDOR CONECTADO!');
    logError('Você precisa conectar pelo menos um provedor para usar o OmniRoute');
    logInfo('');
    logInfo('📋 Sugestões de provedores gratuitos para começar:');
    
    const topProviders = FREE_PROVIDERS
      .filter(p => p.isFree && p.difficulty === 'easy')
      .slice(0, 3);
    
    topProviders.forEach(provider => {
      logInfo(`  ${provider.displayName}: ${provider.description}`);
      logInfo(`    🔗 ${provider.docsUrl}`);
    });
    
    logInfo('');
    logInfo('💡 Use: easy-o-route providers --setup-guide');
    
  } else if (missingFreeProviders.length > 0) {
    logSection(`💡 RECOMENDAÇÃO: Adicione ${missingFreeProviders.length} provedor(es) gratuito(s)`);
    logInfo('Estes provedores são gratuitos e podem melhorar seu setup:');
    logInfo('');
    
    missingFreeProviders.slice(0, 5).forEach(provider => {
      const diffBadge = provider.difficulty === 'easy' ? '✅' : 
                        provider.difficulty === 'medium' ? '⚠️' : '❌';
      logInfo(`  ${diffBadge} ${provider.displayName}`);
      logInfo(`     ${provider.description}`);
      logInfo(`     🔗 ${provider.docsUrl}`);
      logInfo('');
    });
    
    logInfo('💡 Use: easy-o-route providers --setup-guide');
  } else {
    logSection('✅ TODOS OS PROVEDORES GRATUITOS ESTÃO CONECTADOS!');
    logSuccess('Parabéns! Você tem uma ótima configuração de provedores');
    logInfo('');
  }
  
  // Sugestão de combo
  logSection('🎯 SUGESTÃO DE COMBO');
  logInfo(` Combo "${SUGGESTED_ECONOMIC_COMBO.name}": ${SUGGESTED_ECONOMIC_COMBO.description}`);
  
  if (connectedProviders.length >= 3) {
    logSuccess('Você tem provedores suficientes para criar um combo');
    logInfo('   Acesse: http://localhost:20128 → Combos → Novo Combo');
  } else {
    logWarn('Recomendamos ter pelo menos 3 provedores para um bom combo');
    logInfo('   Adicione mais provedores gratuitos antes de criar o combo');
  }
  
  logInfo('');
  logInfo('📊 Dicas para combos:');
  COMBO_TIPS.forEach(tip => logInfo(`   - ${tip}`));
  
  logSuccess('\n✅ Verificação concluída!');
}

// Mostrar guia de configuração rápida
async function showSetupGuide(): Promise<void> {
  logTitle('🚀 GUIA RÁPIDO: CONFIGURAÇÃO DE PROVEDORES GRATUITOS');
  
  const guideLines = getQuickSetupGuide([]);
  guideLines.forEach(line => {
    if (line.startsWith('=')) {
      console.log(line);
    } else if (line.startsWith('📌') || line.startsWith('📁') || line.startsWith('🎯')) {
      logSection(line);
    } else if (line.includes('✅') || line.includes('❌')) {
      if (line.includes('✅')) {
        logSuccess(line);
      } else {
        logError(line);
      }
    } else if (line.trim().startsWith('💡')) {
      logInfo(line);
    } else if (line.trim() === '') {
      console.log('');
    } else {
      logInfo(line);
    }
  });
  
  // Adicionar seção de exemplo de configuração
  logSection('📝 EXEMPLO DE CONFIGURAÇÃO DE COMBO');
  logInfo('Combo: economico');
  logInfo('Descrição: Provedores gratuitos para economia');
  logInfo('');
  logInfo('Provedores (na ordem):');
  SUGGESTED_ECONOMIC_COMBO.providers.forEach((p, i) => {
    logInfo(`  ${i + 1}. ${p.name} (${p.models[0]})`);
  });
  logInfo('');
  logInfo('💡 Dica: a ordem importa! O OmniRoute tenta um de cada vez, de cima para baixo.');

  logSection('🔗 RECURSOS ÚTEIS');
  logInfo('Documentação do OmniRoute: https://github.com/diegosouzapw/OmniRoute');
  logInfo('Easy-O-Route: https://github.com/ferpa2505-art/Easy-O-Route');
  logInfo('');
  
  logSuccess('Pronto! Siga estes passos e você terá um setup otimizado!');
}
