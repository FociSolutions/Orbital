import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrbialServerService {
  apiURL = 'https://localhost:5001/api/v1/OrbitalAdmin';

  constructor(private httpClient: HttpClient) {}
}
