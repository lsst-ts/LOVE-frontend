pipeline {
  agent any
  environment {
    registryCredential = "dockerhub-inriachile"
    dockerImageName = "lsstts/love-frontend:"
    dockerImage = ""
    user_ci = credentials('lsst-io')
    LTD_USERNAME="${user_ci_USR}"
    LTD_PASSWORD="${user_ci_PSW}"
  }
  stages {
    stage("Build Docker image") {
      when {
        anyOf {
          branch "master"
          branch "develop"
          branch "bugfix/*"
          branch "hotfix/*"
          branch "release/*"
        }
      }
      steps {
        script {
          def git_branch = "${GIT_BRANCH}"
          def image_tag = git_branch
          def slashPosition = git_branch.indexOf('/')
          if (slashPosition > 0) {
            git_tag = git_branch.substring(slashPosition + 1, git_branch.length())
            git_branch = git_branch.substring(0, slashPosition)
            if (git_branch == "release" || git_branch == "hotfix" || git_branch == "bugfix") {
              image_tag = git_tag
            }
          }
          dockerImageName = dockerImageName + image_tag
          echo "dockerImageName: ${dockerImageName}"
          dockerImage = docker.build dockerImageName
        }
      }
    }
    stage("Push Docker image") {
      when {
        anyOf {
          branch "master"
          branch "develop"
          branch "bugfix/*"
          branch "hotfix/*"
          branch "release/*"
        }
      }
      steps {
        script {
          docker.withRegistry("", registryCredential) {
            dockerImage.push()
          }
        }
      }
    }

    stage("Run tests") {
      when {
        anyOf {
          branch "develop"
          branch "add-linter-to-pipeline"
        }
      }
      steps {
        script {
          sh "docker image build -f Dockerfile-test -t love-frontend-test  ."
          sh "docker run love-frontend-test"
        }
      }
    }

    stage("Deploy documentation") {
      agent {
        docker {
          alwaysPull true
          image 'lsstts/develop-env:develop'
          args "-u root --entrypoint=''"
        }
      }
      when {
        anyOf {
          changeset "docs/*"
        }
      }
      steps {
        script {
          sh "pwd"
          sh """
            source /home/saluser/.setup_dev.sh
            pip install ltd-conveyor
            ltd upload --product love-frontend --git-ref ${GIT_BRANCH} --dir ./docs
          """
        }
      }
    }

    stage("Trigger develop deployment") {
      when {
        branch "develop"
      }
      steps {
        build(job: '../LOVE-integration-tools/develop', wait: false)
      }
    }
    stage("Trigger master deployment") {
      when {
        branch "master"
      }
      steps {
        build(job: '../LOVE-integration-tools/master', wait: false)
      }
    }


  }
}
