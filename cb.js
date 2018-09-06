var game = new Phaser.Game(640, 320, Phaser.AUTO, null, {preload: preload, create: create, update: update});

var ball;
var paddle;
var bricks;
var metals;
var hardbricks;
var newBrick;
var brickInfo;
var scoreText;
var score = 0;
var lives = 3;
var livesText;
var lifeLostText;
var brickValue = 10;
var brickBonus = 1;
var vitesse = 150;
// var level = new Array();
var level = ["b","b","b","b","b","b","b","b","b","b","b","b","b","b","b","b","b","b","m","b","b","b","b","b","b","b","b"];
var stage = 1;
// var playing = false;
// var startButton;
var ballstart = (Math.random() * (1.00 - 0.15) + 0.05).toFixed(2);

function preload() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.stage.backgroundColor = '#eeeeee';
    game.load.image('ball', 'img/ball.png');
    game.load.image('paddle', 'img/paddle.png');
    game.load.image('brick', 'img/brick.png');
    game.load.image('metal', 'img/metal.png');
    game.load.image('hardbrick', 'img/hard.png');
    game.load.spritesheet('ball', 'img/wobble.png', 20, 20);
    // game.load.spritesheet('button', 'img/button.png', 120, 40);
}
function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    ball = game.add.sprite(game.world.width*ballstart, game.world.height-25, 'ball');
    ball.animations.add('wobble', [0,1,0,2,0,1,0,2,0], 24);
    ball.anchor.set(0.5);
    game.physics.enable(ball, Phaser.Physics.ARCADE);
    game.input.onDown.addOnce(function(){
        ball.body.velocity.set(vitesse, -vitesse);
    }, this);
    ball.body.collideWorldBounds = true;
    ball.body.bounce.set(1);
    game.physics.arcade.checkCollision.down = false;
    ball.checkWorldBounds = true;
    ball.events.onOutOfBounds.add(ballLeaveScreen, this);
    paddle = game.add.sprite(game.world.width*ballstart, game.world.height-5, 'paddle');
    paddle.anchor.set(0.5,1);
    game.physics.enable(paddle, Phaser.Physics.ARCADE);
    paddle.body.immovable = true;
    // initBricks();
    // initLevel();
    getLevelData();
    textStyle = { font: '12px Arial', fill: '#00dd8d' };
    scoreText = game.add.text(5, 5, 'Points: 0', textStyle);
    stageText = game.add.text(game.world.width*0.46, 5, 'Stage 1', textStyle);
    livesText = game.add.text(game.world.width-5, 5, 'Lives: '+lives, textStyle);
    livesText.anchor.set(1,0);
    lifeLostText = game.add.text(game.world.width*0.5, game.world.height*0.6, 'Life lost, click to continue', textStyle);
    lifeLostText.anchor.set(0.5);
    lifeLostText.visible = false;
    // startButton = game.add.button(game.world.width*0.5, game.world.height*0.5, 'button', startGame, this, 1, 0, 2);
    // startButton.anchor.set(0.5);
}
function update() {
    game.physics.arcade.collide(ball, paddle, ballHitPaddle);
    game.physics.arcade.collide(ball, bricks, ballHitBrick);
    game.physics.arcade.collide(ball, metals, ballHitMetal);
    game.physics.arcade.collide(ball, hardbricks, ballHitHardbrick);
    paddle.x = game.input.x || game.world.width*0.5;
    // if(playing) {
    //     paddle.x = game.input.x || game.world.width*0.5;
    // }
}
function initBricks() {
    brickInfo = {
        width: 50,
        height: 30,
        count: {
            row: 3,
            col: 9
        },
        offset: {
            top: 45,
            left: 60
        },
        padding: 15
    }
    bricks = game.add.group();
    metals = game.add.group();
    hardbricks = game.add.group();
    for(c=0; c<brickInfo.count.col; c++) {
        for(r=0; r<brickInfo.count.row; r++) {
            var brickX = (c*(brickInfo.width+brickInfo.padding))+brickInfo.offset.left;
            var brickY = (r*(brickInfo.height+brickInfo.padding))+brickInfo.offset.top;
            if (Math.floor((Math.random() * 10) + 1) >= 8 && brickValue < 150) {
                newBrick = game.add.sprite(brickX, brickY, 'metal');
                game.physics.enable(newBrick, Phaser.Physics.ARCADE);
                newBrick.body.immovable = true;
                newBrick.anchor.set(0.5);
                metals.add(newBrick);
                brickValue += brickBonus;
                if (brickValue < 32) {
                    brickBonus += 1;
                } else if (brickValue < 54) {
                    brickBonus += 2;
                } else if (brickValue < 98) {
                    brickBonus += 4;
                } else {
                    brickBonus += 6;
                }
            }else {
                newBrick = game.add.sprite(brickX, brickY, 'brick');
                game.physics.enable(newBrick, Phaser.Physics.ARCADE);
                newBrick.body.immovable = true;
                newBrick.anchor.set(0.5);
                bricks.add(newBrick);
            }
        }
    }
}
function getLevelData() {
    var request = new XMLHttpRequest();
    request.open("POST", "levels.json");
    request.onreadystatechange = function() {
        if (this.readyState == this.DONE && this.status == 200) {
            if (this.responseText) {
                parseLevels(this.responseText, stage);
                initLevel();
            }
            else {
                console.log("Error: Data is empty");
            }
        }
    };
    request.send();
}
function parseLevels(levelsJSON, stage) {
    if (levelsJSON == null || levelsJSON.trim() == "") {
        return;
    }
    var levelsArray = JSON.parse(levelsJSON);
    if (levelsArray.length == 0) {
        console.log("Error: Data is empty");
        return;
    }
    if (stage > levelsArray.length) {
        console.log("No more stages");
        stage = 1;
    }
    level = levelsArray[stage];
}
function initLevel() {
    // console.log('in init '+level);
    brickInfo = {
        width: 50,
        height: 30,
        count: {
            row: 3,
            col: 9
        },
        offset: {
            top: 45,
            left: 60
        },
        padding: 15
    }
    bnum = 0;
    bricks = game.add.group();
    metals = game.add.group();
    hardbricks = game.add.group();
    for(c=0; c<brickInfo.count.col; c++) {
        for(r=0; r<brickInfo.count.row; r++) {
            var brickX = (c*(brickInfo.width+brickInfo.padding))+brickInfo.offset.left;
            var brickY = (r*(brickInfo.height+brickInfo.padding))+brickInfo.offset.top;
            // console.log(level[bnum]);
            if (level[bnum] == 'm') {
                newBrick = game.add.sprite(brickX, brickY, 'metal');
                game.physics.enable(newBrick, Phaser.Physics.ARCADE);
                newBrick.body.immovable = true;
                newBrick.anchor.set(0.5);
                metals.add(newBrick);
                brickValue += brickBonus;
                if (brickValue < 32) {
                    brickBonus += 1;
                } else if (brickValue < 54) {
                    brickBonus += 2;
                } else if (brickValue < 98) {
                    brickBonus += 4;
                } else {
                    brickBonus += 6;
                }
            } else if (level[bnum] == 'h') {
                newBrick = game.add.sprite(brickX, brickY, 'hardbrick');
                game.physics.enable(newBrick, Phaser.Physics.ARCADE);
                newBrick.body.immovable = true;
                newBrick.anchor.set(0.5);
                hardbricks.add(newBrick);
            } else {
                newBrick = game.add.sprite(brickX, brickY, 'brick');
                game.physics.enable(newBrick, Phaser.Physics.ARCADE);
                newBrick.body.immovable = true;
                newBrick.anchor.set(0.5);
                bricks.add(newBrick);
            }
            bnum++;
        }
    }
}
function ballHitBrick(ball, brick) {
    // var killTween = game.add.tween(brick.scale);
    // killTween.to({x:0,y:0}, 50, Phaser.Easing.Linear.None);
    // killTween.onComplete.addOnce(function(){
    //     brick.kill();
    // }, this);
    // killTween.start();
    brick.kill();
    score += brickValue;
    scoreText.setText('Points: '+score);
    var count_alive = 0;
    for (i = 0; i < bricks.children.length; i++) {
        if (bricks.children[i].alive == true) {
            count_alive++;
        }
    }
    for (i = 0; i < hardbricks.children.length; i++) {
        if (hardbricks.children[i].alive == true) {
            count_alive++;
        }
    }
    if (count_alive <= 1) {
        alert('You destroyed stage '+stage+', congratulations!');
        stage++;
        stageText.setText('Stage '+stage);
        // location.reload();
        getLevelData();
        ballstart = (Math.random() * (1.00 - 0.15) + 0.05).toFixed(2);
        ball.reset(game.world.width*ballstart, game.world.height-25);
        paddle.reset(game.world.width*ballstart, game.world.height-5);
        game.input.onDown.addOnce(function(){
            lifeLostText.visible = false;
            ball.body.velocity.set(vitesse, -vitesse);
        }, this);
    }
}
function ballHitHardbrick(ball, hardbrick) {
    hardbrick.kill();
    score += brickValue;
    scoreText.setText('Points: '+score);
    brickX = hardbrick.world.x;
    brickY = hardbrick.world.y;
    newBrick = game.add.sprite(brickX, brickY, 'brick');
    game.physics.enable(newBrick, Phaser.Physics.ARCADE);
    newBrick.body.immovable = true;
    newBrick.anchor.set(0.5);
    bricks.add(newBrick);
}
function ballHitMetal(ball, metal) {
    score -= 1;
    scoreText.setText('Points: '+score);
    ball.animations.play('wobble');
}
function ballHitPaddle(ball, paddle) {
    ball.animations.play('wobble');
    ball.body.velocity.x = -1*vitesse/30*(paddle.x-ball.x);
}
function ballLeaveScreen() {
    lives--;
    if(lives) {
        livesText.setText('Lives: '+lives);
        lifeLostText.visible = true;
        ballstart = (Math.random() * (1.00 - 0.15) + 0.05).toFixed(2);
        ball.reset(game.world.width*ballstart, game.world.height-25);
        paddle.reset(game.world.width*ballstart, game.world.height-5);
        game.input.onDown.addOnce(function(){
            lifeLostText.visible = false;
            ball.body.velocity.set(vitesse, -vitesse);
        }, this);
    }
    else {
        alert('You lost, game over!');
        location.reload();
    }
}
