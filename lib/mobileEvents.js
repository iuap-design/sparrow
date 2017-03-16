/**
 * Module : Sparrow touch mobileEvents
 * Author : liuyk(liuyk@yonyou.com)
 * Date	  : 2017-03-16 14:41:17
 */

import { env } from './env';

var u = {};
u.event = {};

var touchStartEvent = env.hasTouch ? "touchstart" : "mousedown",
    touchStopEvent = env.hasTouch ? "touchend" : "mouseup",
    touchMoveEvent = env.hasTouch ? "touchmove" : "mousemove";

// tap和taphold
u.event.tap = {
    tapholdThreshold: 750,
    emitTapOnTaphold: true,
    touchstartFun: function () {
        trigger(this, 'vmousedown');
    },
    touchendFun: function () {
        trigger(this, 'vmouseup');
        trigger(this, 'vclick');
    },
    setup: function () {
        var thisObject = this,
            isTaphold = false;

        on(thisObject, "vmousedown", function (event) {
            isTaphold = false;
            if (event.which && event.which !== 1) {
                return false;
            }

            var origTarget = event.target,
                timer;

            function clearTapTimer() {
                clearTimeout(timer);
            }

            function clearTapHandlers() {
                clearTapTimer();

                off(thisObject, 'vclick');
                off(thisObject, 'vmouseup');
                off(document, 'vmousecancel');
            }

            function clickHandler(event) {
                clearTapHandlers();

                // ONLY trigger a 'tap' event if the start target is
                // the same as the stop target.
                if (!isTaphold && origTarget === event.target) {
                    trigger(thisObject, 'tap');
                } else if (isTaphold) {
                    event.preventDefault();
                }
            }
            on(thisObject, 'vmouseup', clearTapTimer);
            on(thisObject, 'vclick', clickHandler);
            on(document, 'vmousecancel', clearTapHandlers);

            timer = setTimeout(function () {
                if (!u.event.tap.emitTapOnTaphold) {
                    isTaphold = true;
                }
                trigger(thisObject, "taphold");
                clearTapHandlers();
            }, u.event.tap.tapholdThreshold);
        });

        on(thisObject, 'touchstart', u.event.tap.touchstartFun);
        on(thisObject, 'touchend', u.event.tap.touchendFun);
    },
    teardown: function () {
        off(thisObject, 'vmousedown');
        off(thisObject, 'vclick');
        off(thisObject, 'vmouseup');
        off(document, 'vmousecancel');
    }
};

u.event.taphold = u.event.tap;

u.event.swipe = {

    // More than this horizontal displacement, and we will suppress scrolling.
    scrollSupressionThreshold: 30,

    // More time than this, and it isn't a swipe.
    durationThreshold: 1000,

    // Swipe horizontal displacement must be more than this.
    horizontalDistanceThreshold: 30,

    // Swipe vertical displacement must be less than this.
    verticalDistanceThreshold: 30,

    getLocation: function (event) {
        var winPageX = window.pageXOffset,
            winPageY = window.pageYOffset,
            x = event.clientX,
            y = event.clientY;

        if (event.pageY === 0 && Math.floor(y) > Math.floor(event.pageY) || event.pageX === 0 && Math.floor(x) > Math.floor(event.pageX)) {

            // iOS4 clientX/clientY have the value that should have been
            // in pageX/pageY. While pageX/page/ have the value 0
            x = x - winPageX;
            y = y - winPageY;
        } else if (y < event.pageY - winPageY || x < event.pageX - winPageX) {

            // Some Android browsers have totally bogus values for clientX/Y
            // when scrolling/zooming a page. Detectable since clientX/clientY
            // should never be smaller than pageX/pageY minus page scroll
            x = event.pageX - winPageX;
            y = event.pageY - winPageY;
        }

        return {
            x: x,
            y: y
        };
    },

    start: function (event) {
        var data = event.touches ? event.touches[0] : event,
            location = u.event.swipe.getLocation(data);
        return {
            time: new Date().getTime(),
            coords: [location.x, location.y],
            origin: event.target
        };
    },

    stop: function (event) {
        var data = event.touches ? event.touches[0] : event,
            location = u.event.swipe.getLocation(data);
        return {
            time: new Date().getTime(),
            coords: [location.x, location.y]
        };
    },

    handleSwipe: function (start, stop, thisObject, origTarget) {
        if (stop.time - start.time < u.event.swipe.durationThreshold && Math.abs(start.coords[0] - stop.coords[0]) > u.event.swipe.horizontalDistanceThreshold && Math.abs(start.coords[1] - stop.coords[1]) < u.event.swipe.verticalDistanceThreshold) {
            var direction = start.coords[0] > stop.coords[0] ? "swipeleft" : "swiperight";

            trigger(thisObject, "swipe");
            trigger(thisObject, direction);
            return true;
        }
        return false;
    },

    // This serves as a flag to ensure that at most one swipe event event is
    // in work at any given time
    eventInProgress: false,

    setup: function () {
        var events,
            thisObject = this,
            context = {};

        // Retrieve the events data for this element and add the swipe context
        events = thisObject["mobile-events"];
        if (!events) {
            events = {
                length: 0
            };
            thisObject["mobile-events"] = events;
        }
        events.length++;
        events.swipe = context;

        context.start = function (event) {

            // Bail if we're already working on a swipe event
            if (u.event.swipe.eventInProgress) {
                return;
            }
            u.event.swipe.eventInProgress = true;

            var stop,
                start = u.event.swipe.start(event),
                origTarget = event.target,
                emitted = false;

            context.move = function (event) {
                // if ( !start || event.isDefaultPrevented() ) {
                if (!start) {
                    return;
                }

                stop = u.event.swipe.stop(event);
                if (!emitted) {
                    emitted = u.event.swipe.handleSwipe(start, stop, thisObject, origTarget);
                    if (emitted) {

                        // Reset the context to make way for the next swipe event
                        u.event.swipe.eventInProgress = false;
                    }
                }
                // prevent scrolling
                if (Math.abs(start.coords[0] - stop.coords[0]) > u.event.swipe.scrollSupressionThreshold) {
                    event.preventDefault();
                }
            };

            context.stop = function () {
                emitted = true;

                // Reset the context to make way for the next swipe event
                u.event.swipe.eventInProgress = false;
                off(document, touchMoveEvent, context.move);
                context.move = null;
            };

            on(document, touchMoveEvent, context.move);
            on(document, touchStopEvent, context.stop);
        };
        on(thisObject, touchStartEvent, context.start);
    },

    teardown: function () {
        var events, context;

        events = thisObject["mobile-events"];
        if (events) {
            context = events.swipe;
            delete events.swipe;
            events.length--;
            if (events.length === 0) {
                thisObject["mobile-events"] = null;
            }
        }

        if (context) {
            if (context.start) {
                off(thisObject, touchStartEvent, context.start);
            }
            if (context.move) {
                off(document, touchMoveEvent, context.move);
            }
            if (context.stop) {
                off(document, touchStopEvent, context.stop);
            }
        }
    }
};

u.event.swipeleft = u.event.swipe;

u.event.swiperight = u.event.swipe;

var event = u.event;

export { event };