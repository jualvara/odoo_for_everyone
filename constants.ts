
import { Track, Difficulty, Badge, Snippet, Challenge } from './types';

export const ODOO_PURPLE = '#714B67';
export const ODOO_TEAL = '#017E84';

// --- GAMIFICATION: BADGES ---
export const BADGES: Badge[] = [
  {
    id: 'badge-hello',
    title: 'Hola Mundo',
    description: 'Completaste tu primera lección.',
    icon: '👋',
    condition: (p) => p.completedLessonIds.length >= 1
  },
  {
    id: 'badge-streak-3',
    title: 'En Llamas',
    description: 'Racha de 3 días seguidos aprendiendo.',
    icon: '🔥',
    condition: (p) => p.streakDays >= 3
  },
  {
    id: 'badge-junior',
    title: 'Junior Dev',
    description: 'Alcanzaste 500 XP.',
    icon: '⭐',
    condition: (p) => p.totalXP >= 500
  },
  {
    id: 'badge-orm',
    title: 'Maestro ORM',
    description: 'Completaste el módulo de Métodos ORM.',
    icon: '💾',
    condition: (p) => p.completedLessonIds.includes('les-2-2') // Example logic
  },
  {
    id: 'badge-owl',
    title: 'OWL Expert',
    description: 'Completaste tu primer componente OWL.',
    icon: '🦉',
    condition: (p) => p.completedLessonIds.includes('les-6-2')
  }
];

// --- UTILITY: CODE SNIPPETS ---
export const SNIPPETS: Snippet[] = [
  // FIELDS
  { label: 'Char Field', category: 'Fields', code: "name = fields.Char(string='Name', required=True)" },
  { label: 'Integer Field', category: 'Fields', code: "age = fields.Integer(string='Age')" },
  { label: 'Many2one', category: 'Fields', code: "partner_id = fields.Many2one('res.partner', string='Partner')" },
  { label: 'One2many', category: 'Fields', code: "line_ids = fields.One2many('my.model.line', 'parent_id', string='Lines')" },
  { label: 'Selection', category: 'Fields', code: "state = fields.Selection([('draft', 'Draft'), ('done', 'Done')], default='draft')" },
  
  // ORM METHODS
  { label: 'Create', category: 'ORM', code: "record = self.env['my.model'].create({'name': 'New Record'})" },
  { label: 'Search', category: 'ORM', code: "records = self.env['my.model'].search([('state', '=', 'draft')])" },
  { label: 'Write', category: 'ORM', code: "record.write({'state': 'done'})" },
  { label: 'Unlink', category: 'ORM', code: "record.unlink()" },
  
  // METHODS
  { label: 'Compute Decorator', category: 'Methods', code: "@api.depends('field_name')\ndef _compute_field_name(self):\n    for record in self:\n        record.field_name = 'Value'" },
  { label: 'Onchange Decorator', category: 'Methods', code: "@api.onchange('field_name')\ndef _onchange_field_name(self):\n    if self.field_name:\n        self.other_field = 'Value'" },
  
  // XML
  { label: 'Form View', category: 'XML', code: "<record id='view_id' model='ir.ui.view'>\n    <field name='name'>my.model.form</field>\n    <field name='model'>my.model</field>\n    <field name='arch' type='xml'>\n        <form>\n            <sheet>\n                <group>\n                    <field name='name'/>\n                </group>\n            </sheet>\n        </form>\n    </field>\n</record>" }
];

// --- PRACTICE MODE CHALLENGES ---
export const PRACTICE_CHALLENGES: Challenge[] = [
  {
    id: 'chal-singleton',
    title: 'Debug: Singleton Error',
    description: 'Corrige el error común de acceder a múltiples registros como si fuera uno solo.',
    difficulty: Difficulty.BEGINNER,
    xp: 50,
    task: 'El método `action_confirm` falla cuando se seleccionan varios registros. Usa un bucle `for` para iterar sobre `self` y corregirlo.',
    initialCode: `class SaleOrder(models.Model):
    _inherit = 'sale.order'

    def action_confirm(self):
        # ERROR: Esto fallará si self tiene más de 1 registro
        if self.amount_total < 0:
            raise ValidationError("El total no puede ser negativo")
        return super().action_confirm()`
  },
  {
    id: 'chal-sql-injection',
    title: 'Seguridad: Inyección SQL',
    description: 'Refactoriza esta consulta SQL insegura para usar parámetros.',
    difficulty: Difficulty.INTERMEDIATE,
    xp: 75,
    task: 'Reemplaza la interpolación de cadenas f-string con parámetros seguros en `self.env.cr.execute`.',
    initialCode: `def find_partners_by_email(self, email):
    # PELIGRO: Vulnerable a inyección SQL
    query = f"SELECT id FROM res_partner WHERE email = '{email}'"
    self.env.cr.execute(query)
    return self.env.cr.fetchall()`
  },
  {
    id: 'chal-create-invoice',
    title: 'ORM: Crear Factura',
    description: 'Automatiza la creación de una factura desde código.',
    difficulty: Difficulty.ADVANCED,
    xp: 100,
    task: 'Completa el método para crear una factura (account.move) con una línea de factura (account.move.line) usando el ORM.',
    initialCode: `def create_simple_invoice(self, partner_id, amount):
    # TODO: Usa self.env['account.move'].create()
    pass`
  }
];

export const CURRICULUM: Track[] = [
  // ==========================================
  // LEVEL 1: JUNIOR (Fundamentos y Core)
  // ==========================================
  {
    id: 'track-jr',
    title: 'Nivel Junior: Fundamentos',
    level: 'Junior',
    description: 'Desde la configuración del entorno hasta tu primer módulo "Hola Mundo".',
    icon: 'Compass',
    modules: [
      {
        id: 'mod-f0',
        title: 'Fase 0: Los Cimientos',
        description: 'Python Avanzado, PostgreSQL y Entorno Docker.',
        difficulty: Difficulty.BEGINNER,
        lessons: [
          {
            id: 'les-0-1',
            title: 'Python para Odoo',
            type: 'code',
            xp: 20,
            content: `
# Python Avanzado para Odoo

No basta con saber \`print("hola")\`. Odoo requiere dominio de:
1.  **POO (Programación Orientada a Objetos):** Clases y Herencia.
2.  **Decoradores:** \`@api.depends\`, \`@api.model\`.
3.  **Kwargs:** Manejo de argumentos variables (\`**kwargs\`).

### Tarea:
Define una clase \`Libro\` que tenga un atributo \`titulo\` y un método \`imprimir_info\`.

\`\`\`python
class Libro:
    def __init__(self, titulo):
        self.titulo = titulo

    def imprimir_info(self):
        print(f"Libro: {self.titulo}")

# Prueba tu clase
mi_libro = Libro("Odoo Development")
mi_libro.imprimir_info()
\`\`\`
            `
          },
          {
            id: 'les-0-2',
            title: 'Entorno Docker (Odoo 17)',
            type: 'theory',
            xp: 20,
            content: `
# Configuración con Docker

La forma profesional de correr Odoo es con \`docker-compose\`.

\`\`\`yaml
version: '3.1'
services:
  web:
    image: odoo:17.0
    depends_on:
      - db
    ports:
      - "8069:8069"
  db:
    image: postgres:15
    environment:
      - POSTGRES_PASSWORD=odoo
      - POSTGRES_USER=odoo
\`\`\`

**Tip:** Mapea siempre un volumen para tus módulos personalizados (addons) en \`/mnt/extra-addons\`.
            `
          }
        ]
      },
      {
        id: 'mod-f1',
        title: 'Fase 1: Estructura del Módulo',
        description: 'Creación del Manifiesto, Modelos y Vistas.',
        difficulty: Difficulty.BEGINNER,
        lessons: [
          {
            id: 'les-1-1',
            title: 'El Manifiesto (__manifest__.py)',
            type: 'theory',
            xp: 30,
            content: `
# El DNI de tu Módulo

Todo módulo necesita un \`__manifest__.py\`. Define las dependencias y los archivos a cargar.

\`\`\`python
{
    'name': 'Gestión de Biblioteca',
    'version': '17.0.1.0.0',
    'category': 'Education',
    'summary': 'Módulo para gestionar libros y préstamos',
    'depends': ['base', 'mail'],
    'data': [
        'security/ir.model.access.csv',
        'views/library_book_views.xml',
        'views/library_menus.xml',
    ],
    'application': True,
}
\`\`\`
            `
          },
          {
            id: 'les-1-2',
            title: 'Tu Primer Modelo (ORM)',
            type: 'code',
            xp: 50,
            content: `
# ORM: Object Relational Mapping

En Odoo no escribimos SQL (normalmente). Definimos clases Python.

### Tarea:
Crea un modelo \`library.book\` con campos básicos.

\`\`\`python
from odoo import models, fields

class LibraryBook(models.Model):
    _name = 'library.book'
    _description = 'Libro de Biblioteca'

    name = fields.Char(string='Título', required=True)
    active = fields.Boolean(default=True)
    pages = fields.Integer(string='Número de Páginas')
    description = fields.Text()
\`\`\`
            `
          }
        ]
      }
    ]
  },

  // ==========================================
  // LEVEL 2: MIDDLE (Lógica y Procesos)
  // ==========================================
  {
    id: 'track-mid',
    title: 'Nivel Middle: Lógica de Negocio',
    level: 'Middle',
    description: 'Relaciones, Herencia, Vistas Avanzadas, Seguridad y Wizards.',
    icon: 'Database',
    modules: [
      {
        id: 'mod-f2',
        title: 'Fase 2: Relaciones y Computados',
        description: 'Many2one, One2many y campos @api.depends.',
        difficulty: Difficulty.INTERMEDIATE,
        lessons: [
          {
            id: 'les-2-1',
            title: 'Campos Relacionales',
            type: 'theory',
            xp: 40,
            content: `
# Conectando Datos

El poder de un ERP está en las relaciones.

1.  **Many2one (N:1):** Un libro pertenece a *una* editorial.
    \`publisher_id = fields.Many2one('res.partner', string='Editorial')\`
2.  **One2many (1:N):** Una editorial tiene *muchos* libros.
    \`book_ids = fields.One2many('library.book', 'publisher_id', string='Libros')\`
3.  **Many2many (N:M):** Un libro tiene *muchas* etiquetas.
    \`tag_ids = fields.Many2many('library.tag', string='Etiquetas')\`
            `
          },
          {
            id: 'les-2-2',
            title: 'Campos Computados',
            type: 'code',
            xp: 60,
            content: `
# Automatización con @api.depends

Calcula valores automáticamente.

### Tarea:
Crea un campo computado que indique si el libro es "Corto" o "Largo" (más de 300 páginas).

\`\`\`python
from odoo import models, fields, api

class LibraryBook(models.Model):
    _name = 'library.book'
    
    pages = fields.Integer()
    length_type = fields.Char(compute='_compute_length', store=True)

    @api.depends('pages')
    def _compute_length(self):
        for record in self:
            if record.pages > 300:
                record.length_type = 'Largo'
            else:
                record.length_type = 'Corto'
\`\`\`
            `
          }
        ]
      },
      {
        id: 'mod-f3',
        title: 'Fase 3: Herencia y Seguridad',
        description: 'Modificar módulos existentes (Mixins) y Reglas de Acceso.',
        difficulty: Difficulty.INTERMEDIATE,
        lessons: [
          {
            id: 'les-3-1',
            title: 'Herencia de Modelos (_inherit)',
            type: 'code',
            xp: 70,
            content: `
# La Regla de Oro de Odoo

**Nunca modifiques el código fuente original.** Usa herencia.

### Tarea:
Extiende el modelo de Contactos (\`res.partner\`) para añadir un campo que indique si es un "Autor".

\`\`\`python
class ResPartner(models.Model):
    _inherit = 'res.partner'

    is_author = fields.Boolean(string='Es Autor', default=False)
\`\`\`
            `
          },
          {
            id: 'les-3-2',
            title: 'Seguridad (CSV y Rules)',
            type: 'theory',
            xp: 50,
            content: `
# Control de Acceso (ACL)

1.  **ir.model.access.csv:** Define CRUD (Create, Read, Write, Unlink) por grupo.
    \`id,name,model_id:id,group_id:id,perm_read,perm_write,perm_create,perm_unlink\`
    
2.  **Record Rules:** Filtros de seguridad a nivel de fila.
    *Ejemplo:* Un usuario solo puede ver los libros creados por él mismo.
    \`[('create_uid', '=', user.id)]\`
            `
          }
        ]
      },
      {
        id: 'mod-f3-5',
        title: 'Fase 3.5: Herramientas Low-Code',
        description: 'Uso de Odoo Studio para personalización rápida.',
        difficulty: Difficulty.INTERMEDIATE,
        lessons: [
          {
            id: 'les-studio-1',
            title: 'Introducción a Odoo Studio',
            type: 'theory',
            xp: 40,
            content: `
# Odoo Studio: Personalización Visual

Odoo Studio es una herramienta potente que permite realizar cambios en la estructura de datos y las vistas sin escribir código manualmente.

### ¿Qué es?
Es el icono de "llave inglesa y lápiz" que aparece en la barra superior (en versiones Enterprise).

### Funcionalidades Clave:
1.  **Editor de Vistas:** Arrastrar y soltar (Drag & Drop) para añadir campos nuevos o existentes a formularios y listas.
2.  **Creador de Apps:** Crear una nueva aplicación desde cero en minutos.
3.  **Editor de Reportes:** Modificar PDFs visualmente.
4.  **Automatizaciones:** Crear acciones de servidor básicas sin Python.

**Nota:** Todo lo que haces en Studio se guarda automáticamente en un módulo técnico llamado \`studio_customization\`.

**Tip:** Como desarrollador, Studio es útil para prototipar rápidamente una vista, exportar el XML generado y luego moverlo a tu propio módulo para tener control de versiones.
            `
          }
        ]
      },
      {
        id: 'mod-f4-mid',
        title: 'Fase 4: Wizards y Reportes',
        description: 'Creación de asistentes interactivos y reportes PDF.',
        difficulty: Difficulty.INTERMEDIATE,
        lessons: [
          {
            id: 'les-4-1-mid',
            title: 'Introducción a Wizards (TransientModel)',
            type: 'theory',
            xp: 40,
            content: `
# Models.TransientModel: Datos Efímeros

En Odoo, un "Wizard" es una ventana emergente que solicita información al usuario para realizar una acción específica (ej. "Actualizar precios masivamente" o "Generar un reporte").

A diferencia de los modelos normales (\`models.Model\`), los **TransientModel**:
1.  **Son temporales:** Los datos se borran automáticamente (vacuum) periódicamente.
2.  **Permisos simplificados:** Generalmente todos los usuarios tienen acceso completo a sus propios registros temporales.
3.  **Uso:** Se usan para diálogos de interfaz, no para almacenar datos de negocio permanentes.

\`\`\`python
class LibraryRentWizard(models.TransientModel):
    _name = 'library.rent.wizard'
    _description = 'Asistente de Préstamo'

    member_id = fields.Many2one('library.member', string='Miembro')
    date_return = fields.Date(string='Fecha de Devolución')
\`\`\`
            `
          },
          {
            id: 'les-4-2-mid',
            title: 'Creando tu primer Wizard',
            type: 'code',
            xp: 60,
            content: `
# Lógica del Wizard

Un wizard suele tener un método de acción (ej. \`action_apply\`) que se ejecuta al pulsar el botón "Confirmar".

### Tarea:
Crea un Wizard (\`library.price.wizard\`) con un campo \`percentage\` (Float) y un método \`apply_update\` que imprima "Actualizando precios...".

\`\`\`python
from odoo import models, fields

class LibraryPriceWizard(models.TransientModel):
    _name = 'library.price.wizard'
    _description = 'Wizard de Actualización de Precios'

    percentage = fields.Float(string='Porcentaje de Aumento', default=5.0)

    def apply_update(self):
        # En la vida real, aquí iteraríamos sobre 'active_ids'
        # para actualizar los precios de los libros.
        print(f"Actualizando precios un {self.percentage}%")
        return {'type': 'ir.actions.act_window_close'}
\`\`\`
            `
          },
          {
            id: 'les-4-3-mid',
            title: 'Reportes PDF con QWeb',
            type: 'code',
            xp: 80,
            content: `
# Motores de Reporte QWeb

Odoo genera PDFs usando **QWeb** (XML con lógica) y **Wkhtmltopdf**.

### Estructura:
1.  **Report Action:** Declara el reporte en el sistema.
2.  **QWeb Template:** Define el HTML del reporte.

### Tarea:
Define un template QWeb básico para listar libros. Usa \`t-foreach\` para iterar sobre \`docs\`.

\`\`\`xml
<template id="report_library_book_list">
    <t t-call="web.html_container">
        <t t-foreach="docs" t-as="book">
            <div class="page">
                <h2>Libro: <span t-field="book.name"/></h2>
                <p>Páginas: <span t-field="book.pages"/></p>
                <hr/>
            </div>
        </t>
    </t>
</template>
\`\`\`
            `
          }
        ]
      }
    ]
  },

  // ==========================================
  // LEVEL 3: SENIOR (Arquitectura y Web)
  // ==========================================
  {
    id: 'track-sr',
    title: 'Nivel Senior: Fullstack',
    level: 'Senior',
    description: 'Automatización avanzada, Cron Jobs y Frontend OWL.',
    icon: 'Layers',
    modules: [
      {
        id: 'mod-f5-sr',
        title: 'Fase 5: Automatización Avanzada',
        description: 'Server Actions y Cron Jobs (Acciones Planificadas).',
        difficulty: Difficulty.ADVANCED,
        lessons: [
          {
            id: 'les-5-1-sr',
            title: 'Acciones de Servidor',
            type: 'theory',
            xp: 60,
            content: `
# Server Actions: Programación sin Código (a veces)

Las **Acciones de Servidor** (\`ir.actions.server\`) permiten ejecutar lógica Python directamente desde la interfaz o desde un botón, sin desplegar código nuevo (aunque se recomienda definirlas en XML).

**Tipos comunes:**
1.  **Ejecutar código Python:** Scripts complejos.
2.  **Crear registro:** Generar una factura automáticamente.
3.  **Actualizar registro:** Cambiar estado a "Done".

\`\`\`xml
<record id="action_mark_done" model="ir.actions.server">
    <field name="name">Marcar como Hecho</field>
    <field name="model_id" ref="model_library_book"/>
    <field name="state">code</field>
    <field name="code">
        for record in records:
            record.write({'state': 'done'})
    </field>
</record>
\`\`\`
            `
          },
          {
            id: 'les-5-2-sr',
            title: 'Cron Jobs (Scheduled Actions)',
            type: 'code',
            xp: 80,
            content: `
# Cron Jobs: Tareas en Segundo Plano

Para tareas recurrentes (ej. enviar emails masivos, limpiar temporales), usamos \`ir.cron\`.

### Tarea:
Define una acción planificada que se ejecute cada día para verificar préstamos vencidos.

\`\`\`xml
<record id="cron_check_overdue" model="ir.cron">
    <field name="name">Biblioteca: Verificar Vencidos</field>
    <field name="model_id" ref="model_library_loan"/>
    <field name="state">code</field>
    <field name="code">model._check_overdue_loans()</field>
    <field name="interval_number">1</field>
    <field name="interval_type">days</field>
    <field name="numbercall">-1</field> <!-- Infinito -->
</record>
\`\`\`
            `
          }
        ]
      },
      {
        id: 'mod-f6-sr',
        title: 'Fase 6: Frontend OWL',
        description: 'Odoo Web Library: Componentes Reactivos en Odoo 16/17.',
        difficulty: Difficulty.ADVANCED,
        lessons: [
          {
            id: 'les-6-1',
            title: 'Introducción a OWL',
            type: 'theory',
            xp: 100,
            content: `
# OWL (Odoo Web Library)

Desde Odoo 14 (y obligatorio en v16+), el frontend usa OWL. Es un framework inspirado en React y Vue.

### Componentes:
Todo en la interfaz web (Menús, Campos, Kanban) son componentes OWL.
Usan \`hooks\` como \`useState\`, \`onWillStart\`.

**Importante:** Ya no se usan los antiguos "Widgets" de jQuery.
            `
          },
          {
            id: 'les-6-2',
            title: 'Componente OWL Básico',
            type: 'code',
            xp: 120,
            content: `
# Creando un Componente

### Tarea:
Define un componente OWL simple que tenga un contador.

\`\`\`javascript
/** @odoo-module **/

import { Component, useState } from "@odoo/owl";
import { registry } from "@web/core/registry";

class Counter extends Component {
    setup() {
        this.state = useState({ value: 0 });
    }

    increment() {
        this.state.value++;
    }
}

Counter.template = "my_module.Counter";
registry.category("actions").add("my_module.counter_action", Counter);
\`\`\`
            `
          }
        ]
      }
    ]
  }
];
