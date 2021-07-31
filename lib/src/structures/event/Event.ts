import Bot from '../../Bot'

class Event {
  options: { name: string }
  constructor (eventOptions: { name: string }, public bot?: Bot) {
    this.options = {
      name: eventOptions.name
    }
  }
}

export default Event