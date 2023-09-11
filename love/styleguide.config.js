/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

const path = require('path');
const webpack = require('webpack');

const commonIgnored = [
  'src/components/Watcher/AlarmUtils.js',
  'src/components/Watcher/AlarmsTable/mock.js ',
  'src/components/GenericCamera/CameraUtils.js ',
  'src/components/UIF/ViewsIndex/ViewLauncher/ViewLauncher.jsx',
  'src/components/GeneralPurpose/Graph/entities/link/index.js ',
  'src/components/UIF/ComponentIndex.jsx',
  'src/components/ScriptQueue/Scripts/Scripts.jsx',
  'src/components/ScriptQueue/QueueMessage.jsx',
  'src/components/HealthStatusSummary/TelemetrySelectionTable/fakeData.jsx',
  'src/components/GeneralPurpose/Graph/entities/port/SimplePortFactory.jsx',
  'src/components/GeneralPurpose/Graph/entities/port/DiamondPortModel.jsx',
  'src/components/GeneralPurpose/Graph/entities/node/DiamondNodeFactory.jsx',
  'src/components/GeneralPurpose/Graph/entities/node/DiamondNodeModel.jsx',
  'src/components/GeneralPurpose/Graph/entities/label/EditableLabelModel.jsx',
  'src/components/GeneralPurpose/Graph/entities/label/EditableLabelFactory.jsx',
];

module.exports = {
  title: 'LOVE-frontend',
  serverPort: 3001,
  require: [path.join(__dirname, 'src/index.css')],
  assetsDir: 'docsrc/assets',
  pagePerSection: true,
  tocMode: 'collapse',
  exampleMode: 'collapse', // 'hide' | 'collapse' | 'expand'
  usageMode: 'collapse', // 'hide' | 'collapse' | 'expand'm
  styleguideDir: '../docs',
  propsParser(filePath, source, resolver, handlers) {
    return require('react-docgen').parse(source, resolver, handlers);
  },
  sections: [
    {
      name: 'Overview',
      content: 'docsrc/overview.md',
    },
    {
      name: 'How it works',
      content: 'docsrc/howitworks/01-howitworks.md',
      sectionDepth: 2,
      sections: [
        {
          name: 'Global state management with Redux',
          content: 'docsrc/howitworks/02-redux.md',
        },
        {
          name: 'Token, websocket connection and groups subscriptions',
          content: 'docsrc/howitworks/02.1-auth-and-subscriptions.md',
        },
        {
          name: 'Clock sync',
          content: 'docsrc/howitworks/03-time-sync.md',
        },
        {
          name: 'View editor',
          content: 'docsrc/howitworks/04-view-editor.md',
        },
        {
          name: 'Scripts config validation',
          content: 'docsrc/howitworks/05-scripts-validation.md',
        },
        {
          name: 'Configuration file settings',
          content: 'docsrc/howitworks/06-config-file.md',
        },
      ],
    },
    {
      name: 'Components',
      sectionDepth: 3,
      content: 'docsrc/components/components.md',
      sections: [
        {
          name: 'Obervatory',
          content: 'docsrc/components/observatory.md',
          components: [
            'src/components/AuxTel/Camera/Camera.container.jsx',
            'src/components/HealthStatusSummary/HealthStatusSummary.{js,jsx}',
            'src/components/ScriptQueue/Scripts/AvailableScript/AvailableScript.{js,jsx}',
            'src/components/ScriptQueue/Scripts/CurrentScript/CurrentScript.{js,jsx}',
            'src/components/ScriptQueue/Scripts/WaitingScript/WaitingScript.{js,jsx}',
            'src/components/ScriptQueue/Scripts/ScriptList/ScriptList.{js,jsx}',
            'src/components/ScriptQueue/Scripts/FinishedScript/FinishedScript.{js,jsx}',
          ],
          ignore: ['src/components/**/*.container.{js, jsx}', ...commonIgnored],
        },
        {
          name: 'Auxiliary Telescope',
          content: 'docsrc/components/auxtel.md',
          components: [],
          ignore: ['src/components/**/*.container.{js, jsx}', ...commonIgnored],
        },
        {
          name: 'General Purpose',
          content: 'docsrc/components/general-purpose.md',
          components: [
            'src/components/HealthStatusSummary/HealthStatusSummary.{js,jsx}',
            // "src/components/HealthStatusSummary/TelemetrySelectionTable/TelemetrySelectionTable.{js,jsx}",
            'src/components/GeneralPurpose/InfoPanel/InfoPanel.{js,jsx}',
            'src/components/GeneralPurpose/Graph/Graph.{js,jsx}',
            'src/components/GeneralPurpose/Panel/Panel.{js,jsx}',
            'src/components/GeneralPurpose/Button/Button.{js,jsx}',
            'src/components/GeneralPurpose/Hoverable/Hoverable.{js,jsx}',
            'src/components/GeneralPurpose/ActionableTable/ActionableTable.{js,jsx}',
            'src/components/GeneralPurpose/LoadingBar/LoadingBar.{js,jsx}',
            'src/components/GeneralPurpose/PaginatedTable/PaginatedTable.{js,jsx}',
            'src/components/GeneralPurpose/SimpleTable/SimpleTable.{js,jsx}',
            'src/components/GeneralPurpose/Plot/Plot.{js,jsx}',
            // "src/components/GeneralPurpose/Plot/VegaTimeSeriesPlot/VegaTimeSeriesPlot.{js,jsx}",
            // "src/components/Vega/Vega.{js,jsx}",
          ],
          ignore: ['src/components/**/*.container.{js, jsx}', ...commonIgnored],
        },
      ],
    },
    {
      name: 'Instructions',
      external: true,
      href: 'https://github.com/lsst-ts/LOVE-frontend/blob/develop/README.md',
    },
    {
      name: 'Contributing',
      external: true,
      href: 'https://github.com/lsst-ts/LOVE-frontend/blob/develop/CONTRIBUTING.md',
    },
  ],
  dangerouslyUpdateWebpackConfig(config) {
    config.module.rules.push({
      test: /.\.md$/,
      type: 'javascript/auto',
    });
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /react-styleguidist\/lib\/loaders\/utils\/client\/requireInRuntime$/,
        'react-styleguidist/lib/loaders/utils/client/requireInRuntime',
      ),
    );
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /react-styleguidist\/lib\/loaders\/utils\/client\/evalInContext$/,
        'react-styleguidist/lib/loaders/utils/client/evalInContext',
      ),
    );
    return config;
  },
};
