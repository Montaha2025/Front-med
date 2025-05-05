import { Role } from "src/app/shared/enums/role.enum";

export interface UtilisateurUpdateRequest {
    nom: string;
    prenom: string;
    age: number;
    email: string;
    motDePasse: string;
    telephone: string;
    adresse: string;
    role: Role;  
}
