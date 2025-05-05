import { Role } from '../../shared/enums/role.enum';
import { BaseInterface } from './base-interface';

export interface Utilisateur extends BaseInterface {
  id?: number;
  nom: string;
  prenom: string;
  age: number;
  email: string;
  motDePasse?: string;
  telephone: string;
  adresse: string;
  active?: boolean;
  role: Role;
}
// Requête pour la création d'un utilisateur
export interface UtilisateurRequest {
  nom: string;
  prenom: string;
  age: number;
  email: string;
  motDePasse: string;
  telephone: string;
  adresse: string;
  role: Role;
}
// Réponse renvoyée par l'API 
export interface UtilisateurResponse {
  id: number;
  nom: string;
  prenom: string;
  age: number;
  email: string;
  telephone: string;
  adresse: string;
  role: Role;
}

