import Player from './player.js'
import { InputHandler } from './input.js'
import { Background } from './background.js'
import { FlyingEnemy, GroundEnemy, ClimbingEnemy } from './enemies.js'
import { UI } from './UI.js'

window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas1')
    const ctx = canvas.getContext('2d')
    canvas.width = 1000
    canvas.height = 500

    class Game {
        constructor(width, height) {
            this.width = width
            this.height = height
            this.groundMargin = 40
            this.speed = 0
            this.maxSpeed = 2
            this.background = new Background(this)
            this.player = new Player(this)
            this.input = new InputHandler(this)
            this.UI = new UI(this)

            this.enemies = []
            this.particles = []
            this.collisions = []
            this.enemyTimer = 0
            this.enemyInterval = 1000

            this.debug = false

            this.score = 0
            this.fontColor = 'black'

            this.maxParticles = 100


            this.time = 0
            this.maxTime = 15000

            this.gameOver = false

            this.lives = 5

            this.player.currentState = this.player.states[0]
            this.player.currentState.enter()
        }
        update(deltaTime) {

            this.time += deltaTime
            if (this.time > this.maxTime) this.gameOver = true

            this.background.update()
            this.player.update(this.input.keys, deltaTime)

            //handles enemies
            if (this.enemyTimer > this.enemyInterval) {
                this.addEnemy()
                this.enemyTimer = 0
            } else {
                this.enemyTimer += deltaTime
            }
            this.enemies.forEach(enemy => {
                enemy.update(deltaTime)
                if (enemy.markedForDeletion) this.enemies.splice(this.enemies.indexOf(enemy), 1)
            })

            //handles particles
            this.particles.forEach((particle, index) => {
                particle.update()
                if (particle.markedForDeletion) this.particles.splice(index, 1); //this method will delete one lement from the index
            })

            //console.log(this.particles)

            if (this.particles.length > this.maxParticles) {
                this.particles = this.particles.slice(0, this.maxParticles) // this method will keep the elements from 0 to max particles and splice one lement that exceeds the max particle index
            }

            //console.log(this.particles)

            //handling collision sprites

            this.collisions.forEach((collision, index) => {
                collision.update(deltaTime);
                if (collision.markedForDeletion) this.collisions.splice(index, 1)
            })
        }


        draw(context) {
            this.background.draw(context)
            this.player.draw(context)

            this.enemies.forEach(enemy => {
                enemy.draw(context)
            })

            this.particles.forEach(particle => {
                particle.draw(context)
            })

            this.collisions.forEach(collision => {
                collision.draw(context)
            })


            this.UI.draw(context)
        }

        addEnemy() {

            if (this.speed > 0 && Math.random() < 0.5) this.enemies.push(new GroundEnemy(this))
            else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this))

            this.enemies.push(new FlyingEnemy(this))
            //console.log(this.enemies)
        }
    }

    const game = new Game(canvas.width, canvas.height)
    //console.log(game)

    let lastTime = 0

    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime
        lastTime = timeStamp
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        game.update(deltaTime)
        game.draw(ctx)
        if (!game.gameOver) requestAnimationFrame(animate)

    }

    animate(0)

})