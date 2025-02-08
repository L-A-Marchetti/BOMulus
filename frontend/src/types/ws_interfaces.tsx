// src/types/workspaces.ts

// Si tu disposes d'équivalents pour core.Component et core.Filter,
// importe-les depuis leur module ; sinon, tu peux les définir comme 'any'
export type Component = any; // À remplacer par le type approprié
export type Filter = any; // À remplacer par le type approprié

export interface Comparison {
  v1: string;
  v2: string;
}

export interface WorkspaceInfos {
  name: string;
  path: string;
  // Selon ton API, tu peux utiliser 'Date' ou 'string' (si le format est ISO)
  createdAt: Date;
  last_opened: Date;
  production_quantity: string;
  last_comparison: Comparison;
}

export interface Workspace {
  workspace_infos: WorkspaceInfos;
  files: FileInfo[];
}

export interface BOMulusFile {
  workspaces: Workspace[];
  api_keys: APIKeys;
  analyze_save_state: boolean;
  analysis_refresh_days: number;
  api_priority: string[];
}

export interface FileInfo {
  version_tag: number;
  name: string;
  path: string;
  components: Component[];
  filters: Filter;
}

export interface APIKeys {
  mouser_api_key: string;
  bomulus_api_key: string;
  dk_client_id: string;
  dk_secret: string;
}

// Exemple d'initialisation d'API_KEYS en TypeScript :
export const API_KEYS: APIKeys = {
  bomulus_api_key: '',
  mouser_api_key: '',
  dk_client_id: '',
  dk_secret: '',
};

// Pour ActiveWorkspacePath, c'est une variable globale simple :
export let ActiveWorkspacePath: string = '';

// Pour ActiveWorkspaceMutex (un mutex en Go), il n'existe pas d'équivalent en front.
// En général, tu n'en as pas besoin en TypeScript/JavaScript,
// car la gestion de la concurrence se fait différemment en JS.
