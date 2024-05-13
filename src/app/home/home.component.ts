import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from '../core/services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  payload: string = '202211001';
  constructor(
    private router: Router,
    private electronService: ElectronService
  ) {}

  ngOnInit(): void {
    console.log('HomeComponent INIT');
    this.electronService.ipcRenderer.on('nfc:read', async (event, data) => {
      console.log(data);
    });
    this.electronService.ipcRenderer.on('nfc:write', async (event, message) => {
      console.log(message);
    });
  }

  async write() {
    await this.electronService.ipcRenderer.send('nfc:write', this.payload);
  }
}
