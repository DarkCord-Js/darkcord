import Client from '../../Client'

class Event {
  options: { name: string }
  constructor (eventOptions: { name: string }, public client?: Client) {
    this.options = {
      name: eventOptions.name
    }
  }
}

export default Event