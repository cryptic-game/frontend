import { Component, OnInit } from "@angular/core"
import anime from "animejs"

@Component({
    selector: "app-startup",
    templateUrl: "./startup-animation.component.html",
    styleUrls: ["./startup-animation.component.scss"]
})
export class StartupAnimationComponent implements OnInit{
    ngOnInit(){
        const tl = anime.timeline()
        const shadow = {size: 0}
        const circle = document.getElementsByClassName("circle")[0]
        const drop = document.getElementsByClassName("drop")[0]

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
