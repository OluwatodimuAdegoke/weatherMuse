import { Component,Input } from '@angular/core';
import { Weather } from '../weather';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-track',
  standalone: true,
  imports: [],
  template: `
  <section class="tracks">
    <a [href]="track.song_url">
    <img class="track-image" [src]="track.image_url" alt="Image Url" >
    <h2 class="title">{{track.title}}</h2>
    <p class="artists">{{track.artist_name}}</p>
    </a>

</section>
  `,
  styles: `
  .tracks {
    background: var(--accent-color);
  border-radius: 30px;
  padding-bottom: 30px;
  }
  .track-image {
    height: 200px;
    width: 200px;
    object-fit: fill;
    border-radius: 30px 30px 30px 30px ;
  }
  `
})
export class TrackComponent {
  @Input() track!: Weather;

}
