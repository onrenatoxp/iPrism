import { Component } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { ConstantsService } from './../services/constants.service';
import {ApiService} from './../services/api.service'
import { LoadingController, ToastController, NavController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AppComponent } from '../app.component';
import { StoragesService } from '../services/storages.service';
 
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
 
  public URL_API:string;
  public msgAlert: string;
  public dados: any = [];
  public isOnline: boolean;
  public itensRecuperados : any =[];
  public itensOpened : any =[];
  slideOptsThumbs = {
    spaceBetween: 0,
    slidesPerView: 2.3,
  };

  
  
  constructor( 
    private activatedRoute: ActivatedRoute,  
    public global: ConstantsService, 
    public app:AppComponent,
    public api: ApiService,
    private storage: Storage,
    public storageService: StoragesService,
    public loadingCtrl: LoadingController, 
    public modalController: ModalController,
    public navCtrl: NavController,
    private toastCtrl: ToastController) {
    this.URL_API = global.API_ENDPOINT;
  }
 
  ngOnInit( ) {
   
          

  }

  ionViewWillEnter(){

    this.listar();

    this.storage.get('books').then(dados => {
      this.itensRecuperados = dados;
    });

    this.storage.get('booksOpened').then(dados => {
      this.itensOpened = dados;
    });


 
  }

  async listar(){

    const loading = await this.loadingCtrl.create({
      message: 'Loading'
    });
  
    await loading.present();


      this.api.GetBook(0).subscribe(
        data => {
          
        this.dados = data;

        this.saveBooks(this.dados)

        loading.dismiss();
  
       }, (Error) =>{
  
          loading.dismiss();

          this.dados = this.itensRecuperados;

        });


  

    

    };
    

    saveBooks($dados){

          this.storage.set('books',  $dados);

    }
       
    
        
 
saveRecentlyOpened($item){



  this.storage.get('booksOpened').then(dados => {

    this.itensOpened = dados;

    if( this.itensOpened != undefined ||  this.itensOpened != null ){

      let found = this.itensOpened.find(e=> e.id == $item.id);
  
      if(found == null || found == undefined){
      
        this.itensOpened.push({
          'id': $item.id,
          'capa': $item.capa,
          'tipo': $item.tipo,
          'indice': $item.indice,
          'indicePai': $item.indicePai,
          'descricao': $item.descricao,
          'descricaoPai': $item.descricaoPai
      });
  
      this.storage.set('booksOpened',  this.itensOpened);
  
  }
  
  
    }else{
  
       this.storage.set('booksOpened', Array.of($item));
  
    }
  
  });


  


  




}

GoOpcao(item){

  this.saveRecentlyOpened(item)
  let navigationExtras: NavigationExtras = {
    queryParams: {
      id: item.id
    }
    
};

this.navCtrl.navigateForward(['opcao'], navigationExtras);


}
 
  async presentToast() {
    const toast = await this.toastCtrl.create({
      message:  this.msgAlert,
      duration: 2000
    });
    toast.present();
  }

}
