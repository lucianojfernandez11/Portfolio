/* =====================================================================
   CONTENIDO DEL PORTFOLIO
   ---------------------------------------------------------------------
   Este es el ÚNICO archivo que necesitás editar para cambiar textos,
   proyectos y enlaces. El resto del sitio se genera a partir de acá.

   Convención: cualquier texto que contenga "[COMPLETAR" se muestra en
   el sitio marcado como DATO TEMPORAL (subrayado punteado + aviso).
   Cuando lo reemplaces por tu dato real, la marca desaparece sola.

   Enlaces: si un enlace queda vacío ("") o como "#", se muestra como
   "pendiente" y no se puede clickear.
   ===================================================================== */

window.PORTFOLIO = {
  config: {
    // Muestra un aviso flotante si quedan textos con "[COMPLETAR".
    // Útil mientras editás; hoy no queda ninguno.
    showPlaceholderNotice: false,
  },

  person: {
    name: "Luciano",
    surname: "Fernández",
    role: "Programador web full stack",
    location: "San Miguel de Tucumán, Argentina",
    // Coordenadas reales de San Miguel de Tucumán (detalle decorativo del inicio)
    coords: "26.81° S · 65.22° O",
    // Eslogan: la frase grande debajo de tu nombre.
    // Otras opciones con el mismo enfoque comercial:
    //   "Tu próxima venta empieza en tu web."
    //   "Tu competencia ya está online. ¿Y vos?"
    //   "Más clientes, menos excusas: tu web trabajando por vos."
    slogan: "Webs que convierten visitas en clientes.",
    // Bajada debajo del eslogan. Ajustala a tu forma de hablar.
    tagline:
      "Diseño y desarrollo sitios y sistemas a medida que trabajan por vos las 24 horas: atraen, convencen y generan consultas mientras vos te ocupás de tu negocio.",
    // Cambialo a false si en este momento no estás tomando proyectos.
    available: true,
    availabilityText: "Tomando proyectos nuevos",
    // Tres compromisos cortos que aparecen debajo de los botones del inicio
    promises: [
      "Del diseño al deploy, con un solo responsable",
      "Código prolijo y documentado",
      "Sitios rápidos y adaptados a celular",
      "Landing pages listas en 5 días",
      "De 3 a 6 meses de soporte incluido",
    ],
  },

  /* ---------------- ESPECIALIDADES ----------------
     Franja debajo del inicio. "tech" es opcional: poné la herramienta
     principal que usás en esa área (p. ej. "React") o dejalo vacío. */
  specialties: [
    { icon: "spark", title: "Diseño UI/UX", text: "Interfaces claras, prolijas y fáciles de usar", tech: "" },
    { icon: "atom", title: "Frontend", text: "Interfaces dinámicas que responden al instante", tech: "Next.js · React" },
    { icon: "server", title: "Backend", text: "Arquitectura sólida, segura y escalable", tech: ".NET · PostgreSQL" },
    { icon: "search", title: "SEO técnico", text: "Estructura pensada para aparecer en Google", tech: "" },
    { icon: "bolt", title: "Rendimiento", text: "Carga rápida, incluso con mala conexión", tech: "" },
    { icon: "phone", title: "Responsive", text: "Se ve bien en celular, tablet y escritorio", tech: "" },
  ],

  /* ---------------- SERVICIOS ----------------
     Lo que ofrecés. "ideal" dice para quién es; "includes" son entregables.
     Revisá que todo lo listado sea algo que realmente hacés. */
  services: [
    {
      id: "landing",
      icon: "layout",
      title: "Sitios y landing pages",
      pitch: "Una página clara, rápida y pensada para que quien entra termine escribiéndote.",
      ideal: "Emprendimientos, profesionales y comercios · lista en 5 días",
      includes: ["Diseño adaptado a celular", "SEO técnico básico", "Formulario o botón de WhatsApp"],
    },
    {
      id: "app",
      icon: "app",
      title: "Aplicaciones web a medida",
      pitch: "Sistemas para ordenar tu operación: turnos, reservas, stock, clientes o lo que tu negocio necesite.",
      ideal: "Negocios que hoy se manejan con planillas",
      includes: ["Usuarios y permisos", "Base de datos", "Panel de administración"],
    },
    {
      id: "api",
      icon: "plug",
      title: "APIs e integraciones",
      pitch: "Conecto tu sistema con otros servicios para que los datos fluyan solos y no tengas que copiarlos a mano.",
      ideal: "Equipos que usan varias herramientas sueltas",
      includes: ["APIs REST", "Pasarelas de pago y servicios externos", "Documentación"],
    },
    {
      id: "mantenimiento",
      icon: "wrench",
      title: "Mantenimiento y mejoras",
      pitch: "Corrijo errores, mejoro la velocidad y sumo funciones a un proyecto que ya está andando.",
      ideal: "Sitios o sistemas que quedaron sin quien los cuide",
      includes: ["Plan de mantenimiento mensual", "Corrección de errores", "Optimización de rendimiento", "Nuevas funciones"],
    },
  ],

  /* Motivos para elegirte (aparecen debajo de los servicios) */
  reasons: [
    { title: "Un solo interlocutor", text: "Hablás directamente con quien diseña, programa y publica. Sin intermediarios ni teléfono descompuesto." },
    { title: "Comunicación clara", text: "Te muestro avances reales en cada etapa y te explico las decisiones sin tecnicismos." },
    { title: "El código es tuyo", text: "Te entrego el repositorio y la documentación para que nunca dependas de una sola persona." },
    { title: "Pensado para crecer", text: "Una base sólida para sumar funciones más adelante sin tener que rehacer todo." },
  ],

  /* ---------------- PROCESO ---------------- (en orden) */
  process: [
    { title: "Charla inicial", text: "Me contás qué querés lograr, para quién es y para cuándo lo necesitás." },
    { title: "Propuesta", text: "Te envío por escrito el alcance, las etapas, los tiempos y el presupuesto." },
    { title: "Desarrollo", text: "Trabajo por entregas y te dejo una versión de prueba online para que veas el avance y opines." },
    { title: "Lanzamiento y soporte", text: "Publico el proyecto y te acompaño después de la entrega con 3 a 6 meses de soporte incluido, según el sistema." },
  ],

  /* ---------------- TESTIMONIOS ----------------
     La sección se oculta sola mientras esta lista esté vacía.
     Agregá sólo opiniones reales, con permiso de quien las da. Ejemplo:
     { quote: "Texto del testimonio", name: "Nombre Apellido", role: "Cargo, Empresa" }, */
  testimonials: [],

  /* ---------------- PREGUNTAS FRECUENTES ---------------- */
  faq: [
    {
      q: "¿Cuánto cuesta un proyecto?",
      a: "Depende del alcance. Después de la primera charla te paso un presupuesto por escrito, con lo que incluye y lo que no, para que no haya sorpresas.",
    },
    {
      q: "¿Cuánto tiempo tarda?",
      a: "Una landing page está lista en unos 5 días. Un sistema a medida depende de lo que incluya: después de la primera charla te paso por escrito las etapas y el plazo de cada una.",
    },
    {
      q: "¿Trabajás con clientes de otras ciudades o países?",
      a: "Sí. Trabajo de forma remota como freelance, así que puedo tomar proyectos de cualquier provincia. Coordinamos por videollamada, WhatsApp o email, y vas viendo los avances online.",
    },
    {
      q: "¿Qué necesito para empezar?",
      a: "Una idea de lo que querés lograr. Si tenés logo, textos o sitios de referencia, mejor; si no, los definimos juntos.",
    },
    {
      q: "¿Me quedo con el código y los accesos?",
      a: "Sí. Al terminar te entrego el código, la documentación y todos los accesos (dominio, hosting, base de datos).",
    },
    {
      q: "¿Qué pasa después de la entrega?",
      a: "Cada proyecto incluye entre 3 y 6 meses de soporte, según el sistema y lo que necesite cada cliente: corrijo errores y te ayudo con cualquier duda de uso. Después podés seguir con un mantenimiento mensual para actualizaciones, mejoras y nuevas funciones.",
    },
  ],

  about: {
    // Foto de perfil: guardala en assets/ (p. ej. assets/foto-luciano.webp) y poné la ruta acá.
    // Mientras quede vacía, el marco de la foto no aparece.
    photo: "assets/foto-luciano.webp",
    photoAlt: "Luciano Fernández, programador web full stack",
    // Párrafo principal (grande). Escrito con lo que sé de vos: revisalo y ajustalo.
    lead:
      "Soy un desarrollador Full Stack que construye sistemas web a medida para negocios reales. Combino código limpio y diseño cuidado con algo que no se aprende en un curso: cinco años trabajando en la tesorería de una empresa, viendo de cerca cómo se mueven los números de un negocio. Por eso no solo programo pantallas: transformo procesos que hoy se llevan en planillas y cuadernos en herramientas claras que ahorran tiempo y evitan errores.",
    paragraphs: [
      "Hoy desarrollo software a medida para negocios y profesionales. Me ocupo de todo el recorrido: entender el problema, diseñar la solución, programar el frontend, el backend y la base de datos, y dejar el sistema funcionando.",
    ],
    // Tarjetas destacadas debajo del texto. Usá sólo datos reales.
    // value: número que se anima al aparecer (opcional). icon: award, briefcase, layers, clock, check, globe
    badges: [
      { icon: "award", value: 5, prefix: "", suffix: " años", title: "en gestión comercial", text: "Tesorería en Grido, 2020 – 2025" },
      { icon: "briefcase", title: "Disponible para freelance", text: "Trabajo remoto, para clientes de todo el país" },
      { icon: "layers", value: 3, prefix: "", suffix: " rubros", title: "con sistemas propios", text: "Comercio, salud y vida nocturna" },
      { icon: "clock", value: 24, prefix: "< ", suffix: " h", title: "de respuesta", text: "Te contesto rápido y claro" },
    ],
    facts: [
      { label: "Edad", value: "21 años" },
      { label: "Base", value: "San Miguel de Tucumán, AR" },
      { label: "Especialidad", value: "Desarrollo web full stack" },
      { label: "Idiomas", value: "Español nativo · Inglés básico" },
      { label: "Modalidad", value: "Freelance · 100% remoto" },
    ],
  },

  /* Cada proyecto:
     - featured: true lo muestra como proyecto principal (tarjeta grande, primero)
     - status: etiqueta de estado (p. ej. "Online", "En desarrollo")
     - kind: tipo de proyecto (aparece arriba del título)
     - name, description: textos
     - highlights: funciones destacadas (se muestran en la tarjeta principal y en las demás si hay lugar)
     - team: con quién lo hiciste (opcional)
     - tags: tecnologías (se usan también para los filtros)
     - image: ruta opcional a una captura (p. ej. "assets/proyecto-1.webp").
              Si queda vacía se dibuja una portada geométrica automática.
     - demo / repo: URLs. demoLabel cambia el texto del botón.
     - privateNote: si no hay enlaces, se muestra este texto y un botón "Pedir una demo" */
  projects: [
    {
      featured: true,
      status: "Demo presentada al cliente",
      kind: "Sistema de gestión comercial",
      name: "Grido Control",
      description:
        "Sistema web para la operación comercial de Grido con heladerías y comercios. Controla en tiempo real la cuenta corriente de cada cliente: qué boletas tiene, cuánto debe con exactitud y cómo pagó.",
      highlights: [
        "Cuenta corriente exacta: cada boleta suma y cada pago descuenta",
        "Los pagos se aplican solos a las boletas más antiguas",
        "Semáforo de clientes: al día, debe, moroso o sin compras",
        "Pagos en efectivo o transferencia y rendiciones de cada preventista",
        "Accesos por rol para administración y preventistas",
      ],
      tags: ["Next.js", "TypeScript", "Tailwind CSS", "ASP.NET Core", "PostgreSQL"],
      // Portada diseñada para el portfolio. Podés reemplazarla por una captura real.
      image: "assets/portada-grido.webp",
      imageAlt: "Panel de Grido Control con cuentas corrientes, semáforo de clientes y rendición de un preventista",
      demo: "",
      repo: "",
      privateNote: "Sistema privado del cliente",
    },
    {
      status: "Propuesta · en desarrollo",
      kind: "Plataforma para consultorios",
      name: "Gestión Odontológica Multisede",
      description:
        "Plataforma a medida para consultorios odontológicos con dos sedes en Tucumán: agenda por sede y profesional, turnos online, ficha clínica y control de caja, desde la PC de secretaría o el celular junto al sillón.",
      highlights: [
        "Odontograma FDI interactivo, de 5 caras por pieza y apto para pantallas táctiles",
        "Turnos online con validación por DNI y avisos por WhatsApp",
        "Ficha clínica con anamnesis, alertas y galería de fotos antes / después",
        "Gastos y balances de caja por sede y profesional",
      ],
      tags: ["React", "JavaScript", "C#", "PostgreSQL", "MySQL"],
      image: "assets/portada-odonto.webp",
      imageAlt: "Ficha clínica con odontograma interactivo, turnos del día y caja semanal",
      demo: "",
      repo: "",
      privateNote: "Proyecto en desarrollo",
    },
    {
      status: "Online",
      kind: "Landing page",
      name: "Mr. John's & Warhol",
      description:
        "Landing page para un club nocturno de Tucumán, con estética negra y dorada que transmite la experiencia del lugar. Lleva al público directo a reservar su mesa y a ver los próximos eventos.",
      highlights: [
        "Reserva de mesa a un toque desde el inicio",
        "Acceso directo a los eventos disponibles",
        "Diseño pensado primero para celular",
        "Identidad propia: negro, dorado y tipografía serif",
      ],
      tags: ["React", "JavaScript", "HTML", "CSS", "Vercel"],
      image: "assets/portada-boliche.webp",
      imageAlt: "Portada de la landing de Mr. John's & Warhol con reserva de mesas VIP",
      demo: "https://mrjhones.vercel.app/",
      demoLabel: "Ver sitio",
      repo: "",
    },
  ],

  /* type: "Experiencia" o "Formación" */
  // Datos tomados de tu CV. Confirmá fechas y nombres.
  timeline: [
    {
      type: "Experiencia",
      title: "Desarrollador de software a medida",
      place: "Independiente · Freelance",
      period: "Actualidad",
      description: "Desarrollo de Grido Control (cuentas corrientes y cobranzas), la propuesta del sistema de gestión odontológica multisede y landing pages para comercios.",
    },
    {
      type: "Experiencia",
      title: "Asistente de Tesorería",
      place: "Grido",
      period: "2020 — 2025",
      description: "Gestión administrativa y de tesorería: control de ingresos y egresos, carga de datos y organización de documentación contable. Esa experiencia es la base de Grido Control.",
    },
    {
      type: "Formación",
      title: "Programación Web Full Stack",
      place: "Rolling Code",
      period: "2023 — actualidad",
      description: "",
    },
    {
      type: "Formación",
      title: "Tecnicatura en Programación",
      place: "Universidad Tecnológica Nacional (UTN)",
      period: "En curso",
      description: "",
    },
  ],

  /* Habilidades agrupadas por capa del stack */
  // Armado a partir de lo que usaste en tus sistemas. Sumá o quitá lo que haga falta.
  skills: [
    { group: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "JavaScript", "HTML", "CSS"] },
    { group: "Backend", items: ["C#", "ASP.NET Core", "APIs REST", "Autenticación y roles"] },
    { group: "Bases de datos", items: ["PostgreSQL", "MySQL", "SQL"] },
    { group: "Herramientas y nube", items: ["Git", "GitHub", "Docker", "AWS", "Vercel", "VS Code"] },
    { group: "Conocimiento de negocio", items: ["Cuentas corrientes y cobranzas", "Tesorería y caja", "Turnos y agendas"] },
  ],

  contact: {
    email: "luchoofernandez11@gmail.com",
    // Número de WhatsApp con código de país, sin + ni espacios (ej. 5493811234567).
    // Si lo dejás vacío, el botón de WhatsApp no aparece.
    // Con número cargado, el botón flotante "Hablemos" abre WhatsApp directo.
    whatsapp: "5493815867891",
    // Mensaje que aparece ya escrito al abrir WhatsApp desde "Hablemos"
    whatsappMessage: "Hola Luciano, vi tu portfolio y me gustaría hacerte una consulta.",
    // Tiempo de respuesta que querés comprometer (aparece junto al formulario)
    responseTime: "menos de 24 horas",
    intro:
      "Contame qué tenés en mente. Completá el formulario y se arma el mensaje solo: lo enviás por Gmail o WhatsApp en un clic.",
    // Opciones de plazo del formulario
    timelines: ["Lo antes posible", "En 1 a 3 meses", "Sin apuro, estoy explorando"],
    links: [
      { label: "GitHub", handle: "@lucianojfernandez11", url: "https://github.com/lucianojfernandez11", icon: "github" },
      // Cuando tengas LinkedIn listo, descomentá esta línea y poné tu enlace:
      // { label: "LinkedIn", handle: "Luciano Fernández", url: "https://www.linkedin.com/in/...", icon: "id" },
      // Podés sumar más, p. ej.:
      // { label: "X / Twitter", handle: "@usuario", url: "https://...", icon: "at" },
    ],
  },
};
