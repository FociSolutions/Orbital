import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrbitalServerService {
  constructor(private http: HttpClient) {}
  onServerExport(uri: string, mockDefinition: Blob) {
    return this.http.post(uri, mockDefinition, {
      headers: new HttpHeaders({
        'Access-Control-Allow-Methods': 'GET, POST',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      })
    });
  }
}
