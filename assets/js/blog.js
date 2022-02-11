'use strict';

/* Global vars */

window.blogPage = 1;
window.blogPosts = [];

/* Blog */

async function getPosts() {
    const json = await getData(`https://darceldisappointscom.prismic.io/api/v2/documents/search?ref=${ window.prismicMasterRef }&pageSize=100&page=${ window.blogPage }&orderings=[document.last_publication_date]`);
    window.blogPosts = json.results;
    loadPost(0);
}

function loadPost(count) {
    const data = window.blogPosts[count].data;
    console.log(data);
    var post = document.querySelector('#blog-post').content;
    const postDate = new Date(data.date);
    post.querySelector('h3').textContent = postDate.toLocaleString('default', { month: 'long' }) + ' ' + postDate.toLocaleString('default', { day: 'numeric' });
    post.querySelector('h2').textContent = data.title[0].text;
    post.querySelector('img').src = data.image.url;
    const clone = document.importNode(post, true);
    document.querySelector('#home-blog').appendChild(clone);
}