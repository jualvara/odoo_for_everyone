# 🚀 Guía de Configuración para GitHub Pages

Este documento te guiará paso a paso para publicar OdooMastery AI en GitHub Pages.

## 📋 Prerrequisitos

- ✅ Cuenta de GitHub
- ✅ Git instalado en tu máquina
- ✅ Gemini API Key (gratis en https://ai.google.dev/)

---

## 🔧 Paso 1: Configurar el Repositorio

### 1.1 Crear Repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre del repositorio: `odoomastery` (o el nombre que prefieras)
3. Visibilidad: **Public** (necesario para GitHub Pages gratis)
4. **NO** inicialices con README, .gitignore o licencia (ya los tenemos)
5. Click en **Create repository**

### 1.2 Conectar tu Proyecto Local

```bash
# Si aún no has inicializado git
cd /home/qubiq15/Documentos/DEVELOPER/odoomastery
git init
git add .
git commit -m "Initial commit: OdooMastery AI platform"

# Conectar con el repositorio remoto (reemplaza 'tuusuario')
git remote add origin https://github.com/tuusuario/odoomastery.git

# Subir el código
git branch -M main
git push -u origin main
```

---

## 🔑 Paso 2: Configurar la API Key de Gemini

### 2.1 Obtener Gemini API Key

1. Ve a https://ai.google.dev/
2. Click en **Get API key in Google AI Studio**
3. Acepta los términos y condiciones
4. Click en **Create API key**
5. Copia la key (formato: `AIza...`)

### 2.2 Añadir Secret en GitHub

1. Ve a tu repositorio en GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Click en **New repository secret**
4. Name: `GEMINI_API_KEY`
5. Secret: pega tu API key
6. Click en **Add secret**

---

## 📄 Paso 3: Habilitar GitHub Pages

1. En tu repositorio, ve a **Settings** → **Pages**
2. En **Source**, selecciona: **GitHub Actions**
3. (No necesitas configurar nada más aquí)

---

## 🚢 Paso 4: Desplegar

### 4.1 Ajustar el nombre del repositorio en vite.config.ts

Abre `vite.config.ts` y cambia la línea 10:

```typescript
// Cambia 'odoomastery' por el nombre exacto de tu repositorio
const base = mode === 'production' ? '/tu-repo-name/' : '/';
```

### 4.2 Commit y Push

```bash
git add vite.config.ts
git commit -m "Configure base path for GitHub Pages"
git push origin main
```

### 4.3 Verificar el Deployment

1. Ve a la pestaña **Actions** en tu repositorio
2. Verás el workflow "Deploy to GitHub Pages" ejecutándose
3. Espera a que ambos jobs (build y deploy) estén en verde ✅
4. Tardará ~2-3 minutos la primera vez

---

## 🌐 Paso 5: Acceder a tu Sitio

Tu aplicación estará disponible en:

```
https://tuusuario.github.io/odoomastery/
```

(Reemplaza `tuusuario` y `odoomastery` con tus valores reales)

---

## 🔄 Actualizaciones Futuras

Cada vez que hagas cambios:

```bash
git add .
git commit -m "Descripción de tus cambios"
git push origin main
```

El workflow se ejecutará automáticamente y desplegará la nueva versión.

---

## 🐛 Troubleshooting

### Error: "Page build failed"

**Causa:** Gemini API Key no configurada

**Solución:** Verifica que el secret `GEMINI_API_KEY` existe en Settings → Secrets and variables → Actions

### Error: 404 al acceder a la página

**Causa:** Base path incorrecto en `vite.config.ts`

**Solución:** 
1. Verifica que el `base` en `vite.config.ts` coincide exactamente con el nombre del repositorio
2. Ejemplo: Si tu repo es `github.com/usuario/mi-proyecto`, debe ser:
   ```typescript
   const base = mode === 'production' ? '/mi-proyecto/' : '/';
   ```

### La página carga pero el chat de IA no funciona

**Causa 1:** API Key inválida o sin cuota

**Solución:** Ve a https://ai.google.dev/ y verifica que tu key funciona

**Causa 2:** Restricciones de CORS

**Solución:** Gemini permite CORS desde GitHub Pages por defecto. Si tienes problemas, revisa la consola del navegador (F12)

### Los estilos no cargan correctamente

**Causa:** Paths de recursos incorrectos

**Solución:** Asegúrate de que en tu HTML e imports usas rutas relativas, no absolutas. Vite debería manejar esto automáticamente.

---

## 🔒 Seguridad de la API Key

### ⚠️ IMPORTANTE: Proteger tu API Key

La API key se expone en el cliente (frontend). Para protegerla:

1. **Restricciones de URL en Google AI Studio:**
   - Ve a https://aistudio.google.com/app/apikey
   - Click en tu API key → **Edit restrictions**
   - **Website restrictions** → Add:
     ```
     https://tuusuario.github.io/*
     ```

2. **Monitoreo de uso:**
   - Revisa regularmente el uso en Google AI Studio
   - Si detectas uso anormal, regenera la key

3. **Alternativa (Avanzado):** 
   - Para producción empresarial, considera montar un backend proxy con Cloudflare Workers o Vercel Functions que oculte la key

---

## 📊 Monitoreo

### Ver estadísticas de tu sitio

GitHub no incluye analytics por defecto. Opciones:

1. **Google Analytics** (gratis)
2. **Plausible Analytics** (open source)
3. **Vercel Analytics** (si migras a Vercel)

---

## 🎉 ¡Listo!

Tu plataforma de aprendizaje de Odoo ya está en línea y accesible desde cualquier parte del mundo.

**Comparte el link con tu equipo y la comunidad:**

```
https://tuusuario.github.io/odoomastery
```

---

## 💡 Próximos Pasos

1. **Personaliza el README.md** con tu información de contacto
2. **Añade tu propio logo** en `index.html`
3. **Customiza colores** en `App.tsx` (variables ODOO_PURPLE, ODOO_TEAL)
4. **Crea nuevas lecciones** en `constants.ts`
5. **Comparte en redes sociales** para democratizar el conocimiento

---

<div align="center">

**¿Preguntas? Abre un [Issue en GitHub](https://github.com/tuusuario/odoomastery/issues)**

*¡Feliz enseñanza! 🎓*

</div>
