import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Movie } from '../../models/movie.model';
import { MovieService } from '../../services/movie.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-movie-form',
  templateUrl: './movie-form.component.html',
  styleUrl: './movie-form.component.scss'
})
export class MovieFormComponent {
  movieForm: FormGroup;
  isEditMode = false;
  movieId: string | null = null;
  genresList: string[] = ['Drama', 'Comedy', 'Action', 'Horror', 'Sci-Fi', 'Romance'];
  currentYear = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private movieService: MovieService,
    public dialogRef: MatDialogRef<MovieFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { isEdit: boolean, movie?: Movie }
  ) {

    this.isEditMode = data.isEdit;

    // Inicialización del formulario con sus controles y validaciones
    this.movieForm = this.fb.group({
      id: [''],
      primaryTitle: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(200)
      ]],
      originalTitle: [''],
      description: [''],
      releaseDate: ['', Validators.required],
      runtimeMinutes: ['', [
        Validators.min(1),
        Validators.max(600)
      ]],
      genres: [[], Validators.required],
      averageRating: ['', [
        Validators.min(0),
        Validators.max(10)
      ]],
      primaryImage: [''],
      contentRating: [''],
      isAdult: [false]
    });

    // Si se está editando y se proporciona una película, se rellenan los campos del formulario
    if (this.isEditMode && data.movie) {
      this.movieForm.patchValue(data.movie);
    }
  }

  ngOnInit(): void { }

  // Maneja el envío del formulario
  onSubmit(): void {
    // Solo se ejecuta si el formulario es válido
    if (this.movieForm.valid) {
      const movie = this.movieForm.value as Movie;

      // Si es modo edición, se actualiza la película
      if (this.isEditMode) {
        this.movieService.updateMovie(movie);
        this.dialogRef.close(true); // Cierra el diálogo y pasa `true` como indicador de éxito
      } else {
        // Si es nuevo, se agrega la película
        this.movieService.addMovie(movie);
        this.dialogRef.close(); // Cierra el diálogo sin pasar estado
      }
    }
  }

  // Getters para facilitar el acceso a los controles del formulario en la plantilla HTML
  get primaryTitle() { return this.movieForm.get('primaryTitle'); }
  get releaseDate() { return this.movieForm.get('releaseDate'); }
  get runtimeMinutes() { return this.movieForm.get('runtimeMinutes'); }
  get genres() { return this.movieForm.get('genres'); }
  get averageRating() { return this.movieForm.get('averageRating'); }
}
