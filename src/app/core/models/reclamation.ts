import { BaseInterface } from "./base-interface";
import { Medecin } from "./medecin";
import { Patient } from "./patient";


export interface Reclamation extends BaseInterface{
  sujet: string;
  dateEnvoi: Date; 
  medecin: Medecin; 
  patient: Patient; 
}
