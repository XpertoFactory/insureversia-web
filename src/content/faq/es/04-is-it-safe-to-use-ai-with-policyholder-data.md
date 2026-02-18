---
title: "¿Es seguro usar IA con datos de los asegurados?"
category: "skeptical"
order: 4
sources:
  - type: regulation
    title: "NAIC Model Bulletin: Use of Artificial Intelligence Systems by Insurers"
    author: "National Association of Insurance Commissioners"
    date: "2023-12-04"
    note: "Guía regulatoria sobre privacidad de datos y uso de IA en seguros"
  - type: industry-report
    title: "Data Privacy and AI in Insurance: A Risk-Based Framework"
    author: "International Association of Insurance Supervisors (IAIS)"
    date: "2024-01-15"
    note: "Marco global para gestionar riesgos de privacidad de datos en seguros impulsados por IA"
---

Esta es una de las preguntas más importantes en la adopción de IA, y la respuesta honesta es: depende de cómo la use y qué herramientas elija.

**Cuándo la IA en la nube es riesgosa:** Las herramientas de IA de propósito general como ChatGPT, Claude y Gemini procesan datos en servidores externos. Ingresar nombres de asegurados, números de póliza, detalles de reclamaciones, información médica o números de seguro social en estas plataformas genera riesgos reales de confidencialidad y cumplimiento. Los términos de servicio de la mayoría de los proveedores de IA establecen que los datos de entrada pueden utilizarse para el entrenamiento de modelos — un conflicto directo con las obligaciones de protección de datos en seguros.

**Cuándo la IA en la nube es apropiada:** Estas mismas herramientas son perfectamente seguras para trabajo no confidencial: resumir documentos regulatorios públicos, redactar lenguaje de plantillas, generar ideas sobre conceptos de cobertura o analizar datos anonimizados y agregados. La clave es asegurar que no ingrese información de identificación personal (PII) ni información de salud protegida (PHI) en el prompt.

**Existen opciones de IA empresarial y local:** Las versiones empresariales de las principales plataformas de IA (ChatGPT Enterprise, Claude for Business) ofrecen acuerdos de procesamiento de datos y compromisos de que los datos de entrada no se utilizarán para entrenamiento. Los modelos de IA locales que se ejecutan en su propio hardware — como Ollama con modelos de código abierto — mantienen todos los datos en las instalaciones, eliminando por completo la exposición a la nube.

**Un protocolo práctico:**

1. **Clasifique sus datos** antes de usar cualquier herramienta de IA: públicos, internos, confidenciales o restringidos.
2. **Nunca ingrese PII o PHI** en herramientas de IA para consumidores.
3. **Use IA empresarial o local** para trabajo confidencial de seguros.
4. **Establezca una política de datos de IA a nivel de toda la empresa** que todos los miembros del equipo comprendan y sigan.

El Boletín Modelo de la NAIC aborda explícitamente la privacidad de datos en el uso de IA, requiriendo que las aseguradoras mantengan una gobernanza adecuada sobre cómo los sistemas de IA manejan los datos de los consumidores. El cumplimiento no es opcional — es una obligación regulatoria.
