import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../theme.service';
import { Storage } from '@ionic/storage';
import { ConstantsService } from '../services/constants.service';

@Component({
  selector: 'app-configuracao',
  templateUrl: './configuracao.page.html',
  styleUrls: ['./configuracao.page.scss'],
})
export class ConfiguracaoPage implements OnInit {
  public isToggleBtnChecked:boolean;
  constructor(private theme: ThemeService,private storage: Storage, public global: ConstantsService) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.storage.get('dark').then(c => {
      this.isToggleBtnChecked = c;
    });
  }

  RemoveMemory(){}



  onToggleBtnChange(event): void {
    const isChecked = this.isToggleBtnChecked;
    this.storage.set('dark', this.isToggleBtnChecked);

    if (isChecked) {
      this.theme.setTheme( this.global.themes['night']);
    } else{
      this.theme.setTheme(this.global.themes['']);
    }
  }
  
  }
