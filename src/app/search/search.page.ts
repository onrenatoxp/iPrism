import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { LoadingController, ModalController, NavController, ToastController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { StoragesService } from '../services/storages.service';
import { Storage } from '@ionic/storage';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  public result: any = [];
  public msgAlert: any;
  public indiceLivro:any;
  public existe:boolean = false;
  constructor(public api: ApiService,
    public storageService: StoragesService,
    public loadingCtrl: LoadingController, 
    public modalController: ModalController,
    public navCtrl: NavController,
    private route: ActivatedRoute,
    private storage: Storage,
    private domSanitizer: DomSanitizer,
    private toastCtrl: ToastController) { }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      this.indiceLivro  = params['id']; 
      this.storage.set('ActualLivroId', this.indiceLivro );
   });

 

  }


  ionViewWillEnter(){
   this.result = []
  }


  async filterList(evt){

    console.log(evt);
    
    if (evt && evt.key === "Enter"){


      console.log(evt.key);
      this.result = []
          

      const loading = await this.loadingCtrl.create({
        message: 'Loading'
      });
  
       await loading.present();

      var key = evt.srcElement.value;

      if(key != null){


        if(this.indiceLivro == null){

          this.storage.get('ActualLivroId' + this.indiceLivro).then($items => { 

             this.indiceLivro = $items;

          });

        }

        
  
        this.storage.get('itemsBook' + this.indiceLivro).then($items => { 

   
          var range = 300;
          var CompleteSize = key.length;
 
        var regex = RegExp('\\b(' + key + ')\\b', 'i');

       

          for (let i = 0; i <= $items.length-1; i++) {

            var str = $items[i].descricao;
            var $input = null;
            var position =  str.search(regex);

      

            if(position > 0){
 

              var limLeft = position > 150 ? position - 150 : 0;
              var limRight = limLeft + range < CompleteSize ? range - key.length : range - key.length;

              $input = str.substr(limLeft, limRight - 1);

     

              const searchRegExp = new RegExp(key, "gi");
              const replaceWith = "<b style='background: #ffc107 !important; color: #222222'>" + str.substr(position, key.length) + '</b>'

              var output =  $input.replaceAll(searchRegExp, replaceWith);

              // console.log(output)

         
        
              this.result.push({
                'id': $items[i].id,
                'capa': $items[i].capa,
                'tipo': $items[i].tipo,
                'indice': $items[i].indice,
                'indicePai': $items[i].indicePai,
                'descricao':  this.domSanitizer.bypassSecurityTrustHtml(output)
  
              });
 

            }

 
          }
 

 

        });
  
   
        loading.dismiss();
    };  

  }
  };
    
    async listar(filtro){


      const loading = await this.loadingCtrl.create({
        message: 'Loading'
      });
    
      await loading.present();

      this.storage.get('itemsBook' + filtro.id).then($lista => { 


        let result = JSON.parse(JSON.stringify($lista))

    
        result = result.filter(e=>e.indice ==filtro.indice  && e.indicePai ==filtro.indicePai)[0]

        console.log(result)
  
        loading.dismiss();

              if(result.tipo == "Conteúdo"){
         
                    this.GoConteudo(result.id, result.indicePai, result.descricao);
           

              }else{

                    this.GoSummary(result);
               
              }



   
      });

      };   



    GoConteudo(indiceLivro, indicePai, titulo){
  
      let navigationExtras: NavigationExtras = {
        queryParams: {
          titulo:  titulo,
          indiceLivro: indiceLivro,
          indicePai:  indicePai
        }
    };
    this.navCtrl.navigateForward(['conteudo'], navigationExtras);

    }

    GoSummary(item){

      console.log(item)
      let navigationExtras: NavigationExtras = {
        queryParams: {
          id: item.id,
          indicePai: item.indice
        }
    };
    this.navCtrl.navigateForward(['summary'], navigationExtras);

    }

Cancel(){
  this.result = null;
}

    async presentToast(msgAlert) {
      const toast = await this.toastCtrl.create({
        message:   msgAlert,
        duration: 2000
      });
      toast.present();
    }

}
