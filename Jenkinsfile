pipeline {
  agent any
  environment {
    registryCredential = "dockerhub-inriachile"
    dockerImageName = "lsstts/love-frontend:"
    dockerImage = ""
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

    stage("Run tests") {
      when {
        branch "test_in_pipeline"
      }
      steps {
        script {
          sh "ls /usr/local/bin"
        }
      }
    }
  }
}
