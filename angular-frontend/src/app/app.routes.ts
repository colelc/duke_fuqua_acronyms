import { Routes } from '@angular/router';
import { AcronymsAdminViewComponent } from './acronyms-admin-view/acronyms-admin-view.component';
import { AcronymsUserViewComponent } from './acronyms-user-view/acronyms-user-view.component';
import { DeleteAcronymComponent } from './delete-acronym/delete-acronym.component';
import { EditAcronymComponent } from './edit-acronym/edit-acronym.component';
import { NewAcronymComponent } from './new-acronym/new-acronym.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const routes: Routes = [
    // {
    //     path: "", 
    //     redirectTo: "",
    //     pathMatch: "full"
    // },
    {
        path: "admin", 
        component: AcronymsAdminViewComponent
    }, 
    {
        path: "view", 
       component: AcronymsUserViewComponent
    }, 
    {
        path: "new-acronym", 
        component: NewAcronymComponent
    }, 
    {
        path: "edit-acronym/:id", 
        component: EditAcronymComponent
    }, 
    {
        path: "delete-acronym/:id", 
        component: DeleteAcronymComponent
    }, 
    {
        path: "**",
        component: PageNotFoundComponent 
     }
];
