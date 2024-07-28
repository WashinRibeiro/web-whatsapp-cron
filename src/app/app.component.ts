import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IChat } from './models/chats';
import { ISchedule } from './models/schedule';
import { ChatsService } from './services/chats.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  form = this._fb.group({
    id: [''],
    chatId: ['', [Validators.required]],
    chatName: [''],
    body: ['', [Validators.required]],
    time: ['', [Validators.required]],
  });

  chats: IChat[] = [];
  dataSource: ISchedule[] = [];
  displayedColumns: string[] = ['chatName', 'body', 'time', 'actions'];

  constructor(private _fb: FormBuilder, private _chatsService: ChatsService) {}

  ngOnInit(): void {
    this.getChats();
    this.getSchedules();
  }

  getChats() {
    this._chatsService.getChats().subscribe((data) => {
      this.chats = data;
    });
  }

  getSchedules() {
    this._chatsService.getSchedules().subscribe((data) => {
      this.dataSource = data;
    });
  }

  editSchedule(schedule: any) {
    this.form.patchValue(schedule);
  }

  updateSchedule(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this._putSchedule();
  }

  deleteSchedule(schedule: ISchedule) {
    if (!schedule.id) return;

    this._chatsService.deleteSchedule(schedule.id).subscribe((data) => {
      this.dataSource = this.dataSource.filter(
        (item) => item.id !== schedule.id
      );
    });
  }

  selectChat(chat: IChat) {
    this.form.patchValue({
      chatName: chat.name,
    });
  }

  saveSchedule() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.form.value.id) {
      this._putSchedule();
    } else {
      this._postSchedule();
    }
  }

  private _postSchedule() {
    const schedule = {
      ...this.form.value,
      time: this._ensureTimeFormat(this.form.value.time as string),
    };

    this._chatsService.postSchedule(schedule as ISchedule).subscribe((data) => {
      this.dataSource.push(this.form.value as ISchedule);
      this.dataSource = [...this.dataSource];

      this.getSchedules();
      this.form.reset();
    });
  }

  private _putSchedule() {
    const schedule = {
      ...this.form.value,
      time: this._ensureTimeFormat(this.form.value.time as string),
    };

    this._chatsService
      .updateSchedule(schedule as ISchedule)
      .subscribe(() => {
        this.form.reset();
        this.getSchedules();
      });
  }

  private _ensureTimeFormat(dateTime: string): string {
    const dateTimePattern = /^T\d{2}:\d{2}:\d{2}$/; // Formato TXX:XX:XX
  
    if (dateTimePattern.test(dateTime)) {
      return dateTime; // Já está no formato correto
    } else {
      return `${dateTime}:00`; // Adiciona :00 no final
    }
  }
}
