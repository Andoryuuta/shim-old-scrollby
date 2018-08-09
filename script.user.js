// ==UserScript==
// @name         shim for outdated window.scrollBy
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Proxies any calls to the missing (on older chrome version <61) window.scrollBy({options}) to window.scrollBy(x, y).
// @author       Andoryuuta
// @match        *://*/*
// @grant        none
// ==/UserScript==


// Per https://caniuse.com/#feat=css-scroll-behavior, chrome before v61 doesn't have the window.scrollBy({options})
// variation of scrollBy enabled by default.
//
// This script checks if window.scrollBy({options}) is missing and installs a shim that forwards optioned scrollBy calls
// to normal scrollBy(x,y) without the optional behavior.

(function() {
    'use strict';

    function is_scrollBy_objectarg_bad(){
        try{
            window.scrollBy({top:0, behavior:"smooth"});
        } catch(e) {
            return true;
        }
        return false;
    }

    function customScrollBy() {
        switch(typeof arguments[0]){
            case "object":
                var options = arguments[0];
                var x = 0;
                var y = 0;
                if(options.hasOwnProperty("left")){
                    x = options.left;
                }
                if(options.hasOwnProperty("top")){
                    y = options.top;
                }
                window.scrollBy(x, y);
                break;
            case "number":
                window.real_scrollBy.apply(null, arguments);
                break
        }
    }

    if(is_scrollBy_objectarg_bad()){
        window.real_scrollBy = window.scrollBy
        window.scrollBy = customScrollBy
    }

})();
