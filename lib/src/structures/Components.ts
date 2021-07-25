import Button from './Button'
import SelectMenu from './SelectMenu'

class Components {
  row: any[]
  private component0Type: any
  constructor (public componentsLimit: number = 10) {
    this.row = [{
      type: 1,
      components: []
    }]
  }

  add (...components: SelectMenu[] | Button[]) {
    let index = 0
    for (const component of components) {
      index++
      if (this.size > this.componentsLimit) {
        throw new Error(`Component limit reached. (${this.size}/${this.componentsLimit})`)
      }

      if (this.component0Type) {
        if (component instanceof this.component0Type[1]) {
          continue
        } else {
          throw new TypeError(`\n\u001b[1m\u001b[31mComponent conflict.\u001b[0m\nThe component type does not match the type of the component.\n\u001b[1mComponent (${index - 1}) type:\u001b[0m \u001b[32m${this.component0Type[0].toString()}\u001b[0m\n\u001b[1mComponent (${index}) type:\u001b[0m \u001b[31m${component.toString()}\u001b[0m`)
        }
      }

      if (component instanceof Button) {
        if (component.url) {
          if (component.custom_id) {
            throw new Error('Link buttons do not use custom id')
          }
        } else if (!component.custom_id) {
          throw new Error('Button require a custom id')
        }
        this.component0Type = [component, Button]
      } else {
        if (!component.custom_id) {
          throw new Error('Select Menu require a custom id.')
        }
        this.component0Type = [component, SelectMenu]
      }

      this.components.push(component)
    }
    return this
  }

  remove (component: any) {
    this.components = this.components.filter((c: any) => Object.values(c) !== Object.values(component))
    return this
  }

  get components (): any[] {
    return this.row[0].components
  }

  set components (value: any) {
    this.row[0].components = value
  }

  get size () {
    return this.row[0].length + 1
  }
}

export default Components
