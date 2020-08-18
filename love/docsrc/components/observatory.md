Observatory components are common interfaces that allow to monitor and command specific systems of the entire observatory.

You can distinguish Container components from Presentational components by looking at the `Container` suffix. For example, the `Camera` Presentational component has its respective Container component called `CameraContainer`. Otherwise you can safely assume they are `Presentational` components.

See an explanation of what Presentational and Container components are [here](/#/How%20it%20works/Global%20state%20management%20with%20Redux)