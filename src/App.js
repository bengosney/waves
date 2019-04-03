import React, { Component } from 'react';
import './App.css';
import OpenSimplexNoise from 'open-simplex-noise';


class App extends Component {
    constructor(props) {
	super(props);

	this.state = {
	    pixelSize: 8,
	    height: 500,
	    width: 150,
	    mouseX: -9999,
	    mouseY: -9999,
	    effectMod: 2,
	    strengthMod: 15
	};
	
	this.drawing = false;
	this.ctx = null;

	this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
	this.startts = this.getTS();
    }

    
    componentDidMount() {
	const canvas = this.refs.canvas;
	this.canvas = canvas;
	this.ctx = canvas.getContext("2d");

	canvas.addEventListener('mousemove', (e) => {
	    this.setState({
		mouseX: e.clientX,
		mouseY: e.clientY
	    });
	});

	this.rAF = requestAnimationFrame(() => this.updateAnimationState());
	this.updateWindowDimensions();
	window.addEventListener('resize', this.updateWindowDimensions);
    }
    
    updateWindowDimensions() {
	const rect = this.canvas.getBoundingClientRect();
	const { innerWidth, innerHeight } = window;
	const { width, height } = rect;
	
	this.setState({ width: Math.min(width, innerWidth), height: Math.min(height, innerHeight) });
    }
    
    componentWillUnmount() {
	cancelAnimationFrame(this.rAF);
	window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateAnimationState() {
	this.ts = this.getTS();
	this.clearFrame();

	this.drawDots();
	
	this.nextFrame();
    }

    nextFrame() {
	this.rAF = requestAnimationFrame(() => this.updateAnimationState());
    }

    clearFrame() {
	const { width, height } = this.state;
	const { ctx } = this;

	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, width, height);
    }
    
    getTS() {
	const date = new Date();
	
	return date.getTime();
    }

    convertRange( value, r1, r2 ) { 
	return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
    }

    move(x, y, dx, x1, y1, x2, y2) {
	const a = {x: x2 - x1, y: y2 - y1};
        let mag = Math.sqrt(a.x*a.x + a.y*a.y);
	
	if (mag == 0) {
            a.x = a.y = 0;
	} else {
            a.x = a.x/mag*dx;
            a.y = a.y/mag*dx;
	}
	
	return {x: x + a.x, y: y + a.y};
    }

    distance(x1, y1, x2, y2) {
	const x = x1 - x2;
	const y = y1 - y2;
	
	return Math.sqrt( x * x + y * y);
    };

    drawDots() {
	const gap = 25;
	const r = 3;
	const { width, height, mouseX, mouseY, effectMod, strengthMod } = this.state;
	const effect = Math.min(width, height) * effectMod;
	const { ctx } = this;

	for (let x = 0 ; x < width ; x += gap) {
	    for (let y = 0 ; y < height ; y += gap) {
		const dist = this.distance(x, y, mouseX, mouseY);

		const mod = Math.max(0, (effect - dist) / (strengthMod * (width / 500)));
		const pos = this.move(x, y, mod, mouseX, mouseY, x, y);
		
		ctx.beginPath();
		ctx.fillStyle = "#ffffff";
		ctx.arc(pos.x, pos.y, r, 0, 2 * Math.PI);
		ctx.fill();
	    }
	}
    }
    
    render() {
	const { width, height, openSimplex, effectMod, strengthMod } = this.state;
        
        return (
	    <div className={ 'grid' }>
              <div className={ 'dots' }>
		<canvas ref="canvas" width={ width } height={ height } />
	      </div>
	      <div className={ 'controls' }>
		<h2>Controls</h2>
		<div>
		  <label htmlFor={ 'area' }>Area Mod</label><br />
		  <input name={ 'area' } value={ effectMod } onChange={ e => this.setState({ effectMod: e.target.value }) } />
		</div>
		<div>
		  <label htmlFor={ 'strength' }>Strength Mod</label><br />
		  <input name={ 'strength' } value={ strengthMod } onChange={ e => this.setState({ strengthMod: e.target.value }) } />
		</div>
	      </div>
            </div>
	);	
    }
}

export default App;
