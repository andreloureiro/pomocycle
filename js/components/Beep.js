import {Observable} from 'rx'

const defaultConfig = {
  source: 'square',
  env: {
    attack: 0.01,
    decay: 0.005,
    sustain: 0.2,
    hold: 0.2,
    release: 0.3
  },
  filter: {
    type: 'lowpass',
    frequency: 1200,
    q: 8.5,
    env: {
      attack: 0.2,
      frequency: 600
    }
  }
}

const Beep = props$ => {
  return props$
    .map(prop => {
      const config = Object.assign({}, defaultConfig, prop.config)
      return {
        id: prop.id,
        config
      }
    })
}

export default Beep
