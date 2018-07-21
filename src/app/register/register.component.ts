import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, UserService } from '../_services';
import { domain_str } from './domain_data';

@Component({
    templateUrl: 'register.component.html',
    styleUrls: ['register.component.css']
})

export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    
    loading = false;
    submitted = false;
    

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private userService: UserService,
        private alertService: AlertService) { }

        emailDomainValidator(control: FormControl) { 
            let email = control.value;
            let domain_arr = domain_str.split("**"); 
            console.log(domain_arr);
            if (email && email.indexOf("@") != -1) { 
              let [_, domain] = email.split("@"); 
              if (domain_arr.indexOf(domain)!=-1) { 
                return {
                  emailDomain: {
                    parsedDomain: domain
                  }
                }
              }
            }
            return null; 
          }
          keyPress(event: any) {
            const pattern = /[0-9\+\-\ ]/;
        
            let inputChar = String.fromCharCode(event.charCode);
            if (event.keyCode != 8 && !pattern.test(inputChar)) {
              event.preventDefault();
            }
          }
    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            compname: ['', Validators.required],
            comptype: ['', Validators.required],
            compadd: ['', Validators.required],
            desig: ['', Validators.required],
            email: ['',[Validators.required,Validators.email,this.emailDomainValidator],],
            phone: ['', Validators.required],
            pan: ['', Validators.required],
            dob: ['', Validators.required],
            lastName: ['', Validators.required],
            username: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        this.loading = true;
        //  console.log(this.registerForm.value);
        this.userService.create(this.registerForm.value)
            .pipe(first())
            .subscribe(
                data => {
                   // this.alertService.success('Registration successful', true);
                    this.router.navigate(['/login']);
                },
                error => {
                    console.log(error);
                   this.alertService.error(error.error.error);
                    this.loading = false;
                });
    }
}
