import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "app/auth/login/service/auth.service";
import { Factura } from "app/shared/models/Factura.model";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";

import { Listado } from "app/shared/services/listados.service";
import {
  FiltrosList,
  Link,
  ListadoModel,
} from "app/shared/models/Listados.model";
import { TypesFiltersForm } from "app/shared/models/FiltersForm";
import { HelpersService } from "app/shared/services/helpers.service";
import { UsuariosService } from "app/shared/services/usuarios.service";
import { Usuario } from "app/shared/models/Usuario.model";

@Component({
  selector: "app-incentivos-list-component",
  templateUrl: "./incentivos-list-component.component.html",
  styleUrls: ["./incentivos-list-component.component.scss"],
})
export class IncentivosListComponentComponent implements OnInit {
  incentivos: any[];
  isLoad: boolean;
  isAdmin: boolean;
  isSupervisor: boolean;
  Factura: Factura;

  userId: number;
  userIdString: string;
  userStore: Usuario[];
  USersNames: string[] = [];

  roleName: string;
  listadoData: ListadoModel<Factura>;
  listadoFilter: FiltrosList = { link: null };
  insentivoSelected: any;
  private Subscription = new Subscription();

  dateIni: string;
  dateFin: string;
  allDates: boolean = true;

  constructor(
    private _Listado: Listado,
    private _AuthService: AuthService,
    private route: ActivatedRoute,
    private NgbModal: NgbModal,
    private _HelpersService: HelpersService,
    private _UsuariosService: UsuariosService
  ) {}

  ngOnInit(): void {
    this.getUsers();
    this.isAdmin = this._AuthService.isAdmin();
    this.isSupervisor = this._AuthService.isSupervisor();
    this.userId = Number(this._AuthService.dataStorage.user.userId);
    this.roleName = String(this._AuthService.dataStorage.user.roleName);
    this.listadoFilter = {
      ...this.listadoFilter,
      estado: 1,
      roleName: this.roleName,
      userId: Number(this._AuthService.dataStorage.user.userId),
      disablePaginate: 0,
      allDates: this.allDates,
    };

    this.setCurrentDate();
    this.asignarValores();
  }

  asignarValores() {
    this.isLoad = true;

    let Subscription = this._Listado
      .getIncentivosHistorial(this.listadoFilter)
      .subscribe(
        (Paginacion) => {
          console.log();

          this.listadoData = { ...Paginacion };
          this.incentivos = [...Paginacion.data];
          this.isLoad = false;
        },
        (error) => {
          this.isLoad = false;
        }
      );
    this.Subscription.add(Subscription);
  }

  BuscarValor() {
    // let camposPorFiltrar:any[] = [
    //   ['cliente','nombreCompleto'],
    //   ['id',],
    // ];

    this.listadoFilter.link = null;
    this.asignarValores();
  }

  openDevolverFactura(content: any, Factura: Factura) {
    this.Factura = Factura;
    this.NgbModal.open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then((result) => {})
      .catch((err) => {});
  }

  FormsValuesDevolucion(incentivoForm: any) {
    // console.log("[DevolucionFacturaForm]", DevolucionProducto);

    Swal.fire({
      title: "Cargando",
      text: "Esto puede demorar un momento.",
      timerProgressBar: true,
      allowEscapeKey: false,
      allowOutsideClick: false,
      allowEnterKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    console.log(incentivoForm);
    if (incentivoForm.id) {
      this._Listado
        .updateIncentivoHistoria(incentivoForm, incentivoForm.id)
        .subscribe((data) => {
          console.log("[response]", data);

          Swal.fire({
            text: "El incentivo fue modificado con exito",
            icon: "success",
          }).then((result) => {
            if (result.isConfirmed) {
              location.reload();
            }
          });
        },()=>{
          Swal.fire({
            text: "Error, verifica que no exista un incentivo para esta fecha",
            icon: "warning",
          })
        });
    } else {
      this._Listado.insertIncentivoHistoria(incentivoForm).subscribe((data) => {
        console.log("[response]", data);

        Swal.fire({
          text: "El incentivo fue insertado con exito",
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed) {
            location.reload();
          }
        });
      },()=>{
        Swal.fire({
          text: "Error, verifica que no exista un incentivo para esta fecha",
          icon: "warning",
        })
      });
    }
  }

  newPage(link: Link) {
    if (link.url == null) return;
    // console.log(link);

    this.listadoFilter.link = link.url;

    this.asignarValores();
  }

  editarIndice(content: any, insentivo: any) {
    this.insentivoSelected = insentivo;
    this.NgbModal.open(content, {
      ariaLabelledBy: "modal-basic-title",
      size: "lg",
    }).result.then(
      (result) => {},
      (reason) => {}
    );
  }

  openFiltros(content: any, size = "md") {
    // console.log(this.mesNewMeta);
    this.listadoFilter.link = null;

    this.NgbModal.open(content, {
      ariaLabelledBy: "modal-basic-title",
      size,
    }).result.then(
      (result) => {},
      (reason) => {}
    );
  }

  ngOnDestroy() {
    this.Subscription.unsubscribe();
  }

  limpiarFiltros() {
    this.Subscription.unsubscribe();
  }

  aplicarFiltros() {
    this.listadoFilter = {
      ...this.listadoFilter,
      dateIni: this.dateIni,
      dateFin: this.dateFin,
      userId: this.userId,
      allDates: this.allDates,
    };
    this.asignarValores();
  }

  setCurrentDate() {
    let current = this._HelpersService.changeformatDate(
      this._HelpersService.currentDay(),
      "MM/DD/YYYY",
      "YYYY-MM-DD"
    );
    let month = this._HelpersService.changeformatDate(
      this._HelpersService.currentDay(),
      "MM/DD/YYYY",
      "MM"
    );
    let year = this._HelpersService.changeformatDate(
      this._HelpersService.currentDay(),
      "MM/DD/YYYY",
      "YYYY"
    );
    let rangoMonth = this._HelpersService.InicioYFinDeMes(current);

    this.dateIni = `${year}-${month}-01`;
    this.dateFin = `${year}-${month}-${rangoMonth.ultimoDiaDelMes}`;

    this.listadoFilter = {
      ...this.listadoFilter,
      dateIni: this.dateIni,
      dateFin: this.dateFin,
    };
  }

  getUsers() {
    this._UsuariosService.getUsuario().subscribe((usuarios: Usuario[]) => {
      this.userStore = usuarios;
      this.USersNames = usuarios.map(
        (usuario) => `${usuario.id} - ${usuario.name} ${usuario.apellido}`
      );

      // this.resetUser()
    });
  }
}
