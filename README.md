# 🎓 OdooMastery AI - Democratización del Conocimiento Odoo

<div align="center">

**Plataforma de aprendizaje interactivo impulsada por IA para dominar el desarrollo en Odoo**

[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-brightgreen)](https://github.com/jualvara/odoo_for_everyone)
[![React](https://img.shields.io/badge/React-19.2.0-blue)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-purple)](https://vitejs.dev/)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI-orange)](https://ai.google.dev/)

</div>

---

## 🌟 Nuestra Misión: Democratizar el Conocimiento

**OdooMastery AI** nace con un propósito claro: **eliminar las barreras de acceso al aprendizaje de Odoo**. Creemos que el conocimiento debe ser:

- ✅ **Accesible:** Gratis y disponible 24/7 desde cualquier lugar del mundo
- ✅ **Práctico:** Aprendizaje basado en proyectos reales con retroalimentación instantánea
- ✅ **Personalizado:** Asistente IA que se adapta a tu ritmo y estilo de aprendizaje
- ✅ **Inclusivo:** Contenido en español y diseñado para todos los niveles (Junior → Senior)

Tradicionalmente, aprender Odoo requiere:
- 💰 Cursos costosos ($2,000 - $5,000 USD)
- 📚 Documentación fragmentada y dispersa
- ⏰ Meses de prueba y error sin guía estructurada

**Nosotros lo cambiamos.** Ofrecemos un curriculum completo, estructurado y **completamente gratuito** con asistencia de IA en tiempo real.

---

## 🚀 ¿Por Qué OdooMastery AI?

### Para Profesionales Individuales
- **Curriculum de 15 módulos** (Junior → Middle → Senior)
- **Laboratorio interactivo** con editor de código Monaco y validación automática
- **Gamificación:** XP, badges y tracking de progreso para mantener motivación
- **Chat con IA experta** en Odoo para resolver dudas al instante
- **Practice Mode** con desafíos reales de debugging y arquitectura

### Para Empresas: ROI Inmediato

#### 📊 Reducción de costes de formación
| Concepto | Tradicional | Con OdooMastery AI | Ahorro |
|----------|-------------|-------------------|--------|
| Curso oficial Odoo | $3,500/persona | $0 | **100%** |
| Tiempo de onboarding | 6-8 meses | 3-4 meses | **50%** |
| Consultoría externa | $150/hora | Autónomo | **80%** |

#### 💼 Beneficios empresariales clave

1. **Acelera el Onboarding de Nuevos Developers**
   - Path de aprendizaje claro desde día 1
   - Reduce dependencia de seniors para mentorización básica
   - Estándares de código consistentes desde el inicio

2. **Upskilling Interno Económico**
   - Convierte profiles funcionales en functional developers
   - Actualiza equipos a Odoo 17 sin parar producción
   - Fomenta cultura de aprendizaje continuo

3. **Reduce Dependencia de Consultoras Externas**
   - Equipo interno capaz de mantener y extender módulos custom
   - Menor coste por hora de desarrollo ($40 vs $150 externo)
   - Mayor control sobre roadmap técnico

4. **Atracción de Talento**
   - Muestra compromiso con desarrollo profesional
   - Diferenciador en ofertas laborales (plan de carrera técnico)

---

## ✨ Características Principales

### 📚 Curriculum Completo Estructurado

```
🎯 Nivel Junior (Fundamentos)
├── Fase 0: Python + PostgreSQL + Docker
├── Fase 1: Estructura del Módulo (Manifest, Models, Views)
└── Fase 2: ORM y Relaciones

🎯 Nivel Middle (Lógica de Negocio)
├── Fase 3: Herencia (_inherit) y Seguridad (ACL)
├── Fase 3.5: Odoo Studio (Low-Code)
└── Fase 4: Wizards y Reportes QWeb

🎯 Nivel Senior (Arquitectura Avanzada)
├── Fase 5: Server Actions y Cron Jobs
└── Fase 6: Frontend OWL (Odoo Web Library)
```

### 🤖 Asistente IA Experto en Odoo
- Powered by **Google Gemini 2.0 Flash**
- Contexto completo del curriculum y mejores prácticas
- Respuestas instantáneas con ejemplos de código
- Debugging asistido y revisión de arquitectura

### 💻 Laboratorio de Código Interactivo
- **Monaco Editor** (mismo de VS Code) con syntax highlighting
- Validación automática de desafíos
- Snippets de código reutilizables (Fields, ORM, XML)
- Hints progresivos si te atascas

### 📊 Sistema de Gamificación
- **XP Points** por cada lección completada
- **Badges desbloqueables:** "ORM Master", "OWL Expert", etc.
- **Streak tracking** para mantener consistencia
- **Progress Dashboard** visual con gráficas Recharts

---

## 🛠️ Stack Tecnológico

- **Frontend:** React 19.2 + TypeScript + Vite
- **UI Components:** Lucide React (iconos) + CSS Vanilla
- **Editor:** Monaco Editor (VS Code engine)
- **IA:** Google Gemini 2.0 Flash API
- **Gráficas:** Recharts
- **Deploy:** GitHub Pages (CI/CD automático)

---

## 🚀 Demo y Despliegue

### 🌐 Demo en Vivo
Visita la aplicación desplegada en GitHub Pages:
**[https://jualvara.github.io/odoo_for_everyone/](https://jualvara.github.io/odoo_for_everyone/)**

### 💻 Ejecutar Localmente

#### Prerrequisitos
- Node.js 18+ y npm

#### Pasos

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/jualvara/odoo_for_everyone.git
   cd odoo_for_everyone
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar Gemini API Key**
   
   Crea un archivo `.env.local` en la raíz:
   ```
   GEMINI_API_KEY=tu_api_key_aqui
   ```
   
   > 💡 **Obtén tu API key gratis en:** https://ai.google.dev/

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```
   
   Abre http://localhost:3000

5. **Build de producción** (opcional)
   ```bash
   npm run build
   npm run preview
   ```

---

## 📁 Estructura del Proyecto

```
odoomastery/
├── App.tsx                 # Componente principal con routing
├── constants.ts            # Curriculum, badges, challenges
├── types.ts                # TypeScript interfaces
├── components/
│   ├── LearningPath.tsx    # Vista del curriculum
│   ├── LessonView.tsx      # Lección individual con editor
│   ├── Dashboard.tsx       # Progreso y estadísticas
│   └── ChatWithAI.tsx      # Asistente IA conversacional
├── services/
│   └── geminiService.ts    # Cliente Gemini API
├── vite.config.ts          # Configuración Vite + GitHub Pages
└── .github/
    └── workflows/
        └── deploy.yml      # CI/CD automático
```

---

## 🔧 Configuración para GitHub Pages

Este proyecto está pre-configurado para desplegar en GitHub Pages con CI/CD automático.

### Pasos para Publicar tu Versión

1. **Fork/Clone este repo en tu GitHub**

2. **Configurar Secret para API Key**
   - Ve a *Settings → Secrets and variables → Actions*
   - Crea un secreto llamado `GEMINI_API_KEY`
   - Pega tu Gemini API key

3. **Habilitar GitHub Pages**
   - *Settings → Pages*
   - Source: **GitHub Actions**

4. **Push a `master` para desplegar**
   ```bash
   git push origin master
   ```
   
   El workflow `.github/workflows/deploy.yml` se ejecutará automáticamente.

5. **Accede a tu sitio**
   - URL: `https://tuusuario.github.io/odoo_for_everyone`

---

## 🗺️ Roadmap

### ✅ Versión Actual (v1.0)
- [x] Curriculum completo Junior → Senior (15 módulos)
- [x] Chat con IA experto en Odoo
- [x] Sistema de XP y badges
- [x] Editor de código interactivo
- [x] Deployment en GitHub Pages

### 🚧 Próximas Funcionalidades (v1.1)
- [ ] **Modo Offline:** Descargar lecciones para estudiar sin internet
- [ ] **Code Linter:** Validación automática según PEP8 y Odoo guidelines
- [ ] **Certificados:** Certificado de completion por nivel
- [ ] **Community Forum:** Espacio para Q&A entre estudiantes
- [ ] **Video Tutorials:** Screencast complementarios

### 🔮 Visión a Largo Plazo (v2.0)
- [ ] **Sandbox Odoo en Browser:** Entorno Odoo real con Pyodide (Python en WASM)
- [ ] **Tracks especializados:** eCommerce, Contabilidad, Manufacturing
- [ ] **Integración con IDE:** Extension para VS Code
- [ ] **Modelo de Negocio Sostenible:** Corporate licenses para empresas

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si quieres ayudar a democratizar el conocimiento de Odoo:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-leccion`)
3. Commit tus cambios (`git commit -m 'Añade lección de Workflows'`)
4. Push a la rama (`git push origin feature/nueva-leccion`)
5. Abre un Pull Request

### Ideas para Contribuir
- 📝 Añadir nuevas lecciones o módulos
- 🐛 Reportar bugs o mejoras de UX
- 🌍 Traducir a otros idiomas (inglés, francés, portugués)
- 🎨 Mejorar diseño y accesibilidad

---

## 📜 Licencia

Este proyecto es **Open Source** bajo licencia MIT. Siéntete libre de usarlo, modificarlo y distribuirlo.

---

## 📧 Contacto y Soporte

- **GitHub Issues:** Para reportar bugs o sugerir features
- **Discussions:** Para preguntas generales y showcase de proyectos
- **Email:** [tu-email@ejemplo.com]

---

## 🙏 Agradecimientos

- **Odoo SA** por crear un ERP increíble y Open Source
- **Google Gemini** por democratizar el acceso a IA avanzada
- **Comunidad Open Source** que hace posible proyectos como este
- **Todos los estudiantes** que confían en esta plataforma para crecer profesionalmente

---

<div align="center">

**⭐ Si este proyecto te ayuda, considera darle una estrella en GitHub ⭐**

*Hecho con ❤️ para democratizar el conocimiento de Odoo*

</div>
