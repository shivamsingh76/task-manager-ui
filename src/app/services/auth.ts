import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/v1/users';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/signin`, { username, password });
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, { username, password });
  }

  saveUserData(data: any): void {
    localStorage.setItem('userData', JSON.stringify(data));
  }

  getUserData(): any {
    const data = localStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
  }

  getToken(): string | null {
    return this.getUserData()?.jwt ?? null;
  }

  getUserId(): string | null {
    return this.getUserData()?.userId ?? null;
  }

  getUsername(): string | null {
    return this.getUserData()?.username ?? null;
  }

  logout(): void {
    localStorage.removeItem('userData');
  }

  isLoggedIn(): boolean {
    return !!this.getUserData();
  }
}
