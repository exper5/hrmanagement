import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../_models';

@Injectable()
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>('/api/users');
    }

    getById(id: number) {
        return this.http.get('/api/users/' + id);
    }

    create(user: User) {
        return this.http.post('http://a347294d.ngrok.io/hr-registration', user);
    }

    update(user: User) {
        return this.http.put('/api/users/' + user.id, user);
    }

    delete(id: number) {
        return this.http.delete('/api/users/' + id);
    }

    search(user:User){
        return this.http.post<User[]>('/api/users/search',user);
    }
    addrecord(user:User){
        return this.http.post<User[]>('/api/users/addrecord',user);
    }

    addcandidate(user:User){
        return this.http.post<User[]>('/api/users/addcandidate',user);
    }

    uploadFile(file:File){
        const formData: FormData = new FormData();
        formData.append('file', file, file.name);     
        return this.http.post('  https://gentle-bastion-60766.herokuapp.com/api/upload', formData);
    }

    
}