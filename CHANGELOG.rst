===============
Version History
===============

v6.8.0
------

* Implement Nightreport v2. `<https://github.com/lsst-ts/LOVE-frontend/pull/718>`_
* Refactor AvailableScript to avoid using isCompact property by relaying just in CSS styles for script name triming. `<https://github.com/lsst-ts/LOVE-frontend/pull/716>`_
* Add option to duplicate components to the UI framework. `<https://github.com/lsst-ts/LOVE-frontend/pull/717>`_
* Refactor and improve EFD interface for different components. `<https://github.com/lsst-ts/LOVE-frontend/pull/713>`_

v6.7.3
------

* Update package.json version to v6.7.3. `<https://github.com/lsst-ts/LOVE-frontend/pull/714>`_
* Move current script configuration to the top in the current script details section. `<https://github.com/lsst-ts/LOVE-frontend/pull/712>`_
* Add exitControl for all CSCs and enterControl to XXCamera CSCs in expanded view. `<https://github.com/lsst-ts/LOVE-frontend/pull/711>`_
* Add Offline detailed stated for big cameras in CSC detailed and expanded views. `<https://github.com/lsst-ts/LOVE-frontend/pull/711>`_
* Fix MTDomeShutter component interpreting MTDome_apertureShutter value erroneously. `<https://github.com/lsst-ts/LOVE-frontend/pull/710>`_
* Roll back critical alarm loop for Watcher alarm sounds. `<https://github.com/lsst-ts/LOVE-frontend/pull/709>`_
* Fix HVAC Facility Map display after XML 23 changes. `<https://github.com/lsst-ts/LOVE-frontend/pull/707>`_
* Fix state enumeration mapping for the MTDome_logevent_azEnabled topic. `<https://github.com/lsst-ts/LOVE-frontend/pull/708>`_
* Fix MTDome shutter display. `<https://github.com/lsst-ts/LOVE-frontend/pull/706>`_
* Improve AlarmAudio sound handling even more. `<https://github.com/lsst-ts/LOVE-frontend/pull/705>`_

v6.7.2
------

* Update package.json version to v6.7.2. `<https://github.com/lsst-ts/LOVE-frontend/pull/701>`_
* Refactor Watcher AlarmAudio component for a more reliable flow. `<https://github.com/lsst-ts/LOVE-frontend/pull/700>`_
* Fix WeatherStation plots for temperature and dewpoint. `<https://github.com/lsst-ts/LOVE-frontend/pull/699>`_
* Bump vega from 5.25.0 to 5.26.0 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/693>`_
* Bump nanoid from 3.3.6 to 3.3.8 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/694>`_
* Bump vega-selections from 5.4.1 to 5.5.0 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/695>`_
* Bump express from 4.19.2 to 4.21.2 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/691>`_
* Bump webpack from 5.88.2 to 5.98.0 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/690>`_
* Bump cross-spawn from 7.0.3 to 7.0.6 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/677>`_
* Bump http-proxy-middleware from 2.0.6 to 2.0.7 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/671>`_
* Bump rollup from 2.79.1 to 2.79.2 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/666>`_
* Bump micromatch from 4.0.5 to 4.0.8 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/662>`_

v6.7.1
------

* Update package.json version to v6.7.1. `<https://github.com/lsst-ts/LOVE-frontend/pull/692>`_
* Improve how scripts with empty schemas are handled. `<https://github.com/lsst-ts/LOVE-frontend/pull/689>`_
* Improve error handling for queries to get services status for SAL and EFD. `<https://github.com/lsst-ts/LOVE-frontend/pull/688>`_
* Refactor LOVE components to use private_sndStamp instead of deprecated private_rcvStamp `<https://github.com/lsst-ts/LOVE-frontend/pull/687>`_

v6.7.0
------

* Update package.json version to v6.7.0. `<https://github.com/lsst-ts/LOVE-frontend/pull/686>`_
* Fix telescope RA and Rotator display on DomeSummaryTable components. `<https://github.com/lsst-ts/LOVE-frontend/pull/685>`_
* Add a button to log alarms from the AlarmsList and AlarmsTable components. `<https://github.com/lsst-ts/LOVE-frontend/pull/684>`_

v6.6.0
------

* Extend LOVE Jira interface to comply with new OBS systems hierarchy. `<https://github.com/lsst-ts/LOVE-frontend/pull/683>`_

v6.5.0
------

* Update package.json version to v6.5.0. `<https://github.com/lsst-ts/LOVE-frontend/pull/682>`_
* Convert narrativelog date_begin and date_end TAI datetimes to UTC. `<https://github.com/lsst-ts/LOVE-frontend/pull/681>`_
* Extend ScriptQueue ConfigPanel component to load scripts schemas on demand. `<https://github.com/lsst-ts/LOVE-frontend/pull/680>`_

v6.4.1
------

* Update package.json version to v6.4.1. `<https://github.com/lsst-ts/LOVE-frontend/pull/679>`_
* Show error details for requests to the LOVE-manager. `<https://github.com/lsst-ts/LOVE-frontend/pull/678>`_

v6.4.0
------

* Update package.json version to v6.4.0. `<https://github.com/lsst-ts/LOVE-frontend/pull/676>`_
* Add RA and dec information on dome summary table components and a few other improvements. `<https://github.com/lsst-ts/LOVE-frontend/pull/675>`_
* Add M1M3HardpointsDataTable component. `<https://github.com/lsst-ts/LOVE-frontend/pull/674>`_
* Add M1M3Compact and M2Compact components. `<https://github.com/lsst-ts/LOVE-frontend/pull/673>`_
* Fix OLE exposure components to allow all instruments to be used queried. `<https://github.com/lsst-ts/LOVE-frontend/pull/672>`_

v6.3.1
------

* Update package.json version to v6.3.1 `<https://github.com/lsst-ts/LOVE-frontend/pull/670>`_
* Adjustments and fixes for M1M3TS components `<https://github.com/lsst-ts/LOVE-frontend/pull/669>`_
* Fix links parsing on the htmlToJiraMarkdown function so it properly parse more than one link in the string `<https://github.com/lsst-ts/LOVE-frontend/pull/667>`_
* Remove deprecated MTHexapod Offline controller state `<https://github.com/lsst-ts/LOVE-frontend/pull/668>`_
* Refactor M2 Selector component to fix axial and tangent actuators coordinate system `<https://github.com/lsst-ts/LOVE-frontend/pull/665>`_

v6.3.0
------

* Update package.json version to v6.3.0 `<https://github.com/lsst-ts/LOVE-frontend/pull/661>`_
* Fix ampersand being parsed to html encoding by QuillJS `<https://github.com/lsst-ts/LOVE-frontend/pull/660>`_
* Fix ATDome Nasmyth value display `<https://github.com/lsst-ts/LOVE-frontend/pull/659>`_
* Fix GearIcon rendering on the Scheduler component `<https://github.com/lsst-ts/LOVE-frontend/pull/658>`_
* Extend size of individual log message display `<https://github.com/lsst-ts/LOVE-frontend/pull/657>`_
* Add RA, Dec and Rotator parameters to the ATDome component `<https://github.com/lsst-ts/LOVE-frontend/pull/656>`_

v6.2.0
------

* Update package.json version to v6.2.0 `<https://github.com/lsst-ts/LOVE-frontend/pull/652>`_
* Fix observers dropdown on the NightReport component `<https://github.com/lsst-ts/LOVE-frontend/pull/655>`_
* Fix M1M3 force dropdown selection behavior `<https://github.com/lsst-ts/LOVE-frontend/pull/654>`_
* Adjust polling rate for external services queries `<https://github.com/lsst-ts/LOVE-frontend/pull/653>`_
* Add visual cue on CSCDetail and CSCExpanded to identify CSCs on simulation mode `<https://github.com/lsst-ts/LOVE-frontend/pull/651>`_

v6.1.1
------

* Update package.json version to v6.1.1 `<https://github.com/lsst-ts/LOVE-frontend/pull/650>`_
* Rename Confluence URL to Night Plan URL on the CreateNightReport component `<https://github.com/lsst-ts/LOVE-frontend/pull/649>`_
* Bump ws from 7.5.9 to 7.5.10 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/648>`_
* Bump braces from 3.0.2 to 3.0.3 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/647>`_
* Bump ejs from 3.1.9 to 3.1.10 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/638>`_

v6.1.0
------

* Update package.json version to v6.1.0 `<https://github.com/lsst-ts/LOVE-frontend/pull/646>`_
* Add new BulkSelect component and hook it up to the ExposureAdd one `<https://github.com/lsst-ts/LOVE-frontend/pull/645>`_
* Add dashboard name to page title `<https://github.com/lsst-ts/LOVE-frontend/pull/644>`_
* Fix Weatherforecast last 48 hours feature `<https://github.com/lsst-ts/LOVE-frontend/pull/643>`_
* Update CSC hierarchy by removing Archiver references and adding missing CSCs `<https://github.com/lsst-ts/LOVE-frontend/pull/642>`_

v6.0.0
------

* Update package.json version to v6.0.0 `<https://github.com/lsst-ts/LOVE-frontend/pull/641>`_
* Remove Authorize CSC components and references `<https://github.com/lsst-ts/LOVE-frontend/pull/640>`_
* Refactor ScriptQueueState payload into several `<https://github.com/lsst-ts/LOVE-frontend/pull/639>`_

v5.30.2
-------

* Update package.json version to v5.30.2 `<https://github.com/lsst-ts/LOVE-frontend/pull/637>`_
* Refactor the ExposureAdd component and fix issue with submit button being disabled `<https://github.com/lsst-ts/LOVE-frontend/pull/636>`_
* Bump express from 4.18.2 to 4.19.2 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/625>`_
* Bump webpack-dev-middleware from 5.3.3 to 5.3.4 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/620>`_
* Bump follow-redirects from 1.15.5 to 1.15.6 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/615>`_
* Bump es5-ext from 0.10.62 to 0.10.64 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/611>`_
* Adjustments for ComCam and MTCamera component `<https://github.com/lsst-ts/LOVE-frontend/pull/635>`_
* Refactor Plot components `<https://github.com/lsst-ts/LOVE-frontend/pull/634>`_
* Remove unused heartbeats subscription on TMA, M2 and M2Table `<https://github.com/lsst-ts/LOVE-frontend/pull/633>`_
* Memoize DigitalClock and AnalogClock components `<https://github.com/lsst-ts/LOVE-frontend/pull/632>`_

v5.30.1
-------

* Update package.json version to v5.30.1 `<https://github.com/lsst-ts/LOVE-frontend/pull/631>`_
* Adjust Auxtel Mount SummaryPanel component to start using ATPneumatics_mainAirSourcePressure topic `<https://github.com/lsst-ts/LOVE-frontend/pull/630>`_
* Couple improvements for sizing big logs for the NonExposure component `<https://github.com/lsst-ts/LOVE-frontend/pull/629>`_
* UI/UX Improvements for the night report feature `<https://github.com/lsst-ts/LOVE-frontend/pull/627>`_
* Fix CameraCableWrap UI swapped limits and floating points `<https://github.com/lsst-ts/LOVE-frontend/pull/628>`_
* Fix value of MTHexapod_logevent_compensatedPosition.w setting `<https://github.com/lsst-ts/LOVE-frontend/pull/626>`_

v5.30.0
-------

* Update package.json version to v5.30.0 `<https://github.com/lsst-ts/LOVE-frontend/pull/624>`_
* Fix the feature to convert Jira ticket names into hyperlinks `<https://github.com/lsst-ts/LOVE-frontend/pull/623>`_
* Fix content cleaning on RichTextEditor `<https://github.com/lsst-ts/LOVE-frontend/pull/622>`_
* Update missing reference to the jira service `<https://github.com/lsst-ts/LOVE-frontend/pull/621>`_
* Add Night Report implementation `<https://github.com/lsst-ts/LOVE-frontend/pull/619>`_

v5.29.3
-------

* Update package.json version to v5.29.3 `<https://github.com/lsst-ts/LOVE-frontend/pull/618>`_
* Fixes for RichTextEditor and parsing functions `<https://github.com/lsst-ts/LOVE-frontend/pull/617>`_
* Fix day obs calculation on NonExposure `<https://github.com/lsst-ts/LOVE-frontend/pull/616>`_

v5.29.2
-------

* Update package.json version to v5.29.2 `<https://github.com/lsst-ts/LOVE-frontend/pull/613>`_
* Fix getFilesURLs function to properly use JIRA_TICKETS_BASE_URL constant `<https://github.com/lsst-ts/LOVE-frontend/pull/614>`_
* Update OLE_JIRA_COMPONENTS fields ids `<https://github.com/lsst-ts/LOVE-frontend/pull/612>`_

v5.29.1
-------

* Update package.json version to v5.29.1 `<https://github.com/lsst-ts/LOVE-frontend/pull/610>`_
* Update OLE JIRA fields ids `<https://github.com/lsst-ts/LOVE-frontend/pull/609>`_

v5.29.0
-------

* Update package.json version to v5.29.0 `<https://github.com/lsst-ts/LOVE-frontend/pull/607>`_
* Add jira tickets filter for NonExposure logs table `<https://github.com/lsst-ts/LOVE-frontend/pull/606>`_
* Create OrderableTable to extend SimpleTable to allow rows sorting by column `<https://github.com/lsst-ts/LOVE-frontend/pull/605>`_
* Extend logs edition feature to allow JIRA tickets attachment `<https://github.com/lsst-ts/LOVE-frontend/pull/604>`_

v5.28.0
-------

* Update package.json version to v5.28.0 `<https://github.com/lsst-ts/LOVE-frontend/pull/603>`_
* Remove drag and drop ability on RichTextEditor component `<https://github.com/lsst-ts/LOVE-frontend/pull/602>`_
* Add M1M3 Bump Tests reports `<https://github.com/lsst-ts/LOVE-frontend/pull/601>`_
* Make narrative log time of incident optional and improve usability `<https://github.com/lsst-ts/LOVE-frontend/pull/600>`_

v5.27.11
--------

* Update package.json version to v5.27.11 `<https://github.com/lsst-ts/LOVE-frontend/pull/598>`_
* Fix time of incident handling `<https://github.com/lsst-ts/LOVE-frontend/pull/599>`_
* Bump follow-redirects from 1.15.2 to 1.15.5 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/597>`_
* Increase OLE tables contrast even more `<https://github.com/lsst-ts/LOVE-frontend/pull/596>`_
* Make OLE components field to persist set values `<https://github.com/lsst-ts/LOVE-frontend/pull/595>`_
* Add button to send showSchema command `<https://github.com/lsst-ts/LOVE-frontend/pull/594>`_
* Adjust LOVE M2 force gradient coloring `<https://github.com/lsst-ts/LOVE-frontend/pull/592>`_
* Fix GIS signals typo `<https://github.com/lsst-ts/LOVE-frontend/pull/591>`_
* Add MTM2 powerSystemState data `<https://github.com/lsst-ts/LOVE-frontend/pull/590>`_
* Remove custom failed script sound alert `<https://github.com/lsst-ts/LOVE-frontend/pull/589>`_
* OLE visual improvements `<https://github.com/lsst-ts/LOVE-frontend/pull/588>`_

v5.27.10
--------

* Update package.json version to v5.27.10 `<https://github.com/lsst-ts/LOVE-frontend/pull/587>`_
* Update Rubin logos lineup `<https://github.com/lsst-ts/LOVE-frontend/pull/586>`_
* Add release instructions to CONTRIBUTING guide `<https://github.com/lsst-ts/LOVE-frontend/pull/585>`_
* Improve Watcher alarm handling to comply with new rules `<https://github.com/lsst-ts/LOVE-frontend/pull/584>`_
* Fix OLE JIRA tickets handling `<https://github.com/lsst-ts/LOVE-frontend/pull/583>`_

v5.27.9
-------

* Update package.json version to v5.27.9 `<https://github.com/lsst-ts/LOVE-frontend/pull/582>`_
* Improve ManagerInterface response handling `<https://github.com/lsst-ts/LOVE-frontend/pull/581>`_
* Bump @adobe/css-tools from 4.3.1 to 4.3.2 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/580>`_
* Several fixes for Plot components `<https://github.com/lsst-ts/LOVE-frontend/pull/578>`_

v5.27.8
-------

* Update package.json version to v5.27.8 `<https://github.com/lsst-ts/LOVE-frontend/pull/579>`_
* Fix MultiSelect selection removing behavior `<https://github.com/lsst-ts/LOVE-frontend/pull/577>`_
* Make constraints to save logs more robust `<https://github.com/lsst-ts/LOVE-frontend/pull/576>`_
* Rollback query to FinishedScript removed on a previous commit `<https://github.com/lsst-ts/LOVE-frontend/pull/575>`_
* Increase interval between audio alarms `<https://github.com/lsst-ts/LOVE-frontend/pull/574>`_
* Improve OLE behavior when jira ticket creation fails `<https://github.com/lsst-ts/LOVE-frontend/pull/573>`_

v5.27.7
------

* Hotfix: make scripts timestamp evaluation more robust `<https://github.com/lsst-ts/LOVE-frontend/pull/572>`_

v5.27.6
-------

* Update package.json version to v5.27.6 `<https://github.com/lsst-ts/LOVE-frontend/pull/571>`_
* Add more info on scripts for ScriptQueue `<https://github.com/lsst-ts/LOVE-frontend/pull/570>`_
* Remove auto formatting from RichTextEditor `<https://github.com/lsst-ts/LOVE-frontend/pull/569>`_

v5.27.5
-------

* Add script failure alert sound `<https://github.com/lsst-ts/LOVE-frontend/pull/568>`_
* Add package override for Semver and PostCSS `<https://github.com/lsst-ts/LOVE-frontend/pull/567>`_
* Fix OLE time of incident input `<https://github.com/lsst-ts/LOVE-frontend/pull/566>`_
* Fix narrative log to avoid crashing when filtering by log components `<https://github.com/lsst-ts/LOVE-frontend/pull/565>`_

v5.27.4
-------

* Update package.json version to 5.27.4 `<https://github.com/lsst-ts/LOVE-frontend/pull/564>`_
* Fixes for Wind plot `<https://github.com/lsst-ts/LOVE-frontend/pull/563>`_

v5.27.3
-------

* Minimize mouse clicks and other OLE adjustments `<https://github.com/lsst-ts/LOVE-frontend/pull/562>`_
* Fix documentation pipeline `<https://github.com/lsst-ts/LOVE-frontend/pull/561>`_

v5.27.2
-------

* Update yarn.lock `<https://github.com/lsst-ts/LOVE-frontend/pull/560>`_
* Bump d3-color from 1.4.1 to 3.1.0 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/559>`_
* Bump d3, d3-geo-veroni, get rid of cypress and vega-lib, update component d3 use of d3.event `<https://github.com/lsst-ts/LOVE-frontend/pull/558>`_
* Clean compilation warnings on LOVE-frontend `<https://github.com/lsst-ts/LOVE-frontend/pull/557>`_
* Update to node:lts docker image `<https://github.com/lsst-ts/LOVE-frontend/pull/556>`_
* Extend OLE for Tekniker tickets logging `<https://github.com/lsst-ts/LOVE-frontend/pull/547>`_

v5.27.1
-------

* Add jira tickets auto conversion `<https://github.com/lsst-ts/LOVE-frontend/pull/555>`_

v5.27.0
-------

* DM Flow implementation `<https://github.com/lsst-ts/LOVE-frontend/pull/554>`_
* Point LOVE weather station to read corresponding CSC `<https://github.com/lsst-ts/LOVE-frontend/pull/553>`_
* Add Dynalene Component `<https://github.com/lsst-ts/LOVE-frontend/pull/552>`_
* Add new params: category and time_lost_type to narrative log `<https://github.com/lsst-ts/LOVE-frontend/pull/551>`_

v5.26.1
-------

* AT Dome and Mount telemetry displays not correct `<https://github.com/lsst-ts/LOVE-frontend/pull/550>`_
* Adjust parameters names for ESS topics `<https://github.com/lsst-ts/LOVE-frontend/pull/549>`_
* Reconnect MTDome Power Draw Plots to mocekd 'undefined' telemetries `<https://github.com/lsst-ts/LOVE-frontend/pull/548>`_
* Add AuxTel Atmospheric Transmission `<https://github.com/lsst-ts/LOVE-frontend/pull/546>`_
* Extend OLE Jira feature by implementing a compatible wysiwyg `<https://github.com/lsst-ts/LOVE-frontend/pull/543>`_

v5.26.0
-------

* Final adjustments for EnvironmentSummary `<https://github.com/lsst-ts/LOVE-frontend/pull/545>`_
* Bump @babel/traverse from 7.22.5 to 7.23.2 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/544>`_
* Add Simonyi Interlock Signals `<https://github.com/lsst-ts/LOVE-frontend/pull/542>`_
* Scripts Form Config is not showing button icons `<https://github.com/lsst-ts/LOVE-frontend/pull/541>`_
* Layout improvements for OLE components `<https://github.com/lsst-ts/LOVE-frontend/pull/540>`_
* Update ATMCS Mount Tracking config file `<https://github.com/lsst-ts/LOVE-frontend/pull/539>`_
* Add Environmental Degradation to top level summaries `<https://github.com/lsst-ts/LOVE-frontend/pull/538>`_
* Possibly malformed YAML in script dialog causes crash loop on subsequent use `<https://github.com/lsst-ts/LOVE-frontend/pull/536>`_
* Add ability to add a script at the top of the queue from LOVE `<https://github.com/lsst-ts/LOVE-frontend/pull/537>`_
* Move docs creation to CI `<https://github.com/lsst-ts/LOVE-frontend/pull/532>`_

v5.25.3
-------

* Add mock Dome Tracking to ATDome and MTDome `<https://github.com/lsst-ts/LOVE-frontend/pull/535>`_
* Add Optical Alignment Alarm to M2 and M1M3 `<https://github.com/lsst-ts/LOVE-frontend/pull/534>`_
* Add ZoomOut button and better performance on FacilityMap component `<https://github.com/lsst-ts/LOVE-frontend/pull/533>`_
* Fix ESS component with the sorted sensors in cache `<https://github.com/lsst-ts/LOVE-frontend/pull/531>`_
* MTCamera and CCCamera zoom out button `<https://github.com/lsst-ts/LOVE-frontend/pull/530>`_
* Scheduler accordion BlockList grid fix `<https://github.com/lsst-ts/LOVE-frontend/pull/529>`_
* Fix M2 Actuator position units from um to µm `<https://github.com/lsst-ts/LOVE-frontend/pull/528>`_

v5.25.2
-------

* Improve copyright file `<https://github.com/lsst-ts/LOVE-frontend/pull/527>`_
* Patch ScriptQueue ConfigPanel yaml strings parsing `<https://github.com/lsst-ts/LOVE-frontend/pull/526>`_
* Improvements for Plot component `<https://github.com/lsst-ts/LOVE-frontend/pull/525>`_
* LOVE License `<https://github.com/lsst-ts/LOVE-frontend/pull/524>`_
* Make CSCExpanded select inputs more clear `<https://github.com/lsst-ts/LOVE-frontend/pull/523>`_
* Reorganize Component Select Screen `<https://github.com/lsst-ts/LOVE-frontend/pull/522>`_
* Change Illinois timezone to California as USDF is at SLAC now `<https://github.com/lsst-ts/LOVE-frontend/pull/521>`_

v5.25.1
-------

* Fix components configuration saving method `<https://github.com/lsst-ts/LOVE-frontend/pull/518>`_

v5.25.0
--------

* ESS Implementation `<https://github.com/lsst-ts/LOVE-frontend/pull/506>`_
* CSC Summary State into MTDome ATDome and TMA Component `<https://github.com/lsst-ts/LOVE-frontend/pull/519>`_

v5.24.11
--------

* Update narrative log to use new jira fields `<https://github.com/lsst-ts/LOVE-frontend/pull/517>`_
* OLE layout improvements `<https://github.com/lsst-ts/LOVE-frontend/pull/503>`_

v5.24.10
---------

* Implement MultiFileUploader for the OLE component `<https://github.com/lsst-ts/LOVE-frontend/pull/515>`_
* Set narrativelog date selector to work between startOfDay and endOfDay `<https://github.com/lsst-ts/LOVE-frontend/pull/514>`_
* Fix GIS data expunge `<https://github.com/lsst-ts/LOVE-frontend/pull/513>`_
* Various ATDome updates `<https://github.com/lsst-ts/LOVE-frontend/pull/512>`_
* Highlight block when is selected `<https://github.com/lsst-ts/LOVE-frontend/pull/511>`_
* Bump @adobe/css-tools from 4.0.1 to 4.3.1 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/508>`_

v5.24.9
--------

* Add 1 day to end obs day for querying exposures `<https://github.com/lsst-ts/LOVE-frontend/pull/510>`_
* Point LOVE weather station to read corresponding CSC `<https://github.com/lsst-ts/LOVE-frontend/pull/509>`_

v5.24.8
--------

* Extend getSALStatus to catch errors on fetching `<https://github.com/lsst-ts/LOVE-frontend/pull/507>`_
* Simonyi LightPath Covers Hotfix `<https://github.com/lsst-ts/LOVE-frontend/pull/505>`_
* Fix script configuration storing rendering constraints `<https://github.com/lsst-ts/LOVE-frontend/pull/504>`_

v5.24.7
--------

* Mobile version menu not stacking `<https://github.com/lsst-ts/LOVE-frontend/pull/502>`_
* addBlock command into Scheduler component `<https://github.com/lsst-ts/LOVE-frontend/pull/501>`_

v5.24.6
--------

* Improve ScriptQueue search scripts functionality `<https://github.com/lsst-ts/LOVE-frontend/pull/500>`_
* Add unique Ids and ZoomOut button to M1M3TS `<https://github.com/lsst-ts/LOVE-frontend/pull/499>`_
* Workaround to fetch an infinite response when status is 0 `<https://github.com/lsst-ts/LOVE-frontend/pull/497>`_

v5.24.5
--------

* Fix Scheduler subscription for Layout component `<https://github.com/lsst-ts/LOVE-frontend/pull/498>`_
* Hotfix Add unique Id to Glycol Loop Temp Ref `<https://github.com/lsst-ts/LOVE-frontend/pull/496>`_

v5.24.4
--------

* Hotfix for typo in GenericCameraControls component `<https://github.com/lsst-ts/LOVE-frontend/pull/495>`_
* Hotfix M1M3 raw button `<https://github.com/lsst-ts/LOVE-frontend/pull/494>`_

v5.24.3
--------

* Add M2 zoom-out button and remove inclination `<https://github.com/lsst-ts/LOVE-frontend/pull/493>`_
* Fix generic camera image generation `<https://github.com/lsst-ts/LOVE-frontend/pull/492>`_

v5.24.2
--------

* Fixes and improvements for the EnvironmentSummary `<https://github.com/lsst-ts/LOVE-frontend/pull/491>`_
* Fix time parameters to query finished scripts historic logs and config `<https://github.com/lsst-ts/LOVE-frontend/pull/490>`_

v5.24.1
--------

* More OLE improvements `<https://github.com/lsst-ts/LOVE-frontend/pull/489>`_
* Bump word-wrap from 1.2.3 to 1.2.4 `<https://github.com/lsst-ts/LOVE-frontend/pull/486>`_
* Bump semver from 5.7.1 to 5.7.2 `<https://github.com/lsst-ts/LOVE-frontend/pull/483>`_

v5.24.0
--------

* MTCamera & CCCamera implementation `<https://github.com/lsst-ts/LOVE-frontend/pull/488>`_
* LOVE windows are difficult to read on control room displays `<https://github.com/lsst-ts/LOVE-frontend/pull/487>`_
* Extend LOVE frontend routing system to add SSL and subpath serving `<https://github.com/lsst-ts/LOVE-frontend/pull/485>`_
* Extend getEFDLogs method to specify the timestamps scale `<https://github.com/lsst-ts/LOVE-frontend/pull/484>`_

v5.23.0
--------

* Hotfix Scheduler plots `<https://github.com/lsst-ts/LOVE-frontend/pull/482>`_
* Implement MT Light Path `<https://github.com/lsst-ts/LOVE-frontend/pull/481>`_
* Move Authlist components to Observatory index `<https://github.com/lsst-ts/LOVE-frontend/pull/480>`_

v5.22.0
--------

* Hotfix/v5.21.0 `<https://github.com/lsst-ts/LOVE-frontend/pull/479>`_
* Environment Summary implementation `<https://github.com/lsst-ts/LOVE-frontend/pull/478>`_
* Avoid session logout when receiving 403 forbidden response `<https://github.com/lsst-ts/LOVE-frontend/pull/477>`_
* Glycol Loop Implementation `<https://github.com/lsst-ts/LOVE-frontend/pull/475>`_
* Include Dynalene System and MTAirCompressor devices to Facility Map `<https://github.com/lsst-ts/LOVE-frontend/pull/474>`_
* Subsystem EUIs Implementation `<https://github.com/lsst-ts/LOVE-frontend/pull/476>`_

v5.21.0
--------

* Add changelog checker github action `<https://github.com/lsst-ts/LOVE-frontend/pull/473>`_
* Microphones Component implementation `<https://github.com/lsst-ts/LOVE-frontend/pull/471>`_
* ScriptQueue Upgrade implementation `<https://github.com/lsst-ts/LOVE-frontend/pull/470>`_
* Implementation WeatherForecast `<https://github.com/lsst-ts/LOVE-frontend/pull/468>`_

v5.20.3
--------

* Add throtle to alarm notification checking to avoid annoying sound alarms `<https://github.com/lsst-ts/LOVE-frontend/pull/469>`_

v5.20.2
--------

* Fix M1M3 actuators mappings for different force parameters `<https://github.com/lsst-ts/LOVE-frontend/pull/467>`_
* Extend exposure log service to show exposures from different registries `<https://github.com/lsst-ts/LOVE-frontend/pull/466>`_
* Add error fedback to the user when a date input is not valid for OLE component `<https://github.com/lsst-ts/LOVE-frontend/pull/465>`_
* Add Inria Logo and an About `<https://github.com/lsst-ts/LOVE-frontend/pull/464>`_

v5.20.1
--------

* Hotfix/v5.20.0 `<https://github.com/lsst-ts/LOVE-frontend/pull/463>`_
* Fix error with not defined method on MTM2 component `<https://github.com/lsst-ts/LOVE-frontend/pull/462>`_
* UI/UX improvements for MTM1M3 component `<https://github.com/lsst-ts/LOVE-frontend/pull/461>`_
* Adjust GIS to comply with the latest GIS_logevent_rawStatus format `<https://github.com/lsst-ts/LOVE-frontend/pull/460>`_

v5.20.0
--------

* MTM1M3TS implementation `<https://github.com/lsst-ts/LOVE-frontend/pull/459>`_
* Scheduler implementation `<https://github.com/lsst-ts/LOVE-frontend/pull/458>`_
* Fix scrolling behavior when content overflows on CSCGroup `<https://github.com/lsst-ts/LOVE-frontend/pull/457>`_
* Fix initial data to avoid errors after creating 1 narrative log `<https://github.com/lsst-ts/LOVE-frontend/pull/456>`_
* Extend thumbnails query `<https://github.com/lsst-ts/LOVE-frontend/pull/455>`_
* Refactor Watcher alarms handling `<https://github.com/lsst-ts/LOVE-frontend/pull/454>`_

v5.19.1
--------

* Bump yaml from 2.1.1 to 2.2.2 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/453>`_
* Hotfixes for tag 5.19.0 `<https://github.com/lsst-ts/LOVE-frontend/pull/452>`_

v5.19.0
--------

* Connect SAL status service `<https://github.com/lsst-ts/LOVE-frontend/pull/451>`_
* Add ``Facility Map`` component `<https://github.com/lsst-ts/LOVE-frontend/pull/450>`_
* Connect Tracking Modes telemetries `<https://github.com/lsst-ts/LOVE-frontend/pull/449>`_
* Fix ``GIS`` signals - effects mappings `<https://github.com/lsst-ts/LOVE-frontend/pull/448>`_

v5.18.0
--------

* Add ``Aircraft Tracker`` component implementation `<https://github.com/lsst-ts/LOVE-frontend/pull/447>`_
* Add Location Control sources of information `<https://github.com/lsst-ts/LOVE-frontend/pull/446>`_
* Fix LATISS and ATCamera state mappings `<https://github.com/lsst-ts/LOVE-frontend/pull/445>`_

v5.17.1
--------

* Remove OLE commented code `<https://github.com/lsst-ts/LOVE-frontend/pull/444>`_

v5.17.0
--------

* Extend some OLE features `<https://github.com/lsst-ts/LOVE-frontend/pull/443>`_
* Tickets/love 89 Mirror Cover Status in TMA `<https://github.com/lsst-ts/LOVE-frontend/pull/442>`_

v5.16.0
--------

* Update GIS component to adapt with newest CSC version `<https://github.com/lsst-ts/LOVE-frontend/pull/441>`_
* Observatory Summary Component Implementation `<https://github.com/lsst-ts/LOVE-frontend/pull/440>`_

v5.15.1
--------

* Update docs: LOVE Config file `<https://github.com/lsst-ts/LOVE-frontend/pull/439>`_
* Tickets/love 157 - changes about the Visit to Summit `<https://github.com/lsst-ts/LOVE-frontend/pull/438>`_

v5.15.0
-------

* Extend ``CommandPanel`` component `<https://github.com/lsst-ts/LOVE-frontend/pull/437>`_
* Add ``CloudMap`` component `<https://github.com/lsst-ts/LOVE-frontend/pull/436>`_
* Bump webpack from 5.74.0 to 5.76.1 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/435>`_

v5.14.1
-------

* Fix styling issues and state mapping on ``M1M3`` component `<https://github.com/lsst-ts/LOVE-frontend/pull/434>`_
* Add repository version history `<https://github.com/lsst-ts/LOVE-frontend/pull/433>`_
* Fix a state mapping of ``M1M3`` `<https://github.com/lsst-ts/LOVE-frontend/pull/432>`_
* Fix LOVE Config Files component `<https://github.com/lsst-ts/LOVE-frontend/pull/431>`_
* Bump vega from 5.22.1 to 5.23.0 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/430>`_
* Bump vega-functions from 5.13.0 to 5.13.1 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/429>`_

v5.14.0
-------

* Hotfix for TMA `<https://github.com/lsst-ts/LOVE-frontend/pull/428>`_
* Update deprecated param for ScriptQueue_command_move `<https://github.com/lsst-ts/LOVE-frontend/pull/427>`_
* Fix mirror covers values for LightPath component `<https://github.com/lsst-ts/LOVE-frontend/pull/426>`_
* OLE implementation `<https://github.com/lsst-ts/LOVE-frontend/pull/321>`_

v5.13.0
-------

* Add optional chaining to avoid errors when user logouts `<https://github.com/lsst-ts/LOVE-frontend/pull/425>`_
* Replace Main and MT names to Simonyi `<https://github.com/lsst-ts/LOVE-frontend/pull/424>`_
* Hotfix and documentation to Value component `<https://github.com/lsst-ts/LOVE-frontend/pull/423>`_
* Hotfix for ATDome view `<https://github.com/lsst-ts/LOVE-frontend/pull/422>`_
* ADD MTDomePower component `<https://github.com/lsst-ts/LOVE-frontend/pull/421>`_
* Fix Auxtel Mount SummaryPanel `<https://github.com/lsst-ts/LOVE-frontend/pull/420>`_
* Correct telemetries on MTM1M3.container `<https://github.com/lsst-ts/LOVE-frontend/pull/419>`_
* Bump luxon from 1.28.0 to 1.28.1 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/418>`_
* Bump json5 from 1.0.1 to 1.0.2 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/416>`_
* Add configurationsApplied topic to CSCExpanded `<https://github.com/lsst-ts/LOVE-frontend/pull/415>`_
* Improved Az and El display for ATDome MTDome and TMA `<https://github.com/lsst-ts/LOVE-frontend/pull/414>`_

v5.12.3
-------

* Add execution information for Authlist `<https://github.com/lsst-ts/LOVE-frontend/pull/413>`_
* Pneumatics Section in Dome & Mount Screen `<https://github.com/lsst-ts/LOVE-frontend/pull/412>`_
* Bump loader-utils from 2.0.3 to 2.0.4 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/411>`_
* MTM1M3 topics update `<https://github.com/lsst-ts/LOVE-frontend/pull/391>`_

v5.12.2
-------

* Bump loader-utils from 2.0.2 to 2.0.3 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/410>`_
* Update ScriptQueue_command_requeue param `<https://github.com/lsst-ts/LOVE-frontend/pull/409>`_
* MTDome: azimuth telemetry is not connected `<https://github.com/lsst-ts/LOVE-frontend/pull/408>`_

v5.12.1
-------

* Dome and Mount fixes `<https://github.com/lsst-ts/LOVE-frontend/pull/407>`_

v5.12.0
-------

* Tickets/dm 36357 `<https://github.com/lsst-ts/LOVE-frontend/pull/405>`_
* Adjust properly transform origin `<https://github.com/lsst-ts/LOVE-frontend/pull/404>`_
* GIS implementation `<https://github.com/lsst-ts/LOVE-frontend/pull/384>`_

v5.11.1
-------

* Hotfix for dome section `<https://github.com/lsst-ts/LOVE-frontend/pull/403>`_

v5.11.0
-------

* ATMCS Summary Panel adjustments `<https://github.com/lsst-ts/LOVE-frontend/pull/402>`_
* Fix dome pointing difference between actual value and commanded `<https://github.com/lsst-ts/LOVE-frontend/pull/401>`_
* Fix m3InPosition value read `<https://github.com/lsst-ts/LOVE-frontend/pull/400>`_
* Fix transition animated Mount TMA `<https://github.com/lsst-ts/LOVE-frontend/pull/399>`_
* Extend logs formatting to the rest of components `<https://github.com/lsst-ts/LOVE-frontend/pull/397>`_
* LOVE EFD Status in Dropdown menu Navbar `<https://github.com/lsst-ts/LOVE-frontend/pull/396>`_
* Fix M2 force bar significant digits `<https://github.com/lsst-ts/LOVE-frontend/pull/395>`_
* Update react-styleguidist dependency `<https://github.com/lsst-ts/LOVE-frontend/pull/394>`_
* Update documentation dependencies `<https://github.com/lsst-ts/LOVE-frontend/pull/393>`_
* Refactor Authorize CSC connection `<https://github.com/lsst-ts/LOVE-frontend/pull/392>`_
* More Authlist adjustments `<https://github.com/lsst-ts/LOVE-frontend/pull/390>`_
* Adjust sound alarms handling `<https://github.com/lsst-ts/LOVE-frontend/pull/389>`_

v5.10.0
-------

* Authlist adjustments `<https://github.com/lsst-ts/LOVE-frontend/pull/388>`_
* Bump moment from 2.29.3 to 2.29.4 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/387>`_
* Bump terser from 5.13.1 to 5.14.2 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/386>`_
* tickets/SITCOM-432 `<https://github.com/lsst-ts/LOVE-frontend/pull/385>`_
* Fix some issues with MTM1M3 `<https://github.com/lsst-ts/LOVE-frontend/pull/383>`_
* Change ATMCS m3PortSelected mapping `<https://github.com/lsst-ts/LOVE-frontend/pull/382>`_

v5.9.0
------

* tickets/SITCOM-431 `<https://github.com/lsst-ts/LOVE-frontend/pull/381>`_
* Extend mount azimuth plot accessor `<https://github.com/lsst-ts/LOVE-frontend/pull/380>`_
* Extend TimeSeriesPlot EFD Querying to support Influxdb arrays queries `<https://github.com/lsst-ts/LOVE-frontend/pull/379>`_
* Add ATAOS corrections information to MountSummaryPanel `<https://github.com/lsst-ts/LOVE-frontend/pull/378>`_
* Add ConfigFile selection storage `<https://github.com/lsst-ts/LOVE-frontend/pull/377>`_
* Bump eventsource from 1.1.0 to 1.1.1 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/376>`_
* M2 Implementation `<https://github.com/lsst-ts/LOVE-frontend/pull/353>`_
* TMA Implementation `<https://github.com/lsst-ts/LOVE-frontend/pull/352>`_
* MTDome implementation `<https://github.com/lsst-ts/LOVE-frontend/pull/347>`_

v5.8.0
------

* Tickets/dm 34844 `<https://github.com/lsst-ts/LOVE-frontend/pull/375>`_
* default position now showing correctly plus ATAOS default values changed `<https://github.com/lsst-ts/LOVE-frontend/pull/374>`_
* Remove priority SAL field `<https://github.com/lsst-ts/LOVE-frontend/pull/372>`_
* Update configuration file settings documentation `<https://github.com/lsst-ts/LOVE-frontend/pull/370>`_
* Resolve LOVE-frontend security alerts `<https://github.com/lsst-ts/LOVE-frontend/pull/369>`_
* Bump async from 2.6.3 to 2.6.4 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/368>`_
* Bump cross-fetch from 3.0.6 to 3.1.5 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/367>`_
* Adjust details on VegaTimeSeriesPlot component `<https://github.com/lsst-ts/LOVE-frontend/pull/373>`_
* MTHexapod: Fix decimals on tables values `<https://github.com/lsst-ts/LOVE-frontend/pull/371>`_

v5.7.0
------

* AT Summary table update `<https://github.com/lsst-ts/LOVE-frontend/pull/366>`_
* Fixes on EFDQuery component `<https://github.com/lsst-ts/LOVE-frontend/pull/365>`_
* Extend Time displays to include information about survey duration and day `<https://github.com/lsst-ts/LOVE-frontend/pull/364>`_
* Fix missing parameter to be read when getting alarm configurations `<https://github.com/lsst-ts/LOVE-frontend/pull/363>`_
* Refactor Limits component `<https://github.com/lsst-ts/LOVE-frontend/pull/361>`_
* Add EFD Querying to EventLog component `<https://github.com/lsst-ts/LOVE-frontend/pull/357>`_
* MTHexapod Implementation `<https://github.com/lsst-ts/LOVE-frontend/pull/336>`_


v5.6.2
------

* Bump moment from 2.29.1 to 2.29.2 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/362>`_


v5.6.1
------

* Avoid horizontal scrolling on LogMessageDisplay component `<https://github.com/lsst-ts/LOVE-frontend/pull/360>`_
* Fix parameter name on ATCamera component `<https://github.com/lsst-ts/LOVE-frontend/pull/359>`_

v5.6.0
------

* Tickets/dm 34255 `<https://github.com/lsst-ts/LOVE-frontend/pull/358>`_

v5.5.1
------

* Bump minimist from 1.2.5 to 1.2.6 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/356>`_
* Bump url-parse from 1.5.7 to 1.5.10 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/355>`_
* Bump prismjs from 1.25.0 to 1.27.0 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/354>`_

v5.5.0
------

* Refactor docker files path `<https://github.com/lsst-ts/LOVE-frontend/pull/351>`_
* Bump url-parse from 1.5.3 to 1.5.7 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/350>`_
* Hotfix/update jenkins file `<https://github.com/lsst-ts/LOVE-frontend/pull/349>`_
* Bumps follow-redirects from 1.14.7 to 1.14.8 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/348>`_
* M1M3 implementation `<https://github.com/lsst-ts/LOVE-frontend/pull/316>`_

v5.3.0
------

* Add formatting to log messages display `<https://github.com/lsst-ts/LOVE-frontend/pull/346>`_
* Bump nanoid from 3.1.16 to 3.2.0 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/345>`_
* Bump color-string from 1.5.4 to 1.9.0 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/344>`_
* Bump follow-redirects from 1.13.0 to 1.14.7 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/343>`_
* Improved responsiveness on Weather Station `<https://github.com/lsst-ts/LOVE-frontend/pull/342>`_
* CCW responsiveness `<https://github.com/lsst-ts/LOVE-frontend/pull/341>`_
* ATCamera display is showing strange output `<https://github.com/lsst-ts/LOVE-frontend/pull/339>`_
* Add documentation about Configuration Files `<https://github.com/lsst-ts/LOVE-frontend/pull/338>`_
* Fixed the Heartbeats take too much time to arrive `<https://github.com/lsst-ts/LOVE-frontend/pull/337>`_
* Fix heartbeat behavior on CSCDetail `<https://github.com/lsst-ts/LOVE-frontend/pull/335>`_
* Extend VegaTimeSeriesPlot to configure EFD instance to query `<https://github.com/lsst-ts/LOVE-frontend/pull/334>`_
* Add warning message indicator in CSC summary state view `<https://github.com/lsst-ts/LOVE-frontend/pull/333>`_
* Dealing with too much logMessages in CSC detailed view `<https://github.com/lsst-ts/LOVE-frontend/pull/332>`_

v5.3.0
------

* Allow user to configure components in the EventLog view `<https://github.com/lsst-ts/LOVE-frontend/pull/331>`_
* Removed mockup alarm data `<https://github.com/lsst-ts/LOVE-frontend/pull/330>`_
* LOVE screenshot function lacks functionality `<https://github.com/lsst-ts/LOVE-frontend/pull/329>`_
* Improving AT LightPath cartoon `<https://github.com/lsst-ts/LOVE-frontend/pull/328>`_
* AT Dome and Mount screen shows telescope oscillating `<https://github.com/lsst-ts/LOVE-frontend/pull/327>`_
* Improvements on UI Framework ViewEditor about saving interactions `<https://github.com/lsst-ts/LOVE-frontend/pull/326>`_
* Authlist implementation `<https://github.com/lsst-ts/LOVE-frontend/pull/325>`_
* UX Improvements `<https://github.com/lsst-ts/LOVE-frontend/pull/324>`_
* Top bar is being incorrectly displayed when show of notifications `<https://github.com/lsst-ts/LOVE-frontend/pull/323>`_
* Hotfix for CSCGroup component `<https://github.com/lsst-ts/LOVE-frontend/pull/322>`_
* Bump url-parse from 1.5.1 to 1.5.3 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/320>`_
* Bump tmpl from 1.0.4 to 1.0.5 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/319>`_
* Bump prismjs from 1.24.0 to 1.25.0 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/318>`_
* Bump tar from 6.1.4 to 6.1.11 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/317>`_
* M1M3 implementation `<https://github.com/lsst-ts/LOVE-frontend/pull/316>`_

v5.2.0
------

* Bump path-parse from 1.0.6 to 1.0.7 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/315>`_
* CCW implementation `<https://github.com/lsst-ts/LOVE-frontend/pull/314>`_
* Bump tar from 6.0.5 to 6.1.4 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/313>`_

v5.1.0
------

* Add Vega-lite custom plots implementation `<https://github.com/lsst-ts/LOVE-frontend/pull/312>`_
* Update LATISS state selectors `<https://github.com/lsst-ts/LOVE-frontend/pull/311>`_
* Bump prismjs from 1.23.0 to 1.24.0 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/310>`_
* Remove deprecated Plot components `<https://github.com/lsst-ts/LOVE-frontend/pull/309>`_
* Bump merge-deep from 3.0.2 to 3.0.3 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/308>`_
* Bump ws from 6.2.1 to 6.2.2 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/307>`_
* Bump dns-packet from 1.3.1 to 1.3.4 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/306>`_

v5.0.2
------

* Hotfix Scriptqueue `<https://github.com/lsst-ts/LOVE-frontend/pull/305>`_
* Hotfix atcs `<https://github.com/lsst-ts/LOVE-frontend/pull/304>`_
* Bump hosted-git-info from 2.8.8 to 2.8.9 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/303>`_
* Bump lodash from 4.17.20 to 4.17.21 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/302>`_
* Bump url-parse from 1.4.7 to 1.5.1 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/301>`_
* Release/5.0.0 `<https://github.com/lsst-ts/LOVE-frontend/pull/300>`_

v5.0.0
------

* TCS API `<https://github.com/lsst-ts/LOVE-frontend/pull/299>`_
* Make heartbeats compliant with the new LOVE-producer `<https://github.com/lsst-ts/LOVE-frontend/pull/298>`_
* Update ScriptQueue layout to new version `<https://github.com/lsst-ts/LOVE-frontend/pull/297>`_
* Bump ssri from 6.0.1 to 6.0.2 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/296>`_
* Release/4.0.0 `<https://github.com/lsst-ts/LOVE-frontend/pull/295>`_
* Bump y18n from 4.0.0 to 4.0.1 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/294>`_
* Update default CSCSummaryHierarchy `<https://github.com/lsst-ts/LOVE-frontend/pull/293>`_

v4.0.0
------

* Bump react-dev-utils from 10.2.1 to 11.0.4 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/291>`_
* Add unsubscription method on componentWillUnmount `<https://github.com/lsst-ts/LOVE-frontend/pull/290>`_
* Update icons `<https://github.com/lsst-ts/LOVE-frontend/pull/289>`_
* Bump elliptic from 6.5.3 to 6.5.4 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/288>`_
* tickets/LOVE-30 `<https://github.com/lsst-ts/LOVE-frontend/pull/287>`_
* Bump prismjs from 1.22.0 to 1.23.0 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/286>`_
* M1M3 and Cable Wraps prototypes `<https://github.com/lsst-ts/LOVE-frontend/pull/285>`_
* Add environmental variable to avoid styleguide crash `<https://github.com/lsst-ts/LOVE-frontend/pull/283>`_
* Add linter to pipeline `<https://github.com/lsst-ts/LOVE-frontend/pull/282>`_
* Include pre-commit config file `<https://github.com/lsst-ts/LOVE-frontend/pull/281>`_
* Efd api `<https://github.com/lsst-ts/LOVE-frontend/pull/280>`_
* Eslint fixes `<https://github.com/lsst-ts/LOVE-frontend/pull/279>`_
* Add time series controls to PolarPlot `<https://github.com/lsst-ts/LOVE-frontend/pull/278>`_
* Time series controls fix `<https://github.com/lsst-ts/LOVE-frontend/pull/277>`_
* Thumbnail update performance fix `<https://github.com/lsst-ts/LOVE-frontend/pull/275>`_
* Script logs `<https://github.com/lsst-ts/LOVE-frontend/pull/274>`_
* Sonarqube fixes `<https://github.com/lsst-ts/LOVE-frontend/pull/273>`_
* Emergency contacts `<https://github.com/lsst-ts/LOVE-frontend/pull/272>`_
* Update jenkinsfile to publish documentation `<https://github.com/lsst-ts/LOVE-frontend/pull/271>`_
* Change deprecated variable name Environment by WeatherStation `<https://github.com/lsst-ts/LOVE-frontend/pull/270>`_
* Add trend display vega timeseries plot `<https://github.com/lsst-ts/LOVE-frontend/pull/269>`_
* ConfigFile api `<https://github.com/lsst-ts/LOVE-frontend/pull/268>`_
* Bump vega from 5.17.0 to 5.17.3 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/267>`_
* Bump node-notifier from 8.0.0 to 8.0.1 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/266>`_
* Flush elapsed time after script is finished `<https://github.com/lsst-ts/LOVE-frontend/pull/265>`_
* Add Inactive alarms column `<https://github.com/lsst-ts/LOVE-frontend/pull/264>`_
* Minor scripqueue adjustments `<https://github.com/lsst-ts/LOVE-frontend/pull/263>`_
* Bump ini from 1.3.5 to 1.3.7 in /love `<https://github.com/lsst-ts/LOVE-frontend/pull/262>`_
* Add scriptqueue detail modal `<https://github.com/lsst-ts/LOVE-frontend/pull/261>`_
* Lovecsc observinglogs http refactor `<https://github.com/lsst-ts/LOVE-frontend/pull/260>`_
* Websocket simulator `<https://github.com/lsst-ts/LOVE-frontend/pull/259>`_
* Performance optimization `<https://github.com/lsst-ts/LOVE-frontend/pull/258>`_
* Update vega plots `<https://github.com/lsst-ts/LOVE-frontend/pull/257>`_
* Manager interface refactor `<https://github.com/lsst-ts/LOVE-frontend/pull/256>`_
* Refactor Current Script card `<https://github.com/lsst-ts/LOVE-frontend/pull/255>`_
* Scriptqueue summary state controls `<https://github.com/lsst-ts/LOVE-frontend/pull/254>`_
* Log level fix `<https://github.com/lsst-ts/LOVE-frontend/pull/253>`_
* Layout tweaks `<https://github.com/lsst-ts/LOVE-frontend/pull/252>`_
* Feature/upgrade packages `<https://github.com/lsst-ts/LOVE-frontend/pull/251>`_
