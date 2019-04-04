import React, { Component } from 'react';
import './App.css';

class App extends Component {
    constructor(props) {
	super(props);

	this.state = {
	    pixelSize: 1.5,
	    height: 500,
	    width: 150,
	    mouseX: -9999,
	    mouseY: -9999,
	    mouseEvent: 0,
	    effectMod: 2,
	    strength: 40,
	    strengthCur: 0,
	    mouseOver: false,
	    gap: 14,
	    r: 255,
	    g: 255,
	    b: 255,
	    a: .8
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

	canvas.addEventListener('mouseover', () => {
	    this.setState({mouseOver: true, mouseEvent: this.getTS()});
	});
	
	canvas.addEventListener('mouseleave', () => {
	    this.setState({mouseOver: false, mouseEvent: this.getTS()});
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

	ctx.clearRect(0, 0, width, height);
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
	const { width, height, mouseX, mouseY, mouseEvent, mouseOver, effectMod, strength, pixelSize, gap } = this.state;
	const { r, g, b, a } = this.state;
	const effect = Math.min(width, height) * effectMod;
	const { ctx } = this;

	let curStrength = strength;
	const timeMod = (this.getTS() - mouseEvent) / 3;
	
	if (mouseOver) {
	    curStrength = Math.min(strength, timeMod);
	} else {
	    curStrength = Math.max(0, (strength - timeMod));
	}

	for (let x = 0 ; x < width ; x += gap) {
	    for (let y = 0 ; y < height ; y += gap) {
		const dist = this.distance(x, y, mouseX, mouseY);

		const mod = Math.max(0, curStrength);
		const pos = this.move(x, y, mod, mouseX, mouseY, x, y);
		
		ctx.beginPath();
		ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
		ctx.fillRect(pos.x, pos.y, pixelSize, pixelSize);
	    }
	}
    }
    
    render() {
	const { width, height, effectMod, strength, pixelSize, gap } = this.state;
	const { r, g, b, a } = this.state;
        
        return (
	    <div className={ 'grid' }>
              <div className={ 'dots' }>
		<canvas ref="canvas" width={ width } height={ height } />
	      </div>
	      <div className={ 'controls' }>
		<h2>Controls</h2>
		<div>
		  <label htmlFor={ 'area' }>Area Effected</label><br />
		  <input name={ 'area' } value={ effectMod } onChange={ e => this.setState({ effectMod: e.target.value }) } />
		</div>
		<div>
		  <label htmlFor={ 'strength' }>Strength</label><br />
		  <input name={ 'strength' } value={ strength } onChange={ e => this.setState({ strength: e.target.value }) } />
		</div>
		<div>
		  <label htmlFor={ 'size' }>Dot Size</label><br />
		  <input name={ 'size' } value={ pixelSize } onChange={ e => this.setState({ pixelSize: e.target.value }) } />
		</div>
		<div>
		  <label htmlFor={ 'gap' }>Gap Size</label><br />
		  <input name={ 'gap' } value={ gap } onChange={ e => this.setState({ gap: e.target.value }) } />
		</div>
		<div>
		  <label>Colour</label><br />
		  <div className={ 'row' } >
		    <input className={ 'small' } value={ r } onChange={ e => this.setState({ r: e.target.value }) } />
                    <input className={ 'small' } value={ g } onChange={ e => this.setState({ g: e.target.value }) } />
		    <input className={ 'small' } value={ b } onChange={ e => this.setState({ b: e.target.value }) } />
		    <input className={ 'small' } value={ a } onChange={ e => this.setState({ a: e.target.value }) } />
		  </div>
		</div>
	      </div>
            </div>
	);	
    }
}

export default App;
