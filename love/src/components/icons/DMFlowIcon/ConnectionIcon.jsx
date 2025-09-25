import React from 'react';
import Danger from './Icons/Danger';
import Disabled from './Icons/Disabled';
import Enabled from './Icons/Enabled';
import Error from './Icons/Error';

function ConnectionIcon(props) {
  const mapStateToRender = (state) => {
    if (state === 'enabled') return <Enabled />;
    if (state === 'disabled') return <Disabled />;
    if (state === 'danger') return <Danger />;
    if (state === 'error') return <Error />;
    return <></>;
  };
  const { state } = props;
  const svg = mapStateToRender(state);
  return svg;
}

export default ConnectionIcon;
