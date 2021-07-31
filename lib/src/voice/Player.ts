import { PlayerOptions, Structure } from 'erela.js'

module.exports = Structure.extend('Player', (Player) => {
  class LavaLinkPlayerExtension extends Player {
          speed: number
          pitch: number
          rate: number
          nightcore: boolean
          vaporwave: boolean
          bassboost: boolean
          radio: boolean
          band: number = 0
          gain: number = 0
          constructor (options: PlayerOptions) {
            super(options)
            this.speed = 1
            this.pitch = 1
            this.rate = 1
            this.nightcore = false
            this.vaporwave = false
            this.bassboost = false
            this.radio = false
          }

          setSpeed (speed: number) {
            if (isNaN(speed)) { throw new RangeError('Player#setSpeed() Speed must be a number.') }
            this.speed = Math.max(Math.min(speed, 5), 0.05)
            this.setTimescale(speed)
            return this
          }

          setPitch (pitch: number) {
            if (isNaN(pitch)) { throw new RangeError('Player#setPitch() Pitch must be a number.') }
            this.pitch = Math.max(Math.min(pitch, 5), 0.05)
            this.setTimescale(this.speed, pitch)
            return this
          }

          setNightcore (nighcore: boolean) {
            if (typeof nighcore !== 'boolean') { throw new RangeError('Player#setNighcore() Nightcore can only be "true" or "false".') }

            this.nightcore = nighcore
            if (nighcore) {
              this.vaporwave = false
              this.setTimescale(1.2999999523162842, 1.2999999523162842, 1)
            } else this.setTimescale(1, 1, 1)
            return this
          }

          setVaporwave (vaporwave: boolean) {
            if (typeof vaporwave !== 'boolean') { throw new RangeError('Player#setVaporwave() Vaporwave can only be "true" or "false".') }

            this.vaporwave = vaporwave
            if (vaporwave) {
              this.nightcore = false
              this.setTimescale(0.8500000238418579, 0.800000011920929, 1)
            } else this.setTimescale(1, 1, 1)
            return this
          }

          setBassboost (bassboost: boolean) {
            if (typeof bassboost !== 'boolean') { throw new RangeError('Player#setBassboost() Bassboost can only be "true" or "false"') }

            this.bassboost = bassboost
            if (bassboost) {
              this.setVaporwave(false)
              this.setNightcore(false)
              this.setEqualizer(1, 0.95)
            } else this.clearEffects()
            return this
          }

          setEqualizer (band: number, gain: number) {
            this.band = band || this.band
            this.gain = gain || this.gain

            this.node.send({
              op: 'filters',
              guildId: this.guild,
              equalizer: [
                {
                  band: this.band,
                  gain: this.gain
                },
                {
                  band: this.band,
                  gain: this.gain
                },
                {
                  band: this.band,
                  gain: this.gain
                },
                {
                  band: this.band,
                  gain: this.gain
                },
                {
                  band: this.band,
                  gain: this.gain
                },
                {
                  band: this.band,
                  gain: this.gain
                }
              ]
            })
          }

          setTimescale (speed?: number, pitch?: number | undefined, rate?: number | undefined) {
            this.speed = speed || this.speed
            this.pitch = pitch || this.pitch
            this.rate = rate || this.rate

            this.node.send({
              op: 'filters',
              guildId: this.guild,
              timescale: {
                speed: this.speed,
                pitch: this.pitch,
                rate: this.rate
              }
            })
            return this
          }

          clearEffects () {
            this.speed = 1
            this.pitch = 1
            this.rate = 1
            this.bassboost = false
            this.nightcore = false
            this.vaporwave = false

            this.clearEQ()

            this.node.send({
              op: 'filters',
              guildId: this.guild
            })
            return this
          }
  }
  return LavaLinkPlayerExtension
})
