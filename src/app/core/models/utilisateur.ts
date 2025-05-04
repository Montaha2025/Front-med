import { Role } from '../../shared/enums/role.enum';
import { BaseInterface } from './base-interface';

export interface Utilisateur extends BaseInterface {
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
