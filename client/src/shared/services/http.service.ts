import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@environment/environment.development';
import { Observable } from 'rxjs';

const API_URL = environment.API_KEY;

const GET_HEADERS = new HttpHeaders();

const POST_HEADERS = new HttpHeaders({
  'Content-Type': 'application/json',
  Accept: 'application/json',
});

const PATCH_HEADERS = new HttpHeaders({
  'Content-Type': 'application/json',
  Accept: 'application/json',
});

type GetParams = {
  page?: number;
  skip?: number;
  limit?: number;
};

@Injectable({ providedIn: 'root' })
export class HttpService {
  #httpClient = inject(HttpClient);

  get<T, Params = Record<string, any>>(
    url: string,
    params: GetParams & Partial<Params> = {},
  ): Observable<T> {
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

  put<T>(url: string, data: T): Observable<T> {
    return this.#httpClient.put<T>(API_URL + '/' + url, data, {
      headers: PATCH_HEADERS,
    });
  }
}
