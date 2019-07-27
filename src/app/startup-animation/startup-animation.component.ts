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
    @ViewChild("display", {static: true}) display: ElementRef

    ngOnInit(){
        const drop = this.drop.nativeElement
        const circle = this.circle.nativeElement
        const display = this.display.nativeElement

        const animations = {}
        const descriptions = {
            loadingStates: [
                "Loading assets...",
                "Checking storage...",
                "Connecting to Internet...",
                "Starting OS..."
            ],
            done: "Done!"
        }

        const shadow = {size: 0}
        const glowingDuration = 1000
        const tl = anime.timeline({autoplay: false})

        animations.initSpin = (duration = 1000) => {
            let offset, matches = drop.style.transform.match(/\d+\.?\d+/)
            if(matches) offset = parseInt(matches[0])
            else offset = 0
            animations.spin = anime({
                targets: drop,
                rotate: [offset, offset+360],
                duration: duration,
                easing: "linear",
                autoplay: false,
                loop: true
            })
        }
        animations.initSpin()

        animations.percentage = anime({
            targets: ".percentage svg circle",
            strokeDashoffset: [anime.setDashoffset, 0],
            duration: 1000,
            easing: "linear",
            autoplay: false
        })

        animations.finish = anime({
            targets: shadow,
            size: 10,
            easing: "easeOutSine",
            duration: glowingDuration,
            update: () => circle.style.boxShadow = `
                0 0 ${shadow.size*5}px ${shadow.size/2}px #2ecc71,
                0 0 ${shadow.size*5}px ${shadow.size/2}px #2ecc71 inset
            `,
            autoplay: false
        })

        animations.complete = () => {
            drop.style.display = "none"
            circle.getElementsByTagName("circle")[0].style.display = "none"
            display.innerHTML = descriptions.done
            animations.finish.play()
        }

        const sleep = (t, state) => {
            display.innerHTML = descriptions.loadingStates[state-1] || "No information provided"
            return new Promise(resolve => setTimeout(resolve, t))
        }

        const updatePercentage = (steps, state) => {
            const percentage = state/steps
            animations.percentage.seek(animations.percentage.duration * percentage)
            animations.initSpin(1000*(1/percentage)/(steps+1))
            animations.spin.play()
        }

        const loadData = async () => {
            // Any kind of operation that may take a while / should be included in loading-screen, can be called here
            const steps = 4
            animations.spin.play()

            updatePercentage(steps, 0)
            await sleep(750, 1)

            updatePercentage(steps, 1)
            await sleep(500, 2)

            updatePercentage(steps, 2)
            await sleep(250, 3)

            updatePercentage(steps, 3)
            await sleep(500, 4)

            updatePercentage(steps, 4)
            return Promise.resolve()
        }

        loadData().then(animations.complete)
    }
}
