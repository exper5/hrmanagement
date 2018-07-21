import {Component, OnInit,} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { UserService } from '../_services/user.service';
import { first } from 'rxjs/operators';
import { AlertService } from '../_services/alert.service';
import { User } from '../_models/user';
declare var $ :any;
@Component({
    selector: 'search-root',
    templateUrl: './search.component.html',
    styleUrls:['search.component.css']
})
export class searchComponent implements OnInit{
   
    searchform: FormGroup;
    searchgroup: FormGroup;
  
    submitted = false;
    loading = false;
    
    showTable:boolean
    users: User[] = [];
    
    constructor(
        private formBuilder: FormBuilder,
        private userService: UserService,
        
        private alertService: AlertService){
            

        this.showTable=false;
        this.searchgroup = new FormGroup({
            firstName: new FormControl('', Validators.required),
            lastName: new FormControl('', Validators.required),
            email: new FormControl(),
            dob: new FormControl(),
            phone:new FormControl(),
          
         });
         
    }
    

    
    // formControlValueChanged() {
    //     const phoneControl = this.searchgroup.get('email');
    //     const phoneControl1 = this.searchgroup.get('phone');
  
    //     (mode: string) => {
    //         console.log(mode);
    //         if (mode === 'declined') {
    //             phoneControl.setValidators([Validators.required]),
    //             phoneControl1.setValidators([Validators.required]);
    //         }
    //         else if (mode === 'accepted') {
    //             phoneControl.clearValidators(),
    //             phoneControl1.clearValidators();
    //         }
    //         phoneControl.updateValueAndValidity(),
    //         phoneControl1.updateValueAndValidity();
    //     };
    // }
    
    ngOnInit() {
        
        $('#test1, #test2').keyup(function(){
            var $test1 = $('#test1');
            var $test2 = $('#test2');
            $test1.prop('disabled', $test2.val() && ! $test1.val());
            $test2.prop('disabled', $test1.val() && ! $test2.val());
        }); 
        $(function() {
            var loc = window.location.href; // returns the full URL
            if(/search/.test(loc)) {
              $('.headbar').addClass('tech');
            }
          });

    
}
  
    get f() { return this.searchgroup.controls; } 
    onSubmit() {
        this.submitted = true;
        this.showTable=false;
        // stop here if form is invalid
        if (this.searchgroup.invalid) {
            return;
        }

        this.loading = true;
        console.log(this.searchgroup.value);

        this.userService.search(this.searchgroup.value)
        .pipe(first())
        .subscribe(
            users => {
                if(users.length==0)
                    this.showTable=true;
                // console.log(users);
                this.users = users; 
            },
            error => {
                this.alertService.error(error);
                
            });

        
}
}