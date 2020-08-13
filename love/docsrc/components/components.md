The `LOVE-frontend` is built using React Components.  These components are split in three categories:

- [Observatory](/#/Components/Obervatory) components are common interfaces that allow to monitor and command specific systems of the entire observatory.
- [Auxiliary Telescope](/#/Components/Auxiliary%20Telescope) components are interfaces specialized for displaying Auxiliary Telescope-related information.
- [General Purpose](/#/Components/General%20Purpose) components are basic building blocks, such as buttons, labels or charts, that can be used to build any kind of user interfaces, independently of their purpose.

As explained [here](/#/How%20it%20works/Global%20state%20management%20with%20Redux), there are Container components, i.e., components that read information from the global state, such as CSC events and telemetries, or telemetries, and also Presentational components, i.e., components that manage their own piece of state, exposing an API (React `props`) that can be used by Container components.

In the next sections you can distinguish Container components from Presentational components by looking at the `Container` suffix. For example, the `Camera` Presentational component has its respective Container component called `CameraContainer`. Otherwise you can safely assume they are `Presentational` components.