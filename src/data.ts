export type ServiceId = 'estrategia' | 'audiovisual' | 'branding' | 'merchandise' | 'digital';
export type Service = {
  id: ServiceId;
  number: string;
  title: string;
  short: string;
  heroLines: [string, string];
  eyebrow: string;
  description: string;
  categories: [string, string];
  examples: [string, string];
  action: string;
  footer: string;
  brand: string;
};

export const services: Service[] = [
  {
    id: 'estrategia', number: '01', title: 'ESTRATEGIA Y PUBLICIDAD',
    short: 'Campañas / Meta Ads / contenido', heroLines: ['ESTRATEGIA', 'Y PUBLICIDAD'],
    eyebrow: 'CAMPAÑAS CON DIRECCIÓN',
    description: 'Estrategia de contenido, campañas digitales y anuncios para conectar con las personas correctas.',
    categories: ['CAMPAÑAS / ADS', 'ESTRATEGIA DIGITAL'], examples: ['CAMPAÑA / ADS', 'CONTENIDO / PLAN'],
    action: 'COTIZAR ESTRATEGIA', footer: '¿Quieres impulsar tu marca deportiva? Podemos revisar juntos tus objetivos.', brand: 'THE HEAT',
  },
  {
    id: 'audiovisual', number: '02', title: 'PRODUCCIÓN AUDIOVISUAL',
    short: 'Video / fotografía / reels', heroLines: ['PRODUCCIÓN', 'AUDIOVISUAL'],
    eyebrow: 'CONTENIDO CON INTENCIÓN',
    description: 'Video, fotografía, reels y edición para comunicar el valor de tu proyecto.',
    categories: ['VIDEO COMERCIAL', 'REELS + FOTO'], examples: ['VIDEO / REEL', 'CAMPAÑA / FOTO'],
    action: 'COTIZAR ESTE SERVICIO', footer: '¿Necesitas más ejemplos? Pídelos directamente por WhatsApp.', brand: 'ISAK ODAIR',
  },
  {
    id: 'branding', number: '03', title: 'BRANDING E IDENTIDAD',
    short: 'Identidad visual / dirección de arte', heroLines: ['BRANDING', 'E IDENTIDAD'],
    eyebrow: 'IDENTIDAD CON CARÁCTER',
    description: 'Creamos identidades visuales y dirección de arte que hacen reconocible lo que tu marca representa.',
    categories: ['IDENTIDAD VISUAL', 'DIRECCIÓN DE ARTE'], examples: ['IDENTIDAD / MARCA', 'SISTEMA / GRÁFICA'],
    action: 'COTIZAR MI MARCA', footer: '¿Ya tienes una marca y quieres renovarla? Cuéntame qué necesitas.', brand: 'ISAK ODAIR',
  },
  {
    id: 'merchandise', number: '04', title: 'MERCHANDISE',
    short: 'Producción / productos QUAIDS', heroLines: ['MERCH', 'PERSONALIZADO'],
    eyebrow: 'TU IDEA, HECHA PRODUCTO',
    description: 'Diseño y producción de merch para marcas, además de nuestras colecciones propias de QUAIDS.',
    categories: ['PARA TU MARCA', 'PRODUCTOS QUAIDS'], examples: ['MERCH / MARCAS', 'QUAIDS / PRODUCTOS'],
    action: 'COTIZAR MI MERCH', footer: 'Para tu marca, cotiza un pedido. Para QUAIDS, consulta los productos disponibles.', brand: 'QUAIDS',
  },
  {
    id: 'digital', number: '05', title: 'EXPERIENCIAS DIGITALES',
    short: 'Web / landing pages / UX/UI', heroLines: ['EXPERIENCIAS', 'DIGITALES'],
    eyebrow: 'EXPERIENCIAS QUE CONECTAN',
    description: 'Landing pages, sitios web y diseño UX/UI para transformar ideas en experiencias claras y útiles.',
    categories: ['LANDING PAGES', 'DISEÑO UX/UI'], examples: ['LANDING / WEB', 'INTERFAZ / UI'],
    action: 'COTIZAR MI WEB', footer: 'El desarrollo técnico se cotiza según funciones y alcance de cada proyecto.', brand: 'ISAK ODAIR',
  },
];

export function getService(id: string | null | undefined): Service | undefined {
  return services.find((service) => service.id === id);
}

export type ProjectRequest = {
  name: string;
  service: string;
  goal: string;
  when: string;
  budget: string;
};

export const WHATSAPP_NUMBER = '524494685875';

export function composeWhatsAppMessage(request: ProjectRequest): string {
  const lines = [
    '¡Hola, Isak! 👋',
    'Vengo de tu página y me gustaría cotizar un proyecto.',
    '',
    `*Nombre:* ${request.name.trim()}`,
    `*Servicio:* ${request.service}`,
    `*Proyecto:* ${request.goal.trim()}`,
    `*Fecha estimada:* ${request.when}`,
  ];
  if (request.budget.trim()) lines.push(`*Presupuesto aproximado:* ${request.budget.trim()}`);
  lines.push('', '¿Podemos platicar los siguientes pasos?');
  return lines.join('\n');
}

export function whatsappUrl(request: ProjectRequest): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(composeWhatsAppMessage(request))}`;
}
