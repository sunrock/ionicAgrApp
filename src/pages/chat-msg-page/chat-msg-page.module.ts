import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatMsgPage } from './chat-msg-page';

@NgModule({
  declarations: [
    ChatMsgPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatMsgPage),
  ],
  exports: [
    ChatMsgPage
  ]
})
export class ChatMsgPageModule {}
