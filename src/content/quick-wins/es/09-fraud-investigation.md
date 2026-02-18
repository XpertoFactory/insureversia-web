---
title: "Construye un Esquema de Investigacion de Fraude"
description: "Crea un esquema estructurado de investigacion de fraude a partir de indicadores de alerta en reclamaciones, que cubre plan de investigacion, indicadores de fraude, estatutos aplicables, preservacion de evidencia e hitos de investigacion."
time: 5
difficulty: "advanced"
insuranceSector: "Claims Processing"
aiTool: "ChatGPT / Claude"
prompt: |
  Eres un analista de la Unidad de Investigaciones Especiales (SIU) en una compania de seguros. Con base en la informacion de la reclamacion y los indicadores de alerta que describire, crea un esquema estructurado de investigacion de fraude con las siguientes secciones:

  1. **Resumen de Indicadores de Alerta**: Organiza los indicadores de alerta identificados por categoria (por ejemplo, circunstancias de la reclamacion, comportamiento del reclamante, inconsistencias en la documentacion, indicadores financieros). Para cada indicador de alerta, califica su importancia como Alta, Media o Baja.

  2. **Plan de Investigacion**: Detalla los pasos especificos para investigar cada indicador de alerta, incluyendo:
     - **Entrevistas a realizar**: A quien se debe entrevistar, que preguntas clave hacer y en que orden
     - **Documentos a obtener**: Registros especificos a solicitar (reportes policiales, registros medicos, documentos financieros, registros telefonicos, redes sociales, etc.)
     - **Consideraciones de vigilancia**: Si la vigilancia esta justificada segun los indicadores de alerta, que tipo y que resultado apoyaria o refutaria la hipotesis de fraude
     - **Busquedas en bases de datos**: Que bases de datos de la industria consultar (NICB, ISO ClaimSearch, LexisNexis, etc.) y que buscar

  3. **Indicadores de Fraude Aplicables**: Lista los indicadores de fraude reconocidos por la industria (de NICB, CAIF o ISO) que coinciden con las caracteristicas de esta reclamacion. Indica cuantos indicadores estan presentes y que umbral tipicamente activa una referencia.

  4. **Estatutos de Fraude Estatales Relevantes**: Identifica los estatutos de fraude de seguros estatales aplicables, incluyendo:
     - Estatuto de fraude penal (cita y elementos del delito)
     - Recursos civiles de fraude disponibles para la aseguradora
     - Obligaciones de reporte obligatorio a la oficina estatal de fraude
     - Disposiciones de inmunidad para reportes de fraude de buena fe

  5. **Requisitos de Preservacion de Evidencia**: Lista la evidencia que debe preservarse, los procedimientos adecuados de cadena de custodia y los estandares de documentacion para cada tipo de evidencia.

  6. **Cronograma de Investigacion**: Proporciona un cronograma sugerido con hitos:
     - Revision inicial y triaje (dias 1-3)
     - Fase de recopilacion de documentos (dias 3-14)
     - Fase de entrevistas (dias 14-30)
     - Analisis y determinacion (dias 30-45)
     - Reporte y referencia (si corresponde)

  Formatea con encabezados claros, vinetas y una matriz de prioridad para los pasos de investigacion.

  Aqui esta la informacion de la reclamacion:

  Numero de reclamacion: [NUMERO DE RECLAMACION]
  Linea de negocio: [por ejemplo, "Auto", "Propiedad", "Compensacion de Trabajadores", "Incapacidad"]
  Fecha del siniestro: [FECHA]
  Jurisdiccion: [ESTADO]
  Resumen de la reclamacion: [BREVE DESCRIPCION DEL SINIESTRO RECLAMADO]
  Indicadores de alerta identificados: [LISTA LOS INDICADORES DE ALERTA ESPECIFICOS QUE ACTIVARON LA REFERENCIA A LA SIU]
  Informacion del reclamante: [ANTECEDENTES RELEVANTES — por ejemplo, historial previo de reclamaciones, situacion financiera si se conoce, cualquier referencia previa de fraude]
tips:
  - "Se especifico sobre los indicadores de alerta que has identificado. Cuantos mas detalles proporciones, mas dirigido sera el plan de investigacion."
  - "Despues de generar el esquema, haz un seguimiento con: 'Que indicadores de alerta adicionales deberia buscar en una reclamacion de [linea de negocio] con estas caracteristicas?' para identificar indicadores que puedas haber pasado por alto."
  - "Usa este esquema como un marco de gestion del caso. Actualizalo a medida que la investigacion avance y surja nueva informacion."
  - "Para esquemas de fraude complejos o con multiples partes, ejecuta el prompt por separado para cada reclamante o entidad involucrada, luego pide a la IA que identifique conexiones entre ellos."
cautions:
  - "Las investigaciones de fraude tienen implicaciones legales significativas. Este esquema es una herramienta de planificacion; todas las actividades de investigacion deben cumplir con las leyes, regulaciones y protocolos de SIU de tu empresa aplicables."
  - "Los estatutos de fraude estatales citados por la IA deben verificarse independientemente. Las leyes cambian, y la IA puede no reflejar las enmiendas mas recientes o interpretaciones jurisprudenciales."
  - "La vigilancia y las declaraciones grabadas estan sujetas a requisitos legales especificos de cada estado. Verifica que cualquier vigilancia o grabacion planeada cumpla con las leyes de tu jurisdiccion antes de proceder."
  - "No pegues informacion de identificacion personal del reclamante, registros medicos o detalles sensibles de investigacion en herramientas de IA de consumo. Usa versiones empresariales con protecciones de datos apropiadas y procedimientos de retencion legal."
sources:
  - type: industry-report
    title: "Fraude de Seguros: El Costo Oculto del Engano"
    author: "Coalition Against Insurance Fraud"
    date: "2024-01-22"
    url: "https://insurancefraud.org/research/"
    note: "Datos integrales sobre tendencias de fraude en seguros, costos y metodologias de deteccion en todas las lineas de negocio."
  - type: regulation
    title: "Ley Modelo de Prevencion de Fraude en Seguros"
    author: "National Association of Insurance Commissioners"
    date: "2023-01-01"
    url: "https://content.naic.org/sites/default/files/model-law-680.pdf"
    note: "Legislacion modelo para programas estatales de prevencion de fraude en seguros, incluidas las disposiciones de reporte obligatorio e inmunidad."
order: 9
---

## Que Logra Este Quick Win

Cuando una reclamacion es referida a la Unidad de Investigaciones Especiales, el analista de la SIU debe organizar rapidamente un conjunto complejo de informacion — indicadores de alerta, pistas de investigacion, requisitos legales y consideraciones de evidencia — en un plan de investigacion estructurado. Esta fase de planificacion es critica: una investigacion desorganizada puede pasar por alto evidencia clave, violar requisitos legales o no construir un caso que resista el escrutinio.

La IA puede generar un esquema de investigacion estructurado en aproximadamente 5 minutos, organizando los indicadores de alerta, trazando los pasos de investigacion, identificando los estatutos de fraude aplicables y creando un cronograma de investigacion. Esto le da al analista de la SIU un marco integral para trabajar, asegurando que no se pase por alto ninguna via importante de investigacion.

Este es un Quick Win avanzado porque las investigaciones de fraude conllevan implicaciones legales y regulatorias significativas. El esquema generado por IA es una herramienta de planificacion que debe ser revisada por profesionales experimentados de la SIU y, cuando sea apropiado, por un abogado antes de que comiencen las actividades de investigacion.

## Como Usarlo

### Paso 1: Documenta los Indicadores de Alerta

Antes de usar el prompt, compila todos los indicadores de alerta que activaron la referencia a la SIU. Se especifico:
- En lugar de "momento sospechoso", escribe "reclamacion presentada 3 dias despues del inicio de la poliza sin historial previo de seguro durante 6 meses"
- En lugar de "problemas de documentacion", escribe "presupuesto de reparacion de un taller a 45 millas del domicilio del reclamante, presupuesto preparado antes de la cita de inspeccion"
- Incluye cualquier antecedente relevante: historial previo de reclamaciones, indicadores financieros e informacion de las notas del expediente del ajustador

### Paso 2: Genera el Esquema de Investigacion

Pega el prompt y la informacion de tu reclamacion en tu herramienta de IA. La IA producira un esquema estructurado que cubre todos los aspectos principales de la investigacion.

### Paso 3: Revisa y Personaliza

Revisa el esquema contra los protocolos de SIU de tu empresa y las circunstancias especificas de la reclamacion:
- Son los pasos de investigacion recomendados apropiados y proporcionales a la reclamacion?
- Se alinean las entrevistas sugeridas y las solicitudes de documentos con lo que esta disponible y es legalmente obtenible?
- Son los estatutos de fraude citados precisos para tu jurisdiccion?
- Se alinea el cronograma con cualquier plazo de poliza o regulatorio aplicable?

Agrega cualquier paso de investigacion especifico de los procedimientos de tu empresa o de los hechos unicos del caso.

### Paso 4: Ejecuta y Actualiza

Usa el esquema como un documento vivo a lo largo de la investigacion. Actualizalo a medida que surja nueva informacion, se identifiquen nuevos indicadores de alerta o se completen pasos de investigacion. El formato estructurado facilita el seguimiento del progreso y la documentacion de la investigacion para reportes regulatorios o propositos de litigio.

## Que No Reemplaza

Este Quick Win ayuda a organizar una investigacion. No reemplaza el juicio de un analista experimentado de la SIU, la orientacion de un abogado sobre procedimientos de investigacion y admisibilidad de evidencia, ni los requisitos regulatorios especificos de tu jurisdiccion para investigacion y reporte de fraude.
