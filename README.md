# expense WIP

> Basic Expense Tracker to analyse yearly/monthly/daily transactions.
>
> Completely cloudless, cookieless and trackingless. All data is stored in LocalStorage.
>
> Build with Vue, Webpack, Bootstrap(Vue) and JUI Charts

Hosted here: [expense.syma.dev](https://expense.syma.dev).

![Input fields][input]

![Generated charts][charts]

## Roadmap
- [x] Data handling
  - [x] Save/Read from LocalStorage
  - [x] Import/Export in UI
- [ ] Input
  - [x] Name and Frequency
  - [x] Tagging
  - [ ] Effective date (of month)
- [ ] Analysis
  - [x] Calculate average per day/month/year
  - [ ] Charts
    - [x] Basic Pie of every entry
    - [x] Basic Pie of every tag
    - [ ] Line
- [ ] General
  - [ ] Branding
    - [ ] Logo
    - [ ] Name
    - [ ] Domain
  - [ ] Rethink UI
  - [ ] Consider more analysis
  - [ ] Refactor, clean codebase and upgrade
  - [ ] Localize

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run all tests
npm test
```

Based on [vuejs-templates/webpack](https://github.com/vuejs-templates/webpack) old template.

[input]: https://expense.syma.dev/static/input.png "Input fields"
[charts]: https://expense.syma.dev/static/charts.png "Generated charts"
