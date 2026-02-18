---
title: "Genera Preguntas de Suscripcion Dirigidas"
description: "Produce un conjunto integral de preguntas complementarias de suscripcion a partir de una solicitud de seguro, organizadas por categoria de riesgo con explicaciones de por que cada pregunta es importante."
time: 2
difficulty: "beginner"
insuranceSector: "Prospecting & Underwriting"
aiTool: "ChatGPT / Claude"
prompt: |
  Eres un suscriptor senior revisando una solicitud de seguro. Con base en la informacion de la solicitud que te proporcionare, genera un conjunto integral de preguntas complementarias de suscripcion organizadas en las siguientes categorias:

  1. **Caracteristicas de Riesgo que Necesitan Aclaracion**: Preguntas sobre las operaciones, exposiciones o perfil de riesgo del solicitante que necesitan mayor detalle antes de que pueda tomarse una decision de cobertura.
     - Para cada pregunta, indica: *Por que importa* — explica brevemente como la respuesta afecta la decision de suscripcion.

  2. **Preocupaciones sobre la Adecuacion de Cobertura**: Preguntas sobre si los limites solicitados, deducibles y estructura de cobertura son apropiados para el perfil de riesgo del solicitante.
     - Para cada pregunta, indica: *Por que importa* — explica que brecha de cobertura o riesgo de sobreaseguramiento estas investigando.

  3. **Seguimiento del Historial de Siniestros**: Preguntas sobre el historial de reclamaciones reportado por el solicitante que requieren aclaracion, como reclamaciones abiertas, tendencias o detalles faltantes.
     - Para cada pregunta, indica: *Por que importa* — explica que revela la respuesta sobre el potencial de siniestros futuros.

  4. **Practicas de Seguridad y Gestion de Riesgos**: Preguntas sobre las medidas de control de riesgos del solicitante, programas de seguridad, planes de continuidad del negocio y esfuerzos de prevencion de siniestros.
     - Para cada pregunta, indica: *Por que importa* — explica como la presencia o ausencia de estas practicas afecta la calidad del riesgo.

  5. **Consideraciones Regulatorias y de Cumplimiento**: Preguntas sobre el cumplimiento del solicitante con las regulaciones de la industria, requisitos de licencias u obligaciones contractuales que afectan la asegurabilidad.
     - Para cada pregunta, indica: *Por que importa* — explica el riesgo regulatorio o contractual en cuestion.

  Para cada categoria, proporciona 3-5 preguntas dirigidas. Prioriza las preguntas que cambien significativamente el resultado de la suscripcion; no incluyas preguntas genericas que apliquen a cualquier riesgo.

  Aqui esta la informacion de la solicitud:

  [PEGA LA SOLICITUD DE SEGURO O RESUME LOS DETALLES CLAVE: nombre del solicitante, tipo de negocio, industria, ingresos, empleados, ubicaciones, coberturas solicitadas, limites, deducibles, historial de siniestros y cualquier factor de riesgo notable]
tips:
  - "Cuantos mas detalles proporciones de la solicitud, mas especificas y utiles seran las preguntas. Incluye industria, descripcion de operaciones, ingresos y cualquier factor de riesgo inusual."
  - "Esta es una excelente herramienta de capacitacion para suscriptores junior. Pideles que comparen las preguntas generadas por IA con su propia lista y discutan las diferencias."
  - "Despues de recibir las preguntas, haz un seguimiento con: 'Basandote en los riesgos tipicos de esta industria, cuales son las tres piezas de informacion mas criticas que necesito antes de cotizar esta cuenta?'"
  - "Ejecuta este prompt para cada nueva solicitud para asegurar consistencia en tu proceso de suscripcion y evitar pasar por alto preguntas importantes."
cautions:
  - "Las preguntas generadas por IA se basan en principios generales de suscripcion. Pueden omitir consideraciones especificas de la industria o la jurisdiccion que un suscriptor experimentado detectaria."
  - "No pegues informacion confidencial del solicitante en herramientas de IA de consumo. Usa versiones empresariales o de API con acuerdos apropiados de manejo de datos."
  - "Las preguntas complementarias deben ser relevantes y no discriminatorias. Revisa todas las preguntas para asegurar el cumplimiento con practicas justas de suscripcion y regulaciones aplicables."
sources:
  - type: industry-report
    title: "Transformando la Suscripcion con IA"
    author: "Deloitte"
    date: "2024-04-18"
    url: "https://www.deloitte.com/global/en/Industries/financial-services/perspectives/ai-in-insurance-underwriting.html"
    note: "Investigacion sobre como la IA esta potenciando el proceso de suscripcion, incluida la evaluacion de riesgos y la generacion de preguntas."
  - type: regulation
    title: "Ley de Practicas Comerciales Desleales — Regulacion Modelo"
    author: "National Association of Insurance Commissioners"
    date: "2023-01-01"
    url: "https://content.naic.org/sites/default/files/model-law-880.pdf"
    note: "Marco regulatorio que rige las practicas justas de suscripcion y la discriminacion prohibida en seguros."
order: 7
---

## Que Logra Este Quick Win

Revisar una solicitud de seguro e identificar las preguntas de seguimiento correctas es una habilidad que toma anos en desarrollarse. Los suscriptores experimentados saben instintivamente que preguntar: que brechas en la solicitud indican un riesgo elevado, que patrones en el historial de siniestros requieren explicacion y que detalles operativos determinan si un riesgo es aceptable. Para suscriptores mas nuevos, o para suscriptores experimentados trabajando fuera de su linea de negocio habitual, este reconocimiento de patrones toma tiempo.

La IA puede analizar una solicitud y generar un conjunto estructurado de preguntas complementarias en aproximadamente 2 minutos. Cada pregunta viene con una explicacion de por que es importante, haciendo del resultado tanto una herramienta practica como un recurso de aprendizaje. Para suscriptores experimentados, sirve como una lista de verificacion rapida para asegurar que nada se pase por alto durante un ciclo de solicitudes ocupado.

## Como Usarlo

### Paso 1: Prepara la Informacion de la Solicitud

Copia los detalles clave de la solicitud de seguro o resumenlos. Como minimo, incluye:
- Nombre del solicitante y descripcion del negocio
- Industria y operaciones
- Ingresos y numero de empleados
- Ubicaciones y territorio
- Coberturas solicitadas, limites y deducibles
- Historial de siniestros de los ultimos 3-5 anos
- Cualquier factor de riesgo que te llame la atencion

Cuanto mas contexto proporciones, mas dirigidas seran las preguntas.

### Paso 2: Genera las Preguntas

Pega el prompt y la informacion de la solicitud en tu herramienta de IA. La IA devolvera un conjunto categorizado de preguntas con explicaciones.

### Paso 3: Revisa y Prioriza

No todas las preguntas generadas seran relevantes para cada solicitud. Revisa la lista y:
- Conserva las preguntas que aborden brechas genuinas en la solicitud
- Elimina las preguntas que la solicitud ya responde
- Agrega cualquier pregunta especifica de las guias de suscripcion o apetito de tu empresa que la IA no conoceria
- Prioriza las preguntas que afectarian materialmente tu decision de precios o cobertura

### Paso 4: Envia al Agente o Corredor

Compila tu lista final de preguntas complementarias y envialas al agente o corredor que presento la solicitud. Las explicaciones de "Por que importa" pueden ayudarte a articular al agente por que necesitas la informacion, lo que frecuentemente resulta en respuestas mas rapidas y completas.

## Que No Reemplaza

Este Quick Win ayuda a generar y organizar preguntas de suscripcion. No reemplaza el juicio profesional de un suscriptor sobre la aceptabilidad del riesgo, las guias de suscripcion y apetito especificas de tu empresa, ni la evaluacion matizada que proviene de la experiencia con una linea de negocio o segmento de industria en particular.
