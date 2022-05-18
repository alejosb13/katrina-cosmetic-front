import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'app/auth/login/service/auth.service';
import { Factura } from 'app/shared/models/Factura.model';
import { CarteraDate, CarteraDateBodyForm } from 'app/shared/models/Logistica.model';
import { Usuario } from 'app/shared/models/Usuario.model';
import { HelpersService } from 'app/shared/services/helpers.service';
import { LogisticaService } from 'app/shared/services/logistica.service';
import { TablasService } from 'app/shared/services/tablas.service';
import { UsuariosService } from 'app/shared/services/usuarios.service';
import { environment } from 'environments/environment';
import { merge, Observable, OperatorFunction, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-mora60-a90',
  templateUrl: './mora60-a90.component.html',
  styleUrls: ['./mora60-a90.component.css']
})
export class Mora60A90Component implements OnInit {

  page = 1;
  pageSize = environment.PageSize;
  collectionSize = 0;
  isLoad:boolean
  isAdmin:boolean

  Data: any[];
  filtros: any = {};
  dateIni: string;
  dateFin: string;
  tipoVenta = 1 //credito
  status_pagado = 0 // por pagar
  allDates:boolean = false
  // user:number

  @ViewChild('instance', {static: true}) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  USersNames:string[] = []
  userId: number;
  userIdString: string;
  userStore: Usuario[];

  constructor(
    private _TablasService:TablasService,
    private _AuthService:AuthService,
    private _LogisticaService: LogisticaService,
    private NgbModal: NgbModal,
    private _HelpersService: HelpersService,
    private _UsuariosService: UsuariosService,
  ) {}

  ngOnInit(): void {
    this.isAdmin = this._AuthService.isAdmin()
    this.userId = Number(this._AuthService.dataStorage.user.userId);


    if(this.isAdmin){
      this.getUsers();
    }

    // this.setCurrentDate();
    this.aplicarFiltros();
    // this.asignarValores()
  }


  asignarValores(){
    this.isLoad = true
    let bodyForm: CarteraDateBodyForm = {
      dateIni: this.filtros.dateIni,
      dateFin: this.filtros.dateFin,
      userId: this.filtros.userId,
      tipo_venta: this.filtros.tipo_venta,
      status_pagado: this.filtros.status_pagado,
      allDates: this.filtros.allDates,
    };

    this._LogisticaService.getMora60A90(bodyForm).subscribe((data:CarteraDate)=> {
      console.log(data);
      this.Data = [...data.factura]
      this._TablasService.datosTablaStorage = [...data.factura]
      this._TablasService.total = data.factura.length
      this._TablasService.busqueda = ""

      this.refreshCountries()
      this.isLoad =false
    },(error)=>{
      this.isLoad =false
    })
  }

  refreshCountries() {
    this._TablasService.datosTablaStorage = [...this.Data]
    .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  BuscarValor(){
    let camposPorFiltrar:any[] = [
      ['user','apellido'],
      ['user','name'],
      ['cliente','nombreCompleto'],
      ['cliente','nombreEmpresa'],
    ];

    this._TablasService.buscarEnCampos(this.Data,camposPorFiltrar)

    if(this._TablasService.busqueda ==""){this.refreshCountries()}

  }



  getUsers(){
    this._UsuariosService.getUsuario().subscribe((usuarios:Usuario[]) => {
      this.userStore = usuarios
      this.USersNames = usuarios.map(usuario => `${ usuario.id } - ${ usuario.name } ${ usuario.apellido }`)

      this.resetUser()
    })
  }

  setCurrentDate() {
    let current    = this._HelpersService.changeformatDate(this._HelpersService.currentDay(),'MM/DD/YYYY',"YYYY-MM-DD")
    let month      = this._HelpersService.changeformatDate(this._HelpersService.currentDay(),'MM/DD/YYYY',"MM")
    let year       = this._HelpersService.changeformatDate(this._HelpersService.currentDay(),'MM/DD/YYYY',"YYYY")
    let rangoMonth = this._HelpersService.InicioYFinDeMes(current)

    this.dateIni = `${year}-${month}-01`;
    this.dateFin = `${year}-${month}-${rangoMonth.ultimoDiaDelMes}`;

    this.filtros = {
      dateIni: this.dateIni,
      dateFin: this.dateFin,
    };
  }



  openFiltros(content: any) {
    this.NgbModal.open(content, {
      ariaLabelledBy: "modal-basic-title",
    }).result.then(
      (result) => {},
      (reason) => {}
    );
  }

  resetUser(){
    this.userId = Number(this._AuthService.dataStorage.user.userId);
    this.userStore.map(usuario => {
      if(usuario.id == this.userId){
        this.userIdString = `${ usuario.id } - ${ usuario.name } ${ usuario.apellido }`
      }
    })
  }

  limpiarFiltros() {
    this.setCurrentDate();
    this.tipoVenta = 1
    this.status_pagado = 0 // por pagar

    if(this.isAdmin) this.resetUser();

    console.log(this.filtros);
  }

  aplicarFiltros() {
    console.log(this.allDates);

    if(!this.dateIni || !this.dateFin) this.setCurrentDate() // si las fechas estan vacias, se setean las fechas men actual

    if(this._HelpersService.siUnaFechaEsIgualOAnterior(this.dateIni,this.dateFin)) this.setCurrentDate() // si las fecha inicial es mayor a la final, se setean las fechas mes actual

    this.filtros = {
      dateIni: this.dateIni,
      dateFin: this.dateFin,
      userId : this.userId,
      tipo_venta : this.tipoVenta,
      status_pagado : this.status_pagado,
      allDates: this.allDates,
    };

    this.asignarValores()
  }


  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    // const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$).pipe(
      map(term => (term === '' ? [...this.USersNames]
        : [...this.USersNames].filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }


  dataChangedUser(element:string) {
    // console.log(element);
    if(element.includes("-")){
      let split:string[] = element.split("-")
      let id = Number(split[0].trim())

      console.log("IdUsuario",id);
      this.userId = id
      // this.userIdString = element
      // console.log(this.cliente);


    }
  }
}