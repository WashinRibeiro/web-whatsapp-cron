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
    chatId: ['', [Validators.required]],
    body: ['', [Validators.required]],
    time: ['', [Validators.required]],
  });

  chats: IChat[] = [];
  dataSource: ISchedule[] = []
  displayedColumns: string[] = ['chatId', 'body', 'time'];

  constructor(private _fb: FormBuilder, private _chatsService: ChatsService) {}

  ngOnInit(): void {
    this.getChats()
  }

  getChats() {
    this._chatsService.getChats().subscribe((data) => {
      this.chats = data;
    })
  }

  addSchedule(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this._postSchedule();
  }

  private _postSchedule() {
    const schedule = {
      ...this.form.value,
      time: `${this.form.value.time}:00`,
    }
    
    this._chatsService.postSchedule(schedule as ISchedule).subscribe((data) => {
      this.dataSource.push(this.form.value as ISchedule);
      this.dataSource = [...this.dataSource];

      this.form.reset();
    })
  }
}
