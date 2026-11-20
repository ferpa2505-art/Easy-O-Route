import axios from 'axios';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { OMNIROUTE } from './constants';

/**
 * Contexto mínimo recomendado para cada passo de um combo (em tokens).
 * Desde o OmniRoute 3.8.54, o limite do combo inteiro é o do MENOR passo:
 * um único modelo de 24 mil tokens faz todo pedido maior falhar em todos os passos.
 * O Claude Code manda 30 a 40 mil tokens já no primeiro pedido.
 */
export const MIN_COMBO_CONTEXT = 100_000;

/** Troca e-mails por um texto neutro (nomes de conexão às vezes são e-mails). */
export function maskEmails(text: string): string {
  return text.replace(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g, '(e-mail oculto)');
}

/** Acha o primeiro JSON válido dentro de uma saída de terminal (com avisos antes/depois). */
export function extractJson(text: string): unknown {
  // eslint-disable-next-line no-control-regex
  const clean = text.replace(/\u001b\[[0-9;]*m/g, '');
  for (let i = 0; i < clean.length; i++) {
    const open = clean[i];
    if (open !== '{' && open !== '[') continue;
    const end = clean.lastIndexOf(open === '{' ? '}' : ']');
    if (end <= i) continue;
    try {
      return JSON.parse(clean.slice(i, end + 1));
    } catch {
      // não era JSON: tenta a próxima abertura
    }
  }
  return null;
}

/** Chave de API do OmniRoute: opção, variável OMNIROUTE_API_KEY ou o primeiro *.key em ~/.omniroute. */
export function findApiKey(explicit?: string): string | null {
  const direct = (explicit || process.env.OMNIROUTE_API_KEY || '').trim();
  if (direct) return direct;
  try {
    const dir = path.join(os.homedir(), OMNIROUTE.CONFIG_DIR);
    const file = fs.readdirSync(dir).find(f => f.toLowerCase().endsWith('.key'));
    if (file) {
      const value = fs.readFileSync(path.join(dir, file), 'utf8').trim();
      if (value) return value;
    }
  } catch {
    // sem pasta ou sem arquivo de chave
  }
  return null;
}

/** O servidor está de pé? Qualquer resposta HTTP (até 401) conta como "rodando". */
export async function isServerUp(): Promise<boolean> {
  try {
    await axios.get(`${OMNIROUTE.LOCAL_URL}/api/health`, {
      timeout: 8000,
      validateStatus: () => true,
    });
    return true;
  } catch {
    return false;
  }
}

export async function apiGet<T>(route: string, apiKey: string): Promise<T> {
  const response = await axios.get<T>(`${OMNIROUTE.LOCAL_URL}${route}`, {
    timeout: 60000,
    headers: { Authorization: `Bearer ${apiKey}`, Accept: 'application/json' },
  });
  return response.data;
}

export interface ComboLike {
  name?: string;
  id?: string;
  models?: Array<{ model?: string } | string>;
}

export interface ContextProblem {
  combo: string;
  totalSteps: number;
  minContext: number;
  smallSteps: { model: string; context: number }[];
}

function stepName(step: { model?: string } | string): string {
  return typeof step === 'string' ? step : step.model || '';
}

/** Lista os combos que têm passos com contexto menor que o mínimo recomendado. */
export function analyzeComboContext(
  combos: ComboLike[],
  contexts: Record<string, number>,
  minTokens: number = MIN_COMBO_CONTEXT
): ContextProblem[] {
  const problems: ContextProblem[] = [];
  for (const combo of combos) {
    const steps = (combo.models || []).map(stepName).filter(Boolean);
    const known = steps
      .map(model => ({ model, context: contexts[model] }))
      .filter(s => typeof s.context === 'number' && s.context > 0);
    const small = known.filter(s => s.context < minTokens);
    if (small.length > 0) {
      problems.push({
        combo: combo.name || combo.id || '(sem nome)',
        totalSteps: steps.length,
        minContext: Math.min(...known.map(s => s.context)),
        smallSteps: small,
      });
    }
  }
  return problems;
}
