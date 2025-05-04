import { Medecin } from "./medecin";
import { Patient } from './patient';
import { DossierMedical } from "./dossier-medical";
import { Imc } from "./imc";
import { RythmeCardiaque } from "./rythme-cardiaque";
import { TensionArterielle } from "./tension-arterielle";
import { BaseInterface } from "./base-interface";

export interface Suivi extends BaseInterface {
  dateMesure: Date;  
  imc: Imc;  
  rythmeCardiaque: RythmeCardiaque;  
  tensionArterielle: TensionArterielle; 
  medecin: Medecin;  
  patient: Patient;  
  dossierMedical: DossierMedical; 
}
