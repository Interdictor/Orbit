// orbit.js version: 0.2
function getAbsoluteCenter () {
    return {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
    }
}
class World {
    constructor() {
        this.celestials = [];
    }

    addCelestial(celestial, update, dependency){
        if(!update) return;

        var celestialData = {
            celestial: celestial,
            dependency: null
        };

        if(dependency)
            celestialData.dependency = dependency;

        this.celestials.push(celestialData);
    }

    update(){
        var time = Date.now();

        for(var i = 0; i < this.celestials.length; i++) {
            var celestialData = this.celestials[i];

            var celestial = celestialData.celestial;
            var dependency = celestialData.dependency;

            if(dependency)
                celestial.setOrbitCenter(dependency.getPosition());

            celestial.orbit(time);
        }

        setTimeout(this.update.bind(this), 16);
    }
}

class Celestial {
    constructor (diameter, speed, domElement, orbitRadius, orbitCenter) {
        this.speed = speed;

        this.diameter = diameter;
        this.domElement = domElement;
        this.orbitRadius = orbitRadius;
        this.position = {x: 0, y: 0};

        this.setOrbitCenter(orbitCenter);
        this.setSize();
        this.setInitialPosition();
    }
    setOrbitCenter (center) {
        this.orbitCenter = center;
    }
    setInitialPosition () {
        this.setPosition(this.getCenter().x, this.getCenter().y);
    }
    setPosition (x, y) {
        this.position.x = x;
        this.position.y = y;

        this.domElement.style.left = x - this.getGraphicOffset().x + "px";
        this.domElement.style.top = y - this.getGraphicOffset().y + "px";
    }
    getPosition () {
        return this.position;
    }
    setSize () {
        this.domElement.style.width = this.diameter + "px";
        this.domElement.style.height = this.diameter + "px";
    }
    getCenter () {
        return this.orbitCenter;
    }
    getGraphicOffset () {
        return {
            x: this.diameter / 2,
            y: this.diameter / 2
        }
    }
    orbit (alphaTime) {
        var center = {
            x: this.getCenter().x ,
            y: this.getCenter().y
        }

        var x = Math.cos(alphaTime * this.speed) * this.orbitRadius + center.x;
        var y = Math.sin(alphaTime * this.speed) * this.orbitRadius + center.y;

        this.setPosition(x, y);
    }
}

var sun = new Celestial(100, 0, document.getElementById("sun"), 0, getAbsoluteCenter());
var planet = new Celestial(50, 0.001, document.getElementById("planet"), 200, sun.getCenter());
var moon = new Celestial(25, 0.003, document.getElementById("moon"), 100, planet.getCenter());

var world = new World();

world.addCelestial(sun, false);
world.addCelestial(planet, true);
world.addCelestial(moon, true, planet);

world.update();
