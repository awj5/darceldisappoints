'use strict';

/* Global vars */

window.blogPage = 1;
window.blogPosts = [];
window.blogPostCount = 10;
window.blogTotalPosts = 0;
window.blogCallDate;
window.blogController = new AbortController();
window.blogSignal = window.blogController.signal;

/* Blog */

async function getPosts() {
    // Reset
    document.querySelector('#home-blog').innerHTML = '';
    const footerLinks = document.querySelectorAll('footer a');

    for (let x = 0; x < footerLinks.length; x++) {
        footerLinks[x].style.display = '';
    }

    window.blogPage = window.p ? window.p : 1; // Set page no.
    window.blogCallDate = Date.now(); // Use as call ID

    // Cancel previous fetch and reset controller
    window.blogController.abort();
    window.blogController = new AbortController();
    window.blogSignal = window.blogController.signal;

    var q = '';

    if (window.pattern !== 'home') {
        // Tag
        q = `&q=[[at(document.tags,["${ window.pattern }"])]]`;
    }

    // Call API and set array
    const apiQuery = window.id ? `https://darceldisappointscom.prismic.io/api/v2/documents/search?ref=${ window.prismicMasterRef }&q=[[at(document.id,"${ window.id }")]]` : `https://darceldisappointscom.prismic.io/api/v2/documents/search?ref=${ window.prismicMasterRef }&pageSize=${ window.blogPostCount }&page=${ window.blogPage }${ q }&orderings=[my.blog_post.date desc]`; // Page or post
    const json = await getData(apiQuery, window.blogSignal);
    window.blogPosts = json.results;
    window.blogTotalPosts = json.total_results_size;
    loadPost(0, window.blogCallDate);
}

function loadPost(count, callDate) {
    const postData = window.blogPosts[count];
    //console.log(postData);
    var post = document.querySelector('#blog-post').content;
    const postDate = new Date(postData.data.date);
    post.querySelector('h3').textContent = `${ postDate.toLocaleString('default', { month: 'long' }) } ${ postDate.toLocaleString('default', { day: 'numeric' }) }, ${ postDate.toLocaleString('default', { year: 'numeric' }) }`;
    post.querySelector('h2').textContent = postData.data.title[0].text;
    const imageSize = window.innerWidth >= 768 ? 1600 : 800; // Smaller res for mobile
    post.querySelector('img').src = postData.data.image.url + '&w=' + imageSize;
    const clone = document.importNode(post, true);

    // Click
    if (!window.id) {
        // Is page not post
        const article = clone.querySelector('article');
        article.style.cursor = 'pointer';

        article.addEventListener('click', (e) => {
            history.pushState(null, null, postData.slugs[0] + '?id=' + postData.id);
        });
    }

    // Preload image
    clone.querySelector('img').onload = () => {
        if (callDate === window.blogCallDate) {
            // Page has not changed
            document.querySelector('#home-blog').appendChild(clone); // Add to DOM

            if (window.blogPosts.length - 1 > count) {
                // Next post
                loadPost(count + 1, callDate);
            } else {
                // Show footer
                setBlogFooter();
            }
        }
    }
}

function setBlogFooter() {
    // Next
    if (window.blogTotalPosts > window.blogPage * window.blogPostCount) {
        document.querySelector('a#footer-older').style.display = 'inline';
    }

    // Prev
    if (window.blogPage !== 1 && !window.id) {
        // Is page not post
        document.querySelector('a#footer-newer').style.display = 'inline';
    }
}

function nextPage() {
    window.blogPage++;
    history.pushState(null, null, `./${ window.pattern !== 'home' ? window.pattern : ''}?p=${ window.blogPage }`);
}

function prevPage() {
    window.blogPage--;
    var params = `./${ window.pattern !== 'home' ? window.pattern : ''}?p=${ window.blogPage }`;

    if (window.blogPage === 1) {
        params = window.pattern !== 'home' ? window.pattern : '.'; // Home or tag
    }

    history.pushState(null, null, params);
}