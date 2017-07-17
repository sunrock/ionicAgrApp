import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'contactFilter',
})
export class ContactPipe implements PipeTransform {
  // ContactPipe
  // Filter contact by name or username.
  transform(contacts: any[], search: string): any {
    if (!contacts) {
      return;
    } else if (!search) {
      return contacts;
    } else {
      let term = search.toLowerCase();
      return contacts.filter(contact => 
        contact.name.toLowerCase().indexOf(term) > -1 || contact.username.toLowerCase().indexOf(term) > -1);
    }
  }
}
