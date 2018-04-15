import React from 'react';
import { connect } from "react-redux";
import withStyles from 'material-ui/styles/withStyles';

import { terminate } from '../../../logic/app/actions';
import { logout } from '../../../logic/user/actions';
import { leave } from '../../../logic/lobby/actions';
import { start } from '../actions';

import MANIFEST from '../manifest'
import Button from 'material-ui/Button';
import SpecialCharactersSelector from './configuration/SpecialCharactersSelector'
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';

import ac from '../acutils'

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    margin: theme.spacing.unit * 2,
    textAlign: 'center'
  },
  divider: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  }
});


class StageConfigurationView extends React.Component {

  render() {
    const { classes, user, lobby } = this.props;
    return (
      <div style={{ margin: 0, height: '100%' }}>
        <div style={{ margin: 0, overflow: 'auto', height: 'calc(100% - 56px)' }}>
          <Paper className={classes.paper}>
            <SpecialCharactersSelector
              disabled={user.isLeader === false}
              evilLimit={ac.get.evilCount(lobby.members.length)}
            />
            <Divider />
            <Button
              onClick={() => this.props.start()}
            >START</Button>
          </Paper>
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    avaclone: state.avaclone,
    user: state.user,
    lobby: state.lobby
  };
};

const mapDispatchToProps = (dispatch) => ({
  start: () => dispatch(start()),
  terminate: variant => dispatch(terminate(MANIFEST.NAME)),
  logout: () => dispatch(logout()),
  leave: () => dispatch(leave())
})


export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(StageConfigurationView)
);
