let character = $("#character");
let pipe = $("#pipes");
let displayScore = $("#score");
let hitbox = $("#hitbox");
let timeout;
let jumpNum = 0;
let pipes = [];
let pipeHeights = math.range(125, 375)._data;
let scoreNum = 0;
let reset = () => {
    scoreNum = 0;
    displayScore.text(scoreNum);
    character.css("display", "block");
    checkLossInt = setInterval(checkLoss, 10);
    character.css("animation", "none");
    character.css("top", "220px");
    beforeScore = setTimeout(() => {
        scoreNum++;
        displayScore.text(scoreNum);
        scoreInt = setInterval(score, 2000);
    }, 5250)
    idle();
    pipes = [];
    pipes.push(new Pipe(Math.floor(Math.random() * pipeHeights.length)));
    generate = setInterval(() => {
        pipes.push(new Pipe(pipeHeights[Math.floor(Math.random() * pipeHeights.length)]));
    }, 2000)
}

class Pipe {
    constructor(height) {
        this.height = height;
        this.render();
    }

    render() {
        this.top = $("<img>");
        this.bottom = $("<img>");
        this.top.addClass("top");
        this.top.css({ "top": -500 + this.height, "height": 500});
        this.top.attr("src", "./assets/images/top.png")
        this.bottom.addClass("bottom");
        this.bottom.css({ "top": 100 + this.height, "height": 500});
        this.bottom.attr("src", "./assets/images/bottom.png")
        pipe.append(this.top);
        pipe.append(this.bottom);
        this.timeout = setTimeout(() => {
            this.top.remove();
            this.bottom.remove();
            pipes.shift();
        }, 6000)
    }
}


let jump = () => {
    let top = parseInt(character.css("top"))
    if (timeout) {
        clearTimeout(timeout)
    }
    $.keyframe.define([{
        name: `jump${jumpNum}`,
        '0%': {
            'top': `${top}px`
        },
        '100%': {
            'top': `${top - 50}px`
        }
    }]);
    character.css({ "top": `${top}` })
    character.css({ "animation": `jump${jumpNum} 300ms` })
    timeout = setTimeout(() => {
        top = parseInt(character.css("top"));
        setTimeout(() => {
            character.css("top", `${top}px`)
        }, 2)
        idle();
    }, 249)
    jumpNum++;
}

let idle = () => {
    $.keyframe.define([{
        name: 'idle',
        '0%': {
            'top': `${parseInt(character.css("top"))}px`
        },
        '100%': {
            'top': `${parseInt(character.css("top")) + 1000}px`
        }
    }]);
    character.css({ "animation": "idle 4500ms" })
}

let checkLoss = () => {
    hitbox[0].blur();
    if (hitbox[0].checked) {
        for (i in pipes) {
            pipes[i].top.css("border", "2px solid red");
            pipes[i].bottom.css("border", "2px solid red");
            pipes[i].top.css("border-top", "0px solid red");
            pipes[i].bottom.css("border-bottom", "0px solid red");
        }
        character.css("border", "2px solid red");
    } else {
        
        for (i in pipes) {
            pipes[i].top.css("border", "0px solid red");
            pipes[i].bottom.css("border", "0px solid red");
        }
        character.css("border", "0px solid red");
    }
    let hitpipe = false;
    if (/*Top pipe left side*/ (parseInt(character.css("top")) <= pipes[0].height && 50 >= parseInt(pipes[0].top.css("left")) && 50 <= parseInt(pipes[0].top.css("left")) + 100) || /*Top pipe right side*/ (parseInt(character.css("top")) <= pipes[0].height && 80 >= parseInt(pipes[0].top.css("left")) && 80 <= parseInt(pipes[0].top.css("left")) + 100) || /*Bottom pipe left side*/ (parseInt(character.css("top")) + 30 >= pipes[0].height + 100 && 50 >= parseInt(pipes[0].bottom.css("left")) && 50 <= parseInt(pipes[0].bottom.css("left")) + 100) || /*Bottom pipe right side*/ (parseInt(character.css("top")) + 30 >= pipes[0].height + 100 && 80 >= parseInt(pipes[0].top.css("left")) && 80 <= parseInt(pipes[0].top.css("left")) + 100)) {
        hitpipe = true;
    }
    if (parseInt(character.css("top")) >= 475 || parseInt(character.css("top")) <= -25 || hitpipe) {
        character.css("display", "none");
        for (let i in pipes) {
            pipes[i].top.remove();
            pipes[i].bottom.remove();
            clearTimeout(pipes[i].timeout)
        }
        clearInterval(checkLossInt);
        clearInterval(generate);
        clearInterval(scoreInt);
        clearTimeout(beforeScore)
        setTimeout(() => {
            if (confirm('You lose! Play again?')) {
                reset();
            }
        }, 100)
    }
}

let score = () => {
    scoreNum++;
    displayScore.text(scoreNum);
}

let checkLossInt = setInterval(checkLoss, 10);

let scoreInt;
displayScore.text(scoreNum);
let beforeScore = setTimeout(() => {
    scoreNum++;
    displayScore.text(scoreNum);
    scoreInt = setInterval(score, 2000);
}, 5250)


document.body.onkeypress = function (e) {
    if (e.keyCode == 32) {
        jump();
    }
}

pipes.push(new Pipe(Math.floor(Math.random() * pipeHeights.length)));

let generate = setInterval(() => {
    pipes.push(new Pipe(pipeHeights[Math.floor(Math.random() * pipeHeights.length)]));
}, 2000)

idle();

$( function() {
    hitbox.checkboxradio();
} );

