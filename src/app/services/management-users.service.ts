import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ManagementUsersService {

  private apiUrl = 'http://127.0.0.1:8000/api/'; // Reemplaza con tu URL de la API

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}customUser?per_page=2`);
  }

  get(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/datos/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/datos`, data);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/datos/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/datos/${id}`);
  }
}
