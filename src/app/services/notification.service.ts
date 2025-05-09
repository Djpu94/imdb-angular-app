// notification.service.ts
// Servicio para mostrar notificaciones (snackbars) utilizando Angular Material

import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root' // Hace que este servicio esté disponible de forma global en la aplicación
})
export class NotificationService {

  // Configuración por defecto para todas las notificaciones
  private readonly defaultConfig: MatSnackBarConfig = {
    duration: 3000, // Duración de la notificación en milisegundos (3 segundos)
    horizontalPosition: 'right', // Posición horizontal (derecha)
    verticalPosition: 'top' // Posición vertical (arriba)
  };

  // Inyección del servicio MatSnackBar de Angular Material para mostrar notificaciones
  constructor(private snackBar: MatSnackBar) { }

  /**
   * Muestra una notificación de éxito.
   * @param message El mensaje a mostrar
   */
  showSuccess(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      ...this.defaultConfig, // Usa la configuración por defecto
      panelClass: ['success-snackbar'] // Clase CSS personalizada para el estilo de éxito
    });
  }

  /**
   * Muestra una notificación de error.
   * @param message El mensaje a mostrar
   */
  showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      ...this.defaultConfig, // Usa la configuración por defecto
      panelClass: ['error-snackbar'] // Clase CSS personalizada para el estilo de error
    });
  }

  /**
   * Muestra una notificación informativa.
   * @param message El mensaje a mostrar
   */
  showInfo(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      ...this.defaultConfig, // Usa la configuración por defecto
      panelClass: ['info-snackbar'] // Clase CSS personalizada para el estilo informativo
    });
  }
}
