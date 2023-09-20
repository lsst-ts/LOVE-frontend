/** This file is part of LOVE-frontend.

Developed for Inria Chile Tech Team.

See the COPYRIGHT file at the top-level directory of this distribution
for details of code ownership.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.*/

import React from 'react';
import { connect } from 'react-redux';
import EmbeddedView from './EmbeddedView';

export const schema = {
  description:
    'Component that renders an external web page. The server hosting the page should allow it to be embeddable (no X-Frame-Options in the HTTP header)',
  defaultSize: [57, 35],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Embedded view',
    },
    url: {
      type: 'string',
      description: 'URL to be embedded in the component',
      isPrivate: false,
      default: 'https://dashboard.ampath.net/maddash-webui/index.cgi',
    },
    hasRawMode: {
      type: 'boolean',
      description: 'Whether the component has a raw mode version',
      isPrivate: true,
      default: false,
    },
  },
};

const EmbeddedViewContainer = ({ ...props }) => {
  return <EmbeddedView {...props} />;
};

export default connect(
  () => {
    return {};
  },
  () => {
    return {};
  },
)(EmbeddedViewContainer);
