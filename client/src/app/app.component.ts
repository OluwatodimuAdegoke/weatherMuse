import { Component, inject, OnInit } from '@angular/core';
import {CommonModule} from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Song } from './song';
import { TracksService } from './tracks.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [  CommonModule],
  template: `
  <form action="">
    <button>Search</button>
  </form>
  <section class="content">
  <ul>
  <li *ngFor="let track of trackList"> 
    <a [href]="track.song_url">
      <div class="track-div">
    <img class="track-image" [src]="track.image_url" alt="Image Url" >
    <h2 class="title">{{track.title}}</h2>
    <p class="artists">{{track.artist_name}}</p>
    </div>
    </a>
  </li>
</ul>
  </section>

 
  `,
  styles: [`
    .content {
      margin: 20px;
      background-color: #f5f5f5;
      padding: 20px;
      border-radius: 5px;
    }
    button {
      background-color: #3f51b5;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    button:hover {
      background-color: #303f9f;
    }
  .track-image {
    height: 200px;
    width: 200px;
    object-fit: fill;
    border-radius: 30px 30px 30px 30px ;
  }
  `],

})
export class AppComponent {

  trackList: Song[] = [];

  trackService: TracksService = inject(TracksService);
  constructor() {
    this.trackService.getTracks().then((trackList: Observable<Song[]> ) => {   
      trackList.subscribe((tracks: Song[]) => {
        this.trackList = tracks;
      });
    });

  }



}

