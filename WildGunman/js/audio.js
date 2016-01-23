var Audio = {
    timerId: 0,
    players: {},
    init: function (ready) {
        var self = this,
            isReadyCount = 0;
        for (var sound in Sound) {
            var path = Sound[sound],
                audio = document.createElement('audio');
            audio.id = 'sound-' + path;
            audio.preload = 'auto';
            audio.src = 'sfx/' + path + '.m4a';
            if (path === 'wait') {
                audio.loop = 'loop';
            }
            audio.addEventListener("canplay", function () {
                isReadyCount++;
                if (isReadyCount === Object.keys(Sound).length) {
                    self.attachEvents();
                    ready();
                }
            }, true);
            document.body.appendChild(audio);
            this.players[path] = audio;
        }
    },
    play: function (sound) {
        var player = this.players[sound];
        player.currentTime = 0;
        player.play();
    },
    pause: function (sound) {
        var player = this.players[sound];
        player.pause();
    },
    pauseAll: function () {
        for (var sound in this.players) {
            this.players[sound].pause();
        }
    },
    attachEvents: function () {
        var self = this;
        Game.on(Timer.Wait, Timer.START, function () {
            self.play(Sound.Wait);
        });
        Game.on(Timer.Wait, Timer.END, function () {
            self.pause(Sound.Wait);
        });
        Game.on(Timer.Fire, Timer.START, function () {
            self.play(Sound.Fire);
        });
        Game.on(Timer.Fire, Timer.END, function () {
            self.play(Sound.Death);
        });

        Game.on(Game.Events.NewLevel, function () {
            self.play(Sound.Intro);
        });
        Game.on(Game.Events.Fool, function () {
            self.pauseAll();
            self.play(Sound.Foul);
        });

        Game.on(Game.Events.Fire, function () {
            self.play(Sound.Shot);
        });

        Game.on(Game.Events.Win, function () {
            self.play(Sound.Win);
        });

    }
};

var Sound = {
    Intro: 'intro',
    Death: 'death',
    Shot: 'shot',
    ShotFall: 'shot-fall',
    Fire: 'fire',
    Win: 'win',
    Wait: 'wait',
    Foul: 'foul'
};

