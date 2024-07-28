import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IChat } from '../models/chats';
import { ISchedule } from '../models/schedule';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  apiURLChats = 'http://localhost:3007';
  apiURLJsonServer = 'http://localhost:3006';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  getChats(): Observable<IChat[]> {
    return this.http.get<IChat[]>(this.apiURLChats + '/chats');
  }

  getSchedules(): Observable<ISchedule[]> {
    return this.http.get<ISchedule[]>(this.apiURLJsonServer + '/schedules');
  }

  postSchedule(schedule: ISchedule): Observable<void> {
    return this.http.post<void>(
      this.apiURLJsonServer + '/schedules',
      schedule,
      this.httpOptions
    );
  }

  updateSchedule(schedule: ISchedule): Observable<void> {
    return this.http.put<void>(
      `${this.apiURLJsonServer}/schedules/${schedule.id}`,
      schedule,
      this.httpOptions
    );
  }

  deleteSchedule(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiURLJsonServer}/schedules/${id}`,
      this.httpOptions
    );
  }
}
