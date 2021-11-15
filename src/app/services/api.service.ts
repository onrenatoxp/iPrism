import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, Subject, throwError } from 'rxjs';
import { ConstantsService } from './constants.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, public global: ConstantsService) { }

   
  GetLastUpdate(indice){

    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8'
    });
    
    var url = this.global.API_ENDPOINT + 'Book/lastUpdate?idLivro=' + indice ;
 
    return this.http.get(url, {headers}).pipe(res => res);
  }


  GetBook(indice){

    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8'
    });
    
    var url = this.global.API_ENDPOINT + 'Book/?IndiceLivro=0&IndicePai=' + indice +'&Tipo=0';
 
    return this.http.get(url, {headers}).pipe(res => res);
  }

  GetItem(indiceLivro, indice){

 
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8'
    });
    
    var url = this.global.API_ENDPOINT + 'Book/?IndiceLivro=' + indiceLivro + '&IndicePai=' + indice + '&Tipo=1';
    console.log(url)
    return this.http.get(url, {headers}).pipe(res => res);
  }

  testeConnection(){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8'
    });

    var url = this.global.API_ENDPOINT + 'TesteConnection';
    return this.http.post(url, {headers}).pipe(res => res);
  }

  filter(indiceLivro, key){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8'
    });
    var url = this.global.API_ENDPOINT + 'Search/?indiceLivro=' + indiceLivro + '&chave=' + key;
    return this.http.get(url,{headers}).pipe(res => res);

  }

}
