import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Servicio que encapsula operaciones seguras con localStorage,
 * verificando si el entorno es el navegador (no servidor).
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  /**
   * Propiedad privada que verifica si el código se está ejecutando
   * en el navegador (útil para apps universales con Angular SSR).
   */
  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  /**
   * Obtiene un valor del localStorage de forma segura.
   * @param key Clave del dato a recuperar.
   * @returns El valor parseado desde JSON o null si no existe o hay error.
   */
  get(key: string): any {
    if (!this.isBrowser) {
      console.warn('LocalStorage no disponible en el servidor');
      return null;
    }

    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error al leer de localStorage: ${error}`);
      return null;
    }
  }

  /**
   * Guarda un valor en localStorage de forma segura.
   * @param key Clave bajo la cual se guardará el dato.
   * @param value Valor a guardar (se serializa a JSON).
   */
  set(key: string, value: any): void {
    if (!this.isBrowser) {
      console.warn('LocalStorage no disponible en el servidor');
      return;
    }

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error al escribir en localStorage: ${error}`);
    }
  }

  /**
   * Elimina un valor del localStorage.
   * @param key Clave del valor a eliminar.
   */
  remove(key: string): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(key);
  }

  /**
   * Limpia completamente el localStorage.
   */
  clear(): void {
    if (!this.isBrowser) return;
    localStorage.clear();
  }

  /**
   * Verifica si una clave existe en el localStorage.
   * @param key Clave a verificar.
   * @returns true si la clave existe, false en caso contrario.
   */
  has(key: string): boolean {
    if (!this.isBrowser) return false;
    return localStorage.getItem(key) !== null;
  }
}
