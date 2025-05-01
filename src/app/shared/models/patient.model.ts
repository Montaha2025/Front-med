import { Utilisateur } from './utilisateur.model';

export interface Patient extends Utilisateur {
  dateNaissance: Date;
  numeroDossier: string;
  sexe: string;
  
}
