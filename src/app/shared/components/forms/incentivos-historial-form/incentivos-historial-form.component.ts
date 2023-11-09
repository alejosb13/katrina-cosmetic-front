import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { Frecuencia } from "app/shared/models/Frecuencia.model";
import { FrecuenciaService } from "app/shared/services/frecuencia.service";
import { ValidFunctionsValidator } from "app/shared/validations/valid-functions.validator";
import Swal from "sweetalert2";
import { AuthService } from "app/auth/login/service/auth.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { UsuariosService } from "app/shared/services/usuarios.service";
import { Usuario } from "app/shared/models/Usuario.model";
import { Listado } from "../../../services/listados.service";
import { HelpersService } from "app/shared/services/helpers.service";

@Component({
  selector: "app-incentivos-historial-form",
  templateUrl: "./incentivos-historial-form.component.html",
  styleUrls: ["./incentivos-historial-form.component.scss"],
})
export class IncentivosHistorialFormComponent implements OnInit {
  IncentivoForm: UntypedFormGroup;
  EstadoForm: UntypedFormGroup;

  daysOfWeek: string[];
  loadInfo: boolean = false;
  isAdmin: boolean = false;
  isSupervisor: boolean = false;
  Usuarios: Usuario[];
  @Input() incentivo?: any;
  @Output() FormsValues = new EventEmitter<Frecuencia>();

  constructor(
    private fb: UntypedFormBuilder,
    public _FrecuenciaService: FrecuenciaService,
    public _ListadoService: Listado,
    private _AuthService: AuthService,
    private _modalService: NgbModal,
    private _UsuariosService: UsuariosService,
    private _HelpersService: HelpersService
  ) {}

  ngOnInit(): void {
    this._UsuariosService.getUsuario().subscribe((usaurios: Usuario[]) => {
      this.Usuarios = [...usaurios];
    });

    this.isAdmin = this._AuthService.isAdmin();
    this.isSupervisor = this._AuthService.isSupervisor();

    this.definirValidaciones();
    this.definirValidacionesEstado();

    if (this.incentivo) this.setFormValues();

    console.log(this.incentivo);
  }

  definirValidaciones() {
    this.IncentivoForm = this.fb.group({
      user_id: [
        "",
        Validators.compose([
          Validators.required,
          // Validators.maxLength(80),
        ]),
      ],
      porcentaje: ["", Validators.compose([Validators.required])],
      fecha_indice: ["", Validators.compose([Validators.required])],
    });
  }

  editarIndice(content: any) {
    this._modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {},
        (reason) => {}
      );
  }

  get formularioStadoControls() {
    return this.EstadoForm.controls;
  }

  definirValidacionesEstado() {
    this.EstadoForm = this.fb.group({
      estado: [1, Validators.compose([Validators.required])],
    });
  }

  setFormValues() {
    // this.loadInfo = true;

    this.IncentivoForm.setValue({
      user_id: this.incentivo.user_id,
      porcentaje: this.incentivo.porcentaje,
      fecha_indice: this._HelpersService.changeformatDate(
        this.incentivo.fecha_indice,
        "YYYY-MM-DD",
        "YYYY-MM"
      ),
    });

    // this._ListadoService
    //   .getIncentivosHistorialByID(this.incentivo.id)
    //   .subscribe((incentivo: any) => {

    //     this.loadInfo = false;
    //   });
  }

  get formularioControls() {
    return this.IncentivoForm.controls;
  }

  EnviarFormulario() {
    // console.log(this.editarClienteForm);
    // console.log(this.formularioControls);
    // console.log(this.ProductForm.getRawValue());

    if (this.IncentivoForm.valid) {
      let frecuencia = {} as any;
      if (this.incentivo) frecuencia.id = this.incentivo.id;
      frecuencia.user_id = this.formularioControls.user_id.value;
      frecuencia.porcentaje = Number(this.formularioControls.porcentaje.value);
      frecuencia.fecha_indice = this._HelpersService.changeformatDate(
        this.formularioControls.fecha_indice.value,
        "YYYY-MM",
        "YYYY-MM-DD"
      ),
      // console.log(frecuencia);

      this.FormsValues.emit(frecuencia);
    } else {
      Swal.fire({
        text: "Complete todos los campos obligatorios",
        icon: "warning",
      });
    }
  }
}
