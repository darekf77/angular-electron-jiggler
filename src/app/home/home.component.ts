import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from '../core/services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  height = window.innerHeight;
  width = window.innerWidth;
  niga = ''
  get ipcRenderer() {
    return this.electronService.ipcRenderer;
  }
  jigglerEnable = false;

  constructor(private router: Router, private electronService: ElectronService) { }

  ngOnInit(): void {
    console.log('HomeComponent INIT');
    this.electronService.ipcRenderer.on('loggg', (event, data) => {
      console.log('hello')
    })
    //

  }


  toogleEnable() {
    console.log('TOOGLE')
    this.jigglerEnable = !this.jigglerEnable;
    // // this.electronService.ipcRenderer.send('jiggle', 'helolas');
    // console.log(this.ipcRenderer.sendSync('set-title', this.niga))
    this.ipcRenderer.send('set-title', this.niga)
  }
}
