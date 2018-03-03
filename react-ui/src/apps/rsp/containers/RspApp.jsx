import React from 'react';
import { connect } from "react-redux";
import { move } from '../actions';
import { terminate } from '../../../logic/app/actions';
import PointsTable from '../components/PointsTable';
import { rspMatch } from '../core'
import withStyles from 'material-ui/styles/withStyles';
import MoveSection from '../components/MoveSection';
import Typography from 'material-ui/Typography/Typography';
import { CompleteSectionPlayer, CompleteSectionObserver } from '../components/CompleteSection';
import MANIFEST from '../manifest'

const RESULT = MANIFEST.CONSTS.RESULT;

const styles = theme => ({
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
  }
});


const getMatch = (rspState, lobbyState, cond) => {
  var match = cond(rspState.player1) ? rspState.player1 : rspState.player2;
  return {
    ...match,
    ...lobbyState.members.find(m => m._id === match._id)
  };
}

const getMe = (rspState, lobbyState, userState) => getMatch(
  rspState,
  lobbyState,
  player => player._id === userState._id
)

const getOpponent = (rspState, lobbyState, userState) => getMatch(
  rspState,
  lobbyState,
  player => player._id !== userState._id
)

class RspApp extends React.Component {

  renderOngoing(me, opponent) {
    const opponentsTurn = me.moves.length > opponent.moves.length;
    return (
      <div>
        <PointsTable me={me} opponent={opponent}
          roundLimit={this.props.rsp.roundLimit}
          mutateOffset={this.props.user.loggedIn === false} />
        {this.props.user.loggedIn ?
          <MoveSection disabled={opponentsTurn} onClick={move => this.props.rspMove(move)}>
            <Typography type="headline" align="center" gutterBottom className={this.props.classes.headline}>
              {opponentsTurn ? "waiting for opponent" : "your move"}
            </Typography>
          </MoveSection> : null
        }
      </div>
    );
  }

  renderComplete(me, opponent) {
    const result = rspMatch(me, opponent);
    const isLeader = this.props.lobby.leaderId === this.props.user._id;

    const winner = ({
      [RESULT.VICTORY]: me,
      [RESULT.DEFEAT]: opponent,
      [RESULT.TIE]: null
    })[result];

    return (
      <div>
        <PointsTable me={me} opponent={opponent} roundLimit={this.props.rsp.roundLimit} />
        {this.props.user.loggedIn ?
          <CompleteSectionPlayer
            terminateable={isLeader}
            result={result}
            onTerminate={() => this.props.rspTerminate()} /> :
          <CompleteSectionObserver winner={winner} />
        }
      </div>
    );
  }

  render() {
    try {
      const me = getMe(this.props.rsp, this.props.lobby, this.props.user);
      const opponent = getOpponent(this.props.rsp, this.props.lobby, this.props.user);

      switch (this.props.rsp.stage) {
        case 'ongoing':
          return this.renderOngoing(me, opponent);
        case 'complete':
          return this.renderComplete(me, opponent);
        default:
          return <div />
      }
    } catch (err) {
      console.log(err)
      return <div />
    }
  }
}

const mapStateToProps = (state) => ({
  rsp: state.app.RSP.store,
  lobby: state.lobby,
  user: state.user
});

const mapDispatchToProps = (dispatch) => ({
  rspMove: (variant) => dispatch(move(variant)),
  rspTerminate: (variant) => dispatch(terminate(MANIFEST.NAME)),
})


export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(RspApp));

