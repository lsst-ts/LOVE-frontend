properties(
    [
    buildDiscarder(
        logRotator(
            artifactDaysToKeepStr: '',
            artifactNumToKeepStr: '',
            daysToKeepStr: '14',
            numToKeepStr: '10',
        )
    ),
    // Make new builds terminate existing builds
    disableConcurrentBuilds(
        abortPrevious: true,
    )
    ]
)

pipeline {
  agent {
    docker {
      alwaysPull true
      image 'rubincr.lsst.org/develop-env-node:develop'
    }
  }
  environment {
    NODE_VERSION = '24'
  }
  stages {
    stage("Run pre-commit hooks and tests") {
      steps {
        sh '''#!/bin/bash
          set -eo pipefail
          export NVM_DIR=/home/saluser/.nvm
          . "$NVM_DIR/nvm.sh" --no-use
          nvm install "$NODE_VERSION"

          (cd love && npm exec --yes --package=yarn@1.22.22 -- yarn install --frozen-lockfile --non-interactive)
          /home/saluser/.local/bin/pre-commit run --all-files
          cd love
          CI=true npm test -- --testPathPattern='(redux|Utils.test.js)'
        '''
      }
    }

    stage("Deploy documentation") {
      when {
        anyOf {
          branch "main"
          branch "develop"
        }
      }
      steps {
        sh '''#!/bin/bash
          set -eo pipefail
          export NVM_DIR=/home/saluser/.nvm
          . "$NVM_DIR/nvm.sh" --no-use
          nvm use "$NODE_VERSION"

          rm -rf ./docs
          cd love
          npm run guide:build
        '''
        withCredentials([usernamePassword(credentialsId: 'lsst-io', usernameVariable: 'LTD_USERNAME', passwordVariable: 'LTD_PASSWORD')]) {
          sh 'uvx --from ltd-conveyor ltd upload --product love-frontend --git-ref "$GIT_BRANCH" --dir ./docs'
        }
      }
    }
  }
}
