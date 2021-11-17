import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../theme.service';
import { Storage } from '@ionic/storage';
import { ConstantsService } from '../services/constants.service';
import { AlertController, ToastController } from '@ionic/angular';


@Component({
  selector: 'app-configuracao',
  templateUrl: './configuracao.page.html',
  styleUrls: ['./configuracao.page.scss'],
})
export class ConfiguracaoPage implements OnInit {
  public isToggleBtnChecked:boolean;
  public dados:any = [];
  constructor(private theme: ThemeService,
    private storage: Storage, 
    private toastCtrl: ToastController,
    public global: ConstantsService,
    public alertController: AlertController) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.storage.get('dark').then(c => {
      this.isToggleBtnChecked = c;
    });

    this.storage.get('books').then(books=>{
      this.dados = books;
    });
  }

  async limparCache($item:any) {

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: $item.descricao,
      message: 'A limpeza do cache removerá os dados da memória do celular, forçando a sua atualização novamente. Deseja continuar?',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Sim',
          handler: () => {
            console.log('Confirm Okay');
            this.removerStorage($item.id)
          }
        }
      ]
    });

    await alert.present();
  }

  async removerStorage(id){
      this.storage.remove("lastUpdatelivro" + id);
      this.storage.remove("itemsBook" + id);

      this.presentToast("Limpeza do cache realizada.")

  }



  onToggleBtnChange(event): void {
    const isChecked = this.isToggleBtnChecked;
    this.storage.set('dark', this.isToggleBtnChecked);

    if (isChecked) {
      this.theme.setTheme( this.global.themes['night']);
    } else{
      this.theme.setTheme(this.global.themes['']);
    }
  }

  async presentToast(msgAlert) {
    const toast = await this.toastCtrl.create({
      message:  msgAlert,
      duration: 2000
    });
    toast.present();
  }

  
  }
