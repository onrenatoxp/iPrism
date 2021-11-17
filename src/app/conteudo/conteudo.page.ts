import { Component, OnInit, ChangeDetectorRef, ElementRef, Renderer2, ViewChild } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { IonSlides, LoadingController, NavController, ToastController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { Storage } from '@ionic/storage';
import { AppComponent } from '../app.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-conteudo',
  templateUrl: './conteudo.page.html',
  styleUrls: ['./conteudo.page.scss'],
})



export class ConteudoPage implements OnInit {
  @ViewChild("range") range: HTMLElement;

  public URL_API:string;
  public modalTitle: string;
  public descricao: string;
  public tipo:string;
  public size: any;
  public result : any;
  public isOnline: any;
  public itensRecuperados : any = [];

  
  sliderOpts = {
    zoom: false,
    slidesPerView: 1,
    spaceBetween: 20,
    centeredSlides: true
  };
 


  constructor(private route: ActivatedRoute,
    public loadingCtrl: LoadingController, 
    public navCtrl: NavController,
    private toastCtrl: ToastController,
    private storage: Storage,
    private router:Router,
    private domSanitizer: DomSanitizer,
    private app:AppComponent,
    private changeDetectorRef: ChangeDetectorRef,
    public api: ApiService,
    public element: ElementRef, 
    public renderer: Renderer2) { }

    ngOnInit() {
      this.route.queryParams.subscribe(params => {    
        this.listar(params['indiceLivro'], params['indicePai'])
      });

  }
  
  ionViewWillEnter(){
    this.renderer.setStyle(this.range['el'], 'webkitTransition', 'top 700ms');

    this.storage.get('fontSize').then(tam => {
        this.size = tam ;
    }); 
  }

  onContentScroll(event) {
    if (event.detail.scrollTop >= 50) {
      this.renderer.setStyle(this.range['el'], 'top', '-76px');
    } else {
      this.renderer.setStyle(this.range['el'], 'top', '20px');
    }
  }


  async listar($indiceLivro, $indicePai){

    const loading = await this.loadingCtrl.create({
      message: 'Loading'
    });
  
 
      await loading.present();


      
      this.storage.get('itemsBook').then($items => {

        
 
        for (let i = 0; i < $items.length; i++) {

          if ($items[i].indicePai === $indicePai) {

            this.modalTitle = $items[i].indicePai + '. ' + $items[i].descricaoPai;
        
         
                this.itensRecuperados.push({
                  'id': $items[i].id,
                  'capa': $items[i].capa,
                  'tipo': $items[i].tipo,
                  'indice': $items[i].indice,
                  'indicePai': $items[i].indicePai,
                  'descricao': this.domSanitizer.bypassSecurityTrustHtml($items[i].descricao),
                  'descricaoLessDom':$items[i].descricao,
                  'descricaoPai': $items[i].descricaoPai
             });
  
          }
      
        }
        loading.dismiss();

      });
    
    }; 
    ionSliderForValues(range:any){

      const tam =  range.detail.value;
      this.size = tam;
      this.storage.set('fontSize', tam);
     
      if(tam != null){
        const el = document.querySelector<HTMLElement>('ion-col');
        if(el != null){
            el.style.setProperty('font-size', tam + 'px');
        }
    
       }
  
    }

 
 goArchive(){

  var existe: boolean = true;

  if( this.itensRecuperados != undefined ||  this.itensRecuperados != null ){

    for (let i = 0; i < this.itensRecuperados.length - 1; i++) {

      let found = this.itensRecuperados.find(e=> e.id == this.result[0].indicePai);

      if(found == null || found == undefined){
              existe = false;
              this.itensRecuperados.push({
                'indicePai': this.result.indicePai,
                'indice': this.result.indice,
                'descricaoPai': this.result.descricaoPai
            });

            this.storage.set('archive', Array.of(this.itensRecuperados));
            this.presentToast('Conteúdo salvo');
         
 
        }
        
      }

      if(existe){
        this.presentToast('Conteúdo já estava salvo');
      }
      
    }else
        {

       

            this.storage.set('archive', Array.of([{
                                                  indice:this.result[0].indice, 
                                                  indicePai:this.result[0].indicePai, 
                                                  descricaoPai:this.result[0].descricaoPai}]));
            this.presentToast('Conteúdo salvo');
        }

 
     
  }
  goHome(){
    this.router.navigate(["/tabs/tab1"]);
  }


  async presentToast(msgAlert) {
    const toast = await this.toastCtrl.create({
      message:  msgAlert,
      duration: 2000
    });
    toast.present();
  }


  /// zoomm 


  zoomActive = false;
  zoomScale = 1;
   
  sliderZoomOpts = {
    allowSlidePrev: false,
    allowSlideNext: false,
    zoom: {
      maxRatio: 5
    },
    on: {
      zoomChange: (scale, imageEl, slideEl) => {        
        this.zoomActive = true;
        this.zoomScale = scale/5;
        this.changeDetectorRef.detectChanges();         
      }
    }
  }
  

  async touchEnd(zoomslides: IonSlides, card, geral) {
    // Zoom back to normal
    const slider = await zoomslides.getSwiper();
    const zoom = slider.zoom;
    zoom.out();
   
    // Card back to normal
    card.el.style['z-index'] = 9;
    geral.el.style['z-index'] = 9;
    this.zoomActive = false;
    this.changeDetectorRef.detectChanges();
  }
   
  touchStart(card, geral) {
    // Make card appear above backdrop
    card.el.style['z-index'] = 12;
    geral.el.style['z-index'] = 11;
  }

}
