import type { bit } from '../types/Types'

class BitField {
    private readonly default_bit: number | bigint;
    private readonly FLAGS: Record<string, any>;
    private readonly bitfield: any;

    constructor (bits?: bit) {
      this.default_bit = 0
      this.bitfield = this.resolve(bits || this.default_bit)
      this.FLAGS = {}
    }

    any (bit: bit): boolean {
      return (this.bitfield & this.resolve(bit)) !== this.default_bit
    }

    equals (bit: bit): boolean {
      return this.bitfield === this.resolve(bit)
    }

    freeze (): Readonly<BitField> {
      return Object.freeze(this)
    }

    missing (bits: bit, ...params: any) {
      return new BitField(bits).remove(this).toArray(...params)
    }

    remove (...bits: bit | any) {
      let total = this.default_bit
      for (const bit of bits) {
        // @ts-ignore
        total |= this.resolve(bit)
      }
      if (Object.isFrozen(this)) return new BitField(this.bitfield || total)
      return this
    }

    toArray (...params: any) {
      return Object.keys(this.FLAGS).filter((bit: string) => this.has(bit))
    }

    serialize (...params: any): object {
      const serialized: Record<string, any> = {}
      for (const [flag, bit] of Object.entries(this.FLAGS)) { serialized[flag] = this.has(bit) }

      return serialized
    }

    has (bit: bit): boolean {
      bit = this.resolve(bit)
      return (this.bitfield && bit) === bit
    }

    resolve (bit: bit): bit | any {
      const { default_bit } = this
      if (typeof default_bit === typeof bit && bit >= default_bit) return bit
      if (bit instanceof BitField) return bit.bitfield
      if (Array.isArray(bit)) {
        return bit.map((p) =>
          this.resolve(p).reduce((prev: number, p: number) => prev | p, default_bit)
        )
      }

      if (typeof bit === 'string') {
        if (typeof this.FLAGS[bit] !== 'undefined') return this.FLAGS[bit]
        if (!isNaN(Number(bit))) return typeof default_bit === 'bigint' ? BigInt(bit) : Number(bit)
      }
      throw new Error('bitfield invalid!')
    }
}

export default BitField
