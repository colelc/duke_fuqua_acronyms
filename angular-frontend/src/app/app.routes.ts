import { Routes } from '@angular/router';
import { AcronymsAdminViewComponent } from './acronyms-admin-view/acronyms-admin-view.component';
import { AcronymsUserViewComponent } from './acronyms-user-view/acronyms-user-view.component';
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
    }, // admin list view: extra column for edit (new page opens, a form)
    {
        path: "view", 
       component: AcronymsUserViewComponent
    }, // user list view - all read-only
    {
        path: "new-acronym", 
        component: NewAcronymComponent
    }, // admin form, when admin person has clicked "New Acronym"
    {
        path: "edit-acronym/:id", 
        component: EditAcronymComponent
    }, // admin form, when admin person has clicked "Edit Acronym"
    {
        path: "**",
        component: PageNotFoundComponent 
     }
];
