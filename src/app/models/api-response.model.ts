import { Movie } from './movie.model';

export interface ApiResponse {
    results: Movie[];
    total: number;
}