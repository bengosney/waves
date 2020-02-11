import React, {Component} from 'react';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);

        const gap = 50;
        const mag = gap * .75;

        this.state = {
            pixelSize: 1.5,
            height: 500,
            width: 150,
            gap: gap,
            magX: mag,
            magY: mag * .75,
            r: 255,
            g: 255,
            b: 255,
            a: 1
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


        this.rAF = requestAnimationFrame(() => this.updateAnimationState());
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        const rect = this.canvas.getBoundingClientRect();
        const {innerWidth, innerHeight} = window;
        const {width, height} = rect;

        this.setState({width: Math.min(width, innerWidth), height: Math.min(height, innerHeight)});
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
        const {width, height} = this.state;
        const {ctx} = this;

        ctx.clearRect(0, 0, width, height);
    }

    getTS() {
        const date = new Date();

        return date.getTime();
    }

    convertRange(value, r1, r2) {
        return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
    }

    move(x, y, dx, x1, y1, x2, y2) {
        const a = {x: x2 - x1, y: y2 - y1};
        let mag = Math.sqrt(a.x * a.x + a.y * a.y);

        if (mag === 0) {
            a.x = a.y = 0;
        } else {
            a.x = a.x / mag * dx;
            a.y = a.y / mag * dx;
        }

        return {x: x + a.x, y: y + a.y};
    }

    distance(x1, y1, x2, y2) {
        const x = x1 - x2;
        const y = y1 - y2;

        return Math.sqrt(x * x + y * y);
    };

    drawDots() {
        const {width, height, pixelSize, gap = 50, magX, magY} = this.state;
        const {r, g, b, a} = this.state;
        const {ctx} = this;

        const headGap = height / 2;

        const ts = this.getTS() / 500;
        let mx = magX;
        let my = magY;
        let row = 0;
        const rows = (height - headGap) / gap;

        for (let y = headGap; y < height; y += gap) {
            row++;
            let base = ts;
            for (let x = 0; x < width; x += gap) {
                base += 1;
                mx = magX - ((magX / rows) * row);
                my = magY - ((magY / rows) * row);

                const sin = Math.sin(base);
                const cos = Math.cos(base);

                ctx.beginPath();
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
                ctx.fillRect(x + (sin * mx), y + (cos * my), pixelSize, pixelSize);
            }
        }
    }

    render() {
        const {width, height, pixelSize, gap, magX, magY} = this.state;
        const {r, g, b, a} = this.state;

        return (
            <div className={'grid'}>
                <div className={'dots'}>
                    <canvas ref="canvas" width={width} height={height}/>
                </div>
                <div className={'controls'}>
                    <h2>Controls</h2>
                    <div>
                        <label htmlFor={'size'}>Dot Size</label><br/>
                        <input name={'size'} value={pixelSize}
                               onChange={e => this.setState({pixelSize: e.target.value})}/>
                    </div>
                    <div>
                        <label htmlFor={'gap'}>Gap Size</label><br/>
                        <input name={'gap'} value={gap} onChange={e => this.setState({gap: parseInt(e.target.value)})}/>
                    </div>
                    <div>
                        <label>Magnitude</label><br/>
                        <div className={'row'}>
                            <input className={'small'} name={'magX'} value={magX}
                                   onChange={e => this.setState({magX: e.target.value})}/>
                            <input className={'small'} name={'magY'} value={magY}
                                   onChange={e => this.setState({magY: e.target.value})}/>
                        </div>
                    </div>
                    <div>
                        <label>Colour</label><br/>
                        <div className={'row'}>
                            <input className={'small'} value={r} onChange={e => this.setState({r: e.target.value})}/>
                            <input className={'small'} value={g} onChange={e => this.setState({g: e.target.value})}/>
                            <input className={'small'} value={b} onChange={e => this.setState({b: e.target.value})}/>
                            <input className={'small'} value={a} onChange={e => this.setState({a: e.target.value})}/>
                        </div>
                    </div>

                    <div>
                        <label>Presets</label>
                        <div>
                            <button onClick={() => this.setState({
                                pixelSize: gap * 2,
                                magX: gap * .75,
                                magY: gap * .5,
                                r: 0,
                                a: .8
                            })}>Blue Sea
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
