import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  // public global_url:any = "http://uat.technologenesis.com/public/api/";

  private baseUrl = 'http://backend.staybook.pk/public/api';

  constructor(private http: HttpClient) { }

  private getToken(): string {
    const token = localStorage.getItem('bearer_token');
    return token !== null && token !== undefined ? token : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvYXBpL2xvZ2luIiwiaWF0IjoxNjg0OTEwMzQ3LCJleHAiOjQ4Mzg1MTAzNDcsIm5iZiI6MTY4NDkxMDM0NywianRpIjoiak1EZU9jSUI0TmNIZUVodyIsInN1YiI6IjEiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.XPwoM9GtXonSbssABY3ObBy0UrHjvkk6dmqxrezd48E';
  }

  private getHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.getToken()}`
    });
    return headers;
  }

  public get(endpoint: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.baseUrl}/${endpoint}`, { headers });
  }

  public post(endpoint: string, data: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.baseUrl}/${endpoint}`, data, { headers });
  }

  public put(endpoint: string, data: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put(`${this.baseUrl}/${endpoint}`, data, { headers });
  }

  public delete(endpoint: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.baseUrl}/${endpoint}`, { headers });
  }
}
