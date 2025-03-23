export class Bind {
    constructor(slot0, slot1, boxColor) {
        if (slot0 > slot1) {
            this.slot0 = slot1;
            this.slot1 = slot0;
        } else {
            this.slot0 = slot0; // hotbar
            this.slot1 = slot1; // slot to click
        }
        this.boxColor = boxColor !== undefined ? Number(boxColor) : 0; // Ensure boxColor is converted to a number
    }

    toString() {
        return `[${this.slot0},${this.slot1},${this.boxColor}]`;
    }

    toJsonObject() {
        return `${this.slot0},${this.slot1},${this.boxColor}`;
    }

    static fromJsonObject(json) {
        const parts = json.split(",");
        const slot0 = Number(parts[0]);
        const slot1 = Number(parts[1]);
        const boxColor = parts.length > 2 ? Number(parts[2]) : 0; // Ensure boxColor is parsed as a number
        return new this(slot0, slot1, boxColor);
    }

    equals(b) {
        return b === this || (
            b instanceof this.constructor &&
            (b.slot0 === this.slot0 && b.slot1 === this.slot1 ||
            b.slot0 === this.slot1 && b.slot1 === this.slot0)
        )
    }
}