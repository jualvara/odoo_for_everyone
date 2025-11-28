
import { GoogleGenAI, Type, Schema } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateTutorResponse = async (
  message: string,
  context: string,
  history: { role: 'user' | 'model'; text: string }[]
) => {
  try {
    const model = 'gemini-2.5-flash';
    
    // Construct history for context awareness
    const historyContents = history.map(h => ({
      role: h.role,
      parts: [{ text: h.text }]
    }));

    const systemInstruction = `
      Eres un instructor experto en Odoo (ERP). Tu nombre es "OdooBot".
      Ayudas a estudiantes a aprender Desarrollo en Odoo.
      
      IMPORTANTE:
      1. Céntrate exclusivamente en **Odoo v16 y v17**.
      2. Si te preguntan sobre frontend, habla siempre de **OWL (Odoo Web Library)**, no de widgets antiguos de jQuery.
      3. Tus explicaciones deben ser técnicas pero accesibles.
      4. Sigue el plan de estudios: Junior (Fundamentos, Modelos), Middle (Herencia, Seguridad), Senior (Automatización, OWL).
      
      Contexto actual de la lección:
      ${context}

      Reglas:
      1. Sé conciso y didáctico.
      2. Si te piden código, usa bloques de código.
      3. Responde siempre en Español.
      4. Si el usuario pregunta algo no relacionado con Odoo, redirígelo amablemente.
    `;

    const chat = ai.chats.create({
      model,
      config: {
        systemInstruction,
      },
      history: historyContents
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "Lo siento, tuve un problema conectando con el servidor de IA. Por favor intenta de nuevo.";
  }
};

export const validateCodeSnippet = async (taskDescription: string, code: string) => {
  try {
    const prompt = `
      Actúa como un compilador e intérprete flexible para un curso de Odoo.
      Tarea del Ejercicio: ${taskDescription}
      
      Código enviado por el usuario:
      \`\`\`
      ${code}
      \`\`\`
      
      Acciones:
      1. Analiza si el código resuelve la tarea correctamente.
      2. IMPORTANTE: Si la tarea es simple (ej. "Definir una clase Python básica" sin importar odoo), valídala como Python puro. No exijas imports de Odoo si no son necesarios para la tarea.
      3. Simula la ejecución del código.
         - Si es código Odoo, simula logs del servidor realistas (ej. "INFO: odoo.modules.loading: loading 1 modules...").
         - Si es Python puro, muestra el stdout.
         - Si hay errores de sintaxis, muestra un Traceback breve.
      
      Devuelve un JSON con:
      - valid: boolean (true si cumple la tarea, false si falla)
      - feedback: string (Un consejo breve o felicitación **EN ESPAÑOL**. Explica por qué falló o por qué está bien).
      - consoleOutput: string (texto crudo que iría en la terminal, incluyendo logs o errores).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            valid: { type: Type.BOOLEAN },
            feedback: { type: Type.STRING },
            consoleOutput: { type: Type.STRING }
          },
          required: ['valid', 'feedback', 'consoleOutput']
        } as Schema
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error validating code:", error);
    return { 
      valid: false, 
      feedback: "Error de conexión con el validador.", 
      consoleOutput: "Error 500: Unable to connect to validation server." 
    };
  }
};

export const generateQuizQuestion = async (lessonContent: string) => {
  try {
    const prompt = `
      Basado en este contenido de lección de Odoo:
      "${lessonContent.substring(0, 1000)}..."

      Genera una pregunta de opción múltiple técnica en ESPAÑOL.
      Devuelve JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctIndex: { type: Type.INTEGER },
            explanation: { type: Type.STRING }
          }
        } as Schema
      }
    });
    
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error(error);
    return null;
  }
};
