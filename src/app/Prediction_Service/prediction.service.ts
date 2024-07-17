import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {

  private apiUrl = 'http://localhost:5000/forecast';
  constructor(private http: HttpClient) { }

  getForecast(id: number): Observable<any> {
    let params = new HttpParams().set('url',`http://localhost:8081/api/mesureCC/valByCarteControle/${id}`)
    return this.http.get<any>(this.apiUrl, { params });
  }

  getForecastRes(id: number): Observable<any> {
    let params = new HttpParams().set('url',`http://localhost:8081/api/mesureCC/resByCarteControle/${id}`)
    return this.http.get<any>(this.apiUrl, { params });
  }
}
