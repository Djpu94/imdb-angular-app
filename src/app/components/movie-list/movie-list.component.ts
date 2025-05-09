import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MovieService } from '../../services/movie.service';
import { MovieFormComponent } from '../movie-form/movie-form.component';
import { NotificationService } from '../../services/notification.service';
import { Movie } from '../../models/movie.model';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.scss'
})
export class MovieListComponent {
  dataSource = new MatTableDataSource<Movie>([]);
  displayedColumns: string[] = ['primaryTitle', 'releaseDate', 'averageRating', 'genres', 'actions'];
  movies$: Observable<Movie[]>;
  isLoading = true;
  resultsLength: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private movieService: MovieService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {
    // Se suscribe al observable de películas para obtener la cantidad total
    this.movies$ = this.movieService.movies$;
    this.movies$.subscribe(movies => {
      this.resultsLength = movies.length;
    })
  }

  ngOnInit(): void {
    this.loadMovies(); // Carga las películas desde la API
  }

  /**
   * Llama al servicio para cargar las películas desde la API.
   * Actualiza el estado de carga mientras espera la respuesta.
   */
  loadMovies(): void {
    this.isLoading = true;
    this.movieService.loadMoviesFromApi().subscribe({
      next: () => this.isLoading = false,
      error: () => this.isLoading = false
    });
  }

  /**
   * Abre un diálogo para agregar una nueva película.
   * Pasa un indicador `isEdit: false` al formulario.
   */
  openAddDialog(): void {
    this.dialog.open(MovieFormComponent, {
      width: '600px',
      data: { isEdit: false }
    });
  }

  /**
   * Abre un diálogo para editar una película existente.
   * Después de cerrar el diálogo, si hay cambios, se confirma y actualiza.
   * @param movie Película que se desea editar
   */
  openEditDialog(movie: Movie): void {
    const dialogRef = this.dialog.open(MovieFormComponent, {
      width: '600px',
      data: {
        isEdit: true,
        movie: { ...movie }
      }
    });

    dialogRef.afterClosed().subscribe(updatedMovie => {
      if (updatedMovie) {
        this.confirmAndUpdate(movie, updatedMovie);
      }
    });
  }

  /**
   * Abre un diálogo de confirmación para eliminar una película.
   * Si el usuario confirma, se llama al servicio para eliminarla.
   * @param movie Película a eliminar
   */
  deleteMovie(movie: Movie): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `¿Eliminar "${movie.primaryTitle}"?` }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.movieService.deleteMovie(movie.id);
      }
    });
  }

  /**
   * Convierte el arreglo de géneros en un string separado por comas.
   * @param genres Arreglo de géneros
   * @returns Cadena formateada
   */
  formatGenres(genres: string[]): string {
    return genres?.join(', ') || '';
  }

  /**
   * Formatea una fecha para ser mostrada en formato local.
   * @param date Fecha a formatear
   * @returns Cadena formateada
   */
  formatDate(date: Date | null): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  }

  /**
   * Compara dos películas y si hay cambios, abre un diálogo de confirmación.
   * Si se confirma, actualiza la película y muestra una notificación.
   * @param original Película original
   * @param updated Película con cambios propuestos
   */
  private confirmAndUpdate(original: Movie, updated: Movie): void {
    const hasChanges = JSON.stringify(original) !== JSON.stringify(updated);
    if (!hasChanges) {
      return; // No hacer nada si no hay cambios
    }

    const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar cambios',
        message: `¿Estás seguro de guardar los cambios en "${original.primaryTitle}"?`,
        confirmText: 'Guardar cambios'
      }
    });

    confirmDialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.movieService.updateMovie(updated);
        this.notificationService.showSuccess('Película actualizada correctamente');
      }
    });
  }
}
