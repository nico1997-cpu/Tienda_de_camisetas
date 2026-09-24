import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { mensajeDeError } from '../../../core/utils/http-error';
import { destinoSeguro } from '../../../core/utils/navigation';

function contrasenasIguales(group: AbstractControl): ValidationErrors | null {
  return group.get('contrasena')?.value === group.get('confirmar')?.value
    ? null
    : { noCoinciden: true };
}

type Campo = 'nombre' | 'email' | 'contrasena' | 'confirmar';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistroComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly form = this.fb.group(
    {
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]], // igual que @Size(min=6) del backend
      confirmar: ['', [Validators.required]],
    },
    { validators: contrasenasIguales },
  );

  protected readonly cargando = signal(false);
  protected readonly error = signal<string | null>(null);

  protected invalido(campo: Campo): boolean {
    const control = this.form.controls[campo];
    return control.invalid && (control.touched || control.dirty);
  }

  protected get noCoinciden(): boolean {
    return this.form.hasError('noCoinciden') && this.form.controls.confirmar.touched;
  }

  protected enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { nombre, email, contrasena } = this.form.getRawValue();
    this.cargando.set(true);
    this.error.set(null);

    this.auth
      .registrar({ nombre, email, contrasena })
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: () =>
          this.router.navigateByUrl(destinoSeguro(this.route.snapshot.queryParamMap.get('returnUrl'))),
        error: (err) =>
          this.error.set(
            mensajeDeError(err, {
              409: 'Ese correo ya está registrado.',
              400: 'Revisa los datos ingresados.',
            }),
          ),
      });
  }
}
