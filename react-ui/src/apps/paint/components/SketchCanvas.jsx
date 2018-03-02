import React, { Component } from 'react';
import PropTypes from 'prop-types';


const captureScale = element => ([
  1 / element.offsetWidth,
  1 / element.offsetHeight
])

const drawScale = element => ([
  element.width,
  element.height
])

const event2pos = event => {
  const [xScale, yScale] = captureScale(event.target);
  if (event.touches)
    event = event.touches[0];
  return [
    xScale * (event.pageX - event.target.offsetLeft),
    yScale * (event.pageY - event.target.offsetTop)
  ];
}


class SketchCanvas extends Component {
  constructor(props) {
    super(props);

    this.handlers = {
      'touchstart': this.startTracking.bind(this),
      'touchend': this.stopTracking.bind(this),
      'touchmove': this.onMove.bind(this),

      'mouseup': this.stopTracking.bind(this),
      'mousedown': this.startTracking.bind(this),
      'mousemove': this.onMove.bind(this)
    };

    this.state = {
      isTracking: false,
      sketchBuffer: []
    }
  }

  onMove(event) {
    const [x, y] = event2pos(event);
    const sketchBuffer = this.state.sketchBuffer
    var distance = Infinity;
    if (sketchBuffer.length > 0) {
      const [px, py] = sketchBuffer[sketchBuffer.length - 1];
      distance = Math.sqrt(Math.pow(px - x, 2) + Math.pow(py - y, 2));
    }
    if (distance > 0.005 || sketchBuffer.length === 0) {
      this.setState({
        sketchBuffer: [
          ...this.state.sketchBuffer,
          [x, y]
        ]
      })
    }
    event.preventDefault();
  }

  startTracking(event) {
    this.setState({
      isTracking: true,
      sketchBuffer: []
    });
    this.onMove(event);

    (['mousemove', 'touchmove'])
      .forEach(eventType => {
        this.canvas.addEventListener(eventType,
          this.handlers[eventType], false);
      }, this);
  }

  stopTracking() {
    const sketchBuffer = this.state.sketchBuffer;
    this.setState({ isTracking: false, sketchBuffer: [] });
    (['mousemove', 'touchmove'])
      .forEach(eventType => {
        this.canvas.removeEventListener(eventType,
          this.handlers[eventType], false);
      }, this);
    if (sketchBuffer.length > 0) {
      this.props.onSketch(sketchBuffer);
    }
  }

  componentDidMount() {
    this.setState({
      isTracking: false
    });
    if (this.props.noSketch !== true) {
      (['mousedown', 'mouseup', 'touchstart', 'touchend'])
        .forEach(eventType => {
          this.canvas.addEventListener(eventType,
            this.handlers[eventType], false);
        }, this);
    }
  }

  componentDidUpdate() {
    var ctx = this.canvas.getContext('2d');
    const [xScale, yScale] = drawScale(this.canvas);

    const drawShape = (path, isFilled) => {
      ctx.moveTo(path[0][0] * xScale, path[0][1] * yScale);
      path.slice(1).forEach(([x, y]) =>
        ctx.lineTo(x * xScale, y * yScale)
        , this);
      ctx.stroke();
      if (isFilled) {
        ctx.fill();
      }
    }

    const drawPoint = point => {
      ctx.rect(point[0] * xScale - 2, point[1] * yScale - 1, 5, 3);
      ctx.rect(point[0] * xScale - 1, point[1] * yScale - 2, 3, 5);
      ctx.fill();
    }

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // draw supplied shapes
    this.props.shapes.forEach(shape => {
      if (shape.path.length > 0) {
        ctx.beginPath();
        if (this.props.styler)
          this.props.styler(ctx, shape);
        if (shape.path.length === 1) {
          drawPoint(shape.path[0]);
        } else {
          drawShape(shape.path, shape.isFilled);
        }
        ctx.closePath();
      }
    }, this)

    // draw sketch buffer content
    if (this.props.noSketch !== true) {
      const sketchBuffer = this.state.sketchBuffer;
      if (sketchBuffer.length > 0) {
        ctx.beginPath();
        if (this.props.styler)
          this.props.styler(ctx, { path: sketchBuffer, isSketch: true });
        ctx.moveTo(sketchBuffer[0][0] * xScale, sketchBuffer[0][1] * yScale);
        sketchBuffer.slice(1).forEach(([x, y]) =>
          ctx.lineTo(x * xScale, y * yScale)
          , this);
        ctx.stroke();
        ctx.closePath();
      }
    }
  }

  render() {
    return (
      <canvas ref={e => this.canvas = e}
        width={this.props.width}
        height={this.props.height}
        style={{ verticalAlign: 'bottom' }} />
    );
  }
}

SketchCanvas.propTypes = {
  shapes: PropTypes.array.isRequired,
  onSketch: PropTypes.func,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  noSketch: PropTypes.bool
};


export default SketchCanvas;
