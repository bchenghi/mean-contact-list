import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { Contact } from '../contact';
import {ContactService} from '../contact.service';
import { UserService } from '../user.service';


@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css'],
  providers: [ContactService]
})
export class ContactsComponent implements OnInit {
  contactForm: FormGroup;
  contacts: Contact[] = [];
  contact: Contact = new Contact();
  first_name: string = '';
  last_name: string = '';
  phone: string = '';
  userId: any = '';
  username: any = '';

  constructor(private contactService: ContactService, private userService: UserService, 
    private formBuilder: FormBuilder, private router: Router) {
    this.userService.user()
    .subscribe(
      data => {
        this.userId = (data as any)._id
        this.username = (data as any).username
      },
      error => this.router.navigate(['/login'])
    )
    this.contactForm = this.formBuilder.group({
      first_name: '',
      last_name: '',
      phone: ''
    });
  }

  addContact(customerData: any) {
    const newContact = {
      first_name: customerData.first_name,
      last_name: customerData.last_name,
      phone: customerData.phone,
      user_id: this.userId
    }
    this.contactService.addContact((newContact as Contact)).subscribe(contact => {
      this.contacts.push((contact as Contact));
      this.contactService.getContacts()
      .subscribe(contacts => {
      this.contacts = contacts;
      this.contactForm.reset();
    });
    });
  }

  deleteContact(id: any) {
    var contacts = this.contacts
    this.contactService.deleteContact(id).subscribe(data => {
      if ((data as any).n == 1) {
        for (var i = 0; i < contacts.length; i++) {
          if (contacts[i]._id == id) {
            this.contacts.splice(i, 1);
            break;
          }
        }
      }
    });
  }

  ngOnInit() {
    this.contactService.getContacts()
    .subscribe(contacts => {
      this.contacts = contacts;
    });
  }

  logout() {
    this.userService.logout()
    .subscribe(
      data => this.router.navigate(['/login']),
      error => console.log(error)
    )
  }

}
