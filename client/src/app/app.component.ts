import { Component, inject, OnInit } from '@angular/core';
import {CommonModule} from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Song } from './song';
import { TracksService } from './tracks.service';
import { Observable } from 'rxjs';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [  CommonModule , ReactiveFormsModule],
  template: `
  <section class="content">
    <div class="input">
      <!-- <input #cityName type="text" placeholder="Current City" required> -->
      <button type="submit"  (click)="getTracks()">Click Me</button>
    </div>

  <div *ngFor="let track of trackList" class="track-list"> 
    <a [href]="track.song_url" >
        <div class="track-div">
      <img class="track-image" [src]="track.image_url" alt="Image Url" >
      <div>
        <h2 class="title">{{track.title}}</h2>
        <p class="artists">Artist: {{track.artist_name}}</p>
      </div>
      </div>
    </a>
</div>

  </section>

 
  `,
  styleUrl: "./app.component.css",

})
export class AppComponent {

  trackList: Song[] = [];
  lat: any;
  lng: any;

  trackService: TracksService = inject(TracksService);
  constructor() {
  }

  getTracks = () => {

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
         this.lat = pos.coords.latitude;
         this.lng = pos.coords.longitude;
         this.trackService.getTracks({lat: pos.coords.latitude, lon: pos.coords.longitude}).then((trackList: Observable<Song[]> ) => {   
          trackList.subscribe((tracks: Song[]) => {
            // console.log(tracks)
            this.trackList = tracks;
          });
        });


      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }


  }
}

