class Frequency {
  constructor (name, interval) {
    this.name = name
    this.interval = interval
  }
}

Frequency.ONCE = new Frequency('Once', 0)
Frequency.YEARLY = new Frequency('Yearly', 1)
Frequency.BIMONTHLY = new Frequency('Bi-Monthly', 6)
Frequency.MONTHLY = new Frequency('Monthly', 12)
Frequency.BIWEEKLY = new Frequency('Bi-Weekly', 26)
Frequency.WEEKLY = new Frequency('Weekly', 52)
Frequency.DAILY = new Frequency('Daily', 52 * 7)

Frequency.byId = id => {
  try { return Frequency[Object.keys(Frequency)[id]] } catch (e) { return Frequency.ONCE }
}

Frequency.values = () => {
  let keys = Object.keys(Frequency)
  keys.splice(-3, 3)

  return keys.map(k => Frequency[k])
}

Frequency.options = () => {
  return Frequency.values().map((f, i) => {
    return {
      value: i,
      text: f.name
    }
  })
}

export default Frequency
