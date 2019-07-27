import { Component, ViewChild, ElementRef, OnInit } from "@angular/core"
import anime from "animejs"

@Component({
    selector: "app-startup",
    templateUrl: "./startup-animation.component.html",
    styleUrls: ["./startup-animation.component.scss"]
})
export class StartupAnimationComponent implements OnInit{
    @ViewChild("circle", {static: true}) circle: ElementRef
    @ViewChild("drop", {static: true}) drop: ElementRef

    ngOnInit(){
        const tl = anime.timeline()
        const shadow = {size: 0}
        const drop = this.drop.nativeElement
        const circle = this.circle.nativeElement

        tl.add({
            targets: ".drop-wrapper",
            rotate: 360,
            duration: 2000,
            easing: () => time => (time*3.5)**2,
            complete: () => {
                drop.style.display = "none"
                circle.style.border = "none"
            }
        }).add({
            targets: ".drop-wrapper",
            opacity: 0,
            duration: 2000,
            easing: "easeInSine",
        }, "-=2000").add({
            targets: shadow,
            size: 10,
            easing: "easeOutSine",
            duration: 1000,
            update: () => circle.style.boxShadow = `
                0 0 ${shadow.size*5}px ${shadow.size/2}px #2ecc71,
                0 0 ${shadow.size*5}px ${shadow.size/2}px #2ecc71 inset
            `
        })
    }
}
