import { Component, ViewChild, ElementRef, OnInit } from "@angular/core"
import AnimationHandler from "./AnimationHandler.js"

@Component({
    selector: "app-startup",
    templateUrl: "./startup-animation.component.html",
    styleUrls: ["./startup-animation.component.scss"]
})
export class StartupAnimationComponent implements OnInit{
    @ViewChild("circle", {static: true}) circle: ElementRef
    @ViewChild("drop", {static: true}) drop: ElementRef
    @ViewChild("display", {static: true}) display: ElementRef

    ngOnInit(){
        const drop = this.drop.nativeElement
        const circle = this.circle.nativeElement
        const display = this.display.nativeElement

        AnimationHandler.start(drop, circle, display)
    }
}
