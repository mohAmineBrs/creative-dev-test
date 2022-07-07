import './style.css'
import anime from "animejs"
import {data} from "./data"


// DOM
const navItems = [...document.querySelectorAll('.nav__item')];
const paragraphWrapper = document.querySelector('.heroText__slide--main .paragraph__wrapper');
let headingWrapper = document.querySelectorAll('.heroText__slide--main .heading__line');

// Variables
const bgColor = ['#ffa0a0', '#ffc74f', '#9cd6f0']
const textColor = ['#00347d', '#e93800', '#8a1935']
const easing = 'easeOutExpo';
let currentItem = 0;
let animDir = 1
let wheelSpeed = 0



/**
 * Text Animation
 */
// Paragraph Animation
const paragraphAnimation = () => {
    const tl = anime.timeline({
        duration: 800,
        easing: easing,
    })
    tl.add({
        targets: paragraphWrapper,
        translateY: -5,
        opacity: 0,
        complete: () => {
            paragraphWrapper.innerHTML = data[currentItem].paragraph
        }
    })
    .add({
        targets: paragraphWrapper,
        translateY: 0,
        opacity: 1,

    })
}

// Heading Text Animation

// Splitting The Heading Text Into Letter Inside <span> Elements Using Regular Expression
headingWrapper.forEach(el => {
    el.innerHTML = el.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

})
let headingLetter = [...document.querySelectorAll(`.letter`)];

// Hiding Heading Text Function
const headingTextHide = () => {
        headingLetter.forEach((letter, i) => {
            const tl = anime.timeline()
                tl.add({
                    targets: letter,
                    translateY: `${animDir * -110}%`,
                    duration: 600,
                    delay: 10 * i,
                    easing: easing,
                    complete: () => {
                        document.querySelector('.htmlContent').style.color = textColor[currentItem]
                    }
                })
        })
}

// Revealing Heading Text Function
const headingTextReveal = () => {
    headingWrapper[0].textContent = data[currentItem].heading.headingLine1;
    headingWrapper[1].textContent = data[currentItem].heading.headingLine2;

    // Resplitting The New Heading Text Into Letters Before Revealing
    headingWrapper.forEach(el => {
        el.innerHTML = el.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

    })
    headingLetter = [...document.querySelectorAll(`.letter`)];
    headingLetter.forEach((letter, i) => {
        const tl = anime.timeline()
        tl.add({
            targets: letter,
            translateY: `${animDir * 110}%`,
            duration: 0,
        })

        tl.add({
            targets: letter,
            translateY: 0,
            duration: 800,
            delay: 10 * i,
            easing: easing,
        })
    })
}

// Animating All Function
const animateAll = () => {
    // Handling Nav Items (SVG And Numbers) Color Tweak And Animation
    navItems.forEach(itm => {
        itm.classList.remove('nav__item--active')
    })
    navItems[currentItem].classList.add('nav__item--active')

    document.documentElement.style.setProperty('--textColor', textColor[currentItem])
    document.documentElement.style.setProperty('--bgColor', bgColor[currentItem])

    // Animating Heading And Paragraph
    paragraphAnimation();
    headingTextHide();
    setTimeout(headingTextReveal, 500);
}

/**
 * Navigate Through Nav Items Click
 */
navItems.forEach((item, i) => {
    item.addEventListener('click', e => {
        if (currentItem != i) {
            currentItem < i ? animDir = 1 : animDir = -1
            currentItem = i
            animateAll()
        }
    })
})

/**
 * Navigate Through Keybord Keys
 */
document.addEventListener('keydown', (e) => {
    // 1/2/3 Numbers Keys
    switch(e.which) {
        case 97:   // N°1
            if (currentItem != 0 ){
                animDir = -1
                currentItem = 0
                animateAll()
            }
            break;
        case 98:   // N°2
            if (currentItem != 1 ){
                animDir = -animDir
                currentItem = 1
                animateAll()
            }
            break;
        case 99:   // N°3
            if (currentItem != 2 ){
                animDir = 1
                currentItem = 2
                animateAll()
            }
            break;
    }

    // Up & Down Keys
    switch(e.which) {
        case 38:   // Up
            if (currentItem != 0) {
                currentItem--
                animDir = -1
                animateAll()
            } 
            break;
        case 40:   // Down
            if (currentItem != 2) {
                currentItem++
                animDir = 1
                animateAll()
            }
            break;
    }
})


/**
 * Navigate Through Mouse Wheel
 */
window.addEventListener("wheel", (e) => {
    wheelSpeed += e.deltaY * 0.0025;
    wheelSpeed = Math.min(Math.max(0, wheelSpeed), 2);

    if (currentItem != wheelSpeed) {
        currentItem < wheelSpeed ? animDir = 1 : animDir = -1

        currentItem = Math.round(wheelSpeed)
        animateAll()
    }
})