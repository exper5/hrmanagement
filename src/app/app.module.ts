import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule, FormControl }    from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// used to create fake backend
import { fakeBackendProvider } from './_helpers';
// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppComponent }  from './app.component';
import { routing }        from './app.routing';

import { AlertComponent } from './_directives';
import { AuthGuard } from './_guards';
import { JwtInterceptor } from './_helpers';
import { AlertService, AuthenticationService, UserService } from './_services';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { AlertModule, ModalModule } from 'ngx-bootstrap';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { searchComponent } from './search/search.component';
import { recordComponent, ModalContentComponent } from './record/record.component';
import { SimplePdfViewerModule } from 'simple-pdf-viewer';
import { OfferlistComponent } from './offersList/offerslist.component';
import { CandidateComponent } from './Add Candidate/addcandidate.component';
import { MaterialFileUploadComponent } from './material-file-upload/material-file-upload.component';
import { QuillModule } from 'ngx-quill';
import { startComponent } from './start/start.component';
import { CountUpModule } from 'countup.js-angular2';


@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        routing,
        AlertModule.forRoot(),
        AngularFontAwesomeModule,
        FormsModule,
        SimplePdfViewerModule,  
        QuillModule,
        ModalModule.forRoot(),
        CountUpModule
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        searchComponent,
        recordComponent,
        CandidateComponent,
        MaterialFileUploadComponent,
        ModalContentComponent,
        startComponent,
        
    ],
    providers: [
        AuthGuard,
        AlertService,
        AuthenticationService,
        UserService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptor,
            multi: true
        },
        
        // provider used to create fake backend
        fakeBackendProvider
    ],
    bootstrap: [AppComponent],
    entryComponents: [ModalContentComponent],
    // schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})

export class AppModule { }