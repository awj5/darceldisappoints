"use strict";

/* Global vars */

window.touchScreen = false;
window.prismicMasterRef;

/* On DOM load */

document.addEventListener("DOMContentLoaded", () => {
  window.touchScreen = matchMedia("(hover: none)").matches; // Detect mobile
  setEventsGlobal(); // Mouse and keyboard

  // Scroll
  window.addEventListener("scroll", () => {
    //window.pageYOffset;
  });

  // Resize
  window.addEventListener("resize", () => {});

  document.querySelector("html").style.visibility = "visible"; // Hack to avoid FOUC
  start();
});

/* Mouse and keyboard events */

function setEventsGlobal() {}

/* Start */

async function start() {
  // Prismic
  const json = await getData("https://darceldisappointscom.prismic.io/api/v2"); // Get master ref
  window.prismicMasterRef = json.refs[0].ref;

  // Pattern
  let patrn = new Pattern();
  patrn.init();
}

/* Global */

async function getData(path) {
  const data = await fetch(path, {
    method: "get",
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      console.log(error);
    });

  return data;
}

function patternChange() {
  loadSection();
}

function loadSection() {
  const sections = document.querySelectorAll(".section");

  // Reset
  for (let x = 0; x < sections.length; x++) {
    sections[x].style.display = "";
  }

  var section = window.pattern;
  const func = window[section];

  // Call section function if exists
  if (typeof func === "function") {
    func();
  } else {
    // Blog page or post
    if (window.id) {
      // Is post
      window.pattern = "home";
    }

    getPosts();
    section = "home";
  }

  // Set nav
  const navItems = document.querySelectorAll("nav a");

  // Reset all nav items
  for (let x = 0; x < navItems.length; x++) {
    navItems[x].style.textDecoration = "";
  }

  document.querySelector("a#nav-" + window.pattern).style.textDecoration = "underline"; // Set selected

  document.querySelector("#section-" + section).style.display = "block"; // Show selected
  document.querySelector("html").style.backgroundColor = section === "about" ? "#FC0" : ""; // Set bg color
}

/* Header */

function navClick(section) {
  history.pushState(null, null, section);
}

/* About */

function about() {}
