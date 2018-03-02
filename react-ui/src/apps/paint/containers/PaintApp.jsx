import React from 'react';
import { connect } from "react-redux";
import withStyles from 'material-ui/styles/withStyles';
import IconButton from 'material-ui/IconButton/IconButton';
import Settings from 'material-ui-icons/Settings';
import Undo from 'material-ui-icons/Undo';
import Clear from 'material-ui-icons/Clear';
import Palette from 'material-ui-icons/Palette';
import Menu, { MenuItem } from 'material-ui/Menu';

import { terminate } from '../../../logic/app/actions';
import { logout } from '../../../logic/user/actions';
import { leave } from '../../../logic/lobby/actions';
import { sketch, undo, clear, fill } from '../actions';

import ColorPickerModal from '../components/ColorPickerModal';
import SketchCanvas from '../components/SketchCanvas';
import MANIFEST from '../manifest'
import { pointWithinShape } from '../raycasting';


const styles = theme => {
  console.log(theme); return ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing.unit * 2,
      height: '100%',
    },
    control: {
      padding: theme.spacing.unit * 2,
    },
    headline: {
      paddingBottom: theme.spacing.unit * 2
    },
    settingsButton: {
      position: 'absolute',
      top: '10px',
      right: '10px'
    },
    undoButton: {
      position: 'absolute',
      bottom: '10px',
      right: '50px'
    },
    undoButtonDisabled: {
      position: 'absolute',
      color: '#CCC',
      bottom: '10px',
      right: '50px'
    },
    clearButton: {
      position: 'absolute',
      bottom: '10px',
      right: '90px'
    },
    paletteButton: {
      position: 'absolute',
      bottom: '10px',
      right: '10px'
    },
    canvasContainer: {
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      backgroundColor: '#fff'
    }
  })
};


class PaintApp extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      fillRequest: null,
      sketchCache: [],
      anchorEl: null,
      color: '#000000',
      colorPickerOpen: false,
      screen: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    }
  };

  handleMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };
  handleCloseMenu = () => {
    this.setState({ anchorEl: null });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  handleChangeComplete = color => {
    this.setState({
      color: color.hex,
      colorPickerOpen: false
    });
  };

  handleLeaveLobby = () => {
    this.handleCloseMenu();
    this.props.leave();
  };

  handleLogout = () => {
    this.handleCloseMenu();
    this.props.logout();
  };

  handleTerminate = () => {
    this.handleCloseMenu();
    this.props.paintTerminate();
  };

  handleOpenPicker = () => {
    this.setState({ colorPickerOpen: true })
  };

  handleClosePicker = () => {
    this.setState({ colorPickerOpen: false });
  };

  handleResize = () => {
    this.setState({
      screen: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    });
  }

  handleSketch = (path) => {
    const timestamp = new Date().getTime();
    let dontSketch = false;
    if (path.length === 1) {
      for (let i = this.props.paint.shapes.length - 1; i >= 0; i--) {
        let shape = this.props.paint.shapes[i];
        if (pointWithinShape(path[0], shape.path)) {
          console.log(this.state)
          if (this.state.fillRequest) {
            clearTimeout(this.state.fillRequest.timeout);
            this.props.undo();
            this.props.fill(this.state.fillRequest.timestamp, this.state.color);
            this.setState({ fillRequest: null })
            dontSketch = true;
          }
          else {
            console.log('settimeot')
            this.setState({
              fillRequest: {
                timestamp: shape.timestamp,
                timeout: setTimeout(() => {
                  this.setState({
                    fillRequest: null
                  })
                }, 500)
              }
            })
            break;
          }
        }
      }
    }
    if (dontSketch === false) {
      this.setState({
        sketchCache: [
          {
            path: path,
            style: this.state.color,
            author: this.props.user,
            timestamp: timestamp
          },
          ...this.state.sketchCache
        ]
      });
      this.props.sketch(path, this.state.color, timestamp);
    }

  }

  componentWillUpdate() {
    const filteredCache = this.state.sketchCache.filter(
      ps => this.props.paint.shapes.some(
        pp => pp.timestamp === ps.timestamp
      )
    );
    if (filteredCache.length < this.state.sketchCache.length)
      this.setState({
        sketchCache: filteredCache
      });
  }

  componentWillMount() {
    window.addEventListener('resize', this.handleResize, true);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  render() {
    const { paint, classes, user } = this.props;
    const appUser = paint.store.users[user._id];
    const undoCount = appUser ? appUser.undoCount : 0;

    const styler = (ctx, shape) => {
      if (shape.isSketch) {
        ctx.fillStyle = ctx.strokeStyle = this.state.color;
      } else {
        ctx.fillStyle = ctx.strokeStyle = shape.style;
      }
    };

    return (
      <div className={classes.canvasContainer}>
        <SketchCanvas
          styler={styler}
          noSketch={user.loggedIn === false}
          width={this.state.screen.width}
          height={this.state.screen.height}
          shapes={[...paint.shapes, ...this.state.sketchCache]}
          onSketch={this.handleSketch} />

        {user.loggedIn && <div onClick={ev => ev.preventDefault()}>
          <IconButton className={classes.settingsButton}
            aria-haspopup="true"
            onClick={this.handleMenuOpen}
          >
            <Settings />
          </IconButton>
          <IconButton className={undoCount > 0 ? classes.undoButton : classes.undoButtonDisabled}
            onClick={ev => this.props.undo()}
          >
            <Undo />
          </IconButton>
          <IconButton className={classes.paletteButton}
            onClick={() => this.handleOpenPicker()}
          >
            <Palette style={{ color: this.state.color }} />
          </IconButton>
          <IconButton className={classes.clearButton}
            onClick={() => this.props.clear()}
          >
            <Clear />
          </IconButton>
          <ColorPickerModal
            open={this.state.colorPickerOpen}
            color={this.state.color}
            onClose={this.handleClosePicker}
            onChangeComplete={this.handleChangeComplete}
          />
          <Menu
            id="menu-appbar"
            anchorEl={this.state.anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(this.state.anchorEl)}
            onClose={this.handleCloseMenu}
          >
            {user.isLeader &&
              <MenuItem onClick={this.handleTerminate}>Terminate</MenuItem>
            }
            <MenuItem onClick={this.handleLeaveLobby}>Leave lobby</MenuItem>
            <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
          </Menu>
        </div>}
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  console.log(state)
  return {
    paint: state.paint,
    lobby: state.lobby,
    user: state.user
  };
};

const mapDispatchToProps = (dispatch) => ({
  sketch: (path, color, timestamp) => dispatch(sketch(path, color, timestamp)),
  fill: (timestamp, color) => dispatch(fill(timestamp, color)),
  undo: () => dispatch(undo()),
  clear: () => dispatch(clear()),
  paintTerminate: variant => dispatch(terminate(MANIFEST.NAME)),
  logout: () => {
    dispatch(logout());
  },
  leave: () => {
    dispatch(leave())
  }
})


export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(PaintApp)
);
