# Contributing

When contributing to this repository, please consider the following aspects

## Adding a new Container component

Container components implement the communication with Redux to obtain the available telemetry/event data. Container components:
1. Should be named `component.container.jsx`
2. Should include and export a `schema` variable with the UIF configuration
3. Should provide a `subscriptions` prop with the telemetry/event subscription list, to be displayed in the telemetry/event raw data 

## Editing the documentation

The documentation is done with `styleguide`. Its source code is located under `love/docsrc` and compiled to `docs/` according to the configuration file located at `love/styleguide.config.js`.

1. To edit the docs in a local server run 

```
docker-compose exec frontend 
# inside frontend container
yarn guide:start
```
and go to the pointed address.

2. To create a production build in the `docs/` folder run

```
docker-compose exec frontend
# inside frontend container
yarn guide:build
```

3. Some useful guides to edit the configuration:

* General configuration
    * [Create a new section](https://react-styleguidist.js.org/docs/components.html#sections):
    * [Show 1 page per section or 1 page with all sections](https://react-styleguidist.js.org/docs/configuration#pagepersection)
    * [Changing the build dir](https://react-styleguidist.js.org/docs/configuration#styleguidedir)

* Documenting the source code
  * [Adding `.md` files for examples, using `jsDocs` for descriptions, `proptypes` and `defaultprops`.](https://react-styleguidist.js.org/docs/documenting.html)
  * [Documenting with redux](https://react-styleguidist.js.org/docs/thirdparties.html#redux)
  * [Adding static assets](https://react-styleguidist.js.org/docs/configuration#assetsdir)


