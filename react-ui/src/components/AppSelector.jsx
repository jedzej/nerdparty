import React, { Component } from 'react';
import { connect } from "react-redux";
import Grid from 'material-ui/Grid/Grid';

import { start } from '../logic/app/actions';
import applications from '../applications'


class AppSelector extends Component {

  render() {
    const { props } = this;
    console.log(applications)
    return (
      <Grid container spacing={0}>
        {Object.values(applications).map(app => (
          <Grid item key={app.MANIFEST.NAME} style={{padding:12}}>
            <app.CARD
              lobby={props.lobby}
              user={props.user}
              onStart={() => props.start(app.MANIFEST.NAME)} />
          </Grid>
        ))}
      </Grid>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    user: state.user,
    lobby: state.lobby
  };
};

const mapDispatchToProps = (dispatch) => ({
  start: (name) => {
    dispatch(start(name));
  }
})


export default connect(mapStateToProps, mapDispatchToProps)(AppSelector);
