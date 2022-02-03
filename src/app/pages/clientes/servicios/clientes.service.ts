import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Cliente } from '../models/Cliente.model';


const ClienteURL = `${environment.urlAPI}cliente`

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(
    private http: HttpClient
  ) {}

  
  headerJson_Token():HttpHeaders{
    // const DataUSerStorage = this.authService.getAuthFromLocalStorage() 
    
    let config = {
      ContentType: 'application/json',
      // 'Authorization' : `bearer ${DataUSerStorage? DataUSerStorage?.access_token: "" }`
    };
    
    return new HttpHeaders(config);
  }
  
  
  total:number = 0
  busqueda:string = ""
  datosTablaStorage:Cliente[] = []
  
  buscar(datosTabla:any[]){
    let busqueda = this.busqueda
        
    // filter
    let result = datosTabla.filter(valoresFila => this.filtrarBusqueda(valoresFila, busqueda));
    
    this.datosTablaStorage = result
    this.total = result.length;
  }
  
  filtrarBusqueda(valoresFila:any,busqueda:string):boolean {
    let busquedaMinuscula = busqueda.toLowerCase()
    let tieneCoincidencia = false
    
    // console.log(valoresFila);
    let valores = Object.values(valoresFila)
    // let valores = valoresFila
    
    // debugger
    valores.map((valorFilaDatatableObject:any)=>{
      if(valorFilaDatatableObject.toString().toLowerCase().includes(busquedaMinuscula)) tieneCoincidencia = true
    })
    
    return tieneCoincidencia
  }
  
  // public methods
  getCliente(): Observable<any> { 

    return this.http.get(
      ClienteURL, 
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }
}
