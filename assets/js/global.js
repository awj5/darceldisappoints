'use strict';

/* Global vars */

window.touchScreen = false;
window.prismicMasterRef;

/* On DOM load */

document.addEventListener('DOMContentLoaded', () => {
    // Detect mobile
    window.addEventListener('touchstart', () => {
        document.querySelector('body').classList.remove('no-touch');
        window.touchScreen = ! window.touchScreen; // Toggle
    });

    setEventsGlobal(); // Mouse and keyboard

    // Scroll
    window.addEventListener('scroll', () => {
        //window.pageYOffset;
    });

    // Resize
    window.addEventListener('resize', () => {

    });

    document.querySelector('html').style.visibility = 'visible'; // Hack to avoid FOUC
    start();
});

/* Mouse and keyboard events */

function setEventsGlobal() {}

/* Start */

async function start() {
    // Prismic
    const json = await getData('https://darceldisappointscom.prismic.io/api/v2', undefined); // Get master ref
    window.prismicMasterRef = json.refs[0].ref;

    // Pattern
    let patrn = new Pattern();
    patrn.init();
}

/* Global */

async function getData(path, signal) {
    const data = await fetch(path, {
        method: 'get',
        signal: signal
    })
    .then((response) => {
        return response.json();
    }).catch((error) => {
        console.log(error);
    });

    return data;
}

function patternChange() {
    loadSection();
}

function loadSection() {
    const sections = document.querySelectorAll('section');

    // Reset
    for (let x = 0; x < sections.length; x++) {
        sections[x].style.display = '';
    }

    var section = window.pattern;
    const func = window[window.pattern];

    // Call section function if exists
    if (typeof func === 'function') {
        func();
    } else {
        // Blog page or post
        if (window.id) {
            // Is post
            window.pattern = 'home';
        }

        section = 'home';
        getPosts();
    }

    // Show selected
    document.querySelector('#section-' + section).style.display = 'block';
}

/* Header */

function navClick(section) {
    history.pushState(null, null, section);
}

/* About */

function about() {

}