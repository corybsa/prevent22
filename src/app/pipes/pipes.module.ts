import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { DatePipe } from "./date/date.pipe";

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        DatePipe
    ],
    exports: [
        DatePipe
    ]
})
export class PipesModule { }
