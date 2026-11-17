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
  FreeProvider,
} from '../utils/freeProviders';

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
        const provider = FREE_PROVIDERS.find(
          p => p.name.toLowerCase() === options.add.toLowerCase()
        );
        
        if (provider) {
          showProviderInstructions(provider);
        } else {
          logError(`❌ Provedor "${options.add}" não encontrado na lista de provedores conhecidos`);
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
      logError(`❌ Erro: ${error.message}`);
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
  logInfo('2. Groq, Mistral e OpenRouter são excelentes para começar');
  logInfo('3. Todos requerem API Key (gratuita)');
  logInfo('4. Configure no painel: http://localhost:20128');
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
    logInfo(`   📝 Variável: ${provider.apiKeyEnv}`);
    logInfo(`   🤖 Modelos populares: ${provider.models.slice(0, 2).join(', ')}`);
    logInfo('');
  });
  
  logSection('🎯 POR QUE ESTES?');
  logInfo('✅ Groq: Ultra rápido, bons modelos gratuitos');
  logInfo('✅ Mistral: Excelente custo-benefício');
  logInfo('✅ OpenRouter: Acesso a múltiplos provedores');
  logInfo('✅ Together: Centenas de modelos de código aberto');
  logInfo('✅ Fireworks: Modelos otimizados');
  
  logSection('💡 COMO CONFIGURAR');
  logInfo('1. Crie conta em cada provedor');
  logInfo('2. Obtenha sua API Key');
  logInfo('3. Adicione no OmniRoute: http://localhost:20128');
  logInfo('4. Configure os modelos sugeridos');
  logInfo('5. Teste a conexão');
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
    `1. Acesse ${provider.docsUrl}`,
    '2. Crie uma conta (se não tiver)',
    '3. Obtenha sua API Key',
    `4. Configure no OmniRoute (http://localhost:20128):`,
    `   - Acesse: Settings → Providers → Add Provider`,
    `   - Name: ${provider.displayName}`,
    `   - Base URL: ${provider.baseUrl}`,
    `   - API Key: ${provider.apiKeyEnv || 'sua-chave-api'}`,
    '5. Salve e teste a conexão',
    `6. Adicione os modelos: ${provider.models.slice(0, 3).join(', ')}`,
  ];
  
  steps.forEach(step => logInfo(step));
  
  logSection('💡 DICAS');
  if (provider.difficulty === 'easy') {
    logSuccess('✅ Este provedor é fácil de configurar!');
  } else if (provider.difficulty === 'medium') {
    logWarn('⚠️ Este provedor pode requerer configuração adicional');
  } else {
    logError('❌ Este provedor requer configuração avançada');
  }
  
  if (provider.isFree) {
    logSuccess('✅ Gratuito!');
  } else {
    logWarn('⚠️ Requer plano pago');
  }
  
  logSuccess('\n✅ Pronto! Agora você pode usar este provedor no OmniRoute');
}

// Verificar provedores conectados e sugerir melhorias
async function checkConnectedProviders(): Promise<void> {
  logTitle('🔍 VERIFICAÇÃO DE PROVEDORES CONECTADOS');
  
  let connectedProviders: string[] = [];
  
  try {
    const providersOutput = execSync('omniroute providers list --json 2>&1').toString();
    const providers = JSON.parse(providersOutput);
    connectedProviders = providers.map((p: any) => p.name || p.id);
    
    if (connectedProviders.length > 0) {
      logSection('✅ PROVEDORES CONECTADOS');
      connectedProviders.forEach(p => logSuccess(`  ✓ ${p}`));
      logInfo('');
    }
  } catch (error: any) {
    const errorStr = error.message || '';
    if (errorStr.includes('401') || errorStr.includes('403') || errorStr.includes('Unauthorized')) {
      logWarn('⚠️ OmniRoute requer autenticação para listar provedores');
      logInfo('   Configure sua senha no painel: http://localhost:20128');
    } else {
      logWarn('⚠️ Não foi possível listar provedores conectados');
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
    logSuccess('✅ Você tem provedores suficientes para criar um combo');
    logInfo('   Acesse: http://localhost:20128 → Combos → Novo Combo');
  } else {
    logWarn('⚠️ Recomendamos ter pelo menos 3 provedores para um bom combo');
    logInfo('   Adicione mais provedores gratuitos antes de criar o combo');
  }
  
  logInfo('');
  logInfo('📊 Dicas para combos:');
  logInfo('   - Coloque provedores gratuitos na frente');
  logInfo('   - Use provedores rápidos (Groq) para testes');
  logInfo('   - Deixe provedores pagos como última reserva');
  
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
  logInfo('  1. Groq (llama-3.1-8b-instant)');
  logInfo('  2. Mistral (mistral-tiny)');
  logInfo('  3. OpenRouter (openai/gpt-3.5-turbo)');
  logInfo('  4. Together (meta-llama/Llama-3.1-8B-Instruct)');
  logInfo('');
  logInfo('💡 Dica: A ordem importa! O OmniRoute usa na sequência.');
  
  logSection('🔗 RECURSOS ÚTEIS');
  logInfo('Documentação do OmniRoute: https://github.com/cheaper-inference/OmniRoute');
  logInfo('Easy-O-Route: https://github.com/ferpa2505-art/Easy-O-Route');
  logInfo('');
  
  logSuccess('✅ Pronto! Siga estes passos e você terá um setup otimizado!');
}
