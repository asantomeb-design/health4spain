// Tipos para el sistema de Blog

export interface BlogPost {
  id: string;
  slug: string;
  
  // Contenido
  title: string;
  excerpt: string;
  content: string; // HTML de TinyMCE
  featured_image?: string;
  
  // Taxonomía
  category: BlogCategory;
  tags: string[];
  
  // SEO
  meta_title?: string;
  meta_description?: string;
  
  // Multiidioma
  lang: 'es' | 'en' | 'de' | 'fr' | 'pt';
  /** UUID compartido por todas las traducciones del mismo artículo. */
  translation_group_id?: string;
  /** @deprecated Antiguo. La vinculación real ahora es por translation_group_id. */
  translations?: {
    es?: string;
    en?: string;
    de?: string;
    fr?: string;
    pt?: string;
  };
  
  // Autor
  author_id?: string;
  author_name?: string;
  
  // Estado
  status: 'draft' | 'published' | 'archived';
  published_at?: string;
  
  // Tracking
  views?: number;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export type BlogCategory = 
  | 'guias'
  | 'tramites'
  | 'vida-espana'
  | 'noticias'
  | 'testimonios';

export interface BlogCategoryInfo {
  slug: BlogCategory;
  name: { es: string; en: string };
  description: { es: string; en: string };
  color: string;
}

export const BLOG_CATEGORIES: BlogCategoryInfo[] = [
  {
    slug: 'guias',
    name: { es: 'Guías', en: 'Guides' },
    description: { es: 'Guías prácticas paso a paso', en: 'Step-by-step practical guides' },
    color: 'blue',
  },
  {
    slug: 'tramites',
    name: { es: 'Trámites', en: 'Procedures' },
    description: { es: 'Documentación y burocracia', en: 'Documentation and bureaucracy' },
    color: 'purple',
  },
  {
    slug: 'vida-espana',
    name: { es: 'Vida en España', en: 'Life in Spain' },
    description: { es: 'Cultura, costumbres y consejos', en: 'Culture, customs and tips' },
    color: 'green',
  },
  {
    slug: 'noticias',
    name: { es: 'Noticias', en: 'News' },
    description: { es: 'Actualidad para extranjeros', en: 'News for foreigners' },
    color: 'orange',
  },
  {
    slug: 'testimonios',
    name: { es: 'Testimonios', en: 'Testimonials' },
    description: { es: 'Historias de éxito', en: 'Success stories' },
    color: 'pink',
  },
];

// Tipos para Leads
export interface Lead {
  id: string;
  
  // Datos de contacto
  nombre: string;
  email: string;
  codigo_pais?: string;
  telefono: string;
  fecha_nacimiento?: string;
  
  // Origen del lead
  pais_origen?: string;
  ciudad_origen?: string;
  
  // Necesidad
  servicio: string;
  ciudad: string;
  presupuesto?: string;
  urgencia: string;
  idioma_preferido: 'es' | 'en' | 'de' | 'fr';
  mensaje?: string;
  
  // Tracking
  landing_page: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  dispositivo?: 'mobile' | 'desktop';
  
  // Estado del lead
  status: LeadStatus;
  score?: number; // 1-100
  
  // Asignación
  partner_id?: string;
  assigned_at?: string;
  
  // Seguimiento
  contacted_at?: string;
  converted_at?: string;
  notes?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export type LeadStatus = 
  | 'nuevo'
  | 'contactado'
  | 'cualificado'
  | 'asignado'
  | 'en_proceso'
  | 'convertido'
  | 'perdido'
  | 'descartado';

// =============================================
// Tipos para Partners (post-firma · v1.5)
// =============================================
// Esta interfaz representa al partner ya activo con contrato firmado y
// recibiendo leads. En v0 NO se utiliza todavía: el ciclo del candidato
// (formulario → cualificación → selección de contrato) vive en
// `PartnerLead` (más abajo). Cuando un PartnerLead firma manualmente,
// se creará una fila en `partners` (esquema futuro) con los datos
// finales y se mantendrá la trazabilidad cruzada.
export interface Partner {
  id: string;

  nombre_comercial: string;
  razon_social: string;
  cif: string;

  email: string;
  telefono: string;
  direccion?: string;
  ciudad: string;

  tipo_servicio: string[];
  ciudades_cobertura: string[];
  idiomas: string[];

  status: 'activo' | 'inactivo' | 'pendiente';
  verificado: boolean;

  leads_max_mes?: number;
  leads_actuales_mes?: number;
  precio_lead?: number;

  leads_totales?: number;
  leads_convertidos?: number;
  rating?: number;

  created_at: string;
  updated_at: string;
}

// =============================================
// Tipos para Partner Leads (candidato a partner · v0)
// =============================================
// Una fila por solicitud entrante desde la web pública (Acceso 1).
// Acumula todo el ciclo: formulario, cualificación, token de acceso al
// panel privado (Acceso 2), y selección de contrato Founding.

export type PartnerService = 'seguros' | 'abogados' | 'inmobiliarias' | 'gestorias';

export type PartnerPlan = 'ACTIVA' | 'CRECE' | 'ESCALA' | 'LIDERA';

export type PartnerTier = 'A' | 'B' | 'C';

export type PartnerCarteraPct =
  | 'menos_10'
  | '10_30'
  | '30_60'
  | 'mas_60';

export type PartnerLeadStage =
  | 'solicitud_recibida'
  | 'en_revision'
  | 'llamada_agendada'
  | 'cualificado'
  | 'rechazado'
  | 'contrato_solicitado'
  | 'contratado'
  | 'baja';

export type PartnerCualificacionTipo = 'A' | 'B' | 'C';

export interface PartnerLead {
  id: string;

  // Datos de contacto (formulario)
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;

  // Perfil profesional
  servicio: PartnerService;
  ciudad_principal: string;
  ciudad_es_estrategica: boolean;
  anos_ejerciendo?: number | null;
  pct_cartera_extranjera?: PartnerCarteraPct | null;
  idiomas: string[];
  about?: string | null;

  // Tracking
  source: string;
  landing_page?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  ip_address?: string | null;
  user_agent?: string | null;

  // Cualificación
  stage: PartnerLeadStage;
  cualificacion_tipo?: PartnerCualificacionTipo | null;
  cualificacion_notas?: string | null;
  cualificado_por_email?: string | null;
  cualificado_at?: string | null;

  // Token de acceso (Acceso 2)
  access_token?: string | null;
  access_token_expires_at?: string | null;
  access_first_seen_at?: string | null;
  access_last_seen_at?: string | null;

  // Selección "Solicitar contrato Founding"
  contract_plan?: PartnerPlan | null;
  contract_tier?: PartnerTier | null;
  contract_verticales?: string[] | null;
  contract_zonas_adicionales?: string[] | null;
  contract_founding: boolean;
  contract_notes?: string | null;
  contract_requested_at?: string | null;

  // Firma y onboarding
  signed_at?: string | null;
  setup_started_at?: string | null;
  first_lead_delivered_at?: string | null;

  // Privacidad
  privacy_accepted: boolean;
  privacy_accepted_at?: string | null;

  created_at: string;
  updated_at: string;
}

// Subconjunto de campos que el formulario público (Acceso 1) envía al backend.
export interface PartnerLeadFormPayload {
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  servicio: PartnerService;
  ciudad_principal: string;
  anos_ejerciendo?: number;
  pct_cartera_extranjera?: PartnerCarteraPct;
  idiomas?: string[];
  about?: string;
  privacy_accepted: boolean;
  // Tracking opcional
  landing_page?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

// Datos que la API expone al cliente cuando valida el token (Acceso 2).
// Nunca se devuelve PII completa salvo lo imprescindible para personalizar.
export interface PartnerAccessPublicData {
  id: string;
  first_name: string;
  empresa: string;
  servicio: PartnerService;
  ciudad_principal: string;
  ciudad_es_estrategica: boolean;
  tier_sugerido: PartnerTier;
  founding_disponible: boolean;
  // Si ya solicitó contrato: traer la selección para hidratar el panel
  contract_plan?: PartnerPlan | null;
  contract_verticales?: string[] | null;
  contract_zonas_adicionales?: string[] | null;
  contract_founding: boolean;
  contract_requested_at?: string | null;
}

// Tipos para Landing Pages (columnas de landing_pages en Supabase)
export interface LandingPage {
  id: string;
  slug: string;
  servicio_slug: string;
  servicio_nombre: string;
  ciudad_slug: string;
  ciudad_nombre: string;
  provincia?: string | null;

  // SEO
  meta_title: string;
  meta_description: string;
  meta_keywords: string[] | string | null; // Puede ser array, string o null
  
  // Hero
  hero_title: string;
  hero_subtitle: string;
  hero_bullets: string[];
  
  // Problemas
  problem_title: string;
  problems: string[];
  
  // Solución
  solution_title: string;
  solution_text: string;
  
  // Servicios
  services_title: string;
  services: Array<{ icon?: string; title: string; description: string }>;
  
  // Por qué la ciudad
  why_city_title: string;
  why_city_text: string;
  why_city_stats: Array<{ value: string; label: string }>;
  
  // FAQs
  faqs: Array<{ question: string; answer: string }>;
  
  // CTA
  cta_title: string;
  cta_subtitle: string;
  
  // Estado
  activo: boolean;
  revisado: boolean;
  generado_por_ia: boolean;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

// Tipos para Chatbot IA
export interface ChatbotConfig {
  id: string;
  enabled: boolean;
  model: string;
  temperature: number;
  max_tokens: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  system_prompt: string;
  agent_name: string;
  agent_avatar: string;
  primary_color: string;
  welcome_message: Record<string, string>;
  suggested_questions: Record<string, string[]>;
  knowledge_tables: string[];
  max_context_items: number;
  max_history_messages: number;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatbotPublicConfig {
  enabled: boolean;
  agent_name: string;
  agent_avatar: string;
  primary_color: string;
  welcome_message: Record<string, string>;
  suggested_questions: Record<string, string[]>;
}

// Chat History / Log
export type ChatRating = 'correcta' | 'mejorable' | 'erronea';

export interface ChatMessageLog {
  id: string;
  session_id: string;
  user_message: string;
  assistant_message: string;
  lang: string;
  model: string | null;
  rating: ChatRating | null;
  rated_at: string | null;
  tokens_used: number | null;
  created_at: string;
}

// Respuestas API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// Servicios disponibles
export const SERVICIOS = [
  { id: 'seguros', label: 'Seguros de Salud', icon: '🏥' },
  { id: 'abogados', label: 'Abogados', icon: '⚖️' },
  { id: 'inmobiliarias', label: 'Inmobiliarias', icon: '🏠' },
  { id: 'gestorias', label: 'Gestorías', icon: '📋' },
] as const;

// Ciudades disponibles
export const CIUDADES = [
  { id: 'madrid', label: 'Madrid' },
  { id: 'barcelona', label: 'Barcelona' },
  { id: 'valencia', label: 'Valencia' },
  { id: 'alicante', label: 'Alicante' },
  { id: 'malaga', label: 'Málaga' },
  { id: 'marbella', label: 'Marbella' },
  { id: 'torrevieja', label: 'Torrevieja' },
  { id: 'benidorm', label: 'Benidorm' },
  { id: 'murcia', label: 'Murcia' },
  { id: 'sevilla', label: 'Sevilla' },
  { id: 'palma', label: 'Palma de Mallorca' },
  { id: 'tenerife', label: 'Tenerife' },
  { id: 'las-palmas', label: 'Las Palmas' },
  { id: 'ibiza', label: 'Ibiza' },
  { id: 'granada', label: 'Granada' },
  { id: 'bilbao', label: 'Bilbao' },
  { id: 'zaragoza', label: 'Zaragoza' },
  { id: 'fuengirola', label: 'Fuengirola' },
  { id: 'estepona', label: 'Estepona' },
  { id: 'nerja', label: 'Nerja' },
] as const;

// Usuarios administradores (tabla admin_users + Supabase Auth)
export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
  /** ID en Supabase Auth, si existe cuenta de acceso */
  auth_user_id?: string | null;
  /** Último inicio de sesión (Supabase Auth) */
  last_sign_in_at?: string | null;
  /** Si tiene cuenta creada en Supabase Auth */
  has_auth_account?: boolean;
}

export interface AdminUserCreatePayload {
  email: string;
  name?: string;
  password: string;
}

export interface AdminUserUpdatePayload {
  name?: string;
  active?: boolean;
  password?: string;
}

// =============================================
// Tipos para HUB COLABORADORES (B2E interno)
// =============================================
// Espejo TypeScript del esquema supabase/19-hub-colaboradores.sql.
// El Hub es el cuadro de mando interno del equipo comercial (no la web pública).

export type HubRole = 'admin' | 'supervisor' | 'tecnico' | 'closer';

export type HubCanal = 'interno' | 'externo';

export type HubRegimen = 'n+1' | 'n+2';

export interface HubUser {
  id: string;
  nombre: string;
  email: string;
  nif?: string | null;
  iban?: string | null;
  rol: HubRole;
  canal: HubCanal;
  supervisor_id?: string | null;
  productos_asignados: string[];
  auth_user_id?: string | null;
  ghl_user_id?: string | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface HubCompany {
  id: string;
  slug: string;
  nombre: string;
  parser_key: string;
  regimen_default: HubRegimen;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface HubCommissionConfig {
  id: string;
  hub_user_id: string;
  company_id: string;
  producto: string;
  pct_closer: number;
  regimen?: HubRegimen | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export type HubCsvUploadEstado = 'cargado' | 'asignando' | 'cerrado' | 'anulado';

export interface HubCsvUpload {
  id: string;
  company_id: string;
  periodo: string; // 'MM-YYYY'
  file_hash: string;
  filename: string;
  n_lineas: number;
  n_lineas_validas: number;
  n_lineas_error: number;
  total_comision_bruta: number;
  uploaded_by_email?: string | null;
  estado: HubCsvUploadEstado;
  created_at: string;
  updated_at: string;
}

export type HubLineaEstado =
  | 'consolidandose'
  | 'acumulado'
  | 'cobrado'
  | 'liquidada';

export interface HubLiquidacionLinea {
  id: string;
  csv_upload_id: string;
  company_id: string;
  periodo: string;

  // Esquema interno común
  nif_agente?: string | null;
  nombre_agente?: string | null;
  cliente?: string | null;
  producto?: string | null;
  subramo?: string | null;
  poliza?: string | null;
  asegurado?: string | null;
  fecha_desde?: string | null;
  fecha_hasta?: string | null;
  prima_neta?: number | null;
  comision_bruta: number;
  comision_pct_compania?: number | null;
  ref_externa?: string | null;
  raw: Record<string, unknown>;

  // Asignación
  hub_user_id?: string | null;
  pct_reparto: number;
  pct_closer?: number | null;
  assigned_by_email?: string | null;
  assigned_at?: string | null;

  // Cálculo
  comision_neta?: number | null;
  bonus_cvr?: number | null;
  irpf_pct: number;
  irpf_importe?: number | null;
  neto_pagar?: number | null;

  // Régimen y estado
  regimen?: HubRegimen | null;
  fecha_cobro_estimada?: string | null;
  estado: HubLineaEstado;
  liquidacion_id?: string | null;

  created_at: string;
  updated_at: string;
}

export type HubLiquidacionEstado =
  | 'pendiente'
  | 'pendiente_aprobacion'
  | 'aprobada'
  | 'elegible'
  | 'liquidada'
  | 'rechazada';

export interface HubLiquidacion {
  id: string;
  hub_user_id: string;
  periodo: string;
  total_bruto: number;
  total_irpf: number;
  total_neto: number;
  n_lineas: number;
  estado: HubLiquidacionEstado;
  aprobada_por_email?: string | null;
  aprobada_at?: string | null;
  pagada_at?: string | null;
  pago_referencia?: string | null;
  comentario?: string | null;
  created_at: string;
  updated_at: string;
}

export type HubCvrNivel = 'elite' | 'optimo' | 'objetivo' | 'minimo' | 'riesgo';

export interface HubSnapshotCvr {
  id: string;
  hub_user_id: string;
  fecha: string;
  leads_recibidos_30d: number;
  leads_cerrados_30d: number;
  cvr: number;
  nivel?: HubCvrNivel | null;
  bonus_pct: number;
  created_at: string;
}

export interface HubAuditLogEntry {
  id: number;
  ts: string;
  actor_email?: string | null;
  actor_rol?: string | null;
  ip_address?: string | null;
  action: string;
  resource_type?: string | null;
  resource_id?: string | null;
  metadata?: Record<string, unknown> | null;
  result?: string | null;
}

/** Fila normalizada del parser CSV (esquema interno común multi-compañía). */
export interface HubParsedLine {
  nif_agente?: string | null;
  nombre_agente?: string | null;
  cliente?: string | null;
  producto?: string | null;
  subramo?: string | null;
  poliza?: string | null;
  asegurado?: string | null;
  fecha_desde?: string | null;
  fecha_hasta?: string | null;
  prima_neta?: number | null;
  comision_bruta: number;
  comision_pct_compania?: number | null;
  ref_externa?: string | null;
  periodo?: string | null;
  raw: Record<string, unknown>;
  /** Errores de validación de la fila (vacío = válida). */
  errores: string[];
}

export interface HubParseResult {
  lineas: HubParsedLine[];
  n_total: number;
  n_validas: number;
  n_error: number;
  total_comision_bruta: number;
  periodo_detectado?: string | null;
}
