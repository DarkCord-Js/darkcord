import fs from 'fs'
import path from 'path'
import type Bot from '../CommandBot'
import isClass from '../util/isClass'
import isConstructor from '../util/isConstructor'

const commandsLoaded: string[] = []
const eventsLoaded: string[] = []

export async function CommandLoader (bot: Bot, _path: string = './darkcord/commands') {
  const dir = path.join(path.dirname(<string>require.main?.filename), _path)

  fs.readdir(path.resolve(dir), (err, __) => {
    if (err) throw err
    for (const pof of __) {
      if (fs.lstatSync(path.join(dir, pof)).isDirectory()) {
        fs.readdir(path.join(_path, pof), (err, files) => {
          if (err) throw err

          files = files.filter(file => file.endsWith('.js'))
          for (const file of files) {
            const _dir = path.relative(
              dir,
              path.join(_path, file)
            )

            LoadCommando(bot, _dir, file)
          }
        })
      } else {
        if (pof.endsWith('.js')) {
          const _dir = path.relative(
            dir,
            path.join(_path, pof)
          )

          LoadCommando(bot, _dir, pof)
        }
      }
    }
  })

  const r: {
    /** Array of commands names */
    loaded: string[]
    /** Loader path */
    path: string
  } = {
    loaded: commandsLoaded,
    path: dir
  }

  return r
}

function LoadCommando (bot: Bot, _dir: string, file: string) {
  let commando = require(_dir)

  if (commando.default) {
    commando = commando.default
  }

  if (isClass(commando)) {
    if (isConstructor(commando)) {
      commando = new commando()

      const name = commando.options?.name ?? commando.name

      if (name) {
        commandsLoaded.push(name)
        bot.commands.set(name, commando)
      } else {
        throw new Error(`Missing command name.\nFile: ${file}`)
      }
    } else {
      const name = commando.options?.name ?? commando.name

      if (name) {
        commandsLoaded.push(name)
        bot.commands.set(name, commando)
      } else {
        throw new Error(`Missing command name.\nFile: ${file}`)
      }
    }
  } else {
    throw new Error(`File ${file} is not a class.`)
  }
}

export function EventLoader (bot: Bot, _path: string = './darkcord/events') {
  const dir = path.join(path.dirname(<string>require.main?.filename), _path)

  fs.readdir(path.resolve(dir), (err, __) => {
    if (err) throw err
    for (const pof of __) {
      if (fs.lstatSync(path.join(dir, pof)).isDirectory()) {
        fs.readdir(path.join(_path, pof), (err, files) => {
          if (err) throw err

          files = files.filter(file => file.endsWith('.js'))
          for (const file of files) {
            const _dir = path.relative(
              dir,
              path.join(_path, file)
            )

            LoadEvent(bot, _dir, file)
          }
        })
      } else {
        if (pof.endsWith('.js')) {
          const _dir = path.relative(
            dir,
            path.join(_path, pof)
          )

          LoadEvent(bot, _dir, pof)
        }
      }
    }
  })

  const r: {
    /** Array of events names */
    loaded: string[]
    /** Loader path */
    path: string
  } = {
    loaded: eventsLoaded,
    path: dir
  }

  return r
}

function LoadEvent (bot: Bot, _dir: string, file: string) {
  let event = require(_dir)

  if (event.default) {
    event = event.default
  }

  if (isClass(event)) {
    if (isConstructor(event)) {
      event = new event()

      const name = event.options?.name ?? event.name

      if (name) {
        eventsLoaded.push(name)
        if (event.execute) {
          bot.on(name, (...args) => event.execute(...args))
        } else {
          throw new Error(`Missing event execute.\nFile: ${file}`)
        }
      } else {
        throw new Error(`Missing event name.\nFile: ${file}`)
      }
    } else {
      const name = event.options?.name ?? event.name

      if (name) {
        commandsLoaded.push(name)
        if (event.execute) {
          bot.on(name, (...args) => event.execute(...args))
        } else {
          throw new Error(`Missing event execute.\nFile: ${file}`)
        }
      } else {
        throw new Error(`Missing event name.\nFile: ${file}`)
      }
    }
  } else {
    throw new Error(`File ${file} is not a class.`)
  }
}
