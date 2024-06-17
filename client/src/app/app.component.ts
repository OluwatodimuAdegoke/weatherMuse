import { Component, inject, OnInit } from '@angular/core';
import {CommonModule} from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Song } from './song';
import { TracksService } from './tracks.service';
import { Observable } from 'rxjs';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { Weather } from './weather';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [  CommonModule , ReactiveFormsModule],
  template: `
  <section class="content">
    <div class="header">
      <div class="input">
        <input #cityName type="text" placeholder="Current City" required>
        <button type="submit"  (click)=" getTracks(cityName.value) ">Click Me</button>
      </div>

      <div *ngIf="weather" class="weather-div">
      
        <p class="city">{{weather.city}}, {{weather.country}}</p>
    
        <div class="icon-div">
          <div>
            <img class="weather-icon" [src]="'http://openweathermap.org/img/wn/' + weather.icon + '.png'" alt="Weather Icon" >
            <p class="temp">{{weather.temperature.toPrecision(4)}}°C</p>
          </div>
          <div>
            <p class="weather">{{weather.weather_main}}</p>
            <p class="description">{{weather.weather_description}}</p>
          </div>
        </div>
      </div>
    </div>




  <div *ngFor="let track of trackList" class="track-list"> 
    <a [href]="track.song_url" >
        <div class="track-div">
      <img class="track-image" [src]="track.image_url" alt="Image Url" >
      <div class="details">
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
  weather: Weather | undefined;

  trackService: TracksService = inject(TracksService);
  constructor() {
  }

  getTracks = (city: String) => {
    this.trackService.getTracks({city: city}).then((trackList: Observable<Song[]>) => {
      trackList.subscribe((tracks: Song[]) => {
        this.trackList = tracks;
      })
    }).then(() => {
      this.trackService.getWeather({city: city}).then((weather: Observable<Weather>) => {
        weather.subscribe((weather: Weather) => {
          this.weather = weather;
        })
      })
    }).catch((error) => {
      console.log(error);
      return;
    })

  }
}

