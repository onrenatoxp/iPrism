import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'summary',
    loadChildren: () => import('./summary/summary.module').then( m => m.SummaryPageModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./search/search.module').then( m => m.SearchPageModule)
  },
  {
    path: 'conteudo',
    loadChildren: () => import('./conteudo/conteudo.module').then( m => m.ConteudoPageModule)
  },
  {
    path: 'archive',
    loadChildren: () => import('./archive/archive.module').then( m => m.ArchivePageModule)
  },
  {
    path: 'opcao',
    loadChildren: () => import('./opcao/opcao.module').then( m => m.OpcaoPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
