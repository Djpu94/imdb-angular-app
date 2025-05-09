import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  // Método seguro para obtener datos
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

  // Método seguro para guardar datos
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

  // Método seguro para eliminar datos
  remove(key: string): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(key);
  }

  // Método seguro para limpiar todo
  clear(): void {
    if (!this.isBrowser) return;
    localStorage.clear();
  }

  // Verifica si una clave existe
  has(key: string): boolean {
    if (!this.isBrowser) return false;
    return localStorage.getItem(key) !== null;
  }
}