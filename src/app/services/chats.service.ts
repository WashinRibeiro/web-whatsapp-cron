import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IChat } from '../models/chats';
import { ISchedule } from '../models/schedule';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {
  
  apiURLJsonServer = 'http://localhost:3006';
  apiURLChats = 'http://localhost:3007';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) { }

  getChats(): Observable<IChat[]> {
    return this.http.get<IChat[]>(this.apiURLChats + '/chats')
  }

  postSchedule(schedule: ISchedule): Observable<void> {
    return this.http.post<void>(this.apiURLJsonServer + '/schedules', schedule, this.httpOptions)
  }
}
