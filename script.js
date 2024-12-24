'use strict';

const players = [
    'domingo_terhe_clark',
    'linda',
    'zuri',
    'kaia',
    'katie_kit_garman',
    'kingsley_aves',
    'sally_garman',
    'sally_aves',
    'tom_thomas_garman',
    'tony_anthony_garman'
];

const userName = prompt('What is your name?');
const userMatch = new RegExp(userName.split(' ').map(word => `(${word})?`).join('_*'), 'i');
let playerName = '';
// Find best matching name
let match = -1;
for (let i = 0; i < players.length; i++) {
    const matches = userMatch.exec(players[i])
    const newMatch = matches ? matches.filter(m => !!m).length : 0;
    if (newMatch > match) {
        match = newMatch;
        playerName = players[i];
    }
}

document.getElementById('help').addEventListener('click', help);

setTimeout(help, 50);

function help() {
    alert(`* The Christmas Spirit Quest *

Welcome, ${userName}!

Santa's magical sack of presents has lost its glow, and Christmas Spirit around the world is dwindling.

A magical snowflake named Sparkle has tasked you to journey through enchanted Christmas realms to collect fragments of Christmas Spirit and restore the magic before Christmas morning!

Instructions: move your player to the objective by dragging them across the screen using your mouse or trackpad!`)
}

// Check dimensions and init player
var width = window.innerWidth;
var height = window.innerHeight;
const player = document.querySelector('.player');
player.style.backgroundImage = `url(static/${playerName}.png)`;
player.style['left'] = 20 + 'px';
player.style['top'] = height / 2 + 'px';
document.body.style['background-size'] = width + 'px ' + height + 'px';
const title = document.querySelector('h1');
const description = document.querySelector('p');

// Don't set sceness too fast
let cooloff = false;

const scenes = [
    { name: 'Santa’s Workshop', description: 'Navigate through bustling elves assembling toys. Find the glowing gear hidden near the conveyor belts.', startx: 40, starty: 74, endx: 80, endy: 52 },
    { name: 'The Snowy Forest', description: 'Traverse a serene, snow-covered woodland, avoiding frosty wind gusts. Look for a twinkling star fragment near an old pine tree.', startx: 10, starty: 80, endx: 72, endy: 81 },
    { name: 'Candy Cane Lane', description: 'Cross a path of oversized candy canes and gumdrop puddles. Retrieve the spirit fragment lodged in a giant marshmallow.', startx: 30, starty: 40, endx: 71, endy: 53 },
    { name: 'The Gingerbread Village', description: 'Move through gingerbread houses and frosted cookie bridges. Help a gingerbread man rebuild a broken candy cane fence to earn a fragment.', startx: 35, starty: 76, endx: 78, endy: 76 },
    { name: 'Reindeer Stables', description: 'Assist the reindeer by finding their lost bells scattered across the stable to reveal another fragment.', startx: 50, starty: 50, endx: 29, endy: 82 },
    { name: 'The Frosty Lake', description: 'Carefully glide across a frozen lake, dodging falling icicles. Collect the spirit piece embedded in the ice.', startx: 0, starty: 45, endx: 73, endy: 70 },
    { name: 'The Northern Lights Meadow', description: 'Follow the shimmering aurora in the sky to find the next fragment hidden in a snowy flower patch.', startx: 77, starty: 50, endx: 37, endy: 76 },
    { name: 'Toyland Puzzle Zone', description: 'Solve a puzzle by arranging oversized Christmas ornaments to reveal a hidden fragment.', startx: 2, starty: 76, endx: 52, endy: 27 },
    { name: 'The Carolers’ Square', description: 'Sing along with the carolers to gain a fragment of joy.', startx: 71, starty: 74, endx: 55, endy: 59 },
    { name: 'The Christmas Market', description: 'Help the market vendor fix their twinkling lights to reveal the next spirit piece.', startx: 31, starty: 75, endx: 69, endy: 58 },
    { name: 'The Frost King’s Castle', description: 'Enter a glittering icy castle to convince the Frost King to relinquish a spirit fragment.', startx: 56, starty: 77, endx: 66, endy: 60 },
    { name: 'The Frost King’s Throne', description: 'Enter a glittering icy castle to convince the Frost King to relinquish a spirit fragment.', startx: 37, starty: 76, endx: 50, endy: 49 },
    { name: 'The Christmas Star Peak', description: 'Climb a snowy mountain to place collected fragments into a celestial star.', startx: 36, starty: 75, endx: 78, endy: 19 },
    { name: 'Santa’s Sleigh Launch Site', description: 'Use the restored Christmas Star to light Santa’s sleigh for a successful launch.', startx: 26, starty: 57, endx: 67, endy: 32 }
]

let sceneIndex = -1; // current background
// Preload next background
let img = new Image(); // Lazy load new backgrounds
img.src = `static/scene_${sceneIndex + 1}.jpg`;

/**
 *
 * Draggr
 *
 * Allows elements with class='drag' to be moved by mouse drag
 *
 **/


// Find all '.drag' elements and give them the necessary styles and callbacks
(function () {
    var dragEls = document.querySelectorAll('.drag, .drag-absolute, .drag-relative, .drag-fixed');
    for (var i = 0; i < dragEls.length; i++) {
        var el = dragEls[i];
        el.style['cursor'] = 'pointer';
        if (el.classList.contains('drag-absolute')) {
            el.style['position'] = 'absolute';
        } else if (el.classList.contains('drag-relative')) {
            el.style['position'] = 'relative';
        } else if (el.classList.contains('drag-fixed')) {
            el.style['position'] = 'fixed';
        }
        el.ontouchstart = function (e) {
            handleTouchStart(e);
        };
        
        el.onmousedown = function (e) {
            handleMouseDown(e);
        };
    }

    function handleTouchStart(e) {
        grabbedEl = e.targetTouches[0].target;
        oldX = e.targetTouches[0].pageX;
        oldY = e.targetTouches[0].pageY;
        var offset = getOffset(grabbedEl);
        oldElX = offset.left;
        oldElY = offset.top;
        grabbedEl.classList.add('grabbed');
    }
    
    function handleTouchMove(e) {
        // Add your touch move logic here
    }
    
    function handleTouchEnd(e) {
        // Add your touch end logic here
    }
    
    function handleMouseDown(e) {
        grabbedEl = e.target;
        oldX = e.pageX;
        oldY = e.pageY;
        var offset = getOffset(grabbedEl);
        oldElX = offset.left;
        oldElY = offset.top;
        grabbedEl.classList.add('grabbed');
    }
})();

setScene(0);

const eps = 10;
const PLAYER_SIZE = 200;

// Remember where the mouse last clicked, and whether something is being dragged / what it is
let mouseX, mouseY, oldX, oldY, oldElX, oldElY;;
let grabbedEl = false;
let perspective = 1;

// handle mousemove event
document.onmousemove = function (e) {
    if (grabbedEl) {
        const dX = e.pageX - oldX;
        const dY = e.pageY - oldY;
        const newX = oldElX + dX;
        const newY = oldElY + dY;

        // Decrease size of the player as it moves further away
        perspective = getPerspective(getYPercent(newY));
        grabbedEl.style['transform'] = `scale(${perspective})`;
        grabbedEl.style['left'] = newX + 'px';
        grabbedEl.style['top'] = newY + 'px';

        // If the element is dragged near to the start/end points of the scene, move to the next/previous scene
        const xPercent = getXPercent(newX + PLAYER_SIZE * perspective / 2); // 200 is the width of the player
        const yPercent = getYPercent(newY + PLAYER_SIZE * perspective / 2); // 200 is the height of the player
        if (Math.abs(xPercent - scenes[sceneIndex].endx) < eps && Math.abs(yPercent - scenes[sceneIndex].endy) < eps) {
            setScene(sceneIndex + 1);
        }
    }
}

document.ontouchmove = function(e) {
    if (grabbedEl) {
        const dX = e.targetTouches[0].pageX - oldX;
        const dY = e.targetTouches[0].pageY - oldY;
        const newX = oldElX + dX;
        const newY = oldElY + dY;

        // Decrease size of the player as it moves further away
        perspective = getPerspective(getYPercent(newY));
        grabbedEl.style['transform'] = `scale(${perspective})`;
        grabbedEl.style['left'] = newX + 'px';
        grabbedEl.style['top'] = newY + 'px';

        // If the element is dragged near to the start/end points of the scene, move to the next/previous scene
        const xPercent = getXPercent(newX + PLAYER_SIZE * perspective / 2); // 200 is the width of the player
        const yPercent = getYPercent(newY + PLAYER_SIZE * perspective / 2); // 200 is the height of the player
        if (Math.abs(xPercent - scenes[sceneIndex].endx) < eps && Math.abs(yPercent - scenes[sceneIndex].endy) < eps) {
            setScene(sceneIndex + 1);
        }
    }
}


function getPerspective(percenty) {
    return Math.min(1.2, Math.max(0.4, (2 * percenty / 100) - 0.4));
}

function getXPercent(xPixel) {
    return xPixel / window.innerWidth * 100;
}

function getYPercent(yPixel) {
    return yPixel / window.innerHeight * 100;
}

function setScene(_sceneIndex) {
    if (cooloff) return;
    if (sceneIndex === _sceneIndex) return;
    if (_sceneIndex < 0) return;
    if (_sceneIndex === scenes.length) {
        alert(`Congratulations! You have successfully restored the Christmas Spirit and saved Christmas!
            
Merry Christmas, ${userName}! Love you very much and hope you have a wonderful Christmas!

- Ben & KT`);
        return;
    }
    cooloff = true;
    sceneIndex = _sceneIndex;
    document.body.style['background-image'] = `url(static/scene_${sceneIndex}.jpg)`;
    var img = new Image(); // Preload
    img.src = `url(static/scene_${sceneIndex + 1}.jpg)`;
    player.style['opacity'] = 0;
    window.setTimeout(function () {
        perspective = getPerspective(scenes[sceneIndex].starty);
        player.style['transform'] = `scale(${perspective})`;
        player.style['left'] = scenes[sceneIndex].startx + '%';
        player.style['top'] = scenes[sceneIndex].starty + '%';
        player.style['opacity'] = 1;
        title.innerHTML = scenes[sceneIndex].name;
        description.innerHTML = scenes[sceneIndex].description;
        cooloff = false;
    }, 1000)
}

// Stop dragging on mouseup
document.ontouchend = document.onmouseup = function (e) {
    if (grabbedEl) {
        grabbedEl.classList.remove('grabbed');
        grabbedEl = false;
    }
}

// disable clicking on mobile
// document.addEventListener('touchstart', function (e) {
//     e.preventDefault();
// });

// getoffset function http://stackoverflow.com/a/442474
function getOffset(el) {
    var _x = 0;
    var _y = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return {
        top: _y,
        left: _x
    };
}

// load youtube api https://developers.google.com/youtube/iframe_api_reference
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
document.body.appendChild(tag);

// init player
let ytplayer;

function onYouTubeIframeAPIReady() {
    ytplayer = new YT.Player('ytplayer', {
        height: '0',
        width: '0',
        videoId: 'IFrECBdlOk4',
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

// play when ready
function onPlayerReady(event) {
    event.target.playVideo();
}
// for some reason the api demands that this function exist
function onPlayerStateChange(event) { }

// toggle sound when clicking on #sound
var sound = document.querySelector('#sound');
sound.addEventListener('click', function (e) {
    if (ytplayer.isMuted()) {
        ytplayer.unMute();
        sound.innerHTML = 'sound on';
    } else {
        ytplayer.mute();
        sound.innerHTML = 'sound off';
    }
});

// debug

document.addEventListener('click', function (e) {
    console.log(`x: ${Math.round(getXPercent(e.pageX))}%', y: ${Math.round(getYPercent(e.pageY))}%`);
})


function levenshtein(s, t) {
    if (s === t) {
        return 0;
    }
    var n = s.length, m = t.length;
    if (n === 0 || m === 0) {
        return n + m;
    }
    var x = 0, y, a, b, c, d, g, h, k;
    var p = new Array(n);
    for (y = 0; y < n;) {
        p[y] = ++y;
    }

    for (; (x + 3) < m; x += 4) {
        var e1 = t.charCodeAt(x);
        var e2 = t.charCodeAt(x + 1);
        var e3 = t.charCodeAt(x + 2);
        var e4 = t.charCodeAt(x + 3);
        c = x;
        b = x + 1;
        d = x + 2;
        g = x + 3;
        h = x + 4;
        for (y = 0; y < n; y++) {
            k = s.charCodeAt(y);
            a = p[y];
            if (a < c || b < c) {
                c = (a > b ? b + 1 : a + 1);
            }
            else {
                if (e1 !== k) {
                    c++;
                }
            }

            if (c < b || d < b) {
                b = (c > d ? d + 1 : c + 1);
            }
            else {
                if (e2 !== k) {
                    b++;
                }
            }

            if (b < d || g < d) {
                d = (b > g ? g + 1 : b + 1);
            }
            else {
                if (e3 !== k) {
                    d++;
                }
            }

            if (d < g || h < g) {
                g = (d > h ? h + 1 : d + 1);
            }
            else {
                if (e4 !== k) {
                    g++;
                }
            }
            p[y] = h = g;
            g = d;
            d = b;
            b = c;
            c = a;
        }
    }

    for (; x < m;) {
        var e = t.charCodeAt(x);
        c = x;
        d = ++x;
        for (y = 0; y < n; y++) {
            a = p[y];
            if (a < c || d < c) {
                d = (a > d ? d + 1 : a + 1);
            }
            else {
                if (e !== s.charCodeAt(y)) {
                    d = c + 1;
                }
                else {
                    d = c;
                }
            }
            p[y] = d;
            c = a;
        }
        h = d;
    }

    return h;
}