---
title: "Resume una Poliza de Seguro en 2 Minutos"
description: "Convierte una poliza de seguro extensa en un resumen estructurado con coberturas clave, exclusiones, limites e indicadores de riesgo, listo para revision del cliente o analisis interno."
time: 2
difficulty: "beginner"
insuranceSector: "Prospecting & Underwriting"
aiTool: "ChatGPT / Claude"
prompt: |
  Eres un analista senior de seguros revisando un documento de poliza de seguro. Te proporcionare el texto completo de una poliza. Por favor, elabora un resumen estructurado que incluya:

  1. **Tipo de Poliza y Numero**: Identifica el tipo de seguro y el numero de poliza.
  2. **Asegurado y Asegurador**: Identifica a todas las partes, sus roles y detalles relevantes.
  3. **Resumen de Coberturas**: Resume las coberturas principales en 2-3 oraciones por tipo de cobertura.
  4. **Periodo de la Poliza**: Indica la fecha de vigencia, vencimiento y cualquier disposicion de renovacion.
  5. **Limites y Deducibles Clave**: Lista todos los limites de cobertura, sublimites y montos de deducibles.
  6. **Exclusiones**: Lista las exclusiones principales y explica brevemente cada una.
  7. **Condiciones y Obligaciones**: Para el asegurado, lista las obligaciones clave (requisitos de notificacion, deberes despues de un siniestro, etc.).
  8. **Endosos y Anexos**: Resume cualquier endoso que modifique la cobertura estandar.
  9. **Estructura de la Prima**: Indica el monto de la prima, el calendario de pagos y cualquier descuento o recargo aplicable.
  10. **Clausulas Notables o Inusuales**: Senala cualquier disposicion que no sea estandar o potencialmente problematica, y explica brevemente por que.

  Formatea el resumen con encabezados claros. Usa vietas para facilitar la lectura. Manten el resumen total en menos de 800 palabras. Despues del resumen, agrega una seccion titulada "Brechas de Cobertura e Indicadores de Riesgo" que liste las areas donde la cobertura puede ser insuficiente o donde el asegurado deberia estar al tanto de posibles brechas.

  Aqui esta la poliza:

  [PEGA EL TEXTO COMPLETO DE LA POLIZA AQUI]
tips:
  - "Si la poliza excede la ventana de contexto de la IA, dividela en secciones (declaraciones, acuerdo de seguro, exclusiones, condiciones, endosos) y resume cada una por separado."
  - "Para mejores resultados, incluye todos los endosos y anexos, ya que frecuentemente modifican de manera significativa la cobertura base."
  - "Despues de recibir el resumen, haz preguntas de seguimiento como 'Como se compara esta poliza con los formularios estandar ISO?' o 'Que endosos adicionales recomendarias?'"
  - "Usa este resumen como punto de partida para tu propio analisis, no como el producto de trabajo final."
cautions:
  - "Nunca confies en el resumen de la IA sin leer la poliza original tu mismo. La IA puede malinterpretar terminos definidos, omitir referencias cruzadas entre secciones o pasar por alto endosos que modifican la cobertura base."
  - "No pegues documentos confidenciales de polizas de clientes en herramientas de IA de consumo sin comprender las politicas de retencion de datos. Usa versiones empresariales o de API con acuerdos apropiados de manejo de datos."
  - "La IA puede no reconocer implicaciones especificas de cada jurisdiccion. La regulacion de seguros varia significativamente segun el estado y el pais."
  - "La seccion de 'Brechas de Cobertura' es un punto de partida util, pero refleja coincidencia de patrones, no juicio actuarial o legal."
sources:
  - type: industry-report
    title: "IA en Seguros: Realidad o Ficcion?"
    author: "McKinsey & Company"
    date: "2024-03-15"
    url: "https://www.mckinsey.com/industries/financial-services/our-insights/ai-in-insurance"
    note: "Panorama de las tendencias de adopcion de IA en la industria aseguradora."
  - type: regulation
    title: "Boletin Modelo de la NAIC sobre IA"
    author: "National Association of Insurance Commissioners"
    date: "2023-12-04"
    url: "https://content.naic.org/sites/default/files/inline-files/2023-12-4%20Model%20Bulletin_Artificial%20Intelligence%20Systems.pdf"
    note: "Guia regulatoria sobre el uso de sistemas de IA por parte de aseguradoras."
order: 1
---

## Que Logra Este Quick Win

La revision de polizas es una de las tareas que mas tiempo consume en la practica aseguradora. Una poliza comercial integral puede abarcar mas de 50 paginas con declaraciones, acuerdos de seguro, exclusiones, condiciones y multiples endosos. Con IA, puedes generar un resumen estructurado de primera revision en aproximadamente 2 minutos, liberandote para enfocar tu experiencia en el analisis de cobertura y la asesoria al cliente.

Este Quick Win te proporciona un prompt que produce un resumen integral de poliza, del tipo que prepararias para una consulta con el cliente, una revision de suscripcion o una determinacion de cobertura de reclamaciones.

## Como Usarlo

### Paso 1: Prepara la Poliza

Abre el documento de la poliza en un formato donde puedas seleccionar y copiar el texto completo. Los documentos en PDF pueden necesitar ser convertidos a texto primero.

Asegurate de incluir:
- La pagina de declaraciones
- El acuerdo de seguro
- Todas las exclusiones
- Condiciones y definiciones
- Todos los endosos y anexos
- Cualquier calendario aplicable

### Paso 2: Abre Tu Herramienta de IA

Navega a [ChatGPT](https://chat.openai.com) o [Claude](https://claude.ai). Para documentos confidenciales, asegurate de estar usando una cuenta empresarial con acuerdos apropiados de manejo de datos.

### Paso 3: Pega el Prompt y la Poliza

Copia el prompt anterior, pegalo en el chat de IA y reemplaza `[PEGA EL TEXTO COMPLETO DE LA POLIZA AQUI]` con el texto completo de la poliza. Envia el mensaje.

### Paso 4: Revisa el Resultado

La IA devolvera un resumen estructurado. Leelo junto con la poliza original, prestando especial atencion a:

- **Terminos definidos**: Verifica que la IA identifico correctamente como se definen los terminos clave a lo largo de la poliza.
- **Alcance de las exclusiones**: Comprueba si la IA detecto todas las exclusiones, incluidas las incorporadas en los endosos.
- **Brechas de cobertura**: Usa los elementos senalados como lista de verificacion para tu revision mas profunda.

### Paso 5: Itera

Haz preguntas de seguimiento especificas:

- *"Compara las exclusiones de esta poliza con un formulario estandar ISO de responsabilidad general comercial."*
- *"Que endosos recomendarias para cerrar las brechas de cobertura que identificaste?"*
- *"Resume los requisitos de notificacion y las obligaciones de reporte de reclamaciones."*

## Por Que Funciona

Los modelos de lenguaje de gran escala destacan en la extraccion de informacion estructurada a partir de texto documental. Las polizas de seguro siguen estructuras relativamente predecibles, lo que las hace muy adecuadas para el analisis con IA. El prompt instruye a la IA para organizar su resultado en el marco que usaria un analista experimentado.

## Que No Reemplaza

Este Quick Win acelera la primera revision. No reemplaza:

- **El juicio profesional** sobre si la cobertura es adecuada para un riesgo especifico
- **El analisis actuarial** de la adecuacion del precio
- **La interpretacion legal** del lenguaje ambiguo de la poliza
- **La revision de cumplimiento regulatorio** para requisitos especificos de cada jurisdiccion
