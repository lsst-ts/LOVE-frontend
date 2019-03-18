pipeline {
  agent any
  environment {
    registryCredential = "dockerhub-inriachile"
    dockerImageName = "inriachile/love-frontend:${GIT_BRANCH}"
    dockerImage = ""
  }
  stages {
    stage("Build Docker image") {
      when {
        anyOf {
          branch "master"
          branch "develop"
        }
      }
      steps {
        script {
          dockerImage = docker.build dockerImageName
        }
      }
    }
    stage("Push Docker image") {
      when {
        anyOf {
          branch "master"
          branch "develop"
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
        build '../LOVE-integration-tools/develop'
      }
    }
    stage("Trigger master deployment") {
      when {
        branch "master"
      }
      steps {
        build '../LOVE-integration-tools/master'
      }
    }
  }
}
