import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrbitalServerService {
  apiURL = 'https://localhost:5001/api/v1/OrbitalAdmin';

  constructor(private http: HttpClient) {}
}
