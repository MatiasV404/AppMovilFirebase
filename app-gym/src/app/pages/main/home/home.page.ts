import { Component, OnInit, inject } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateProductComponent } from 'src/app/shared/components/add-update-product/add-update-product.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  products: Product[] = [];

  ngOnInit() {
  }

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  // Ejecuta una función cada vez que el usuario ingresa a la aplicación
  ionViewWillEnter() {
    this.getProducts();
  }

  // Cerrar sesión
  signOut(){
    this.firebaseSvc.signOut();
  }

  // Obtener Productos
  getProducts() {
    let path = `users/${this.user().uid}/products`

    let sub = this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) => {
        console.log(res);
        this.products = res;
        sub.unsubscribe();
      }

    })
  }

  // Agregar o actualizar producto
  async addUpdateProduct(product?: Product) {
    let success = await this.utilsSvc.presentModal({
      component: AddUpdateProductComponent,
      componentProps: { product }
    })

    if (success) this.getProducts();
  }

  // Confirmar eliminación de producto
  async confirmDeleteProduct(product: Product) {
    this.utilsSvc.presentAlert({
      header: 'Confirmar eliminación',
      message: '¿Deseas eliminar este producto?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.deleteProduct(product);
          }
        }
      ]
    });
  }

  // Eliminar producto
  async deleteProduct(product: Product) {

    let path = `users/${this.user().uid}/products/${product.id}`

    const loading = await this.utilsSvc.loading();
    await loading.present();

    let imagePath = await this.firebaseSvc.getFilePath(product.image);
    await this.firebaseSvc.deleteFile(imagePath);

    this.firebaseSvc.deleteDocument(path).then(async res => {

      this.products = this.products.filter(p => p.id !== product.id);

      // Mostramos notificación al usuario
      this.utilsSvc.presentToast({
        message: 'Producto eliminado exitosamente.',
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
