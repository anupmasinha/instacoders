import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  langStr = new EventEmitter<string>();
  
  constructor() { }
}
