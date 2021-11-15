import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  // public API_ENDPOINT: string = 'https://localhost:44381/';

 public API_ENDPOINT: string = 'http://www.dev.alumar.soa.alcoa.com/iprism/';
   public themes = {
    autumn: {
      primary: '#F78154',
      secondary: '#4D9078',
      tertiary: '#B4436C',
      light: '#FDE8DF',
      medium: '#FCD0A2',
      dark: '#B89876'
    },
    night: {
      primary: '#8CBA80',
      secondary: '#FCFF6C',
      tertiary: '#FE5F55',
      medium: '#BCC2C7',
      dark: '#F7F7FF',
      light: '#2e2e2e'
    },
    neon: {
      primary: '#39BFBD',
      secondary: '#4CE0B3',
      tertiary: '#FF5E79',
      light: '#F4EDF2',
      medium: '#B682A5',
      dark: '#34162A'
    }
  };


  private fontSubject = new Subject<any>();

  
  font(font: any) {
    this.fontSubject.next(font);
  }

  getObservable(): Subject<any> {
      return this.fontSubject;
  }

  constructor() { }
}
