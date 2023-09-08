import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommonLibService {
  ab: any;

  bs: any;

  constructor() {
    console.log('CommonLibService');
  }
}
