(()=>{"use strict";const t={CONTROL_KEYS:["ArrowDown","ArrowUp","ArrowLeft","ArrowRight","KeyW","KeyA","KeyS","KeyD","Space"],STARS_COUNT:100,CRASH_SOUND_INTERVAL:10,CIRCLE_FULL_ANGLE:2*Math.PI,PLAYER_IMAGE_WIDTH:48,PLAYER_IMAGE_HEIGHT:48,PLAYER_RADIUS:24,PLAYER_SPEED:5,PLAYER_ZERO_ANGLE:.5*-Math.PI,CROSSHAIR_CORRECTION:10,SOUND_ENGINE_FADEOUT:.04,PROJECTILE_SPEED:20,PROJECTILE_RADIUS:3,PROJECTILE_COLOR:"white",ASTEROID_IMAGE_SIZE:120,ASTEROID_FULLSIZE:120,ASTEROID_HALFSIZE:70,ASTEROID_MINSIZE:40,ASTEROIDS_INTERVAL:1e3,ASTEROIDS_MIN_INTERVAL:500,ASTEROID_INITIAL_SPEED:50,ASTEROID_SPEED_MULTIPLIER:.01,ASTEROID_SPEED_TO_SIZE_VARIABILITY:10,ASTEROID_ROTATION_SPEED:5,ASTEROID_SIZE_VARIABILITY:.1,DEBRIS_COUNT_FULLSIZE:2,DEBRIS_COUNT_HALFSIZE:3,LIMIT_ASTEROIDS:100,PARTICLES_SIZE_RATIO:.015,PARTICLES_COUNT:15,PARTICLES_BLINKAGE_MULT:2,PARTICLES_FRICTION:.99,PARTICLES_FADEOUT:.01,LIMIT_PARTICLES:1e3,SCORE_FULLSIZE:1,SCORE_HALFSIZE:2,SCORE_MINSIZE:4,SCORE_FONT_SIZE:40,FONT_COLOR:"white",TITLE_FONT:"pixelEmulator",MAIN_FONT:"pixelColeco",HUD_HORIZONTAL_OFFSET:30,HUD_VERTICAL_FONT_OFFSET:50,HUD_VERTICAL_ICON_OFFSET:20,EXPLOSION_IMAGE_SIZE:94,MUTE_IMAGE_WIDTH:317,MUTE_IMAGE_HEIGHT:270,MUTE_ICON_WIDTH:50};function i(t,i){return Math.random()*(i-t)+t}function e(t,i){return t=Math.ceil(t),i=Math.floor(i),Math.floor(Math.random()*(i-t+1))+t}function s(t,i){i||t.play()}function h(){return Math.random()<.5}function a(t,i,e){this.x=t,this.y=i,this.isMuted=e,this.image=document.getElementById("explosionImage"),this.frameX=0,this.maxFrame=14,this.fps=20,this.frameTimer=0,this.frameInterval=1e3/this.fps,this.sound=new Audio,this.sound.src="./assets/sounds/explode.wav",this.playSound()}function o(t,i,e,s){this.gameWidth=t,this.gameHeight=i,this.radius=e,this.addProjectile=s,this.diameter=2*e,this.image=document.getElementById("playerImage"),this.horizontalSpeed=0,this.verticalSpeed=0,this.frameX=0,this.frameY=0,this.maxFrame=3,this.fps=10,this.frameTimer=0,this.frameInterval=1e3/this.fps,this.sound=new Audio,this.sound.src="./assets/sounds/enginehum.ogg",this.sound.loop=!0,this.sound.volume=0,this.init()}function r(i,e,s){this.setAngle=i,this.setPause=e,this.setMute=s,this.keys=new Set,window.addEventListener("keydown",(i=>{const{code:e}=i;t.CONTROL_KEYS.includes(e)&&(i.preventDefault(),this.keys.add(e))})),window.addEventListener("keyup",(t=>{this.keys.delete(t.code)})),window.addEventListener("click",(t=>{this.keys.add("Shoot")})),window.addEventListener("mousemove",(i=>{const{CROSSHAIR_CORRECTION:e}=t,s=i.clientX-e,h=i.clientY-e;this.setAngle(s,h)})),window.addEventListener("keypress",(t=>{const{code:i}=t;"KeyP"===i?this.setPause():"KeyM"===i&&this.setMute()}))}function n(s,h,a,o,r){this.x=s,this.y=h,this.velocity=a,this.color=o,this.initialSize=r,this.sizeVariability=this.initialSize*t.ASTEROID_SIZE_VARIABILITY,this.radius=.5*r+i(-this.sizeVariability,this.sizeVariability),this.diameter=2*this.radius,this.image=document.getElementById("asteroidImage"),this.angle=Math.random()*Math.PI,this.rotateSpeed=i(-t.ASTEROID_ROTATION_SPEED,t.ASTEROID_ROTATION_SPEED)/this.initialSize,this.frameX=e(0,4),this.sound=new Audio,this.sound.src=`./assets/sounds/explosion${e(1,9)}.wav`}function d(t,i,e,s,h){this.x=t,this.y=i,this.velocity=e,this.color=s,this.radius=h,this.alpha=1,this.markedForDeletion=!1}function l(t,i,e,s){this.x=t,this.y=i,this.velocity=e,this.isMuted=s,this.markedForDeletion=!1,this.soundShot=new Audio,this.soundShot.src="./assets/sounds/pew.wav",this.soundExplode=new Audio,this.soundExplode.src="./assets/sounds/explodemini.wav",this.playSoundShot()}function m(t,i,e){this.score=e,this.gameWidth=t,this.gameHeight=i}function c(t,s){this.gameWidth=t,this.gameHeight=s,this.x=e(0,this.gameWidth),this.y=e(0,this.gameHeight),this.color=`hsl(${e(45,65)}, 10%, ${e(40,100)}%)`,this.blinkageMult=i(.9,2),this.secondBlinkageMult=Math.random(),this.size=Math.random(),this.fps=i(5,15),this.frameTimer=0,this.frameInterval=1e3/this.fps}function I(t,i,e){this.gameWidth=t,this.gameHeight=i,this.bestScore=e}function E(t,i){this.gameWidth=t,this.gameHeight=i}function S(i,e){this.gameWidth=i,this.gameHeight=e,this.image=document.getElementById("muteImage"),this.frameX=0,this.iconWidth=t.MUTE_ICON_WIDTH,this.iconHeight=this.iconWidth*(this.gameHeight/this.gameWidth)}function u(){}function T(i,e,s,h){this.scene="menu",this.gameWidth=i,this.gameHeight=e,this.context=s,this.contextStars=h,this.score=0,this.bestScore=localStorage.getItem("bestScore")??0,this.isMuted=!!JSON.parse(localStorage.getItem("isMuted")),this.isPaused=!1,this.projectiles=[],this.asteroids=[],this.particles=[],this.stars=[],this.explosion=[],this.player=new o(this.gameWidth,this.gameHeight,t.PLAYER_RADIUS,this.addProjectile.bind(this)),this.startScreen=new I(this.gameWidth,this.gameHeight,this.bestScore),this.gameoverText=new E(this.gameWidth,this.gameHeight),this.input=new r(this.player.setAngle.bind(this.player),this.setPause.bind(this),this.setMute.bind(this)),this.scoreInfo=new m(this.gameWidth,this.gameHeight,this.score),this.muteIcon=new S(this.gameWidth,this.gameHeight),this.pauseText=new u,this.lastTime=0,this.animationId,this.asteroidTimer=0,this.crashSoundTimer=0,this.permissionToPlayCrashSound=!0,this.asteroidsInterval=t.ASTEROIDS_INTERVAL}a.prototype={playSound(){s(this.sound,this.isMuted)},draw(i){const{EXPLOSION_IMAGE_SIZE:e}=t;this.frameX<=15&&i.drawImage(this.image,e*this.frameX,0,e,e,this.x-e/2,this.y-e/2,e,e)},update(t){this.frameX<=15&&(this.frameTimer>this.frameInterval?(this.frameX<=this.maxFrame&&this.frameX++,this.frameTimer=0):this.frameTimer+=t)}},o.prototype={init(){this.soundVolume=0,this.x=.5*this.gameWidth-this.radius,this.y=.5*this.gameHeight-this.radius,this.angle=t.PLAYER_ZERO_ANGLE,this.isAlive=!0},setAngle(t,i){this.angle=Math.atan2(i-this.y,t-this.x)},shoot(){const{PROJECTILE_SPEED:i}=t,e={x:Math.cos(this.angle)*i,y:Math.sin(this.angle)*i},s=this.x+this.radius,h=this.y+this.radius;this.addProjectile(s,h,e)},die(t,i){this.isAlive=!1,this.horizontalSpeed=0,this.verticalSpeed=0,this.soundVolume=0,t.push(new a(this.x+this.radius,this.y+this.radius,i))},draw(i){const{PLAYER_IMAGE_WIDTH:e,PLAYER_IMAGE_HEIGHT:s}=t;this.isAlive&&(i.save(),i.translate(this.x+this.radius,this.y+this.radius),i.rotate(this.angle+Math.PI/2),i.drawImage(this.image,e*this.frameX,s*this.frameY,e,s,0-this.radius,0-this.radius,this.diameter,this.diameter),i.restore())},update(i,e,s,h){const{PLAYER_SPEED:a,SOUND_ENGINE_FADEOUT:o}=t;this.x+=this.horizontalSpeed,this.y+=this.verticalSpeed,"gameplay"===h&&this.isAlive&&(i.keys.has("ArrowRight")||i.keys.has("KeyD")?this.horizontalSpeed=a:i.keys.has("ArrowLeft")||i.keys.has("KeyA")?this.horizontalSpeed=-a:this.horizontalSpeed=0,i.keys.has("ArrowUp")||i.keys.has("KeyW")?this.verticalSpeed=-a:i.keys.has("ArrowDown")||i.keys.has("KeyS")?this.verticalSpeed=a:this.verticalSpeed=0,i.keys.has("Shoot")&&(this.shoot(),i.keys.delete("Shoot"))),this.x<0?this.x=0:this.x>this.gameWidth-this.diameter&&(this.x=this.gameWidth-this.diameter),this.y<0?this.y=0:this.y>this.gameHeight-this.diameter&&(this.y=this.gameHeight-this.diameter),0!==this.horizontalSpeed||0!==this.verticalSpeed?(this.soundVolume+=o,this.frameY=1):(this.soundVolume-=o,this.frameY=0),this.soundVolume>1&&(this.soundVolume=1),this.soundVolume<0&&(this.soundVolume=0),s&&(this.soundVolume=0),this.sound.volume=this.soundVolume,this.frameTimer>this.frameInterval?(this.frameX>=this.maxFrame?this.frameX=0:this.frameX++,this.frameTimer=0):this.frameTimer+=e}},n.prototype={draw(i){const{ASTEROID_IMAGE_SIZE:e}=t;i.save(),i.translate(this.x,this.y),i.rotate(this.angle),i.filter=`\n    hue-rotate(${this.color.hue}deg)\n    saturate(${this.color.saturation}%)\n    brightness(${this.color.brightness}%)\n  `,i.drawImage(this.image,e*this.frameX,0,e,e,-this.radius,-this.radius,this.diameter,this.diameter),i.restore()},update(i,e){this.x+=this.velocity.x,this.y+=this.velocity.y,this.angle+=this.rotateSpeed;const{CIRCLE_FULL_ANGLE:s}=t;this.angle>=s&&(this.angle=s-this.angle),(this.x+this.diameter<0||this.x-this.diameter>i||this.y+this.diameter<0||this.y-this.diameter>e)&&(this.markedForDeletion=!0)}},d.prototype={draw(e){const{PARTICLES_BLINKAGE_MULT:s,CIRCLE_FULL_ANGLE:h}=t;e.save(),e.globalAlpha=this.alpha,e.beginPath(),e.arc(this.x,this.y,i(this.radius,this.radius*s),0,h),e.fillStyle=`hsl(${this.color.hue}, ${this.color.saturation}%, ${this.color.brightness}%)`,e.fill(),e.restore()},update(){const{PARTICLES_FRICTION:i,PARTICLES_FADEOUT:e}=t;this.velocity.x*=i,this.velocity.y*=i,this.x+=this.velocity.x,this.y+=this.velocity.y,this.alpha-=e,this.alpha<=.01&&(this.markedForDeletion=!0)}},l.prototype={playSoundShot(){s(this.soundShot,this.isMuted)},draw(i){const{PROJECTILE_RADIUS:e,CIRCLE_FULL_ANGLE:s,PROJECTILE_COLOR:h}=t;i.beginPath(),i.arc(this.x,this.y,e,0,s),i.fillStyle=h,i.fill()},update(i,e){this.x+=this.velocity.x,this.y+=this.velocity.y;const{PROJECTILE_RADIUS:s}=t;(this.x+s<0||this.x-s>i||this.y+s<0||this.y-s>e)&&(this.markedForDeletion=!0)}},m.prototype={update(t){this.score=t},draw(i){const{FONT_COLOR:e,SCORE_FONT_SIZE:s,MAIN_FONT:h,HUD_HORIZONTAL_OFFSET:a,HUD_VERTICAL_FONT_OFFSET:o}=t;i.fillStyle=e,i.font=`${s}px ${h}`,i.textAlign="start",i.fillText("Score: "+this.score,a,o)}},c.prototype={draw(i,e){this.frameTimer>this.frameInterval?(this.secondBlinkageMult=Math.random(),this.frameTimer=0):this.frameTimer+=e,i.beginPath(),i.arc(this.x,this.y,this.size+this.secondBlinkageMult*this.blinkageMult,0,t.CIRCLE_FULL_ANGLE),i.fillStyle=this.color,i.fill()}},I.prototype={draw(i){const e=.5*this.gameWidth,s=.5*this.gameHeight,h=.05*this.gameWidth,a=.06*this.gameWidth,o=.03*this.gameWidth,r=(2*a+2*o)/2;let n,d=e;const{FONT_COLOR:l,TITLE_FONT:m,MAIN_FONT:c}=t;i.fillStyle=l,i.textAlign="center",i.font=`${h}px ${m}`,n=s-r,i.fillText("ASTEROID CRUSHER",d,n),i.font=`${.5*h}px ${c}`,n+=a,i.fillText(`Best Score: ${this.bestScore}`,d,n),n+=a,i.font=`${.7*h}px ${c}`,i.fillText("Press SPACE to Start!",d,n),i.font=`${.3*h}px ${c}`,n+=a,i.fillText("Use WASD or Arrow keys to move, Mouse to aim and shoot",d,n),n+=o,i.fillText("M to mute sound, P to pause game",d,n),n+=o,i.fillText("I recommend to use your browser's fullscreen mode!",d,n)}},E.prototype={draw(i,e,s){const h=.5*this.gameWidth,a=.5*this.gameHeight,o=.05*this.gameWidth,r=.05*this.gameWidth,n=.03*this.gameWidth,d=(r+2*n)/2;let l,m=h;const{TITLE_FONT:c,MAIN_FONT:I}=t;i.fillStyle=t.FONT_COLOR,i.textAlign="center",i.font=`${o}px ${c}`,l=a-d,i.fillText("GAME OVER",m,l),i.font=`${.3*o}px ${I}`,e>s?(l+=r,i.fillText("Congratulations, you set a new record!",m,l),l+=n,i.fillText(`Your score is: ${e}`,m,l),localStorage.setItem("bestScore",e)):(l+=r,i.fillText(`Your score is: ${e}`,m,l),l+=n,i.fillText(`Best score is: ${s}`,m,l)),i.font=`${.5*o}px ${I}`,l+=r,i.fillText("Press SPACE to Start again!",m,l)}},S.prototype={update(t){this.frameX=t?1:0},draw(i){const{MUTE_IMAGE_WIDTH:e,MUTE_IMAGE_HEIGHT:s,HUD_HORIZONTAL_OFFSET:h,HUD_VERTICAL_ICON_OFFSET:a}=t;i.drawImage(this.image,e*this.frameX,0,e,s,this.gameWidth-this.iconWidth-h,a,this.iconWidth,this.iconHeight)}},u.prototype={draw(i,e,s){const h=.5*e,a=.5*s,o=.05*e,r=.3*o;i.fillStyle=t.FONT_COLOR,i.textAlign="center",i.font=`${o}px ${t.TITLE_FONT}`,i.fillText("PAUSE",h,a+r)}},T.prototype={init(){this.scene="gameplay",this.projectiles=[],this.asteroids=[],this.particles=[],this.explosion=[],this.player.init(),this.input.keys.delete("Shoot"),this.score=0,this.lastTime=0,this.asteroidTimer=0,this.crashSoundTimer=0,this.permissionToPlayCrashSound=!0},windowResize(){const t=window.innerWidth,i=window.innerHeight;this.gameWidth=t,this.gameHeight=i,this.player.gameWidth=t,this.player.gameHeight=i,this.scoreInfo.gameWidth=t,this.scoreInfo.gameHeight=i,this.muteIcon.gameWidth=t,this.muteIcon.gameHeight=i,this.startScreen.gameWidth=t,this.startScreen.gameHeight=i,this.gameoverText.gameWidth=t,this.gameoverText.gameHeight=i,this.stars=[],this.addStars()},handleKeys(){this.input.keys.has("Space")&&("menu"===this.scene?(this.scene="gameplay",this.player.sound.play()):"gameplay"!==this.scene||this.player.isAlive||this.init(),this.input.keys.delete("Space"))},setPause(){"gameplay"===this.scene&&this.player.isAlive&&(this.isPaused?(this.isPaused=!1,this.animate(0)):(this.isPaused=!0,this.pauseText.draw(this.context,this.gameWidth,this.gameHeight),cancelAnimationFrame(this.animationId)))},setMute(){this.isMuted=!this.isMuted,localStorage.setItem("isMuted",this.isMuted)},setScene(t){this.scene=t},addStars(){for(let i=0;i<=t.STARS_COUNT;i++)this.stars.push(new c(this.gameWidth,this.gameHeight))},addProjectile(t,i,e){this.projectiles.push(new l(t,i,e,this.isMuted))},addNewAsteroid(s){let a,o;const r={hue:e(0,360),saturation:e(0,100),brightness:e(70,100)},{ASTEROID_FULLSIZE:d}=t;if(this.asteroidTimer>this.asteroidsInterval){h()?(a=h()?0-d:this.gameWidth+d,o=i(0,this.gameHeight)):(a=i(0,this.gameWidth),o=h()?0-d:this.gameHeight+d);const t=Math.random()*this.calculateAsteroidSpeedMult(d),e={x:a<0?t:-t,y:o<0?t:-t};this.asteroids.push(new n(a,o,e,r,d)),this.asteroidTimer=0}else this.asteroidTimer+=s},addBrokenAsteroids(i,e,s,h,a){if(this.asteroids.length<t.LIMIT_ASTEROIDS)for(let t=1;t<=a;t++){const t={x:(Math.random()-.5)*this.calculateAsteroidSpeedMult(h),y:(Math.random()-.5)*this.calculateAsteroidSpeedMult(h)};this.asteroids.push(new n(i,e,t,s,h))}},calculateAsteroidSpeedMult(i){const{ASTEROID_SPEED_MULTIPLIER:e,ASTEROID_INITIAL_SPEED:s,ASTEROID_SPEED_TO_SIZE_VARIABILITY:h}=t;return(this.score*e+s)/(i/h)},asteroidBrake(i){const{PARTICLES_SIZE_RATIO:e,DEBRIS_COUNT_FULLSIZE:s,ASTEROID_HALFSIZE:h,DEBRIS_COUNT_HALFSIZE:a,ASTEROID_MINSIZE:o}=t;!0!==this.permissionToPlayCrashSound||this.isMuted||(i.sound.play(),this.permissionToPlayCrashSound=!1,this.crashSoundTimer=0),i.markedForDeletion=!0;const r=i.initialSize*e;let n,d;switch(i.initialSize){case t.ASTEROID_FULLSIZE:n=s,d=h;break;case t.ASTEROID_HALFSIZE:n=a,d=o;break;default:n=0}this.createParticles(i.x,i.y,i.color,r),n&&this.addBrokenAsteroids(i.x,i.y,i.color,d,n)},createParticles(i,e,s,h){const{LIMIT_PARTICLES:a,PARTICLES_COUNT:o}=t;if(this.particles.length<a)for(let t=0;t<=o;t++){const t={x:(Math.random()-.5)*(10*Math.random()),y:(Math.random()-.5)*(10*Math.random())};this.particles.push(new d(i,e,t,s,h))}},collisionWithPlayer(t){if(this.player.isAlive){const i=this.player.x+this.player.radius-t.x,e=this.player.y+this.player.radius-t.y;Math.hypot(i,e)-t.radius-this.player.radius<1&&this.player.die(this.explosion,this.isMuted)}},collisionWithProjectiles(t){this.projectiles.forEach((i=>{Math.hypot(i.x-t.x,i.y-t.y)-t.radius<1&&(i.markedForDeletion=!0,s(i.soundExplode,this.isMuted),this.asteroidBrake(t),this.increaseScore(t))}))},increaseScore(i){let e;const{ASTEROID_FULLSIZE:s,SCORE_FULLSIZE:h,ASTEROID_HALFSIZE:a,SCORE_HALFSIZE:o,SCORE_MINSIZE:r,ASTEROIDS_INTERVAL:n,ASTEROIDS_MIN_INTERVAL:d}=t;switch(i.initialSize){case s:e=h;break;case a:e=o;break;default:e=r}this.score+=e,this.asteroidsInterval>d&&(this.asteroidsInterval=n-this.score)},collisionWithAsteroids(t){this.asteroids.forEach((i=>{t!==i&&t.color!==i.color&&(t.x>0||t.x<this.gameWidth)&&(t.y>0||t.y<this.gameHeight)&&Math.hypot(i.x-t.x,i.y-t.y)-t.radius-i.radius<1&&(this.asteroidBrake(t),this.asteroidBrake(i))}))},gameplay(i){this.crashSoundTimer>t.CRASH_SOUND_INTERVAL?(this.permissionToPlayCrashSound=!0,this.crashSoundTimer=0):this.crashSoundTimer+=i,this.projectiles.forEach((t=>{t.update(this.gameWidth,this.gameHeight),t.draw(this.context)})),this.player.draw(this.context),this.player.update(this.input,i,this.isMuted,this.scene),this.addNewAsteroid(i),this.asteroids.forEach((t=>{t.update(this.gameWidth,this.gameHeight),t.draw(this.context),this.collisionWithPlayer(t),this.collisionWithProjectiles(t),(t.x>0||t.x<this.gameWidth)&&(t.y>0||t.y<this.gameHeight)&&this.collisionWithAsteroids(t)})),this.particles.forEach((t=>{t.update(),t.draw(this.context)})),this.projectiles=this.projectiles.filter((t=>!t.markedForDeletion)),this.asteroids=this.asteroids.filter((t=>!t.markedForDeletion)),this.particles=this.particles.filter((t=>!t.markedForDeletion))},drawMenuScene(){this.startScreen.draw(this.context)},drawGameOverText(){this.gameoverText.draw(this.context,this.score,this.bestScore)},animate(t){const i=t-this.lastTime;this.lastTime=t,this.animationId=window.requestAnimationFrame(this.animate.bind(this)),this.context.clearRect(0,0,this.gameWidth,this.gameHeight),this.contextStars.fillStyle="rgba(0, 0, 0, 0.1)",this.contextStars.fillRect(0,0,this.gameWidth,this.gameHeight),this.stars.forEach((t=>{t.draw(this.contextStars,i)})),this.handleKeys(),"menu"===this.scene&&this.drawMenuScene(),"gameplay"===this.scene&&(this.gameplay(i),this.player.isAlive?(this.scoreInfo.draw(this.context),this.scoreInfo.update(this.score)):(this.explosion[0].draw(this.context,this.player.x+this.player.radius,this.player.y+this.player.radius),this.explosion[0].update(i),this.drawGameOverText())),this.muteIcon.draw(this.context),this.muteIcon.update(this.isMuted)}};const g=document.getElementById("canvas"),A=document.getElementById("starcanvas"),p=g.getContext("2d"),_=A.getContext("2d");O();const y=new T(window.innerWidth,window.innerHeight,p,_);function O(){g.width=window.innerWidth,g.height=window.innerHeight,A.width=window.innerWidth,A.height=window.innerHeight}window.addEventListener("load",(function(){document.getElementById("loader").classList.add("hidden"),y.addStars(),y.animate(0)})),window.addEventListener("resize",(()=>{y.windowResize(),O()}))})();