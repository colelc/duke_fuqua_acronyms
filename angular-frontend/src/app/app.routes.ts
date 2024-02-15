import { Routes } from '@angular/router';
import { AcronymsAdminViewComponent } from './acronyms-admin-view/acronyms-admin-view.component';
import { AcronymsUserViewComponent } from './acronyms-user-view/acronyms-user-view.component';
import { AppComponent } from './app.component';
import { DeleteAcronymComponent } from './delete-acronym/delete-acronym.component';
import { EditAcronymComponent } from './edit-acronym/edit-acronym.component';
import { NewAcronymComponent } from './new-acronym/new-acronym.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const routes: Routes = [
    //  {
    //      path: "", 
    //      redirectTo: "",
    //      pathMatch: "full"
    //  },
    {
        path: "acronyms",
        component: AppComponent
    },
    {
        path: "acronyms/admin", 
        component: AcronymsAdminViewComponent
    }, 
    {
        path: "acronyms/view", 
       component: AcronymsUserViewComponent
    }, 
    {
        path: "acronyms/new-acronym", 
        component: NewAcronymComponent
    }, 
    {
        path: "acronyms/edit-acronym/:id", 
        component: EditAcronymComponent
    }, 
    {
        path: "acronyms/delete-acronym/:id", 
        component: DeleteAcronymComponent
    }, 
    {
        path: "**",
        component: PageNotFoundComponent 
     }
];
