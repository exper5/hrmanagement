import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { createOfflineCompileUrlResolver } from '@angular/compiler';
import { FormArray } from '@angular/forms';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

    offers: any;

    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // array in local storage for registered users
        let users: any[] = JSON.parse(localStorage.getItem('users')) || [];

        // wrap in delayed observable to simulate server api call
        return of(null).pipe(mergeMap(() => {

            // authenticate
            if (request.url.endsWith('/api/authenticate') && request.method === 'POST') {
                // find if any user matches login credentials
                let filteredUsers = users.filter(user => {
                    return user.email === request.body.email && user.password === request.body.password;
                });

                if (filteredUsers.length) {
                    // if login details are valid return 200 OK with user details and fake jwt token
                    let user = filteredUsers[0];
                    let body = {
                        id: user.id,
                        username: user.username,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        token: 'fake-jwt-token'
                    };

                    return of(new HttpResponse({ status: 200, body: body }));
                } else {
                    // else return 400 bad request
                    return throwError('Email or password is incorrect');
                }
            }

            // get users
            if (request.url.endsWith('/api/users') && request.method === 'GET') {
                // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    
                    
                    
                    return of(new HttpResponse({ status: 200, body: users }));
                } else {
                    // return 401 not authorised if token is null or invalid
                    return throwError('Unauthorised');
                }
            }


            // search
            if (request.url.endsWith('/api/users/search') && request.method === 'POST') {
                // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {

                    console.log(request.body);
                    let filteredUsers = users.filter(user => {
                        return ((user.firstName.toLowerCase()) === (request.body.firstName.toLowerCase()) && (user.lastName.toLowerCase()) === (request.body.lastName.toLowerCase()) ) && (user.phone === request.body.phone  || user.email === request.body.email);
                    });
    
                    
    
                        return of(new HttpResponse({ status: 200, body: filteredUsers }));
                    
                   // return of(new HttpResponse({ status: 200, body: users }));
                } else {
                    // return 401 not authorised if token is null or invalid
                    return throwError('Unauthorised');
                }
            }

            // get user by id
            if (request.url.match(/\/api\/users\/\d+$/) && request.method === 'GET') {
                // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    // find user by id in users array
                    let urlParts = request.url.split('/');
                    let id = parseInt(urlParts[urlParts.length - 1]);
                    let matchedUsers = users.filter(user => { return user.id === id; });
                    let user = matchedUsers.length ? matchedUsers[0] : null;

                    return of(new HttpResponse({ status: 200, body: user }));
                } else {
                    // return 401 not authorised if token is null or invalid
                    return throwError('Unauthorised');
                }
            }

            // create user
            // if (request.url.endsWith('http://a347294d.ngrok.io/hr-registration') && request.method === 'POST') {
            //     // get new user object from post body
            //     let newUser = request.body;
                
            //     // validation
            //     let duplicateUser = users.filter(user => { return user.email === newUser.email; }).length;
            //     if (duplicateUser) {
            //         return throwError('email "' + newUser.email + '" is already taken');
            //     }

            //     // save new user
            //     // newUser.id = users.length + 1;
            //     users.push(newUser);
            //     this.http.post("http://a347294d.ngrok.io/hr-registration", newUser).subscribe((data) => {});
                
            //     // this.Http.post('http://a347294d.ngrok.io/hr-registration',newUser ).subscribe(res => console.log(res.json()));
            //     // localStorage.setItem('users', JSON.stringify(users));

            //     // respond 200 OK
            //     return of(new HttpResponse({ status: 200 }));
            // }


            //add record
            if (request.url.endsWith('/api/users/addrecord') && request.method === 'POST') {
                // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {

                    console.log(request.body);
                   let index=null;

                   users.forEach((user ,i)=>{
                    if(user.email ==  request.body.email)
                        index = i;
                    
                   });
                   console.log(index);
                
                   let updatedUser = users[index];

                   
                   let offers = {};
                   
                   offers['dd'] = request.body.dd;
                   offers['rod'] = request.body.rod;
                   offers['fileName'] = request.body.fileName;
                   offers['uploaddocs'] = request.body.uploaddocs;
                   offers['offergiven'] = request.body.offergiven;
                   offers['doj'] = request.body.doj;
                  
                   if(!updatedUser['offers'])
                        updatedUser.offers=[];
                   updatedUser.offers.push(offers);
                   // users.splice(0,1,users);
                    console.log(users);
                    console.log(offers);
                    users.splice(index, 1, updatedUser);

                
                   localStorage.setItem('users', JSON.stringify(users)); 
                        // return of(new HttpResponse({ status: 200, }));
                        return throwError('Successfully Added');
                    
                   // return of(new HttpResponse({ status: 200, body: users }));
                } else {
                    // return 401 not authorised if token is null or invalid
                    return throwError('Unauthorised');
                }
            }


            // add candidate using candidate form

            if (request.url.endsWith('/api/users/addcandidate') && request.method === 'POST') {
                // get new user object from post body
                let newUser = request.body;
                
                // validation
                let duplicateUser = users.filter(user => { return user.email === newUser.email; }).length;
                if (duplicateUser) {
                    
                    let index=null;

                    users.forEach((user ,i)=>{
                     if(user.email ==  request.body.email)
                         index = i;
                     
                    });
                    console.log(index);
                 
                    let updatedUser = users[index];
 
                    
                    let offers = {};
                    
                    offers['dd'] = request.body.dd;
                    offers['rod'] = request.body.rod;
                    offers['addemail'] = request.body.addemail;
                    offers['uploaddoc'] = request.body.uploaddoc;
                    offers['offergiven'] = request.body.offergiven;
                    offers['doj'] = request.body.doj;
                   
                    if(!updatedUser['offers'])
                         updatedUser.offers=[];
                    updatedUser.offers.push(offers);
                    // users.splice(0,1,users);
                     console.log(users);
                     console.log(offers);
                     users.splice(index, 1, updatedUser);


                }
                else{

                // save new user
                var tempUser={

                    offers :[]
                };
                tempUser['id'] = users.length + 1;
                tempUser['firstName'] = newUser.firstName;
                tempUser['lastName'] = newUser.lastName;
                tempUser['phone'] = newUser.phone;
                tempUser['email'] = newUser.email;
                tempUser['dob'] = newUser.dob;


                var newOffr = {};
                newOffr['rod'] = newUser.rod;
                newOffr['offergiven'] = newUser.offergiven;
                newOffr['doj'] = newUser.doj;
                newOffr['dd'] = newUser.dd;
                newOffr['addemail'] = newUser.addemail;


                tempUser.offers.push(newOffr);


                users.push(tempUser);
                localStorage.setItem('users', JSON.stringify(users));

                // respond 200 OK
                return of(new HttpResponse({ status: 200 }));
            }
            
        }
        //File uploadapi 
        if (request.url.endsWith('/api/fileupload') && request.method === 'POST') {
            console.log(request.body.name);
            if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                
            }

           
        }
            // delete user
            if (request.url.match(/\/api\/users\/\d+$/) && request.method === 'DELETE') {
                // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    // find user by id in users array
                    let urlParts = request.url.split('/');
                    let id = parseInt(urlParts[urlParts.length - 1]);
                    for (let i = 0; i < users.length; i++) {
                        let user = users[i];
                        if (user.id === id) {
                            // delete user
                            users.splice(i, 1);
                            localStorage.setItem('users', JSON.stringify(users));
                            break;
                        }
                    }

                    // respond 200 OK
                    
                    return of(new HttpResponse({ status: 200 }));
                } else {
                    // return 401 not authorised if token is null or invalid
                    return throwError('Unauthorised');
                }
            }

            // pass through any requests not handled above
            return next.handle(request);
            
        }))

        // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
        .pipe(materialize())
        .pipe(delay(500))
        .pipe(dematerialize());
    }
}

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};