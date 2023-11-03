import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AlertOptions, LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  router = inject(Router);
  modalCtrl = inject(ModalController);
  alertCtrl = inject(AlertController);



  // Camera Capacitor
async takePicture(promptLabelHeader: string){
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt, 
      promptLabelHeader,
      promptLabelPhoto: 'Seleccione una imagen',
      promptLabelPicture: 'Tomar una foto'
    });
  };

  // Alerta
  async presentAlert(opts?:AlertOptions) {
    const alert = await this.alertCtrl.create(opts);
  
    await alert.present();
  }

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
  saveInLocalStorage(key: string, value: any) {
    // Convertimos a string el valor del parámetro
    return localStorage.setItem(key, JSON.stringify(value))
  }

  // Obtener elemento del almacenamiento local
  getFromLocalStorage(key: string) {
    // Convertimos a su valor original el objeto o arreglo
    return JSON.parse(localStorage.getItem(key));
  }

  // Modal
  async presentModal(opts: ModalOptions) {
    const modal = await this.modalCtrl.create(opts);
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) return data;
  }

  dismissModal(data?: any) {
    return this.modalCtrl.dismiss(data);

  }
}
