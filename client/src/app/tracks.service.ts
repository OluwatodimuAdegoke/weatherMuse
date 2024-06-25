import { Injectable, NgModule } from '@angular/core';
import { Song } from './song';
import { Weather } from './weather';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, take, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root',
})

export class TracksService {
  url = 'http://localhost:3000/tracks';
  weatherUrl = 'http://localhost:3000/weather';

  constructor(private http: HttpClient) {

   }

  async getTracks(address: any): Promise<Observable<Song[]>> {
    
      return this.http.get<Song[]>(this.url,{
        params: {
          city: address.city,
        }
      });
  }

  async getWeather(address: any): Promise<Observable<Weather>>{
    return this.http.get<Weather>(this.weatherUrl,{
      params: {
        city: address.city,
      }
    }).pipe(
      catchError((error) => {
        const errorMessage = error.error?.message || error.statusText || 'Unknown error';
        return throwError(() => new Error(error.error.message));
   
      })
    )
  }


}