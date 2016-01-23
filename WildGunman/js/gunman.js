function Gunman() {
    var self = this,
        clickHandler = function (e) {
            e.target.removeEventListener(e.type, arguments.callee);
            Timer.cancelAll();
            Game.dispatchEvent(Game.Events.Fire, {
                gunman: self
            });
        };

    this.__node = document.createElement('div');
    this.__state = Gunman.State.WALK;
    this.__fireStartTime = 0;

    this.getFireSpeed = function () {
        return self.__fireTime;
    };

    this.getNode = function () {
        return self.__node;
    };
    this.getState = function () {
        return this.__state;
    };
    this.setState = function (newState) {
        this.__node.classList.remove('gunman_state_' + this.__state);
        this.__state = newState;
        this.__node.classList.add('gunman_state_' + this.__state);
    };

    this.setup = function(type, waitTime, fireTime){
        this.__state = Gunman.State.WALK;
        this.__node.style.left = '0%';
        this.__node.className = 'gunman';
        this.__node.classList.add('gunman_type_' + type);
        this.__node.classList.add('gunman_state_' + this.__state);

        this.__type = type;
        this.__waitTime = waitTime;
        this.__fireTime = fireTime;

        this.moveToCenter(Math.random() > 0.5 ? Gunman.Side.RIGHT : Gunman.Side.LEFT, function () {
            self.setState(Gunman.State.READY);
            self.ready();
        });

        self.__node.addEventListener('click', clickHandler);
    };

    this.getFireStartTime = function () {
        return this.__fireStartTime;
    };

    this.attachEvents = function () {
        Game.on(Timer.Wait, Timer.END, function () {
            self.setState(Gunman.State.FIRE);
        });
        Game.on(Timer.Fire, Timer.END, function () {
            self.setState(Gunman.State.WIN);
        });
        Game.on(Game.Events.Fool, function () {
            self.setState(Gunman.State.FOUL);
        });
        Game.on(Game.Events.Fire, function () {
            if (self.getState() === Gunman.State.FIRE) {
                Game.dispatchEvent(Game.Events.Win);
                self.setState(Gunman.State.DIE);
            } else {
                Game.dispatchEvent(Game.Events.Fool);
            }
        });
        Game.on(Game.Events.Death, function () {
            self.__node.removeEventListener('click', clickHandler);
        });
    };

    this.ready = function () {
        Timer(Timer.Wait, self.__waitTime).timeout(function () {
            self.__fireStartTime = new Date();
            Timer(Timer.Stopwatch, 10).interval(function () {
                UI.updatePlayerTime(new Date() - self.__fireStartTime);
            }, true);

            Timer(Timer.Fire, self.__fireTime).timeout(function () {
                Game.dispatchEvent(Game.Events.Death);
                UI.updatePlayerTime(self.__fireTime);
                Timer.cancel(Timer.Stopwatch);
            });

        });
    };

    this.moveToCenter = function (side, callback) {
        var node = this.getNode();
        if (side === Gunman.Side.LEFT) {
            node.style.left = '0%';
            node.style.transform = 'rotateY(180deg)';
        } else {
            node.style.left = '100%';
        }

        var TIME = 5000,
            perFrame = 1000 / 30,
            frames = TIME / perFrame,
            pxPerFrame = 50 / frames;

        Timer(Timer.Walk, perFrame).interval(function () {
            node.style.left = parseFloat(node.style.left) + (pxPerFrame * side) + '%';
            if (parseInt(node.style.left) === 50) {
                node.style.left = '50%';
                Timer.cancel(Timer.Walk);
                callback();
            }
        });
    };

    this.attachEvents();
}

Gunman.Side = {
    RIGHT: -1,
    LEFT: 1
};

Gunman.State = {
    WALK: 'walk',
    FOUL: 'foul',
    READY: 'ready',
    FIRE: 'fire',
    DIE: 'die',
    WIN: 'win'
};