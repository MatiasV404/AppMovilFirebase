import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  })

  // Integramos el servicio de FireBase
  firebaseSvc = inject(FirebaseService);

  // Integramos el loading
  utilsSvc = inject(UtilsService);

  ngOnInit() {
  }

  // Función asíncrona
  async submit() {
    if (this.form.valid) {

      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.firebaseSvc.sendRecoveryEmail(this.form.value.email).then(res => {
        // Mostramos notificación al usuario
        this.utilsSvc.presentToast({
          message: 'Correo enviado exitosamente.',
          duration: 1500,
          color: 'secondary',
          position: 'middle',
          icon: 'mail-outline'
        });

        this.utilsSvc.routerLink('/auth');
        this.form.reset();

        // Capturamos errores
      }).catch(error => {
        console.log(error);

        // Mostramos notificación al usuario
        this.utilsSvc.presentToast({
          message: 'Correo y/o contraseña inválido(s). Intente nuevamente.',
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        })

        // Quitamos el loading cuando termine la función
      }).finally(() => {
        loading.dismiss();
      })
    }
  }

}
