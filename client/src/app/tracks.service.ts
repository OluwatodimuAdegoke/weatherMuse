import { Injectable, NgModule } from '@angular/core';
import { Song } from './song';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class TracksService {
  url = 'http://localhost:3000/tracks';


  constructor(private http: HttpClient) { }
  async getTracks(): Promise<Observable<Song[]>> {
    return this.http.get<Song[]>(this.url);
  }

}
