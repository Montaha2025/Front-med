import { Utilisateur } from './utilisateur.model';

export interface Medecin extends Utilisateur {
  specialite: string;
  description: string;
  
}
