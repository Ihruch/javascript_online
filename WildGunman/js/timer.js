var Timer = function (timerId, ms) {
    return {
        timeout: function (fn) {
            game.dispatchEvent(new CustomEvent('timeout', {
                detail: {
                    name: timerId,
                    step: Timer.START
                }
            }));
            Timer.__timers[timerId] = {
                type: 'Timeout',
                id: setTimeout(function () {
                    game.dispatchEvent(new CustomEvent('timeout', {
                        detail: {name: timerId, step: Timer.END}
                    }));
                    fn();
                }, ms)
            };
        },
        interval: function (fn) {
            Timer.__timers[timerId] = {
                type: 'Interval',
                id: setInterval(fn, ms)
            };
        }
    };
};

Timer.cancel = function (timerId) {
    var timer = Timer.__timers[timerId];
    if (timer) {
        window['clear' + timer.type](timer.id);
        game.dispatchEvent(new CustomEvent('timeout', {
            detail: {name: timerId, step: Timer.CANCEL}
        }));
        delete Timer.__timers[timerId];
    }
};

Timer.cancelAll = function () {
    for (var timerId in Timer.__timers) {
        Timer.cancel(timerId);
    }
};


Timer.__timers = {};

Timer.START = 'start';
Timer.END = 'end';
Timer.CANCEL = 'cancel';

Timer.Walk = 1;
Timer.Fire = 2;
Timer.Wait = 3;
Timer.Stopwatch = 4;


