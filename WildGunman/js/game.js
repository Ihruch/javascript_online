function Game() {
    var self = this;
    var bg = document.querySelector('.game__bg');
    var gameField = document.querySelector('#game');
    var score = 0;
    var shootTime;
    var gunman;


    this.__newLevel = function () {
        Game.dispatchEvent(Game.Events.NewLevel);

        var type = Math.ceil(Math.random() * 5),
            waitTime = Math.round(200 + Math.random() * 1500),
            fireSpeed = 100 * (2 + Math.ceil(Math.random() * 10));

        gunman.setup(type, waitTime, fireSpeed);
        UI.updateBanditTime(gunman.getFireSpeed());
    };

    this.attachEvents = function () {
        var self = this;

        Game.on(Game.Events.NewLevel, function () {
            bg.className = 'game__bg';
            shootTime = 0;
        });
        Game.on(Game.Events.Fire, function (eventData) {
            bg.classList.add('game__bg_state_blink');
            bg.addEventListener('animationend', function () {
                bg.classList.remove('game__bg_state_blink');
            });
            shootTime = new Date() - eventData.gunman.getFireStartTime();
            console.log(shootTime);
        });
        Game.on(Game.Events.Fool, function () {
            bg.classList.add('game__bg_state_foul');
        });
        Game.on(Game.Events.Death, function () {
            bg.classList.add('game__bg_state_death');
        });

        Game.on(Game.Events.Win, function () {
            score += shootTime;
            UI.updateScore(score, function () {
                self.__newLevel();
            });
        });
    };

    this.start = function () {
        this.attachEvents();
        gunman = new Gunman();
        gameField.appendChild(gunman.getNode());
        this.__newLevel();
    };
}

Game.__observers = {};
Game.Events = {
    NewLevel: 10,
    Fire: 11,
    Fool: 12,
    Death: 13,
    Win: 14
};

Game.dispatchEvent = function (eventId, eventData) {
    var events = this.__observers[eventId];
    if (events) {
        events.forEach(function (fn) {
            fn && fn(eventData);
        })
    }
};

Game.on = function (timerId, stage, fn) {
    var key = arguments.length === 3 ? timerId + '.' + stage : timerId,
        observers = Game.__observers[key];
    if (!observers) {
        observers = Game.__observers[key] = [];
    }
    observers.push(arguments.length === 3 ? fn : stage);
};

game.addEventListener('timeout', function (e) {
    var events = Game.__observers[e.detail.name + '.' + e.detail.step];
    if (events) {
        events.forEach(function (fn) {
            fn();
        })
    }
});