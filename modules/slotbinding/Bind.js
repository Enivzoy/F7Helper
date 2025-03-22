export class Bind {
    constructor(slot0, slot1) {
        if (slot0 > slot1) {
            this.slot0 = slot1;
            this.slot1 = slot0;
        } else {
            this.slot0 = slot0; // hotbar
            this.slot1 = slot1; // slot to click
        }
    }

    toString() {
        return `[${this.slot0},${this.slot1}]`;
    }

    toJsonObject() {
        return `${this.slot0},${this.slot1}`;
    }

    static fromJsonObject(json) {
        json = json.split(",").map(slot => Number(slot));
        return new this(json[0], json[1]);
    }

    equals(b) {
        return b === this || (
            b instanceof this.constructor &&
            (b.slot0 === this.slot0 && b.slot1 === this.slot1 ||
            b.slot0 === this.slot1 && b.slot1 === this.slot0)
        )
    }
}