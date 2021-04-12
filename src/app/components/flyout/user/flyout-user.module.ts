import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CalendarModule } from "primeng/calendar";
import { ToastModule } from "primeng/toast";
import { UsersService } from "src/app/services/users/users.service";
import { WarningsService } from "src/app/services/warnings/warnings.service";
import { AddWarningFlyoutComponent } from './add-warning-flyout/add-warning-flyout.component';
import { FlyoutUserComponent } from "./flyout-user.component";
import { EditUserFlyoutComponent } from './edit-user-flyout/edit-user-flyout.component';
import { DropdownModule } from "primeng/dropdown";
import { InputMaskModule } from 'primeng/inputmask';

@NgModule({
    declarations: [
        FlyoutUserComponent,
        AddWarningFlyoutComponent,
        EditUserFlyoutComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ToastModule,
        CalendarModule,
        DropdownModule,
        InputMaskModule
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
