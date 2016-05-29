import {Observable} from 'rx'
import {div, h1, svg} from '@cycle/dom'
import {pomodoroTime, shortBreakTime, longBreakTime} from '../root/model'

const toMMSS = ms => {
  let minutes = Math.floor((ms / 1000) / 60)
  let seconds = (ms / 1000) % 60
  let formatUnit = n => String(n).length == 1 ? `0${n}` : n
  return `${formatUnit(minutes)}:${formatUnit(seconds)}`
}

const Timer = props$ => {
  const circleSize = () => {
    const minor = Math.min(window.innerWidth, window.innerHeight)
    return minor < 440 ? minor : 440
  }
  const circleSize$ = Observable.just(circleSize())
  const percentage = (actual, total, totalTime) => (actual * total) / totalTime
  const vtree$ = props$
    .startWith({time: 0, totalTime: pomodoroTime})
    .combineLatest(
      circleSize$,
      (prop, circleSize) => {
        const svgSize = (circleSize - 20)
        const circleXY = ((circleSize / 2) - 10)
        const circleR = ((svgSize / 2) - 10)
        const diameter = ((circleR * Math.PI) * 2)
        const timePercentage = percentage(prop.time, diameter, prop.totalTime)
        return (
          div('.timer', [
            div('.timer-clock', [
              svg('svg', {
                width: svgSize,
                height: svgSize
              }, [
                svg('circle', {
                  cx: circleXY,
                  cy: circleXY,
                  r: circleR,
                  style: {
                    fill: 'transparent',
                    stroke: 'white',
                    strokeWidth: 10,
                    strokeDasharray: `${timePercentage}, ${prop.totalTime}`,
                    transition: '1s stroke-dasharray linear'
                  }
                })
              ])
            ]),
            h1('.timer-text', String(toMMSS(prop.time)))
          ])
        )
      }
  )
  return {
    DOM: vtree$
  }
}

export default Timer
