import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';

import { UidService } from './uid.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private platform: Platform,
    private db: AngularFireDatabase,
    public authFirebase: AngularFireAuth,
    private uidService: UidService,
  ) { }

  // Registro

  async loginWithEmail(email, pass) {
    return new Promise(async (resolve, reject) => {
    try {
        await this.authFirebase.auth.signInWithEmailAndPassword(email, pass);
        const user = this.authFirebase.auth.currentUser;
        const u =  {
          nombre: user.displayName,
          uid: user.uid
        };
        const adSub = this.db.object(`admin/${user.uid}`).valueChanges().subscribe(isAdmin => {
          adSub.unsubscribe();
          if (isAdmin) {
            this.guardaUsuarioStorage(u);
            resolve();
          } else {
            const error = {
              code: 'no-admin'
            };
            reject(error);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

    // Check

    async revisaFireAuth() {
      return new Promise((resolve, reject) => {
        const authSub = this.authFirebase.authState.subscribe(user => {
          authSub.unsubscribe();
          console.log(user);
          if (user) {
            const usuario =  {
              nombre: user.displayName,
              foto: user.photoURL,
              uid: user.uid
            };
            console.log(user.uid);
            this.guardaUsuarioStorage(usuario);
            resolve(true);
          } else {
            resolve(false);
          }
        });
      });
    }

  // Reset password

  async resetPass(email) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.authFirebase.auth.sendPasswordResetEmail(email);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  // Guardar info en Storage

  guardaUsuarioStorage(usuario) {
    return new Promise (async (resolve, reject) => {
      if ( this.platform.is('cordova') ) {
        // Celular
        // this.storage.setItem('usuario', JSON.stringify(usuario));
        this.uidService.setUser(usuario);
        this.uidService.setUid(usuario.uid);
        resolve();
      } else {
        // Escritorio
        localStorage.setItem('usuario', JSON.stringify(usuario));
        this.uidService.setUser(usuario);
        this.uidService.setUid(usuario.uid);
        resolve();
      }
    });
  }

  // Salida

  async logout() {
    return new Promise(async (resolve, reject) => {
      try {
        await this.authFirebase.auth.signOut();
        if ( this.platform.is('cordova') ) {
          // this.storage.remove('usuario');
          this.uidService.setUser(null);
        } else {
          localStorage.removeItem('usuario');
          this.uidService.setUser(null);
          this.uidService.setUid(null);
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }


}
