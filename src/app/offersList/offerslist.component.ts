import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '../_models';
import { UserService } from '../_services';
// import {AppComponent} from '../search/search.component';

@Component({
    selector: 'offers-list',
    templateUrl: 'offerslist.component.html'
})

export class OfferlistComponent implements OnInit {
    users: User;
    currentUser: User;
    currentUsers: User[] = [];

    constructor(private userService: UserService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
         console.log(this.currentUser);
    }

    ngOnInit() {
        // this.loadAllUsers();
    }
     public Users(){
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.currentUser = this.users;
     }

    // deleteUser(id: number) {
    //     this.userService.delete(id).pipe(first()).subscribe(() => { 
    //         this.loadAllUsers() 
    //     });
    // }

    // private loadAllUsers() {
    //     this.userService.getAll().pipe(first()).subscribe(users => { 
    //         this.users = users; 
    //     });
    // }
}