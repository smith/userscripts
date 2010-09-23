// ==UserScript==
// @name          Netflix Links in IMDb
// @namespace     http://www.artefxdesign.com/greasemonkey
// @description   Adds Netflix search links to IMDb pages
// @include       http://*.imdb.com/*
// @include       http://imdb.com/*
// ==/UserScript==

// Author: Ed Hager, ed@artefxdesign.com
// Small fix: Tim Meader, tmeader@gmail.com

// One thing I do to keep my Netflix queue populated is I go to IMDb and look at the top rentals
// lists.  From there I will copy the name of a movie and and then paste that name into Netflix's search page.
// It's a very tedious operation.  This script creates links in the IMDb pages that will do the work for me.
// Now when I go to IMDb, movie URLs will each be followed by a
// "(Netflix)" link that will take me to the Netflix search results page for that movie.

// Problems or comments?  Send me an e-mail: ed@artefxdesign.com
// For greasemonkey info: http://greasemonkey.mozdev.org/

// 4/3/2005 - I fixed a problem where the Netflix search string would be the word "null".  I also
//   removed the target attribute from the inserted links.  Now you can use the back button to return to IMDb's site.
// 8/1/2005 - I fixed a small bug where a link to Netflix was being displayed next to the link for IMDB Pro down in the
//            item description. This was unfortunately sending the string of "IMDB Professional" to Netflix, which of
//            course responded with not being able to find that "movie".
// 12/3/2005 - Netflix formatting thanks to Avi.
// 3/24/2007 - The structure of the HTML changed at IMDb a little which caused the Netflix link to not appear next to the movie title
//             on the details page for a movie.

/*global document */

(function() {

var title = document.title.replace(/\s\(.*/, ""),
    nf = "http://www.netflix.com/";

function isMovieURL(url) {
    if (url === null) { return(false); }

    // Looking for "/title/ttxxxxx/".  If any more slashes are found, then this is not a URL to the movie itself.
    var searchStr = "/title/";
    var pos = url.indexOf(searchStr);

    var notValidStr = "deeplink-title";      // quick fix for IMDBPro bug.
    var pos2 = url.indexOf(notValidStr);  // just an extra URL check

    // Another pro link check
    var pos3 = url.indexOf("/http://pro");

    // Is the prefix correct?
    if ((pos >= 0) && (pos2 < 0) && (pos3 < 0))     // added the second conditional to stop creating bad URLs for IMDBPro
    {
            var temp = url.substring(pos + searchStr.length);

            // Are there any more slashes? One more is ok.
            pos = temp.indexOf("/");
            // If there are no more slashes, then success.
            if (pos == -1) { return(true); }
            temp = temp.substring(pos+1);

            // Is there anything left?
            return (temp === null || temp.length === 0);
    }
}

function link(name) {
    var a = document.createElement("A"),
        img = document.createElement("IMG");

    img.src = nf + "favicon.ico";
    img.style.opacity = "0.5";
    a.href = "http://www.netflix.com/Search?v1=" + name;
    a.appendChild(img);
    a.style.marginLeft = "3px";
    return a;
}

// Insert the link in the heading if it's a movie page
if (isMovieURL(title)) {
    var header = document.querySelectorAll("h1.header")[0];
    if (header) { header.appendChild(link(title)); }
}

// Look for movie urls in links
Array.prototype.slice.call(document.querySelectorAll("a")).forEach(function (a) {
    if (isMovieURL(a.href)) { a.parentNode.appendChild(link(a.innerHTML)); }
});

})();

