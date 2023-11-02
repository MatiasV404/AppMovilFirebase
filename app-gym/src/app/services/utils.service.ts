import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  router = inject(Router)

  // Loading
  loading() {
    return this.loadingCtrl.create({ spinner: 'crescent' })
  }

  // Toast
  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

  // Redirecciona a cualquier página disponible
  routerLink(url) {
    return this.router.navigateByUrl(url);
  }

  // Guardar elemento en el almacenamiento local
  saveInLocalStorage(key: string, value: any){
    // Convertimos a string el valor del parámetro
    return localStorage.setItem(key, JSON.stringify(value))
  }

  // Obtener elemento del almacenamiento local
  getFromLocalStorage(key: string){
    // Convertimos a su valor original el objeto o arreglo
    return JSON.parse(localStorage.getItem(key));
  }

}
