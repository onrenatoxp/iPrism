import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConteudoPage } from './conteudo.page';

const routes: Routes = [
  {
    path: '',
    component: ConteudoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConteudoPageRoutingModule {}
