import {Observable} from 'rx'

export const pomodoroTime = 1500000
export const shortBreakTime = 300000
export const longBreakTime = 900000
const startBeep = sound => {
  sound.play({ pitch : 'Db5'})
}
const finishBeep = (sound, delay) => {
  sound.play({ pitch : 'Db5', wait: delay })
  sound.play({ pitch : 'A4', wait: (delay + 0.2) })
}

export const model = (actions, beep) => {
  const initialState = {
    actual: 'inactive',
    time: 0,
    breakTotal: 0,
    pomodoroTotal: 0,
    totalTime: 0
  }
  const beep$ = beep.get$('beep')
  const pomodoroStatus$ = actions
    .pomodoroClick$
    .map(() => state =>
      Object.assign({}, state, {actual: 'pomodoro', time: pomodoroTime}))
  const shortBreakStatus$ = actions
    .shortBreakClick$
    .map(() => state =>
      Object.assign({}, state, {
        actual: 'shortBreak',
        time: shortBreakTime
      }))
  const longBreakStatus$ = actions
    .longBreakClick$
    .map(() => state =>
      Object.assign({}, state, {
        actual: 'longBreak',
        time: longBreakTime
      }))
  const incPomodoro$ = actions
    .pomodoroClick$
    .map(() => state =>
      Object.assign({}, state, {
        pomodoroTotal: (state.pomodoroTotal + 1)
      }))
  const incBreak$ = Observable
    .merge(
      actions.shortBreakClick$,
      actions.longBreakClick$
    )
    .map(() => state =>
      Object.assign({}, state, {breakTotal: (state.breakTotal + 1)}))
  const makeTimer$ = type => Observable
    .timer(0, 1000)
    .map(i => type - (i * 1000))
    .takeUntil(
      Observable.merge(
        actions.stopClick$,
        Observable.timer(type + 1)
      ))
  const pomodoroTimer$ = makeTimer$(pomodoroTime)
  const shortBreakTimer$ = makeTimer$(shortBreakTime)
  const longBreakTimer$ = makeTimer$(longBreakTime)
  const startPomodoro$ = actions
    .pomodoroClick$
    .combineLatest(beep$, (_, {sound}) => {startBeep(sound)})
    .switchMap(pomodoroTimer$)
    .repeat()
    .combineLatest(beep$,
      (time, {sound}) => state => {
      if (time > 0) {
        return Object.assign({}, state, {time, totalTime: pomodoroTime})
      } else if (time == 0) {
        finishBeep(sound, 1)
        return Object.assign({}, state, {time, actual: 'inactive'})
      } else {
        return state
      }
    })
  const startShortBreak$ = actions
    .shortBreakClick$
    .combineLatest(beep$, (_, {sound}) => {startBeep(sound)})
    .switchMap(shortBreakTimer$)
    .repeat()
    .combineLatest(beep$,
      (time, {sound}) => state => {
      if (time > 0) {
        return Object.assign({}, state, {time, totalTime: shortBreakTime})
      } else if (time == 0) {
        finishBeep(sound, 1)
        return Object.assign({}, state, {time, actual: 'inactive'})
      } else {
        return state
      }
    })
  const startLongBreak$ = actions
    .longBreakClick$
    .combineLatest(beep$, (_, {sound}) => {startBeep(sound)})
    .switchMap(longBreakTimer$)
    .repeat()
    .combineLatest(beep$,
      (time, {sound}) => state => {
      if (time > 0) {
        return Object.assign({}, state, {time, totalTime: longBreakTime})
      } else if (time == 0) {
        finishBeep(sound, 1)
        return Object.assign({}, state, {
          actual: 'inactive',
          pomodoroTotal: 0,
          breakTotal: 0,
          time
        })
      } else {
        return state
      }
    })
  const stopPomodoro$ = actions
    .stopClick$
    .combineLatest(beep$, (_, {sound}) => {finishBeep(sound, 0)})
    .map(() => state => {
      if (state.actual == 'longBreak') {
        return Object.assign({}, state, {
          pomodoroTotal: 0,
          breakTotal: 0,
          actual: 'inactive'
        })
      } else {
        return Object.assign({}, state, {actual: 'inactive'})
      }
    })
  const mods$ = Observable
    .merge(
      incPomodoro$,
      incBreak$,
      pomodoroStatus$,
      shortBreakStatus$,
      longBreakStatus$,
      stopPomodoro$,
      startPomodoro$,
      startShortBreak$,
      startLongBreak$
    )
  return Observable
    .just(initialState)
    .merge(mods$)
    .scan((state, action) => action(state))
    .share()
}
