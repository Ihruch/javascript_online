var UI = {
    __bubble: document.querySelector('.game__bubble'),
    __playerTimeNode: document.querySelector('.game__timers-player'),
    __banditTimerNode: document.querySelector('.game__timers-bandit'),

    showBubble: function (text) {
        this.__bubble.style.display = 'block';
        this.__bubble.textContent = text;
    },
    attachEvents: function () {
        var self = this;
        Game.on(Game.Events.NewLevel, function () {
            self.__playerTimeNode.classList.remove('game__timers-player_mode_blink');
            self.updatePlayerTime(0);
            self.__bubble.style.display = 'none';
        });
        Game.on(Game.Events.Fool, function () {
            self.showBubble('Foul!!');
        });
        Game.on(Game.Events.Fire, function () {
            self.showBubble('You Won!!!')
        });
        Game.on(Game.Events.Win, function () {
            self.__playerTimeNode.classList.add('game__timers-player_mode_blink');
        });
        Game.on(Game.Events.Death, function () {
            self.showBubble('You Lost!!!');
            self.__playerTimeNode.classList.add('game__timers-player_mode_blink');
        });
        Game.on(Timer.Fire, Timer.START, function () {
            self.showBubble('Fire!!!');
        });
    },
    updatePlayerTime: function (timeString) {
        this.__playerTimeNode.textContent = typeof timeString != 'undefined' ? (timeString / 1000).toFixed(2) : 'OVER';
    },
    updateBanditTime: function (timeString) {
        this.__banditTimerNode.textContent = typeof timeString != 'undefined' ? (timeString / 1000).toFixed(2) : 'OVER';
    },
    updateScore: function(score, callback){
        document.querySelector('.game__status-reward-value').textContent = score.toString();
        setTimeout(function(){
            callback();
        }, 5000);
    },
    init: function () {
        this.attachEvents();
    }
};