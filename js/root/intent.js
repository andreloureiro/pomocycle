export const intent = sources => ({
  pomodoroClick$: sources
    .DOM
    .select('#startPomodoro')
    .events('click'),
  shortBreakClick$: sources
    .DOM
    .select('#startShortBreak')
    .events('click'),
  longBreakClick$: sources
    .DOM
    .select('#startLongBreak')
    .events('click'),
  stopClick$: sources
    .DOM
    .select('#stopPomodoro')
    .events('click')
})
