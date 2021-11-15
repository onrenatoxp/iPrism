import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { Storage } from '@ionic/storage';
 
@Component({
  selector: 'app-summary',
  templateUrl: './summary.page.html',
  styleUrls: ['./summary.page.scss'],
})
export class SummaryPage implements OnInit {
 
  public URL_API:string;
  public modalTitle: string;
  public msgAlert: string;
  public dados: any = [];
  constructor(private route: ActivatedRoute,
    public loadingCtrl: LoadingController, 
    public navCtrl: NavController,
    private toastCtrl: ToastController,
    private storage: Storage,
    public api: ApiService) { }

  ngOnInit() {
    
  }

  ionViewWillEnter(){
    
 
 
      this.route.queryParams.subscribe(params => {

              this.listarFilhos( params['id'], params['indicePai'])

          
        });
  }

  async listarFilhos(id, indicePai){


    const loading = await this.loadingCtrl.create({
      message: 'Loading'
    });
  
 
      await loading.present();


      this.storage.get('itemsBook' + id).then($items => {

      

 

        let result = JSON.parse(JSON.stringify($items))

      

        result = result.filter(e=>e.indicePai === indicePai)
        
        if(result[0].tipo == 'Conteúdo'){

          this.modalTitle = indicePai + " " + result[0].descricaoPai;
          this.GoConteudo(id, result[0].indicePai)



        }else{

          console.log(result)
          this.dados = result;
          this.modalTitle = result[0].indicePai ==0?result[0].descricaoPai:  result[0].indicePai + '. ' + this.dados[0].descricaoPai;

        }
     

      },(Error) =>{
  
          loading.dismiss();
          this.msgAlert  ='Falha ao listar o sumário';
          this.presentToast();
        
        });


      loading.dismiss();
        
 
    }; 


    GoConteudo(indiceLivro, indicePai){
 
      let navigationExtras: NavigationExtras = {
        queryParams: {
          indiceLivro:  indiceLivro,
          indicePai:  indicePai
        }
    };
    this.navCtrl.navigateForward(['conteudo'], navigationExtras);

    }

 

  async presentToast() {
    const toast = await this.toastCtrl.create({
      message:  this.msgAlert,
      duration: 2000
    });
    toast.present();
  }

}
