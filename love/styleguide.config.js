
const path = require('path')

module.exports = { 
    webpackConfig: require( './config/webpack.config.dev.js' ),
    require: [
      path.join(__dirname, 'src/index.css')
    ],
    ignore: ['**/__tests__/**', 
    '**/*.test.{js,jsx,ts,tsx}', 
    '**/*.spec.{js,jsx,ts,tsx}', 
    '**/*.d.ts', 
    '**/components/HealthStatusSummary/Button/Button.jsx',
    '**/components/HealthStatusSummary/Button/UploadButton.jsx',
    '**/components/HealthStatusSummary/RawTelemetryTable/ColumnHeader/ColumnHeader.jsx',
    '**/components/HealthStatusSummary/RawTelemetryTable/ColumnHeader/FilterButton/FilterButton.jsx',
    '**/components/HealthStatusSummary/RawTelemetryTable/FilterDialog/FilterDialog.jsx',
    '**/components/HealthStatusSummary/RawTelemetryTable/TelemetrySelectionTag/TelemetrySelectionTag.jsx',
    '**/components/HealthStatusSummary/RawTelemetryTable/fakeData.jsx',
    '**/components/icons/**'
    ],
    theme: {
      color: {
        base: '#aabeca', //default font color, color of headers and paragraphs
        light: 'red', // color of urls, "props&methods" "view code" "add examples to this components" and corner squares
        lightest: '#yellow',
        link: '#fcefe8', // --link-font-color
        linkHover: '#667986', //  --link-hover-font-color
        focus: 'rgba(22, 115, 177, 0.25)',//??
        border: '#e8e8e8',
        name: '#690',
        type: '#905',
        error: '#c00',
        baseBackground: '#071925', // right panel, color taken from uiguide
        codeBackground: '#f5f5f5',
        sidebarBackground: 'black', // of the list of components 
        ribbonBackground: '#e90',
        ribbonText: '#fff',
        // Based on default Prism theme
        codeComment: '#6d6d6d',
        codePunctuation: '#999',
        codeProperty: '#905',
        codeDeleted: '#905',
        codeString: '#690',
        codeInserted: '#690',
        codeOperator: '#9a6e3a',
        codeKeyword: '#1673b1',
        codeFunction: '#DD4A68',
        codeVariable: '#e90',
      },
      fontFamily: {
        base: '"Comic Sans MS", "Comic Sans", cursive'
      }
    }
}