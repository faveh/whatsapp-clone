import { Component, OnInit } from '@angular/core';
import { Chats, Messages } from 'api/collections';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { Chat, MessageType } from 'api/models';
import { NavController } from 'ionic-angular';
import { MessagesPage } from '../messages/messages';

@Component({
    templateUrl: 'chats.html'
})
export class ChatsPage implements OnInit{
    chats;
 constructor(private navCtrl: NavController) {
}
  showMessages(chat): void {
    this.navCtrl.push(MessagesPage, {chat});
  }
      ngOnInit() {
    this.chats = Chats
      .find({}) 
      .mergeMap((chats: Chat[]) =>
        Observable.combineLatest(
          ...chats.map((chat: Chat) =>
            Messages
              .find({chatId: chat._id})
              .startWith(null)
              .map(messages => {
                if (messages) chat.lastMessage = messages[0];
                return chat;
              })
          )
        )
      ).zone();
      }
  removeChat(chat: Chat): void {
 Chats.remove({_id: chat._id}).subscribe(() => {
    });
  }
}    
