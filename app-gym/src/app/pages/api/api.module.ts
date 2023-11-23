// api.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ApiPage } from './api.page';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; // Importante: Asegúrate de importar HttpClientModule

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    HttpClientModule, // Añade HttpClientModule aquí
    RouterModule.forChild([
      {
        path: '',
        component: ApiPage
      }
    ])
  ],
  declarations: [ApiPage]
})
export class ApiPageModule {}
