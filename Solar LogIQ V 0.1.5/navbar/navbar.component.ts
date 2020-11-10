import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { Location } from "@angular/common";
import { AuthService } from 'src/app/pages/auth/auth.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, AfterViewInit {
  @ViewChild('activeOnscbPage') activeOnscbPage:ElementRef;
  onActiveScb;
  onActiveHome;
  onActiveInverter;
  onActiveWMS;
  onActiveReport;
  date: Date;

  constructor(private router: Router, public location: Location, public renderer: Renderer2, private authSrvice: AuthService) {
    console.log('OutlineComponent.............')
    setInterval(() => {
      this.date = new Date()
      // this.date.toLocaleString()
    }, 1000);

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
       let path = this.location.path();
       if(path.includes('scb')){
         this.onActiveScb = true;
       }else{
        this.onActiveScb = false;
       }
       if(path.includes('home')){
          this.onActiveHome = true;
       }else{
          this.onActiveHome = false;
       }

       if(path.includes('inverter')){
        this.onActiveInverter = true;
       }else{
         this.onActiveInverter = false;
       }

       if(path.includes('wms')){
         this.onActiveWMS = true;
       }else{
        this.onActiveWMS = false;
       }

       if(path.includes('report')){
        this.onActiveReport = true;
      }else{
       this.onActiveReport = false;
      }

      }
    })
   }

  ngOnInit(): void {
    // console.log('Outline.........')
  }


  logout() {
    this.authSrvice.logout()
  }

//  private onActivePage(){
//     this.activeOnscbPage.nativeElement.style["border-bottom"] = "4px solid #00ffff";
//     this.activeOnscbPage.nativeElement.style["border-right"] = "2px solid white";
//   }

  ngAfterViewInit(){
    // this.renderer.setStyle(this.activeOnscbPage.nativeElement, 'color', 'yellow')
    
    // this.activeOnscbPage.nativeElement.style["border-bottom"] = "4px solid #00ffff";
    // this.activeOnscbPage.nativeElement.style["border-right"] = "2px solid white";
  }
    // this.activeOnscbPage.nativeElement.style["color"] = "white";
    // this.activeOnscbPage.nativeElement.classList = 'border-bottom '
    // this.activeOnscbPage.nativeElement.classList = 'text-white'

}
