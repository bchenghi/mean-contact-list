import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Contact} from './contact';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http: HttpClient) { }

  getContacts() {
    return this.http.get<Contact[]>('api/contacts', {withCredentials:true});
  }

  addContact(newContact: Contact) {
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post('api/contact', newContact, {headers: headers, withCredentials:true});
  }

  deleteContact(id: string) {
    return this.http.delete('api/contact/' + id, {withCredentials:true});
  }
}
