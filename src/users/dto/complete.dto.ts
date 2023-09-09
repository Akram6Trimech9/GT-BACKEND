import { IsString, IsNotEmpty } from 'class-validator';
 
export class CompleteInfo {
  id ?: string;
  about: string
   formation : string 
   experience : string 
   hospital  : string 
   service : string 
 }
  