import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from './../components/components.module';
import { IonicModule } from '@ionic/angular';

import { OpcaoPageRoutingModule } from './opcao-routing.module';

import { OpcaoPage } from './opcao.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    OpcaoPageRoutingModule
  ],
  declarations: [OpcaoPage]
})
export class OpcaoPageModule {}
