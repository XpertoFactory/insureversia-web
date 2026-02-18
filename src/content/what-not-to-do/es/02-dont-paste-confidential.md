---
title: "No pegues datos de asegurados en herramientas de IA públicas"
number: 2
description: "Las herramientas de IA para consumidores (ChatGPT gratuito, Gemini gratuito) pueden usar tus entradas para el entrenamiento de modelos. Ingresar información personal identificable de asegurados, datos de reclamaciones, registros médicos o información comercial propietaria en estas herramientas crea serios riesgos de privacidad y cumplimiento."
risk: "Violaciones de privacidad de datos (GDPR, CCPA, leyes estatales de privacidad de seguros), sanciones regulatorias, quiebre de confianza del asegurado, exposición de inteligencia competitiva, posible responsabilidad por filtración de datos"
realExample: "En abril de 2023, Samsung prohibió el uso de ChatGPT por parte de sus empleados después de que ingenieros subieron inadvertidamente código fuente propietario y notas de reuniones internas a la plataforma. Los datos pasaron a formar parte del conjunto de entrenamiento de ChatGPT. En el contexto de seguros, imagina que registros médicos de asegurados, historiales de reclamaciones o algoritmos de precios propietarios sean procesados por una herramienta de IA pública — las implicaciones de privacidad bajo HIPAA, GDPR y las leyes estatales de privacidad de seguros serían severas."
mitigation: "Usa herramientas de IA de nivel empresarial con acuerdos de procesamiento de datos apropiados para cualquier trabajo que involucre datos sensibles. Establece una política clara de clasificación de datos que defina qué puede y qué no puede ingresarse en herramientas de IA. En caso de duda, anonimiza o usa datos sintéticos."
insureversiasTake: "Aquí es donde la mayoría de las organizaciones se ven atrapadas. Alguien copia un expediente de reclamaciones en ChatGPT para 'resumirlo rápidamente', y de repente los registros médicos de un asegurado están circulando por los servidores de OpenAI. La persona tenía buenas intenciones — estaba tratando de ser eficiente. Pero acaba de crear una violación de privacidad que podría costarle a la organización millones. Obtén herramientas empresariales. Capacita a tu gente. Haz que lo correcto sea lo fácil."
sources:
  - type: news
    title: "Samsung prohíbe el uso de ChatGPT tras filtración de datos de empleados"
    author: "James Vincent"
    date: "2023-05-02"
    url: "https://www.theverge.com/2023/5/2/23707796/samsung-ban-chatgpt-generative-ai-bing"
    note: "La prohibición de ChatGPT por parte de Samsung después de que se ingresaran datos confidenciales en la plataforma"
  - type: regulation
    title: "NAIC Insurance Data Security Model Law"
    author: "National Association of Insurance Commissioners"
    date: "2017-10-24"
    note: "Ley modelo que establece estándares de seguridad de datos para licenciatarios de seguros"
---

## El peligro en detalle

Cuando escribes o pegas texto en una herramienta de IA para consumidores, esos datos se transmiten a los servidores del proveedor de IA. Dependiendo de los términos de servicio de la herramienta, tu entrada puede usarse para entrenar futuras versiones del modelo, ser revisada por moderadores humanos o almacenarse indefinidamente.

### Qué constituye datos sensibles en seguros

**Información personal identificable del asegurado**: Nombres, direcciones, números de Seguro Social, fechas de nacimiento, números de licencia de conducir, información financiera.

**Información de salud protegida (PHI)**: Registros médicos, historiales de tratamiento, información sobre discapacidad — particularmente relevante para seguros de salud, vida, discapacidad y compensación laboral.

**Datos de reclamaciones**: Descripciones de reclamaciones, montos de liquidación, notas del ajustador, detalles de investigaciones de fraude.

**Información comercial propietaria**: Algoritmos de precios, directrices de suscripción, modelos de pérdidas, análisis competitivo, planes estratégicos.

**Información confidencial de terceros**: Términos de tratados de reaseguro, contratos con proveedores, hallazgos de auditoría.

### Alternativas seguras

**Herramientas de IA empresariales**: Muchos proveedores de IA ofrecen versiones empresariales con acuerdos de procesamiento de datos que prohíben usar tus entradas para entrenamiento. ChatGPT Enterprise/Team, Claude for Business y Microsoft Copilot for Enterprise ofrecen estas protecciones.

**Modelos locales / privados**: Para los datos más sensibles, considera modelos de IA locales que procesan datos completamente dentro de tu infraestructura.

**Anonimización**: Antes de usar cualquier herramienta de IA, elimina toda información identificable. Reemplaza nombres con "Asegurado A", redacta números de cuenta y usa descripciones genéricas.

**Datos sintéticos**: Para propósitos de prueba y entrenamiento, crea conjuntos de datos sintéticos que repliquen los patrones de tus datos reales sin contener información real de asegurados.
