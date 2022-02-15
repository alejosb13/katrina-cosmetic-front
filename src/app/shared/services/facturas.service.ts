import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { Factura } from '../models/Factura.models';

const FacturaURL = `${environment.urlAPI}facturas`

@Injectable({
  providedIn: 'root'
})
export class FacturasService {
  constructor(
    private http: HttpClient
  ) { }
    
  headerJson_Token():HttpHeaders{
    // const DataUSerStorage = this.authService.getAuthFromLocalStorage() 
    
    let config = {
      ContentType: 'application/json',
      // 'Authorization' : `bearer ${DataUSerStorage? DataUSerStorage?.access_token: "" }`
    };
    
    return new HttpHeaders(config);
  }
  
  // public methods
  getFacturas(): Observable<any> { 

    return this.http.get(
      FacturaURL, 
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  getFacturaById(Id:number): Observable<any> { 
    const URL = `${FacturaURL}/${Id}`
    
    return this.http.get(
      URL,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }
  
  insertFactura(data:Factura): Observable<any> { 

    return this.http.post<Factura>(
      FacturaURL, 
      data,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }
  
  updateFactura(Id:number,data:Factura): Observable<any> { 
    const URL = `${FacturaURL}/${Id}`
    
    return this.http.put<Factura>(
      URL, 
      data,
      {headers: this.headerJson_Token(), responseType: "json" }
    );
  }

  deleteFactura(id:number): Observable<any> { 
    const URL = `${FacturaURL}/${id}`
    return this.http.delete(
      URL, {headers: this.headerJson_Token()}
    );
  }
}
