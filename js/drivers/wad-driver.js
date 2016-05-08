import Wad from 'web-audio-daw'
import {Subject} from 'rx'

export const makeWadDriver = () => {
  const sound$ = new Subject()
  const get$ = id => sound$.filter(sound => sound.id == id)
  return soundConfig$ => {
    soundConfig$
      .subscribe(soundConfig => {
        const sound = new Wad(soundConfig.config)
        sound$.onNext({id: soundConfig.id, sound})
      })
    return {get$}
  }
}
