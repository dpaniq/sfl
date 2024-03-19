import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { BehaviorSubject, NEVER, Observable, Subject, catchError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { API_URL } from '@shared/constants/api';

const GET_HEADERS = new HttpHeaders();

const POST_HEADERS = new HttpHeaders({
  'Content-Type': 'application/json',
  Accept: 'application/json',
});

const PATCH_HEADERS = new HttpHeaders({
  'Content-Type': 'application/json',
  Accept: 'application/json',
});

interface GetParams {
  page?: number;
  skip?: number;
  limit?: number;
}

@Injectable({ providedIn: 'root' })
export class HttpService {
  #httpClient = inject(HttpClient);

  get<T>(url: string, params: GetParams = {}): Observable<T> {
    return this.#httpClient.get<T>(API_URL + '/' + url, {
      headers: GET_HEADERS,
      params: {
        ...params,
      },
    });
  }

  post<T>(url: string, data: Partial<T> = {}): Observable<T> {
    return this.#httpClient.post<T>(API_URL + '/' + url, data, {
      headers: POST_HEADERS,
    });
  }

  patch<T>(url: string, data: T): Observable<T> {
    return this.#httpClient.patch<T>(API_URL + '/' + url, data, {
      headers: PATCH_HEADERS,
    });
  }
}
