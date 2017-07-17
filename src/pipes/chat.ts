import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chatFilter',
})
export class ChatPipe implements PipeTransform {
  // ChatPipe
  // Filter chat based on friend's name or username.
  transform(chats: any[], search: string): any {
    if (!chats) {
      return;
    } else if (!search) {
      return chats;
    } else {
      let term = search.toLowerCase();
      return chats.filter(conversation => 
        conversation.friend.name.toLowerCase().indexOf(term) > -1 
        || conversation.friend.username.toLowerCase().indexOf(term) > -1);
    }
  }
}
