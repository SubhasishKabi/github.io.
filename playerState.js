import { Dust, Fire, Splash } from "./particles.js"

const states = {
    SITTING: 0,
    RUNNING: 1,
    JUMPING: 2,
    FALLING: 3,
    ROLLING: 4,
    DIVING: 5,
    HIT: 6,
}

class state {
    constructor(state, game) { //state is a parameter like 'jumping', 'running'
        this.state = state
        this.game = game
    }
} //class in not instantiated. hence it wil have same parameters as the child class

export class Sitting extends state {
    constructor(game) { //game is the object of game class, passed as 'this' while Sitting class instantiated in main.js
        super('SITTING', game)
    }

    enter() {
        this.game.player.frameX = 0
        this.game.player.frameY = 5
        this.game.player.maxFrame = 4

    }

    handleInput(input) {
        if (input.includes('ArrowLeft') || input.includes('ArrowRight')) {
            this.game.player.setState(states.RUNNING, 1)
        } else if (input.includes('Enter')) {
            this.game.player.setState(states.ROLLING, 2)
        }
    }
}

export class Running extends state {
    constructor(game) {
        super('RUNNING', game)
    }

    enter() {
        this.game.player.frameX = 0
        this.game.player.frameY = 3
        this.game.player.maxFrame = 6

    }

    handleInput(input) {

        this.game.particles.unshift(new Dust(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height))


        //unshift adds one or more elements to the beginning of the array and returns the new length of the array


        if (input.includes('ArrowDown')) {
            this.game.player.setState(states.SITTING, 0)
        } else if (input.includes('ArrowUp')) {
            this.game.player.setState(states.JUMPING, 1)
        } else if (input.includes('Enter')) {
            this.game.player.setState(states.ROLLING, 2)
        }
    }
}


export class Jumping extends state {
    constructor(game) {
        super('JUMPING', game)
    }

    enter() {
        if (this.game.player.onGround()) this.game.player.vy -= 20
        this.game.player.frameY = 1
        this.game.player.maxFrame = 6
        this.game.player.frameX = 0
    }

    handleInput(input) {
        if (this.game.player.vy > this.game.player.weight) { //vy becomes positive, then it falls down
            this.game.player.setState(states.FALLING, 1)
        } else if (input.includes('Enter')) {
            this.game.player.setState(states.ROLLING, 2)
        } else if (input.includes('ArrowDown')) {
            this.game.player.setState(states.DIVING, 0)
        }
    }
}

export class Falling extends state {
    constructor(game) {
        super('FALLING', game)
    }

    enter() {
        this.game.player.frameY = 2
        this.game.player.maxFrame = 6
        this.game.player.frameX = 0


    }

    handleInput(input) {
        if (this.game.player.onGround()) {
            this.game.player.setState(states.RUNNING, 1)
        } else if (input.includes('ArrowDown')) {
            this.game.player.setState(states.DIVING, 0)
        }
    }
}


export class Rolling extends state {
    constructor(game) {
        super('ROLLING', game)
    }

    enter() {
        this.game.player.frameY = 6
        this.game.player.maxFrame = 6
        this.game.player.frameX = 0


    }

    handleInput(input) {

        this.game.particles.unshift(new Fire(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height * 0.5))



        if (!input.includes('Enter') && this.game.player.onGround()) {
            this.game.player.setState(states.RUNNING, 1)
        } else if (!input.includes('Enter') && !this.game.player.onGround()) {
            this.game.player.setState(states.FALLING, 1)
        }
        else if (input.includes('Enter') && input.includes('ArrowUp') && this.game.player.onGround()) {
            this.game.player.vy -= 22

        } else if (input.includes('ArrowDown') && !this.game.player.onGround()) {
            this.game.player.setState(states.DIVING, 0)
        }
    }
}


//diving will use the same  sprite animation row as rolling. ie the animaton will be same as rolling
export class Diving extends state {
    constructor(game) {
        super('DIVING', game)
    }

    enter() {
        this.game.player.frameY = 6
        this.game.player.maxFrame = 6
        this.game.player.frameX = 0
        this.game.player.vy = 15

    }

    handleInput(input) {

        this.game.particles.unshift(new Fire(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height * 0.5))



        if (this.game.player.onGround()) {

            this.game.player.setState(states.RUNNING, 1);
            for (let i = 0; i < 30; i++) {

                this.game.particles.unshift(new Splash(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height)) 
            }

           
        }
        else if (input.includes('Enter') && this.game.player.onGround()) {
            this.game.player.setState(states.ROLLING, 2)
        }

    }
}



export class Hit extends state {
    constructor(game) {
        super('HIT', game)
    }

    enter() {
        this.game.player.frameY = 4
        this.game.player.maxFrame = 10
        this.game.player.frameX = 0


    }

    handleInput(input) {

        if(this.game.player.frameX >= 10 && this.game.player.onGround()){
            this.game.player.setState(states.RUNNING, 1)
        } else if(this.game.player.frameX >= 10 && !this.game.player.onGround()){
            this.game.player.setState(states.FALLING, 2)
        }

    }
}