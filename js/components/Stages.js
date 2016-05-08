import {div, svg} from '@cycle/dom'

const items = [1, 2, 3, 4]
const circleStyle = (total, value) => {
  if (value > total) {
    return {
      cx: 17,
      cy: 17,
      r: 10,
      style: {
        fill: 'transparent',
        stroke: '#B71C1C',
        transition: '300ms all cubic-bezier(0.4, 0, 0, 1)'
      }
    }
  } else {
    return {
      cx: 17,
      cy: 17,
      r: 15,
      style: {
        fill: 'transparent',
        stroke: 'white',
        strokeWidth: 2,
        transition: '300ms all cubic-bezier(0.4, 0, 0, 1)'
      }
    }
  }
}
const leafStyle = (total, value) => {
  if (value > total) {
    return {
      d: `M 15, 10
          L 15, 10
            19, 14
          M 19, 14
          L 15, 14
            19, 10`,
      style: {
        fill: 'transparent',
        stroke: '#B71C1C',
        transition: '300ms all cubic-bezier(0.4, 0, 0, 1)'
      }
    }
  } else {
    return {
      d: `M 14, 7
          L 14, 7
            20, 13
          M 20, 7
          L 20, 7
            14, 13`,
      style: {
        fill: 'transparent',
        stroke: '#AED581',
        strokeWidth: 2,
        transition: '300ms all cubic-bezier(0.4, 0, 0, 1)'
      }
    }
  }
}
const pomodoroItem = total => item =>
  div('.stages-item', [
    svg('svg', {
          width: 34,
          height: 34
        }, [
          svg('circle', circleStyle(total, item)),
          svg('path', leafStyle(total, item))
        ])
    ])

const Stages = pomodoroTotal$ => {
  const vtree$ = pomodoroTotal$
    .startWith(0)
    .map(total =>
      div('.stages', [items.map(pomodoroItem(total))])
    )
    return {
      DOM: vtree$
    }
  }

export default Stages
