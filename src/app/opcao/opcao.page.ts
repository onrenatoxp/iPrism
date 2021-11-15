import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { LoadingController, NavController, Platform, ToastController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { DownloadService } from '../services/download.service';
import { Storage } from '@ionic/storage';
import { StoragesService } from '../services/storages.service';

@Component({
  selector: 'app-opcao',
  templateUrl: './opcao.page.html',
  styleUrls: ['./opcao.page.scss'],
})
export class OpcaoPage implements OnInit {

  public id: string;
  public titulo: string;
  public dados:any = [];
  public dadosStorage:any = [];
  public myDate:any;
  public nomeArquivo:any;
  public capa:any;
  public pdfSrc:any;
  public  update: any = [];
  public ultimaAtualizacao:any;

  public booksRecuperados : any =[]
  
  constructor(private route: ActivatedRoute,
    public loadingCtrl: LoadingController, 
    public navCtrl: NavController,
    private toastCtrl: ToastController,
    public storageService: StoragesService,
    public api: ApiService,
    public platform: Platform,
    private storage: Storage,
    private downloadService: DownloadService) { }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {

      this.id  = params['id'];
      
      this.GetLastUpdate(this.id)

   });

  }

  GoSearch(){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: this.id,
      }
      
  };
  
  this.navCtrl.navigateForward(['tabs/tab2'], navigationExtras);
  }

  downloadLivro(){
 
  const url = this.pdfSrc;
  this.myDate = new Date().toISOString();
 // this.nomeArquivo = this.myDate.replace(new RegExp("[-,:,.]", "g"), "");

  if (this.platform.is('ios')){
      this.downloadService.downloadLivroIOS(url, this.nomeArquivo, 'pdf');
  }else{
      this.downloadService.download(url, 'pdf');
  }

}

async GetLastUpdate(id:any){

  const loading = await this.loadingCtrl.create({
    message: 'Verificando última atualização...'
  });

  await loading.present();


  this.api.GetLastUpdate(id).subscribe(up=>{

        this.update = up;
        loading.dismiss();

        this.GetItem(this.id);

 
   }, (Error) =>{
  
     loading.dismiss();

      this.GetItem(this.id);

  });
 



}
 
async GetItem(id:any){

  
  
    this.storage.get('books').then(dados => {


      this.booksRecuperados = dados;

      let found = this.booksRecuperados.find(e=> e.id == id);


      if(found != null){

        this.titulo = found.descricao
        this.capa = found.capa
        this.pdfSrc = found.urlPdf
 
 

        this.storage.get('lastUpdatelivro' + id).then(lastUpdate => {

          this.ultimaAtualizacao = lastUpdate;

      
            if(lastUpdate == null || lastUpdate == undefined){

      
              this.storageService.SetLastUpdate(id, this.update.ultimaAtualizacao);
              this.ultimaAtualizacao = this.update.ultimaAtualizacao;
              this.GetItemsApi(id, this.update.ultimaAtualizacao);
              
 
            }else{ 

 
              if(this.update.ultimaAtualizacao != null || this.update.ultimaAtualizacao != undefined){

                          // se a ultima atualizacao for diferente a atualização salva, chama a api
                          if(this.update.ultimaAtualizacao  != lastUpdate){

                          
                            this.GetItemsApi(id, this.update.ultimaAtualizacao);

                        } 

              }
     
                

            }


          });
 

  }
 

});
  
  
 }

 

  async GetItemsApi(id:any, ultimaAtualizacao:any){



    const loading = await this.loadingCtrl.create({
      message: 'As informações estão sendo atualizadas ...'
    });
    await loading.present();

    this.api.GetItem(id, null).subscribe(
      data => {

              this.storageService.SetLastUpdate(id, ultimaAtualizacao);
              this.storageService.SetItemsLivro(this.id, data);
              loading.dismiss();
 
      },(Error) =>{
        loading.dismiss();

        console.log(JSON.parse(Error))
        this.presentToast("Erro ao tentar atualizar as informações")
      });

  
  }


  GoSummary(){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: this.id,
        indicePai: '0'
      }
      
  };
  
  this.navCtrl.navigateForward(['summary'], navigationExtras);

  }


  async presentToast(msgAlert) {
    const toast = await this.toastCtrl.create({
      message:  msgAlert,
      duration: 2000
    });
    toast.present();
  }
  

}
