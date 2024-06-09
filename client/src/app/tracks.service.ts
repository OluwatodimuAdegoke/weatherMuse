import { Injectable } from '@angular/core';
import { Weather } from './weather';

@Injectable({
  providedIn: 'root'
})
export class TracksService {
  url = 'http://localhost:3000/';

  async getTracks(): Promise<Weather[]> {
    const data = await fetch(this.url);
    const jsonData = await data.json();
    // console.log("Here");
    // console.log("Also",data);
    // console.log(jsonData);
    return (jsonData) ;
  }
  constructor() { }
}
