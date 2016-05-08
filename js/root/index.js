import {Observable} from 'rx'
import {intent} from './intent'
import {model} from './model'
import {view} from './view'
import Beep from '../components/Beep'

const App = sources => {
  const actions = intent(sources)
  const state$ = model(actions, sources.Wad)
  const vtree$ = view(state$)
  const beep$ = Beep(Observable.of({id: 'beep'}))
  return {
    DOM: vtree$,
    Wad: beep$
  }
}

export default App;
