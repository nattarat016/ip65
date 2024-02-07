import { CommonModule } from '@angular/common'
import { Component, Input, ViewChild } from '@angular/core'
import { FormsModule, NgForm } from '@angular/forms'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { faClock, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { TimeagoModule } from 'ngx-timeago'
import { Message } from 'src/app/_models/Message'
import { MessageService } from 'src/app/_services/message.service'
import { NgxLongPress2Module } from 'ngx-long-press2' //

@Component({
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, TimeagoModule, FormsModule, NgxLongPress2Module],
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css'],

})
export class MemberMessagesComponent {
  @Input() username?: string
  @Input() messages: Message[] = []
  faPaperPlane = faPaperPlane;
  faClock = faClock;
  @ViewChild('messageForm') messageForm?: NgForm
  messageContent = ''

  constructor(private messageService: MessageService) { }

  loadMessages() {
    if (!this.username) return

    this.messageService.getMessagesThread(this.username).subscribe({
      next: response => this.messages = response
    })
  }

  ngOnInit(): void {
    this.loadMessages()
  }

  sendMessage() {
    if (!this.username) return
    this.messageService.sendMessage(this.username, this.messageContent).subscribe({
      next: response => {
        this.messages.push(response)
        this.messageForm?.reset()
      }
    })
  }

  onLongPressMessage(id: number) {
    // console.log('delete me, id: ' + id)
    this.messageService.deleteMessage(id).subscribe({
      next: _ => this.messages?.splice(this.messages.findIndex(ms => ms.id === id), 1)
    })
    // this.messages?.splice(this.messages.findIndex(ms => ms.id === id), 1)
  }
}
