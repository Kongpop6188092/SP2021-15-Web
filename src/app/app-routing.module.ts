import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppointmentComponent } from "./appointment/appointment.component";
import { LoginComponent } from "./login/login.component";
import { MedicineComponent } from "./medicine/medicine.component";
import { TreatmentComponent } from "./treatment/treatment.component";

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'treatment', component: TreatmentComponent },
    { path: 'medicine', component: MedicineComponent },
    { path: 'appointment', component: AppointmentComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }