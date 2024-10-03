import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({ providedIn: 'root' })
export class GifsService {
  public gifsList: Gif[] = [];

  private _tagsHistory: string[] = [];
  private apiKey:string = 'VNAofWb3evlS1abJQXTdlRBHo4yZoS5F';
  private apiKeyUrl: string = 'https://api.giphy.com/v1/gifs';

  constructor(private http: HttpClient) {
    this.loadLocalStorage();
  }

  get tagsHistory() {
    return [...this._tagsHistory];
  }

  private organizeHistory(tag: string): void {
    tag = tag.toLowerCase().trim();

    if(this._tagsHistory.includes(tag)){
      this._tagsHistory = this._tagsHistory.filter(oldtag => oldtag !== tag);
    }

    this._tagsHistory.unshift(tag);
    this._tagsHistory = this._tagsHistory.slice(0, 10);
    this.saveLocalStorage();
  }

  private saveLocalStorage(): void{
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage():void{
    const history = localStorage.getItem('history');

    if(history){
      this._tagsHistory.push(...JSON.parse(history));

      if(this._tagsHistory.length > 0){
        this.searchTag(this._tagsHistory[0]);
      }
    }
  }

  searchTag(tag: string): void {
    if (tag.trim().length === 0) {
      return;
    }
    this.organizeHistory(tag);

    const params = new HttpParams()
    .set('api_key', this.apiKey)
    .set('limit', '10')
    .set('q', tag);

    this.http.get<SearchResponse>(`${this.apiKeyUrl}/search`, {params})
    .subscribe(resp => {
      this.gifsList = resp.data;
    });
    // fetch(`https://api.giphy.com/v1/gifs/search?api_key=${this.apiKey}&q=${tag}&limit=10`)
    // .then(resp => resp.json())
    // .then(data => console.log(data))

  }
}
