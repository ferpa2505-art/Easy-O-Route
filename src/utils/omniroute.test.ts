import { MIN_COMBO_CONTEXT, analyzeComboContext, extractJson, maskEmails } from './omniroute';

describe('maskEmails', () => {
  it('hides e-mail addresses used as connection names', () => {
    expect(maskEmails('Provedores: Mistral, fulano@exemplo.com, Groq')).toBe(
      'Provedores: Mistral, (e-mail oculto), Groq'
    );
  });
});

describe('extractJson', () => {
  it('finds a JSON array after noisy lines', () => {
    const out = '📋 Loaded env from C:\\x\n[{"name":"a"},{"name":"b"}]\n';
    expect(extractJson(out)).toEqual([{ name: 'a' }, { name: 'b' }]);
  });

  it('finds a JSON object and ignores ANSI colours', () => {
    expect(extractJson('\u001b[2mok\u001b[0m {"providers":[]}')).toEqual({ providers: [] });
  });

  it('returns null when there is no JSON', () => {
    expect(extractJson('nada por aqui')).toBeNull();
  });
});

describe('analyzeComboContext', () => {
  const contexts = {
    'nvidia/big': 128000,
    'cloudflare-ai/small': 24000,
    'cloudflare-ai/medium': 32768,
    'gemini/huge': 1000000,
  };

  it('flags combos with steps below the minimum and reports the smallest context', () => {
    const problems = analyzeComboContext(
      [
        { name: 'economico', models: [{ model: 'nvidia/big' }, { model: 'cloudflare-ai/small' }, { model: 'gemini/huge' }] },
        { name: 'melhores', models: [{ model: 'nvidia/big' }, { model: 'cloudflare-ai/medium' }] },
        { name: 'ok', models: [{ model: 'nvidia/big' }, { model: 'gemini/huge' }] },
      ],
      contexts
    );
    expect(problems.map(p => p.combo)).toEqual(['economico', 'melhores']);
    expect(problems[0].minContext).toBe(24000);
    expect(problems[0].smallSteps).toEqual([{ model: 'cloudflare-ai/small', context: 24000 }]);
    expect(problems[1].minContext).toBe(32768);
  });

  it('ignores steps whose context is unknown and accepts string steps', () => {
    expect(analyzeComboContext([{ name: 'x', models: ['desconhecido/modelo', 'nvidia/big'] }], contexts)).toEqual([]);
  });

  it('uses 100 mil tokens as the default minimum', () => {
    expect(MIN_COMBO_CONTEXT).toBe(100000);
  });
});
