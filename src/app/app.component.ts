import { Location } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { AlertController, IonRouterOutlet, Platform, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Subject } from 'rxjs';
import { ApiService } from './services/api.service';
import { ConstantsService } from './services/constants.service';
import { ThemeService } from './theme.service';
import { App as CapacitorApp } from '@capacitor/app';
import { Router } from '@angular/router';


 

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  public isOnline:any;


  private fooSubject = new Subject<any>();

  @ViewChild(IonRouterOutlet, {static: true}) routerOutlet: IonRouterOutlet;

  constructor(
    private theme: ThemeService,
    private storage:  Storage, 
    private alertCrt: AlertController,
    private toastCtrl: ToastController,
    public global: ConstantsService,
    public api: ApiService,
    public location: Location,
    public platform: Platform,
    private router:Router) {
 
    this.storage.get('dark').then(dark => {
      const theme = (dark == true? 'night':'');
      this.theme.setTheme( this.global.themes[theme]);

      this.backButtonEvent();
    });

  }

  backButtonEvent(){
    var total = 0;
    
    this.platform.backButton.subscribeWithPriority(10, ()=> {
 
      const url = this.router.url;
    

      if(!this.routerOutlet.canGoBack()){
        if(url === "/tabs/tab1"){
          total = total  +1
          console.log("total", total)

         
          if(total == 1){
            this.presentToast("Pressione mais uma vez para fechar o aplicativo.")
           
          }
          if(total > 1){
            total = 0;
            CapacitorApp.exitApp();
          }
          
        }else{
          this.location.back();
        }
       
      }else{
        
        this.location.back();
      }
    });
  }


  async presentToast(msgAlert) {
    const toast = await this.toastCtrl.create({
      message:  msgAlert,
      duration: 2000
    });
    toast.present();
  }

  async backButtonAlert(){
    const alert = await this.alertCrt.create({
     message: 'Deseja fechar o aplicativo',
     buttons: [{
       text: 'Cancelar',
       role:'cancel'
     },{
       text: 'Sair',
       handler: ()=>{
     
        CapacitorApp.exitApp();
       }
     }]

    });

    await alert.present();
  }

}
