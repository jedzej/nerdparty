import React from 'react';
import { connect } from "react-redux";
import { Button } from 'material-ui';
import withStyles from 'material-ui/styles/withStyles';
import ThumbDown from 'material-ui-icons/ThumbDown';
import ThumbUp from 'material-ui-icons/ThumbUp';
import GpsFixed from 'material-ui-icons/GpsFixed';
import Done from 'material-ui-icons/Done';
import HourglassEmpty from 'material-ui-icons/HourglassEmpty';

import QuestDetails from './quest/QuestDetails';
import StageWrapper from './StageWrapper';
import VotingPanel from './common/VotingPanel';

import { assassinVote } from '../actions';
import MembersList from './common/MembersList';

import MANIFEST from '../manifest';
import ac from '../acutils';

const { CHAR } = MANIFEST.CONSTS;

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


class StageAssassinVotingView extends React.Component {

  render() {
    const { store } = this.props.avaclone;
    const currentUser = this.props.user;
    const assassin = ac.get.assassin(store, this.props.lobby);
    const isAssassin = currentUser._id === assassin._id;

    return (
      <StageWrapper>
        <MembersList
          actions={[
            (memberId) =>
              isAssassin && <Button
                raised
                dense
                mini
                key={memberId}
                onClick={() => this.props.assassinVote(memberId)}
              ><GpsFixed /></Button>
          ]}
        />
      </StageWrapper>
    );
  }
}


const mapStateToProps = (state) => ({
  avaclone: state.avaclone,
  lobby: state.lobby,
  user: state.user
});

const mapDispatchToProps = (dispatch) => ({
  assassinVote: (merlinId) => dispatch(assassinVote(merlinId))
})


export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(StageAssassinVotingView)
);
