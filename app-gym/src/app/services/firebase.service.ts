import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { createUserWithEmailAndPassword, sendPasswordResetEmail, getAuth, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { getFirestore, setDoc, doc, getDoc, addDoc, collection, updateDoc, collectionData, query } from '@angular/fire/firestore'
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage'
import { getStorage, uploadString, ref, getDownloadURL } from 'firebase/storage' 

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  storagr = inject(AngularFireStorage);
  utilsSvc = inject(UtilsService);

  // Autenticación

  getAuth() {
    return getAuth();
  }

  // Acceder
  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password)
  }

  // Crear usuario
  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password)
  }

  // Actualizar usuario
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName })
  }

  // Restablecer contraseña
  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email)
  }

  // Cerrar sesión
  signOut() {
    getAuth().signOut();
    // Removemos el usuario del almacenamiento local
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/auth');
  }

  // Base de datos

  getCollectionData(path: string, collectionQuery?:any){
    const ref = collection(getFirestore(), path);
    // Retorna el objeto y su id
    return collectionData(query(ref, collectionQuery), {idField: 'id'});
  }

  // Setear un documento
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  // Actualizar un documento
  updateDocument(path: string, data: any) {
    return updateDoc(doc(getFirestore(), path), data);
  }

  // Obtener un documento
  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  // Agregar un documento
  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data);
  }

  // Almacenamiento

  // Cargamos imagen en URL y la obtenemos
  async uploadImage(path: string, data_url: string){
    return uploadString(ref(getStorage(),path), data_url, 'data_url').then(() => {
      return getDownloadURL(ref(getStorage(),path))
    })
  }

  // Obtener ruta de la imagen con su URL
  async getFilePath(url : string){
    return ref(getStorage(), url).fullPath;
  }

}
