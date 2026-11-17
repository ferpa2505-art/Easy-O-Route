import {
  FREE_PROVIDERS,
  SUGGESTED_ECONOMIC_COMBO,
  getMissingFreeProviders,
  getProviderConfigs,
  getQuickSetupGuide,
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
});

describe('SUGGESTED_ECONOMIC_COMBO', () => {
  it('only references providers that exist in the catalog', () => {
    const catalog = FREE_PROVIDERS.map(p => p.name.toLowerCase());
    for (const provider of SUGGESTED_ECONOMIC_COMBO.providers) {
      expect(catalog).toContain(provider.name.toLowerCase());
      expect(provider.models.length).toBeGreaterThan(0);
    }
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
