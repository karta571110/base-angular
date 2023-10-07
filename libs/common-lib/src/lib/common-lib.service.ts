import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommonLibService {
  ab = 's';

  bs = 'd';

  constructor() {
    console.log('CommonLibService');
    // const value3 = !(this.bs === null);
  }
}
