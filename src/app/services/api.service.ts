import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie, ApiResponse } from '../models/movie.model';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_URL = 'https://imdb236.p.rapidapi.com';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'X-Rapidapi-Key': 'a68c72c70cmsheda119d0ebbf595p1eea68jsn571b77757908',
      'X-Rapidapi-Host': 'imdb236.p.rapidapi.com'
    });
  }

  getPopularMovies(): Observable<Movie[]> {
    const headers = this.getHeaders();
    return this.http.get<ApiResponse>(
      `${this.API_URL}/title/get-most-popular-movies`,
      { headers }
    ).pipe(
      map(response => this.transformApiResponse(response)),
      catchError(error => {
        console.error('API Error:', error);
        return of([]);
      })
    );
  }

  searchMovies(query: string): Observable<Movie[]> {
    const headers = this.getHeaders();
    return this.http.get<ApiResponse>(
      `${this.API_URL}/title/v2/find?title=${encodeURIComponent(query)}`,
      { headers }
    ).pipe(
      map(response => this.transformApiResponse(response)),
      catchError(error => {
        console.error('API Error:', error);
        return of([]);
      })
    );
  }

  private transformApiResponse(response: ApiResponse): Movie[] {
    if (!response?.results) return [];

    return response.results.map(item => ({
      id: item.id || Math.random().toString(36).substr(2, 9),
      title: item.title || 'Unknown',
      year: item.year || new Date().getFullYear(),
      duration: item.runningTimeInMinutes ?
        `${Math.floor(item.runningTimeInMinutes / 60)}h ${item.runningTimeInMinutes % 60}m` :
        'Unknown',
      genres: item.genres || ['Unknown'],
      director: item.directors?.[0]?.name || 'Unknown',
      actors: item.actors?.map(a => a.name) || ['Unknown'],
      plot: item.plot || 'No plot available',
      posterUrl: item.image?.url || 'assets/default-movie.png',
      rating: item.rating || 0
    }));
  }

  getMovieDetails(id: string): Observable<Movie> {
    const headers = this.getHeaders();
    return this.http.get<Movie>(`${this.API_URL}/title/get-details?tconst=${id}`, { headers });
  }
}
