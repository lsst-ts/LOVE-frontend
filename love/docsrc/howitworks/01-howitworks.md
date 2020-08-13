The LOVE-frontend interacts with the rest of the LOVE system through the [LOVE-manager](https://lsst-ts.github.io/LOVE-manager/html/index.html). The LOVE-frontend is a client-side web-application, that is, it is built as static content (javascript, html and css) that is interpreted and executed in the client's web browser. The LOVE-manager instead is a server-side application.

![frontend details](./Frontend_overview.svg "Overview")

When a user navigates to the LOVE-frontend for the first time, the only available view is the Login. After the user inserts its credentials (username and password), the LOVE-frontend sends the credentials to the LOVE-manager through an HTTP request. The LOVE-manager responds to the request with an access token (if the credentials are valid) or with an error if not.

After the user logs in successfully, the LOVE-frontend validates the token in each new navigation, sending it to the LOVE-manager and waiting for a confirmation before allowing navigation. This way, if the token is expired, the response will state so and the LOVE-frontend will logout the user automatically. After logging-in the LOVE-frontend also establishes a websocket connection with the LOVE-manager

Once the LOVE-frontend renders a component that requires data from a CSC, it sends a subscription message to the LOVE-manager stating to which data (telemetries, events, etc) it needs to subscribe to. The LOVE-manager then sends that information to the LOVE-frontend through the same websockets connection. The schema of these messages is specified [here](https://lsst-ts.github.io/LOVE-manager/html/modules/how_to_use_it.html).

The LOVE-frontend has visual cues to distinguish buttons that will imply a change in the state of any of the observatory components. If the user has enough permissions, these actions are then passed to the LOVE-manager and forwarded to the corresponding `CSC` using the `LOVE-commander`.

Using the `View Editor` of the `UI Framework` users can also mix components and create new views whose configuration is saved in a database managed by the `LOVE-manager`.  This information, together with commands and data coming from CSCs and authentication data, is managed and stored locally in the web browser using Redux, whose details are explained in the next section.


