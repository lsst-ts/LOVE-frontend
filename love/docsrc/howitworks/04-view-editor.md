### ViewEditor responsive layout simulator

The `ViewEditor` located at `love/src/components/UIF/ViewEditor/ViewEditor.jsx` enables a user to edit the size and position of a `View`. On top of these features, in order to support the user to be aware of how other users will see its currently created view on different devices, a responsive layout simulator was implemented. This simulator enables the user to select a device size (such as `Laptop`, `4K`, `Mobile S`, among others) and see how the components are re-organized accordingly on screen.

The behavior of this responsive layout with respect to other features is described with the following finite state machine. Such features as editing components (resizing and moving them), undoing changes and changing the selected device size are included as events and some but not all of the states involve particular side-effects. This state machine is represented by the `ViewEditor.state.responsiveLayoutState` variable and many are described in terms of the number of columns in the layout. The number of columns by device is defined [here](https://github.com/lsst-ts/LOVE-frontend/blob/47626fc8ac5ef5d71e7e49a32991d59fdd3746a5/love/src/components/UIF/CustomView.jsx#L25-L34).

The most important issue that motivates the complexity of this representation is that smaller devices may handle the content with a smaller number of columns, and thus, changes to the layout may be irreversible if the user is not properly aware. In summary, moving to a smaller device will reorganize content on the configured columns, possibly moving some of then to different rows; moving to a bigger device will attempt to re-scale the content to fit the same pixel-area in the new layout.

![State machine of the responsive layout simulator](./responsive-grid-state-machine.svg 'State machine of the responsive layout simulator')

- `COLS_NOT_CHANGED`

  - Initial state. All kinds of editions are allowed normally.
  - Any change to a smaller device will move it to the `COLS_DECREASED` state.
  - Any change to a BIGGER device will move it to the `COLS_INCREASED` state.
  - Any edition will keep the state unchaged.

- `COLS_DECREASED`

  - Represents a state where the user just moved to a smaller device with a smaller number of columns.
  - Any change to a smaller device will keep it in the `COLS_DECREASED` state.
  - Any change to a BIGGER device will move it to the `COLS_INCREASED` state.
  - Any edition will move it to the `EDIT_NEEDS_CONFIRMATION` and will immediately apply changes, saving them in the `uif` `undo/redo` history to be used later.

- `EDIT_NEEDS_CONFIRMATION`

  - This state prompts a confirmation dialog (modal) to ensure the user is aware of the consequences of the current changes.
  - If the user confirms the changes then it goes back to the `COLS_NOT_CHANGED` state.
  - If the user cancels the changes then it moves to the `EDIT_CANCELED` and triggers an `undo` action of the `uif` redux branch, undoing the changes.
  - Since it is displayed in a Modal changing device size and editing is disabled.

- `EDIT_CANCELED`

  - This is state disables the `redo` button of the UIF toolbar to prevent applying canceled changes that may generate inconsistencies.
  - Changing to a smaller device keeps it in the current state.
  - Changing to a bigger device moves the state to `COLS_INCREASED`.
  - Undoing moves the state to `UNDO_NEEDS_CONFIRMATION`.
  - Editing the view changes the state to `EDIT_NEEDS_CONFIRMATION`.

- `UNDO_NEEDS_CONFIRMATION`

  - Similar to `EDIT_NEEDS_CONFIRMATION`, this state prompts a confirmation dialog modal to prevent unwanted changes from clicking the `undo` button.
  - If the user confirms the changes then the `undo` action is triggered and sends the state back to the `COLS_NOT_CHANGED` state.
  - If the user cancels the changes then it moves to the `EDIT_CANCELED` and triggers an `undo` action of the `uif` redux branch, undoing the changes.

- `COLS_INCREASED`
  - Represents the state when the content is rendered in a bigger device than the one used on the last edition.
  - Components rendered on this state will be rescaled in width and horizontal position if two conditions are met: 1) the number of columns of the original device is smaller than a given threshold; 2) the number of the current device is greater than a given threshold. This threshold is defined [here](https://github.com/lsst-ts/LOVE-frontend/blob/47626fc8ac5ef5d71e7e49a32991d59fdd3746a5/love/src/components/UIF/CustomView.jsx#L36) and this behavior handled in the same `CustomView`.
  - This behavior is also dependant on the `container` to have the proper number of `.cols`.
  - Editing moves the state to `COLS_NOT_CHANGED`.
