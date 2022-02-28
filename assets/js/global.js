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

    setOG('https://www.darceldisappoints.com/', 'Hi! My name is Darcel Disappoints, I live in New York and my blog is about the highs and lows of life in a big city. For better or worse (usually worse).', 'https://darceldisappoints.com/assets/img/og.png');

    var section = window.pattern;
    const func = window[section];

    // Call section function if exists
    if (typeof func === 'function') {
        func();
    } else {
        // Blog page or post
        if (window.id) {
            // Is post
            window.pattern = 'home';
        }

        getPosts();
        section = 'home';
    }

    // Set nav
    const navItems = document.querySelectorAll('nav a');

    // Reset all nav items
    for (let x = 0; x < navItems.length; x++) {
        navItems[x].style.textDecoration = '';
    }

    document.querySelector('a#nav-' + window.pattern).style.textDecoration = 'underline'; // Set selected

    document.querySelector('#section-' + section).style.display = 'block'; // Show selected
    document.querySelector('html').style.backgroundColor = section === 'about' ? '#FC0' : ''; // Set bg color
}

function setOG(url, description, image) {
    document.querySelector('meta[property="og:url"]').setAttribute('content', url);
    document.querySelector('meta[property="og:description"]').setAttribute('content', description);
    document.querySelector('meta[property="og:image"]').setAttribute('content', image);
    document.querySelector('meta[property="twitter:url"]').setAttribute('content', url);
    document.querySelector('meta[name="twitter:description"]').setAttribute('content', description);
    document.querySelector('meta[name="twitter:image"]').setAttribute('content', image);
}

/* Header */

function navClick(section) {
    history.pushState(null, null, section);
}

/* About */

function about() {

}