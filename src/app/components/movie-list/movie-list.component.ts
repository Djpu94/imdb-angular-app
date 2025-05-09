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
import { ActivatedRoute, Router } from '@angular/router';
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

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(
    private movieService: MovieService,
    private dialog: MatDialog,
    private router: Router,
  ) {
    this.movies$ = this.movieService.movies$;
  }

  ngOnInit(): void {
    this.loadMovies();
  }



  loadMovies(): void {
    this.isLoading = true;
    this.movieService.loadMoviesFromApi().subscribe({
      next: () => this.isLoading = false,
      error: () => this.isLoading = false
    });
  }


  openAddDialog(): void {
    const dialogRef = this.dialog.open(MovieFormComponent, {
      width: '600px',
      data: { isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.movieService.addMovie(result);
      }
    });
  }

  openEditDialog(movie: Movie): void {
    const dialogRef = this.dialog.open(MovieFormComponent, {
      width: '600px',
      data: { isEdit: true, movie }
    });

    dialogRef.afterClosed().subscribe(updatedMovie => {
      if (updatedMovie) {
        this.movieService.updateMovie(updatedMovie);
      }
    });
  }

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

  // Métodos auxiliares para la vista
  formatGenres(genres: string[]): string {
    return genres?.join(', ') || '';
  }

  formatDate(date: Date | null): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  }

  navigateToAdd(): void {
    this.router.navigate(['/add']);
  }

  navigateToEdit(movieId: string): void {
    this.router.navigate(['/edit', movieId]);
  }

}





