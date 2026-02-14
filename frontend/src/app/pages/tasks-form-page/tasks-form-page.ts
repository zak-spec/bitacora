import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

import { AuthStore } from '../../store/auth.store';
import { TasksStore } from '../../store/tasks.store';
import { uploadFile, deleteFile } from '../../firebase/config';
import { ITaskFormData } from '../../interfaces';

@Component({
  selector: 'app-tasks-form-page',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './tasks-form-page.html',
  styleUrl: './tasks-form-page.css',
})
export class TasksFormPageComponent implements OnInit {
  form: FormGroup;
  taskId: string | null = null;
  isSubmitting = false;
  geoError: string | null = null;

  latitude = 0;
  longitude = 0;

  samplingFiles: (File | string)[] = [];
  speciesFiles: (File | string)[][] = [[]];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public authStore: AuthStore,
    private tasksStore: TasksStore
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      samplingDateTime: [new Date().toISOString().slice(0, 16), [Validators.required]],
      weatherConditions: ['', [Validators.required]],
      habitatDescription: ['', [Validators.required, Validators.minLength(10)]],
      additionalObservations: [''],
      speciesDetails: this.fb.array([this.createSpeciesGroup()]),
    });
  }

  get speciesArray(): FormArray {
    return this.form.get('speciesDetails') as FormArray;
  }

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id');

    // Geolocalización
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.latitude = pos.coords.latitude;
          this.longitude = pos.coords.longitude;
        },
        (err) => {
          if (err.code === err.PERMISSION_DENIED) {
            this.geoError = 'El permiso de geolocalización ha sido bloqueado. Puedes restablecerlo en la configuración de tu navegador.';
          } else {
            this.geoError = 'No se pudo obtener la ubicación. Por favor, verifica tu configuración.';
          }
        }
      );
    } else {
      this.geoError = 'La geolocalización no es soportada por este navegador.';
    }

    if (this.taskId) {
      this.loadTask(this.taskId);
    }
  }

  private async loadTask(id: string): Promise<void> {
    const task = await this.tasksStore.getTask(id);
    if (!task) return;

    this.form.patchValue({
      title: task.title,
      samplingDateTime: new Date(task.samplingDateTime).toISOString().slice(0, 16),
      weatherConditions: task.weatherConditions,
      habitatDescription: task.habitatDescription,
      additionalObservations: task.additionalObservations,
    });

    this.latitude = task.location.latitude;
    this.longitude = task.location.longitude;
    this.samplingFiles = [...(task.samplingPhotos || [])];

    // Reconstruir el FormArray de especies
    this.speciesArray.clear();
    this.speciesFiles = [];
    task.speciesDetails.forEach((species) => {
      this.speciesArray.push(
        this.fb.group({
          scientificName: [species.scientificName, Validators.required],
          commonName: [species.commonName, Validators.required],
          family: [species.family, Validators.required],
          sampleQuantity: [species.sampleQuantity, [Validators.required, Validators.min(1)]],
          plantState: [species.plantState, Validators.required],
        })
      );
      this.speciesFiles.push([...(species.speciesPhotos || [])]);
    });
  }

  private createSpeciesGroup(): FormGroup {
    return this.fb.group({
      scientificName: ['', Validators.required],
      commonName: ['', Validators.required],
      family: ['', Validators.required],
      sampleQuantity: [0, [Validators.required, Validators.min(1)]],
      plantState: ['', Validators.required],
    });
  }

  addSpecies(): void {
    this.speciesArray.push(this.createSpeciesGroup());
    this.speciesFiles.push([]);
  }

  removeSpecies(index: number): void {
    this.speciesArray.removeAt(index);
    this.speciesFiles.splice(index, 1);
  }

  onSamplingFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.samplingFiles.push(...Array.from(input.files));
    }
  }

  onSpeciesFileChange(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      if (!this.speciesFiles[index]) this.speciesFiles[index] = [];
      this.speciesFiles[index].push(...Array.from(input.files));
    }
  }

  async deleteSamplingPhoto(idx: number): Promise<void> {
    const file = this.samplingFiles[idx];
    if (typeof file === 'string' && file.includes('firebasestorage.googleapis.com')) {
      await deleteFile(file);
    }
    this.samplingFiles.splice(idx, 1);
  }

  async deleteSpeciesPhoto(speciesIdx: number, photoIdx: number): Promise<void> {
    const file = this.speciesFiles[speciesIdx][photoIdx];
    if (typeof file === 'string' && file.includes('firebasestorage.googleapis.com')) {
      await deleteFile(file);
    }
    this.speciesFiles[speciesIdx].splice(photoIdx, 1);
  }

  isString(val: any): val is string {
    return typeof val === 'string';
  }

  private async uploadAllFiles(files: (File | string)[]): Promise<string[]> {
    const results: string[] = [];
    for (const file of files) {
      if (typeof file === 'string') {
        results.push(file);
      } else {
        try {
          const url = await uploadFile(file);
          results.push(url);
        } catch (err) {
          console.error('Error uploading file:', err);
        }
      }
    }
    return results;
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;

    try {
      this.isSubmitting = true;
      const formValues = this.form.value;

      // Upload sampling photos
      const samplingPhotos = await this.uploadAllFiles(this.samplingFiles);

      // Upload species photos
      const speciesDetails = await Promise.all(
        formValues.speciesDetails.map(async (species: any, index: number) => {
          const speciesPhotos = await this.uploadAllFiles(this.speciesFiles[index] || []);
          return {
            ...species,
            sampleQuantity: Number(species.sampleQuantity),
            speciesPhotos,
          };
        })
      );

      const taskData: ITaskFormData = {
        title: formValues.title,
        samplingDateTime: new Date(formValues.samplingDateTime).toISOString(),
        location: {
          latitude: Number(this.latitude),
          longitude: Number(this.longitude),
        },
        weatherConditions: formValues.weatherConditions,
        habitatDescription: formValues.habitatDescription,
        samplingPhotos,
        speciesDetails,
        additionalObservations: formValues.additionalObservations || '',
      };

      if (this.taskId) {
        await this.tasksStore.updateTask(this.taskId, taskData);
      } else {
        await this.tasksStore.createTask(taskData);
      }

      this.router.navigate(['/tasks']);
    } catch (error: any) {
      console.error('Error en el envío del formulario:', error);
      alert('Error al procesar el formulario: ' + (error.message || 'Error desconocido'));
    } finally {
      this.isSubmitting = false;
    }
  }
}
