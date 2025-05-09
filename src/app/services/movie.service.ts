// src/app/core/services/movie.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { StorageService } from './storage.service';
import { Movie, APIResponse } from '../models/movie.model';





@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = 'https://imdb236.p.rapidapi.com/imdb/search';
  private localStorageKey = 'imdb_movies_tmp';
  private apiDataKey = 'imdb_movies_api';
  private moviesSubject = new BehaviorSubject<Movie[]>([]);
  public movies$ = this.moviesSubject.asObservable().pipe(distinctUntilChanged());

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {
    this.initializeFromLocalStorage();
  }

  private initializeFromLocalStorage(): void {
    const savedMovies = this.storageService.get(this.localStorageKey) || [];
    this.moviesSubject.next(savedMovies);
  }

  loadMoviesFromApi(): Observable<Movie[]> {
    const headers = new HttpHeaders({
      'x-rapidapi-key': 'a68c72c70cmsheda119d0ebbf595p1eea68jsn571b77757908',
      'x-rapidapi-host': 'imdb236.p.rapidapi.com'
    });

    const params = { type: 'movie', genre: 'Drama', rows: '25' };

    return this.http.get<APIResponse>(this.apiUrl, { headers, params }).pipe(
      map(response => response.results || []),
      tap(movies => {
        this.updateMoviesState(movies);
      }),
      catchError(error => {
        console.error('Error loading movies:', error);
        return of(this.moviesSubject.value);
      })
    );
  }

  private updateMoviesState(movies: Movie[]): void {
    this.storageService.set(this.localStorageKey, movies);
    this.moviesSubject.next(movies);
  }

  addMovie(movie: Omit<Movie, 'id'>): void {
    const currentMovies = this.moviesSubject.value;
    const newMovie = {
      ...movie,
      id: this.generateId()
    };
    const updatedMovies = [...currentMovies, newMovie];
    this.updateMoviesState(updatedMovies);
  }

  updateMovie(updatedMovie: Movie): void {
    const currentMovies = this.moviesSubject.value;
    const updatedMovies = currentMovies.map(movie =>
      movie.id === updatedMovie.id ? updatedMovie : movie
    );
    this.updateMoviesState(updatedMovies);
  }

  deleteMovie(id: string): void {
    const currentMovies = this.moviesSubject.value;
    const updatedMovies = currentMovies.filter(movie => movie.id !== id);
    this.updateMoviesState(updatedMovies);
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 11);
  }
}