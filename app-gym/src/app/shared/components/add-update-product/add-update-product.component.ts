import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
})
export class AddUpdateProductComponent implements OnInit {

  @Input() product: Product;

  form = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    image: new FormControl('', [Validators.required]),
    price: new FormControl(null, [Validators.required, Validators.min(0)]),
    soldUnits: new FormControl(null, [Validators.required, Validators.min(0)]),
  })

  // Integramos el servicio de FireBase
  firebaseSvc = inject(FirebaseService);

  // Integramos el loading
  utilsSvc = inject(UtilsService);

  user = {} as User;

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user');
    if (this.product) this.form.setValue(this.product);
  }

  // Tomar o seleccionar imagen
  async takeImage() {
    const dataUrl = (await this.utilsSvc.takePicture('Imagen del producto')).dataUrl;
    // Seteamos la imagen en el campo del formulario
    this.form.controls.image.setValue(dataUrl);
  }

  submit() {
    if (this.form.valid) {
      if (this.product) this.updateProduct();
      else this.createProduct();
    }
  }

  // Crear producto
  async createProduct() {

    let path = `users/${this.user.uid}/products`

    const loading = await this.utilsSvc.loading();
    await loading.present();

    // Subir la imagen y obtener la URL
    let dataUrl = this.form.value.image;
    let imagePath = `${this.user.uid}/${Date.now()}`;
    let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
    this.form.controls.image.setValue(imageUrl);

    delete this.form.value.id;

    this.firebaseSvc.addDocument(path, this.form.value).then(async res => {

      this.utilsSvc.dismissModal({ success: true });

      // Mostramos notificación al usuario
      this.utilsSvc.presentToast({
        message: 'Producto creado exitosamente.',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      })

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

  // Actualizar producto
  async updateProduct() {

    let path = `users/${this.user.uid}/products/${this.product.id}`

    const loading = await this.utilsSvc.loading();
    await loading.present();

    // Subir la imagen y obtener la URL
    if (this.form.value.image !== this.product.image) {
      let dataUrl = this.form.value.image;
      let imagePath = await this.firebaseSvc.getFilePath(this.product.image);
      let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
      this.form.controls.image.setValue(imageUrl);
    }

    delete this.form.value.id;

    this.firebaseSvc.updateDocument(path, this.form.value).then(async res => {

      this.utilsSvc.dismissModal({ success: true });

      // Mostramos notificación al usuario
      this.utilsSvc.presentToast({
        message: 'Producto actualizado exitosamente.',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      })

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