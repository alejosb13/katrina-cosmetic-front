
export interface MetodoPago{
    id?: number;
    factura_historial_id: number;
    tipo: number;
    detalle: string;
    estado: number;
    created_at: Date;
    updated_at: Date;

}
export const TiposMetodos:any[] = [
  {
    id: 1,
    nombre: 'Efectivo'
  },
  {
    id: 2,
    nombre: 'Transferencia'
  },
  // {
  //   id: 3,
  //   nombre: 'Tarjeta'
  // },
  // {
  //   id: 4,
  //   nombre: 'Cheque'
  // },

];
