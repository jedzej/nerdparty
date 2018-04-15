import React from 'react';
import { connect } from "react-redux";
import { Button } from 'material-ui';
import GpsFixed from 'material-ui-icons/GpsFixed';

import StageWrapper from './StageWrapper';
import MembersList from './common/MembersList';

import { assassinVote } from '../actions';
import ac from '../acutils';


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


export default connect(mapStateToProps, mapDispatchToProps)(StageAssassinVotingView);
