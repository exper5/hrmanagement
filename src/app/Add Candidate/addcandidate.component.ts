import { Component, ViewChild, OnInit } from "@angular/core";
import { AlertService, UserService } from "../_services";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";
import { User } from "../_models";
import { SimplePdfViewerComponent, SimplePDFBookmark } from "simple-pdf-viewer";
import { ActivatedRoute } from "@angular/router";
import { throwError } from "rxjs/internal/observable/throwError";
declare var $ :any;

@Component({
    selector: 'record-root',
    templateUrl: './addcandidate.component.html',
    styleUrls:['./addcandidate.Component.css'],
    
})
export class CandidateComponent implements OnInit{
    
    candidaterecord: FormGroup;
    color: any;
    users: User[];
    candidate: FormGroup;
    submitted = false;
    loading = false;
    showSelected: boolean;
   user_Rec:any;
   
    ShowButton() {
        this.showSelected = true;
        console.log(this.showSelected);
    }
    HideButton() {
        this.showSelected = false;
        console.log(this.showSelected);   
    }

   
    constructor(
        private formBuilder: FormBuilder,
        private userService: UserService,
        private alertService: AlertService,
        private route: ActivatedRoute,    
    ){

        this.user_Rec={};
       this.showSelected=false;
    this.candidate = new FormGroup({
            firstName: new FormControl('', Validators.required),
            lastName: new FormControl('', Validators.required),
            email: new FormControl('',[Validators.required,Validators.email]),
            dob: new FormControl('', Validators.required),
            doj: new FormControl('', Validators.required),
            offergiven: new FormControl('', Validators.required),
            rod: new FormControl(),
            phone:new FormControl('',Validators.required),
            addemail:new FormControl('',Validators.required),
            dd:new FormControl(),
            fileName : new FormControl(),
        uploaddocs : new FormControl(),
        uploaddoc:new FormControl('',Validators.required),
            notification: new FormControl('accepted',Validators.required),
         });
         
        //  this.route.params.subscribe(params => {

        //     console.log(params['id']);
        //    if(params['id']){
        //     this.userService.getById(params['id']).subscribe(user =>{
        //         this.user_Rec = user;
        //         this.newrecord.patchValue({
        //             firstName : user['firstName'],
        //             lastName : user['lastName'],
        //             email:user['email'],
        //             phone:user['phone']
        //         });
        //     });
        //    }
           

           
        //   });
          
    }
    formControlValueChanged() {
        const phoneControl = this.candidate.get('rod');
        const phoneControl1 = this.candidate.get('dd');
    this.candidate.get('notification').valueChanges.subscribe(
       
        (mode: string) => {
            mode === 'true';
            console.log(mode);
            if (mode === 'declined') {
                phoneControl.setValidators([Validators.required]),
                phoneControl1.setValidators([Validators.required]);
            }
            else if (mode === 'accepted') {
                phoneControl.clearValidators(),
                phoneControl1.clearValidators();
            }
            phoneControl.updateValueAndValidity(),
            phoneControl1.updateValueAndValidity();
        });
    }
    ngOnInit(){
        this.formControlValueChanged();
        $(function() {
            var loc = window.location.href; // returns the full URL
            if(/addcandidate/.test(loc)) {
              $('.headbar').addClass('tech');
            }
          });
       
    }

    get f() { return this.candidate.controls; } 

    changeFile(files:FileList){
        //console.log(files.item(0));
        this.userService.uploadFile(files.item(0))
        .pipe(first())
        .subscribe(
            data => {
               
                 console.log(data['path']);
                 this.candidate.patchValue({
                    fileName : data['path'],
                    
                 })
                
            },
            error => {
                this.alertService.error(error);
                return throwError;
                
            });

    }

    changeFile1(files:FileList){
        console.log(files.item(0));
        this.userService.uploadFile(files.item(0))
        .pipe(first())
        .subscribe(
            data => {
               
                 console.log(data['path']);
                 this.candidate.patchValue({
                    uploaddocs : data['path'],
                    
                 })
                
            },
            error => {
                this.alertService.error(error);
                
            });

    }
    
    onSubmit() {
        this.submitted = true;
       // console.log(this.newrecord.value);
        // stop here if form is invalid
        if (this.candidate.invalid) {
            return;
        }

        this.loading = true;
        console.log(this.candidate.value);

        this.userService.addcandidate(this.candidate.value)
        .pipe(first())
        .subscribe(
            users => {
               
                 console.log(users);
                this.users = users; 
            },
            error => {
                this.alertService.error(error);
                
            });

        
}

@ViewChild(SimplePdfViewerComponent) private pdfViewer: SimplePdfViewerComponent;
  bookmarks: SimplePDFBookmark[] = [];

  // how to open PDF document
  openDocument(document: File) {
    const fileReader: FileReader = new FileReader();
    fileReader.onload = () => {
      this.pdfViewer.openDocument(new Uint8Array(fileReader.result));
    };
    fileReader.readAsArrayBuffer(document);
  }

  // how to create bookmark
  createBookmark() {
    this.pdfViewer.createBookmark().then(bookmark => {
      if(bookmark) {
        this.bookmarks.push(bookmark);
      }
    })
  }
}