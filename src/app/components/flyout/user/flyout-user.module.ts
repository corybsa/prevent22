import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CalendarModule } from "primeng/calendar";
import { ToastModule } from "primeng/toast";
import { UsersService } from "src/app/services/users/users.service";
import { WarningsService } from "src/app/services/warnings/warnings.service";
import { AddWarningFlyoutComponent } from './add-warning-flyout/add-warning-flyout.component';
import { FlyoutUserComponent } from "./flyout-user.component";

@NgModule({
    declarations: [
        FlyoutUserComponent,
        AddWarningFlyoutComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ToastModule,
        CalendarModule
    ],
    exports: [
        FlyoutUserComponent
    ],
    providers: [
        WarningsService,
        UsersService
    ]
})
export class FlyoutUserModule { }
