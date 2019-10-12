import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CalendarModalOptions, CalendarModal, CalendarResult } from 'ion2-calendar';

import { BalanceService } from 'src/app/services/balance.service';
import { Balance, Registro } from 'src/app/interfaces/balance.interface';


@Component({
  selector: 'app-balance',
  templateUrl: './balance.page.html',
  styleUrls: ['./balance.page.scss'],
})
export class BalancePage implements OnInit {

  cargandoCalendar = false;
  calendarioAbierto = false;

  registros: Registro[] = [];
  rango: any;

  venta = 0;
  gasto = 0;
  balance = 0;

  constructor(
    private modalCtrl: ModalController,
    private balanceService: BalanceService,
  ) { }

  ngOnInit() {
    this.openCalendar();
  }

  async openCalendar() {
    this.cargandoCalendar = true;
    const primer: string = await this.balanceService.getPrimerRegistro();
    const parts: any = primer.split('-');
    const primerFecha = new Date(parts[0], parts[1] - 1, parts[2]);
    const options: CalendarModalOptions = {
      title: 'Selecciona el rango',
      from: primerFecha,
      to: new Date(),
      defaultDate: new Date(),
      weekdays: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
      weekStart: 1,
      color: 'dark',
      closeLabel: 'Cancelar',
      doneLabel: 'Aceptar',
      pickMode: 'range'
    };

    const myCalendar = await this.modalCtrl.create({
      component: CalendarModal,
      componentProps: { options }
    });

    myCalendar.present();
    this.calendarioAbierto = true;

    const event: any = await myCalendar.onDidDismiss();
    this.calendarioAbierto = false;
    const date: CalendarResult = event.data;
    console.log(date);
    if (date) {
      this.rango = date;
      this.getBalance(date);
    } else {
      this.cargandoCalendar = false;
    }
  }

  async getBalance(rango) {
    this.registros = await this.balanceService.getBalance(rango);
    if (this.registros.length > 0) {
      this.registros.forEach(registro => {
        Object.values(registro.detalles).forEach((reg: Balance) => {
          this.balance += reg.balance;
          registro.venta += reg.venta;
          registro.gasto += reg.gasto;
          registro.balance += reg.balance;
        });
      });
    }
    console.log(this.balance);
    console.log(this.registros);
  }

}
