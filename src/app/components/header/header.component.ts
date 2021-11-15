import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input('title') titleToUse;
  @Input('back') backToUse;
  @Input('backHome') backToHome;

  title: string;
  backTo:string;
  backHome: string;
 
  
  constructor(private router:Router,private location: Location) { }


  
  ngOnInit() {
    this.title = this.titleToUse;
    this.backHome = this.backToHome;
    this.backTo = this.backToUse;
  }

  goHome(){
    this.router.navigate(["/tabs/tab1"]);
  }

  goBack() {
    //this.router.navigateByUrl(this.backTo);
    this.location.back();

}

}
