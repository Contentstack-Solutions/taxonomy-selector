# Taxonomy Selector Marketplace App 

> **Note:** This app is not offically provided by Contentstack.

Taxonomy Selector is a marketplace app where the CustomField component creates an interactive taxonomy selector interface that allows users to:
- Browse through hierarchical taxonomies in an expandable accordion layout
- Select/deselect terms within each taxonomy using checkboxes
- See their selected terms displayed as tags at the top of each taxonomy section
- Navigate nested terms easily with an intuitive indented structure

The component automatically loads taxonomy data, maintains the state of selected terms, and syncs selections with Contentstack's CustomField data. It's particularly useful for editors who need to organize and categorize their content using taxonomies .


## Provider

`<MarketplaceAppProvider>`

This provider is responsible for the following actions

- Initialize the contentstack SDK
- Make the SDK instance available via hooks to avoid props drilling
- Set global properties for Analytics and Error tracking
- Send "App Initialized / Failed" event

## Available Hooks

- useAppConfig
- useAppLocation
- useAppSdk
- useCustomField
- useEntry
- useFrame
- useHostUrl
- useInstallationData
- useSdkDataByPath

## Routes

Each route represents one location. It is recommended to lazy load the route components to reduce the bundle
size.

#### Adding new route

- Create a new Route component inside route. Use default export
  - Inside `App.tsx`, lazy load the route component.
    - eg: `const CustomFieldExtension = React.lazy(() => import("./routes/CustomField"))`
  - Add the route wrapped inside `Suspense`.
    - Eg: ` <Route path="/new" element={<Suspense><CustomFieldExtension /></Suspense>} />`

## Testing

- All e2e test files are stored in e2e folder
- Create a `.env` file in the root directory & add environment variables as shown in `.env.sample` file.
- Please refer the below commands to run e2e tests locally and setup the perquisites before running them.
- `Note`: To run the below commands make sure the app is running in the background i.e on port `http://localhost:3000`

  ```
    "test:chrome": "npx playwright test --config=playwright.config.ts --project=Chromium",
    "test:firefox": "npx playwright test --config=playwright.config.ts --project=firefox",
    "test:chrome-headed": "npx playwright test --headed --config=playwright.config.ts --project=Chromium",
    "test:firefox-headed": "npx playwright test --headed --config=playwright.config.ts --project=firefox"
  ```

- Unit & integration tests are stored in `src/__tests__` folder
- run `npm run test` to run unit and integration tests

## Styling

- This setup uses basic CSS for styling

## Reference to documentation

- [Marketplace App Boilerplate](https://www.contentstack.com/docs/developers/developer-hub/marketplace-app-boilerplate/)
