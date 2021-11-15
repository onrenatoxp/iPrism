import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-archive',
  templateUrl: './archive.page.html',
  styleUrls: ['./archive.page.scss'],
})
export class ArchivePage implements OnInit {
  
  public items:any=[];
  public  result:any = [];


  constructor(private toastCtrl: ToastController,
    private storage: Storage,
    public navCtrl: NavController,
    private router:Router) { }

  ngOnInit() {
    
  }

  ionViewWillEnter(){
    this.listar();
  }

  listar(){

    this.storage.get('archive').then(dados => {
      this.items = dados;

      console.log(this.items)


 
      const map = new Map();

      for (const item of this.items) {
        
         if (!map.has(item.indicePai)) {

            map.set(item.indicePai, true);         
            this.result.push({            
              indicePai: item[0].indicePai,           
              descricaoPai: item[0].descricaoPai        
              });    
          }}
          
      
  
  });
  

  }

  goConteudo($item){
  
    let navigationExtras: NavigationExtras = {
      queryParams: {
        indiceLivro: $item.indiceLivro,
        indicePai:  $item.indicePai
      }
  };
  this.navCtrl.navigateForward(['conteudo'], navigationExtras);

  }

  removeItem(item){

    this.storage.remove('archive');
  
    for (let i = 0; i < this.items.length; i++) {
  
      if (this.items[i] == item) {
          this.items.splice(i, 1);
      }
  }

    this.storage.set('archive', this.items)
  
  }

}
