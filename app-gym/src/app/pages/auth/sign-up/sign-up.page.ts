import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})

export class SignUpPage implements OnInit {

  form = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
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

      this.firebaseSvc.singUp(this.form.value as User).then(async res => {
        // Actualizamos el usuario
        await this.firebaseSvc.updateUser(this.form.value.name);

        let uid = res.user.uid;
        this.form.controls.uid.setValue(uid);

        this.setUserInfo(uid);

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

  // Función asíncrona
  async setUserInfo(uid: string) {
    if (this.form.valid) {

      const loading = await this.utilsSvc.loading();
      await loading.present();

      // Indicamos la ruta de guardado
      let path = 'users/${uid}'
      // Borrar contraseña de la base de datos
      delete this.form.value.password;

      this.firebaseSvc.setDocument(path, this.form.value).then(async res => {

        this.utilsSvc.saveInLocalStorage('user', this.form.value);
        // Redireccionar a home
        this.utilsSvc.routerLink('/main/home');
        // Reseteamos el formulario
        this.form.reset();

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