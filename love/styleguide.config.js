
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
    ]
}