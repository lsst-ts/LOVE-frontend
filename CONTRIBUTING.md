# Contributing

When contributing to this repository, please consider the following aspects

## Making a release (creating a tag)

In order to make a release of the frontend, you need to create a tag in the repository. The tag should be named `vX.Y.Z` where `X.Y.Z` is the version number. The version number should follow [semantic versioning](https://semver.org/). The tag should be created from the `master` branch.

Before creating the tag, make sure to:
- Create a PR that updates the `love/package.json` file with the new version number `X.Y.Z`.
- Check the `CHANGELOG.md` file is updated with the changes that are going to be released.

Once the PR is merged, create the tag with the following command:

```
git checkout develop
git pull
git checkout main
git pull
git merge --no-ff develop
git tag -a vX.Y.Z -m "Release vX.Y.Z"
git push origin vX.Y.Z
```

## Adding a new Container component

Container components implement the communication with Redux to obtain the available telemetry/event data. Container components:
1. Should be named `component.container.jsx`
2. Should include and export a `schema` variable with the UIF configuration
3. Should provide a `subscriptions` prop with the telemetry/event subscription list, to be displayed in the telemetry/event raw data. Also, the `component.container.jsx` render method must include:

```
if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
}
```

## Licensing files

All files in the repository should include a license header. The license header should be the first comment in the file and should look like this:

```
/** 
This file is part of LOVE-frontend.

Developed for the Vera C. Rubin Observatory Telescope and Site Systems.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/
```

You will see several files that have a slightly different license header. This is because files solely developed by the Inria Chile contract are licensed like:

```
/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/
```

If the file has been developed by Inria Chile, but has been updated by contributors on the Telescope and Site Software team, the license header should look like this:

```
/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile and the Telescope and Site Software team.

Developed for the Vera C. Rubin Observatory Telescope and Site Systems.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/
```


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


