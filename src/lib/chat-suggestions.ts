/**
 * Page-context-aware suggested questions for Ask Insureversia.
 * Returns 3 suggestions based on the current page path and locale.
 */

interface Suggestion {
  en: string;
  es: string;
}

const PAGE_SUGGESTIONS: Record<string, Suggestion[]> = {
  '/': [
    { en: 'How can AI help my insurance work?', es: '¿Cómo puede la IA ayudar en mi trabajo de seguros?' },
    { en: 'What should I try first with AI?', es: '¿Qué debería probar primero con la IA?' },
    { en: 'Is AI safe to use in insurance?', es: '¿Es seguro usar la IA en seguros?' },
  ],
  '/practice/quick-wins/': [
    { en: 'Which Quick Win is best for beginners?', es: '¿Cuál Victoria Rápida es mejor para principiantes?' },
    { en: 'Can I use these prompts with any AI tool?', es: '¿Puedo usar estos prompts con cualquier herramienta de IA?' },
    { en: 'How do I adapt a Quick Win to my insurance sector?', es: '¿Cómo adapto una Victoria Rápida a mi sector de seguros?' },
  ],
  '/resources/faq/': [
    { en: "I'm skeptical about AI in insurance. Convince me.", es: 'Soy escéptico sobre la IA en seguros. Convénceme.' },
    { en: 'What are the biggest risks of using AI?', es: '¿Cuáles son los mayores riesgos de usar IA?' },
    { en: 'Will AI replace underwriters?', es: '¿La IA reemplazará a los suscriptores?' },
  ],
  '/learn/ai-101/': [
    { en: 'Explain AI hallucinations in simple terms', es: 'Explica las alucinaciones de IA en términos simples' },
    { en: 'What is the difference between GPT and Claude?', es: '¿Cuál es la diferencia entre GPT y Claude?' },
    { en: 'How does a large language model work?', es: '¿Cómo funciona un modelo de lenguaje grande?' },
  ],
  '/learn/what-to-do/': [
    { en: 'What are the top 3 things to do with AI today?', es: '¿Cuáles son las 3 mejores cosas que hacer con IA hoy?' },
    { en: 'How do I build an AI policy for my organization?', es: '¿Cómo creo una política de IA para mi organización?' },
    { en: 'What AI tools are most useful for insurers?', es: '¿Qué herramientas de IA son más útiles para aseguradores?' },
  ],
  '/learn/prompt-engineering/': [
    { en: 'What makes a good insurance prompt?', es: '¿Qué hace un buen prompt de seguros?' },
    { en: 'Show me an example of role-based prompting', es: 'Muéstrame un ejemplo de prompting basado en roles' },
    { en: 'How can I reduce hallucinations in AI responses?', es: '¿Cómo puedo reducir las alucinaciones en las respuestas de IA?' },
  ],
  '/explore/new-frontiers/': [
    { en: 'What are the newest AI developments for insurance?', es: '¿Cuáles son los desarrollos más nuevos de IA para seguros?' },
    { en: 'How is AI changing underwriting?', es: '¿Cómo está cambiando la IA la suscripción de seguros?' },
    { en: 'What should insurers prepare for in 2026?', es: '¿Para qué deben prepararse las aseguradoras en 2026?' },
  ],
  '/explore/challenges/': [
    { en: 'Tell me about AI bias in insurance pricing', es: 'Háblame del sesgo de la IA en la fijación de precios de seguros' },
    { en: 'What are the biggest ethical concerns?', es: '¿Cuáles son las mayores preocupaciones éticas?' },
    { en: 'How do I comply with AI regulations?', es: '¿Cómo cumplo con las regulaciones de IA?' },
  ],
  '/practice/prompt-library/': [
    { en: 'What are the best prompts for claims processing?', es: '¿Cuáles son los mejores prompts para procesamiento de reclamaciones?' },
    { en: 'How do I customize prompts for my needs?', es: '¿Cómo personalizo los prompts para mis necesidades?' },
    { en: 'Show me a prompt for underwriting review', es: 'Muéstrame un prompt para revisión de suscripción' },
  ],
  '/resources/tool-directory/': [
    { en: 'Which AI tool is best for my needs?', es: '¿Cuál herramienta de IA es mejor para mis necesidades?' },
    { en: 'What is the difference between free and paid AI tools?', es: '¿Cuál es la diferencia entre herramientas de IA gratuitas y de pago?' },
    { en: 'How do I protect confidential data when using AI?', es: '¿Cómo protejo datos confidenciales al usar IA?' },
  ],
  '/about/': [
    { en: 'Who created Insureversia and why?', es: '¿Quién creó Insureversia y por qué?' },
    { en: 'What can I find on this website?', es: '¿Qué puedo encontrar en este sitio web?' },
    { en: 'How is Insureversia different from other AI resources?', es: '¿En qué se diferencia Insureversia de otros recursos de IA?' },
  ],
};

const DEFAULT_SUGGESTIONS: Suggestion[] = [
  { en: 'How can AI help my insurance work?', es: '¿Cómo puede la IA ayudar en mi trabajo de seguros?' },
  { en: 'What should I try first?', es: '¿Qué debería probar primero?' },
  { en: 'Tell me about ethical AI use in insurance', es: 'Háblame sobre el uso ético de la IA en seguros' },
];

/**
 * Strips locale prefix from path for matching.
 * `/es/practice/quick-wins/` → `/practice/quick-wins/`
 */
function normalizePath(path: string): string {
  return path.replace(/^\/es\//, '/');
}

export function getSuggestions(locale: string, pageContext: string): string[] {
  const normalized = normalizePath(pageContext);

  // Try exact match first, then prefix match
  let suggestions = PAGE_SUGGESTIONS[normalized];
  if (!suggestions) {
    const match = Object.keys(PAGE_SUGGESTIONS).find(
      (key) => key !== '/' && normalized.startsWith(key)
    );
    suggestions = match ? PAGE_SUGGESTIONS[match] : DEFAULT_SUGGESTIONS;
  }

  const key = locale as keyof Suggestion;
  return suggestions.map((s) => s[key] || s.en);
}
