function GunmanGame() {
    var self = this;

    var bg = document.querySelector('.game__bg');
    var bubble = document.querySelector('.game__bubble');
    var gameField = document.querySelector('#game');
    var playerTimerNode = document.querySelector('.game__timers-player');
    var banditTimerNode = document.querySelector('.game__timers-bandit');
    var score = 0;

    this.newLevel = function () {
        bg.className = 'game__bg';
        bubble.style.display = 'none';
        playerTimerNode.textContent = '0.00';

        function createRandomGunman(context) {
            var type = Math.ceil(Math.random() * 5),
                waitTime = Math.round(200 + Math.random() * 1500),
                fireSpeed = 100 * (2 + Math.ceil(Math.random() * 10));
            return new Gunman(context, type, waitTime, fireSpeed);
        }

        var gunman = createRandomGunman(self);
        gunman.getNode().style.left = '100%';
        gameField.appendChild(gunman.getNode());
        gunman.setState(Gunman.State.WALK);
        gunman.moveToCenter(Math.random() > 0.5 ? Gunman.Side.RIGHT : Gunman.Side.LEFT, function () {
            gunman.setState(Gunman.State.READY);
            gunman.ready();
        });

        banditTimerNode.textContent = (gunman.getFireSpeed() / 1000).toFixed(2);

        gunman.getNode().addEventListener('banditKilled', function (e) {
            playerTimerNode.classList.add('game__timers-player_mode_blink');
            score += gunman.getFireSpeed() - e.detail.time;
            setTimeout(function () {
                Player.play(Sound.Win);
                setTimeout(function(){
                    self.updateScore(function () {
                        gunman.getNode().remove();
                        self.newLevel();
                    })
                , 4000})

            }, 1000);

        })
    };
    this.updatePlayerTime = function(timeString){
        playerTimerNode.textContent = timeString ? (timeString / 1000).toFixed(2) : 'OVER';
    };

    this.blink = function () {
        bg.classList.add('game__bg_state_blink');
        bg.addEventListener('animationend', function () {
            bg.classList.remove('game__bg_state_blink');
        })

    };

    this.foul = function () {
        bg.classList.add('game__bg_state_foul');
    };

    this.death = function () {
        bg.classList.add('game__bg_state_death');
    };

    this.showBubble = function (text) {
        bubble.style.display = 'block';
        bubble.textContent = text;
    };

    this.updateScore = function (callback) {
        document.querySelector('.game__status-reward-value').textContent = score.toString();
        callback();
    };

    this.start = function () {
        this.newLevel();
    };
}

