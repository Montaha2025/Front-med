import { Role } from '../enums/role.enum';

export interface Utilisateur {
  id?: number;
  nom: string;
  prenom: string;
  age: number;
  email: string;
  motDePasse: string;
  telephone: string;
  adresse: string;
  active?: boolean;
  role: Role;
}
