import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  constructor(private router: Router) {}

  navigateToApi() {
    this.router.navigate(['/api']);
  }

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
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

      this.firebaseSvc.signIn(this.form.value as User).then(res => {

        this.getUserInfo(res.user.uid);
        // Capturamos errores
      }).catch(error => {
        console.log(error);

        // Mostramos notificación al usuario
        this.utilsSvc.presentToast({
          message: 'Correo y/o contraseña inválido(s). Intente nuevamente.',
          duration: 2500,
          color: 'secondary',
          position: 'middle',
          icon: 'alert-circle-outline'
        })

        // Quitamos el loading cuando termine la función
      }).finally(() => {
        loading.dismiss();
      })
    }
  }

  async getUserInfo(uid: string) {
    if (this.form.valid) {

      const loading = await this.utilsSvc.loading();
      await loading.present();

      // Indicamos la ruta de guardado
      let path = 'users/${uid}'

      this.firebaseSvc.getDocument(path).then((user: User) => {

        this.utilsSvc.saveInLocalStorage('user', user);
        // Redireccionar a home
        this.utilsSvc.routerLink('/main/home');
        // Reseteamos el formulario
        this.form.reset();

        this.utilsSvc.presentToast({
          message: `Te damos la bienvenida, ${user.name}`,
          duration: 1500,
          color: 'secondary',
          position: 'middle',
          icon: 'person-circle-outline'
        })

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
