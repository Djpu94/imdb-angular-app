// Servicio Angular para manejar operaciones relacionadas con películas
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { StorageService } from './storage.service';
import { Movie, APIResponse } from '../models/movie.model';
import { NotificationService } from './notification.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private localStorageKey = 'imdb_movies_tmp';
  private apiConfig = environment.apiConfig;

  // Subject para manejar el estado de las películas en memoria
  private moviesSubject = new BehaviorSubject<Movie[]>([]);

  // Observable que expone el estado de las películas, emite solo si hay cambios reales
  public movies$ = this.moviesSubject.asObservable().pipe(distinctUntilChanged());

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private notificationService: NotificationService
  ) {
    this.initializeFromLocalStorage(); // Carga las películas desde almacenamiento local al iniciar
  }

  // Inicializa el estado de las películas desde almacenamiento local
  private initializeFromLocalStorage(): void {
    const savedMovies = this.storageService.get(this.localStorageKey) || [];
    this.moviesSubject.next(savedMovies);
  }

  // Carga películas desde la API externa y actualiza el estado interno
  loadMoviesFromApi(): Observable<Movie[]> {
    const headers = new HttpHeaders(this.apiConfig.headers);
    const params = this.apiConfig.defaultParams; // Parámetros para la consulta

    return this.http.get<APIResponse>(this.apiConfig.url, { headers, params }).pipe(
      map(response => response.results || []),
      tap(movies => {
        this.updateMoviesState(movies); // Actualiza el estado con las nuevas películas
      }),
      catchError(error => {
        this.notificationService.showError('Error al cargar películas'); // Notifica en caso de error
        return of(this.moviesSubject.value); // Devuelve el estado actual como fallback
      })
    );
  }

  // Actualiza el estado interno y guarda en almacenamiento local
  private updateMoviesState(movies: Movie[]): void {
    this.storageService.set(this.localStorageKey, movies);
    this.moviesSubject.next(movies);
  }

  // Añade una nueva película al estado
  addMovie(movie: Omit<Movie, 'id'>): void {
    const currentMovies = this.moviesSubject.value;

    const newMovie = {
      ...movie,
      id: this.generateId() // Genera un ID aleatorio único
    };

    const updatedMovies = [...currentMovies, newMovie];
    this.updateMoviesState(updatedMovies);
    this.notificationService.showSuccess('Película añadida correctamente');
  }

  // Actualiza una película existente en el estado
  updateMovie(updatedMovie: Movie): void {
    const currentMovies = this.moviesSubject.value;

    const updatedMovies = currentMovies.map(movie =>
      movie.id === updatedMovie.id ? updatedMovie : movie
    );

    this.updateMoviesState(updatedMovies);
  }

  // Elimina una película del estado
  deleteMovie(id: string): void {
    const currentMovies = this.moviesSubject.value;

    const deletedMovie = currentMovies.find(m => m.id === id); // Busca la película eliminada

    const updatedMovies = currentMovies.filter(movie => movie.id !== id);
    this.updateMoviesState(updatedMovies);

    if (deletedMovie) {
      this.notificationService.showInfo(`"${deletedMovie.primaryTitle}" eliminada`);
    }
  }

  // Genera un identificador único aleatorio (no garantiza unicidad global)
  private generateId(): string {
    return Math.random().toString(36).substring(2, 11);
  }
}
