import React from 'react';
import { connect } from "react-redux";
import withStyles from 'material-ui/styles/withStyles';
import {
  Grid,
  Button,
  Paper
} from 'material-ui';

import { terminate } from '../../../logic/app/actions';

import StageWrapper from './StageWrapper';
import MembersList from './common/MembersList';
import CharIcon from './character/CharIcon';

import ac from '../acutils';


function StageCompleteView(props) {
  const { store } = props.avaclone;
  const currentUser = props.user;

  const failedCount = ac.sum.failedQuests(store);
  const succeededCount = ac.sum.succeededQuests(store);

  return (
    <StageWrapper>
      <MembersList
        actions={[
          (memberId) =>
            <CharIcon
              char={ac.get.char(store, memberId)}
            />
        ]}
        caption={member => ac.get.char(store, member._id)}
      />
      <Grid container justify="center">
        <Grid item xs={12} style={{ textAlign: 'center', paddingTop: '30px' }}>
          <Button
            raised
            color="primary"
            aria-label="terminate"
            disabled={currentUser.isLeader === false}
            onClick={() => props.terminate(true)}
          >
            TERMINATE
          </Button>
        </Grid>
      </Grid>
    </StageWrapper>
  );
}


const mapStateToProps = (state) => ({
  avaclone: state.avaclone,
  lobby: state.lobby,
  user: state.user
});

const mapDispatchToProps = (dispatch) => ({
  terminate: () => dispatch(terminate())
})


export default connect(mapStateToProps, mapDispatchToProps)(StageCompleteView);
