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
  agent{
    docker {
      alwaysPull true
      image 'lsstts/develop-env:develop'
      args "--entrypoint=''"
    }
  }
  environment {
    dockerImage = ""
    // LTD credentials
    user_ci = credentials('lsst-io')
    LTD_USERNAME="${user_ci_USR}"
    LTD_PASSWORD="${user_ci_PSW}"
  }
  stages {
    stage("Run pre-commit hooks and tests") {
      steps {
        script {
          sh """
            source /home/saluser/.setup_dev.sh

            cd ./love
            
            yarn install
            pre-commit run --all-files
            
            CI=true yarn test --testPathPattern="(redux|Utils.test.js)"
          """
        }
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
        script {
          sh """
            source /home/saluser/.setup_dev.sh

            # Remove old docs folder
            rm -rf ./docs

            # Install dependencies
            cd ./love

            npm install

            # Create docs
            npx styleguidist build

            cd ..

            # Upload docs
            pip install ltd-conveyor
            ltd upload --product love-frontend --git-ref ${GIT_BRANCH} --dir ./docs
          """
        }
      }
    }
  }
}
