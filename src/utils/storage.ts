import { CluedoProject } from '../types/cluedo.ts';
import { INITIAL_PROJECT } from '../data/defaultCluedoData.ts';
import { validateProjectData } from './cluedoRules.ts';

const DB_NAME = 'cluedo_studio_db';
const DB_VERSION = 1;
const STORE_PROJECTS = 'projects';
const STORE_META = 'metadata';
const LOCALSTORAGE_ACTIVE_ID = 'cluedo_studio_active_project_id';

let dbInstance: IDBDatabase | null = null;

async function openDb(): Promise<IDBDatabase> {
  if (dbInstance) return dbInstance;
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_PROJECTS)) {
        db.createObjectStore(STORE_PROJECTS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_META)) {
        db.createObjectStore(STORE_META, { keyPath: 'key' });
      }
    };
    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(request.result);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
}

// Fallback to localStorage if IndexedDB is blocked
function saveToLocalStorageFallback(project: CluedoProject) {
  try {
    localStorage.setItem(`cluedo_proj_${project.id}`, JSON.stringify(project));
    localStorage.setItem(LOCALSTORAGE_ACTIVE_ID, project.id);
  } catch (err) {
    console.warn('LocalStorage save failed:', err);
  }
}

function getFromLocalStorageFallback(id: string): CluedoProject | null {
  try {
    const raw = localStorage.getItem(`cluedo_proj_${id}`);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('LocalStorage read failed:', err);
  }
  return null;
}

export async function saveProject(project: CluedoProject): Promise<void> {
  project.updatedAt = Date.now();
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction([STORE_PROJECTS, STORE_META], 'readwrite');
      const store = tx.objectStore(STORE_PROJECTS);
      const meta = tx.objectStore(STORE_META);
      store.put(project);
      meta.put({ key: 'activeProjectId', value: project.id });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    saveToLocalStorageFallback(project);
  }
}

export async function getAllProjects(): Promise<CluedoProject[]> {
  try {
    const db = await openDb();
    const projects = await new Promise<CluedoProject[]>((resolve, reject) => {
      const tx = db.transaction(STORE_PROJECTS, 'readonly');
      const store = tx.objectStore(STORE_PROJECTS);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });

    if (projects.length === 0) {
      // Seed default project
      await saveProject(INITIAL_PROJECT);
      return [INITIAL_PROJECT];
    }
    return projects;
  } catch {
    // LocalStorage fallback
    const defaultProj = INITIAL_PROJECT;
    saveToLocalStorageFallback(defaultProj);
    return [defaultProj];
  }
}

export async function getActiveProject(): Promise<CluedoProject> {
  try {
    const db = await openDb();
    const activeMeta = await new Promise<{ key: string; value: string } | undefined>(
      (resolve) => {
        const tx = db.transaction(STORE_META, 'readonly');
        const meta = tx.objectStore(STORE_META);
        const req = meta.get('activeProjectId');
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(undefined);
      }
    );

    const activeId = activeMeta?.value || localStorage.getItem(LOCALSTORAGE_ACTIVE_ID) || INITIAL_PROJECT.id;
    const project = await new Promise<CluedoProject | undefined>((resolve) => {
      const tx = db.transaction(STORE_PROJECTS, 'readonly');
      const store = tx.objectStore(STORE_PROJECTS);
      const req = store.get(activeId);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(undefined);
    });

    if (project) return project;
  } catch {
    const local = getFromLocalStorageFallback(INITIAL_PROJECT.id);
    if (local) return local;
  }

  // If not found, save and return default initial project
  await saveProject(INITIAL_PROJECT);
  return INITIAL_PROJECT;
}

export async function deleteProject(id: string): Promise<void> {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_PROJECTS, 'readwrite');
      tx.objectStore(STORE_PROJECTS).delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    localStorage.removeItem(`cluedo_proj_${id}`);
  }
}

/**
 * Cloud Export: Creates a portable JSON file for download
 */
export function exportProjectToJson(project: CluedoProject): void {
  const jsonString = JSON.stringify(project, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const safeName = project.name.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
  a.download = `cluedo_${safeName}_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Cloud Sync Code: Generates a compressed base64 string for quick transfer across devices
 */
export function generateCloudSyncCode(project: CluedoProject): string {
  try {
    const jsonStr = JSON.stringify(project);
    // Base64 encode UTF-8
    const bytes = new TextEncoder().encode(jsonStr);
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  } catch (err) {
    console.error('Failed to create sync code:', err);
    return '';
  }
}

/**
 * Cloud Sync Code Import: Decodes base64 string back to project
 */
export function parseCloudSyncCode(syncCode: string): CluedoProject | null {
  try {
    const cleaned = syncCode.trim();
    const binary = atob(cleaned);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const jsonStr = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(jsonStr);
    if (validateProjectData(parsed)) {
      return parsed;
    }
  } catch (err) {
    console.error('Failed to parse sync code:', err);
  }
  return null;
}
