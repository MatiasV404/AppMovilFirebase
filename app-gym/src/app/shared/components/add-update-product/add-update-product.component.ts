import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
})
export class AddUpdateProductComponent  implements OnInit {

  form = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    image: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required, Validators.min(0)]),
    soldUnits: new FormControl('', [Validators.required, Validators.min(0)]),
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