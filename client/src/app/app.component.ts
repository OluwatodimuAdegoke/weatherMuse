import { Component, inject } from '@angular/core';
import {CommonModule} from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TrackComponent } from './track/track.component';
import { Weather } from './weather';
import { TracksService } from './tracks.service';
import { error } from 'console';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TrackComponent, CommonModule],
  template: `
  <h1>Hello World</h1>
  <!-- <form action="">
    <button>Search</button>
  </form> -->
  <!-- <section class="content">
    <app-track *ngFor="let track of trackList"
                [track]="track"
    ></app-track>
  </section> -->
  <div *ngFor="let track of trackList">
  <!-- Display track properties here. For example: -->
  <h2>{{ track.image_url }}</h2>
  
  <p>{{ track.title }}</p>
</div>
  <h2>End</h2>
    <router-outlet />
  `,
  styles: `
  `,

})
export class AppComponent {
  title = 'homes';
  trackList: Weather[] = [];

  trackService: TracksService = inject(TracksService);
  constructor() {
    this.trackService.getTracks().then((trackList: Weather[] ) => {
   
      this.trackList = trackList;
      console.log(this.trackList);
    }).catch(error => {
      console.error("Error getting tracks",error);
    })
  }
}

