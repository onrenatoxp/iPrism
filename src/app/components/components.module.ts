import { NgModule } from '@angular/core';
import { HeaderComponent } from '../components/header/header.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
 
@NgModule({
	imports: [
	  CommonModule, 
	  IonicModule
	],
	declarations: [
		HeaderComponent
 
	],
	exports: [
		HeaderComponent
	]
  })
export class ComponentsModule {}
