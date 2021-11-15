import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';



@Injectable({
  providedIn: 'root'
})
export class StoragesService {

  constructor( private storage: Storage,) { }


   GetLastUpdate(id){

    this.storage.get('lastUpdatelivro' + id).then(dados => {
      return dados;
    });
  }


  SetLastUpdate(id, ultimaAtualizacao)
  {
    this.storage.set('lastUpdatelivro' + id, ultimaAtualizacao);

  };


  
   GetItemsLivro(id){

    const name = 'itemsBook' + id;
   console.log(name)

    this.storage.get(name).then(dados => {
     
      return dados;
    });

  }
 
  SetItemsLivro(id, items)
  {
    this.storage.set('itemsBook' + id, items);

  };
 
}
