import {
  FREE_PROVIDERS,
  RECOMMENDED_FREE_PROVIDERS,
  SUGGESTED_ECONOMIC_COMBO,
  getMissingFreeProviders,
  getProviderConfigs,
  getQuickSetupGuide,
  isProviderConnected,
} from './freeProviders';

describe('getMissingFreeProviders', () => {
  it('returns only free providers when nothing is connected', () => {
    const missing = getMissingFreeProviders([]);
    expect(missing.length).toBeGreaterThan(0);
    expect(missing.every(p => p.isFree)).toBe(true);
  });

  it('excludes providers that are already connected (case-insensitive)', () => {
    const missing = getMissingFreeProviders(['GROQ', 'mistral']);
    const names = missing.map(p => p.name.toLowerCase());
    expect(names).not.toContain('groq');
    expect(names).not.toContain('mistral');
  });

  it('recognises real OmniRoute connection names and ids', () => {
    const connected = ['Mistral', 'Gemini', 'cloudflare-ai Cloudflare', 'OpenRouter', 'Groq', 'nvidia'];
    const names = getMissingFreeProviders(connected).map(p => p.name);
    for (const covered of ['mistral', 'gemini', 'cloudflare', 'openrouter', 'groq', 'nvidia']) {
      expect(names).not.toContain(covered);
    }
  });

  it('does not confuse a local Ollama with Ollama Cloud', () => {
    const cloud = FREE_PROVIDERS.find(p => p.name === 'ollama-cloud');
    expect(cloud).toBeDefined();
    expect(isProviderConnected(cloud!, ['Ollama Local openai-compatible-chat-56f3bb2d'])).toBe(false);
    expect(isProviderConnected(cloud!, ['Ollama Cloud ollama-cloud'])).toBe(true);
  });
});

describe('catalog', () => {
  it('never lists providers that have no free tier as free', () => {
    const names = FREE_PROVIDERS.map(p => p.name);
    expect(names).not.toContain('anthropic');
    expect(names).not.toContain('openai');
    expect(FREE_PROVIDERS.find(p => p.name === 'deepseek')?.isFree).toBe(false);
  });

  it('has aliases for every provider and recommended ones exist', () => {
    expect(FREE_PROVIDERS.every(p => p.aliases.length > 0)).toBe(true);
    const names = FREE_PROVIDERS.map(p => p.name);
    for (const rec of RECOMMENDED_FREE_PROVIDERS) expect(names).toContain(rec);
  });
});

describe('SUGGESTED_ECONOMIC_COMBO', () => {
  it('only references providers that exist in the catalog', () => {
    const catalog = FREE_PROVIDERS.map(p => p.name.toLowerCase());
    for (const provider of SUGGESTED_ECONOMIC_COMBO.providers) {
      expect(catalog).toContain(provider.name.toLowerCase());
      expect(provider.models.length).toBeGreaterThan(0);
    }
  });

  it('keeps the large-request-refusing Groq at the end', () => {
    const order = SUGGESTED_ECONOMIC_COMBO.providers.map(p => p.name);
    expect(order[order.length - 1]).toBe('groq');
  });
});

describe('getQuickSetupGuide', () => {
  it('returns a non-empty guide that mentions the economic combo', () => {
    const guide = getQuickSetupGuide([]);
    expect(guide.length).toBeGreaterThan(0);
    expect(guide.join('\n')).toContain(SUGGESTED_ECONOMIC_COMBO.name);
  });
});

describe('getProviderConfigs', () => {
  it('returns a string for known provider names', () => {
    expect(typeof getProviderConfigs(['groq'])).toBe('string');
  });
});
