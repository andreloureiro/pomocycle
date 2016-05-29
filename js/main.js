import {run} from '@cycle/core';
import {makeDOMDriver} from '@cycle/dom';
import {isolate} from '@cycle/isolate';
import {restart, restartable} from 'cycle-restart';
import App from './root';
import {makeWadDriver} from './drivers/wad-driver';

const drivers = {
  DOM: restartable(makeDOMDriver('#root'), {pauseSinksWhileReplaying: false}),
  Wad: makeWadDriver()
};

const {sinks, sources} = run(App, drivers);

if (module.hot) {
  module.hot.accept('./root', () => {
    const app = require('./root' ).default;
    restart(app, drivers, {sinks, sources}, isolate);
  });
}
