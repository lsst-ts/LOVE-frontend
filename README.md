# LOVE-frontend instructions

This repository contains the code of the LOVE-frontend application, that provides the user interface of the LOVE project.

See the documentation here: https://lsst-ts.github.io/LOVE-frontend

## 1. Use as part of the LOVE system
In order to use the LOVE-frontend as part of the LOVE system we recommend to use the docker-compose and configuration files provided in the [LOVE-integration-tools](https://github.com/lsst-ts/LOVE-integration-tools) repo. Please follow the instructions there.

## 2. Local load for development
We provide docker images and a docker-compose file in order to load the LOVE-frontend locally for development purposes, i.e. run tests and build documentation.

This docker-compose does not copy the code into the image, but instead it mounts the repository inside the image, this way you can edit the code from outside the docker container with no need to rebuild or restart.

### 2.1 Load and get into the docker image
Follow these instructions to run the application in a docker container and get into it:

1. Launch and get into the container:
```
cd docker/
docker-compose up -d --build
docker-compose exec frontend sh
```

### 2.2 Run tests
Once inside the container you can run the tests as follows:
```
yarn test
```

### 2.3 Build documentation
Once inside the container you can build the documentation as follows:
```
yarn guide:build
```
**INFO:** if you experience problems with the previous command try deleting the `docs/` folder and then executing the command again.

If rather than build you want to launch a development server for the documentation, you can do so as follows:
```
yarn guide:start
```
**INFO:** 

### Linting & Formatting
In order to maintaing code linting and formatting we use `pre-commit` that runs **ESLint** (https://eslint.org/) and **Prettier** (https://prettier.io/) using Git Hooks. To enable this you have to:

1. Install `pre-commit` in your local development environment:
```
pip install pre-commit
```

2. Set up the git hook scripts running:
```
pre-commit install
```

3. Start developing! Linter and Formatter will be executed on every commit you make.

