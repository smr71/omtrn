let TEXT;

function sum(items) {
  return items.reduce((a, b) => a + b, 0);
}

class Permission {
  constructor(time, perm) {
    this.time = time;
    this.perm = perm;
  }
}

class Drink {
  constructor(time, amount) {
    this.time = time;
    this.amount = amount;
  }
  unabsorbed(t) {
    if (t > this.time)
    return Math.pow(2, ((this.time - t) / HALFLIFE)) * this.amount;
    else
    return this.amount;
  }
}

class Release {
  constructor(time, amount, perm) {
    this.time = time;
    this.amount = amount;
    this.perm = perm;
  }
}

class Drinker {
  constructor() {
    this._history = [];
    this.old_acc = [];
    this._permission = new Permission(null, false);
  }

  get history() {
    return [...this._history];
  }

  historyAppend(item) {
    this._history.push(item);
    this._history.sort(function(a, b) {
      return a.time - b.time;
    });
  }

  get drinks() {
    return this._history.filter(x => (x instanceof Drink));
  }

  get total_drinks() {
    return sum(this.drinks.map(x => x.amount));
  }

  get releases() {
    return this._history.filter(x => (x instanceof Release));
  }

  get accidents() {
    return this._history.filter(x => ((x instanceof Release) && !x.perm));
  }

  get capacity() {
    let all_accidents = this.accidents.map(x => x.amount).concat(this.old_acc);
    if (all_accidents.length > 0)
    return sum(all_accidents) / all_accidents.length;
    else
    return DEFAULT_CAP;
  }

  get eta() {
    let excess = sum(this.drinks.map(x => x.amount)) - sum(this.releases.map(x => x.amount)) - this.capacity;
    if (excess > 0) {
      let start_time = Math.min(...(this.drinks.map(x => x.time)));
      return start_time + HALFLIFE*Math.log2(sum(this.drinks.map(x => x.amount * Math.pow(2, ((x.time - start_time)/HALFLIFE))))/excess);
    } else {
      return null;
    }
  }

  absorbed(t) {
    return sum(this.drinks.map(x => x.amount - x.unabsorbed(t)));
  }

  bladder(t) {
    //console.log("Absorbed: " + this.absorbed(t));
    return this.absorbed(t) - sum(this.releases.filter(x => x.time <= t).map(x => x.amount));
  }

  add_drink(t, amount) {
    this.historyAppend(new Drink(t, amount));
  }

  add_release(t, perm) {
    let b = this.bladder(t);
    this.historyAppend(new Release(t, b, perm));
    return b;
  }

  desperation(t) {
    let fullness = this.bladder(t)/this.capacity;
    //console.log("Fullness: " + fullness)
    return fullness > 1 ? 1.0 : fullness;
  }

  roll_allowed(t) {
    if (this._permission.time == null)
    return true;
    else
    return this.absorbed(t) - this.absorbed(this._permission.time) > this.capacity/FULLNESS_QUANTUM;
  }

  roll_for_permission(t) {
    let roll = Math.random()*1.2 - 0.1;
    let answer = roll > this.desperation(t);
    this._permission = new Permission(t, answer);
    return answer;
  }
}
