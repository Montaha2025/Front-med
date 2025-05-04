import { EtatRendezVous } from "src/app/shared/enums/etat-rendezVous";
import { Medecin } from "./medecin";
import { Patient } from "./patient";
import { TypeRendezVous } from "src/app/shared/enums/type-RendezVous";
import { BaseInterface } from "./base-interface";

export interface RendezVous extends BaseInterface {

    id: number;
    date: Date;   
    lieu: string;
    motif: string;
    etatRendezVous: EtatRendezVous;  
    typeRendezVous: TypeRendezVous;  
    patient: Patient;
    medecin: Medecin;
    urlTeleconsultation?: string;  // Optional, for TELECONSULTATION only
}
