import { Bind } from "./bind";

export const ConfigObject = new class {
    constructor() {
        this.path = "F7Helper/modules/slotbinding/";
        this.name = "data.json";
        this.toggled = false;
        this.key = 0;
        this.binds = [];
        this.boxColor = 0;
    }

    load() {
        try {
            if (!FileLib.exists(this.path, this.name)) return false;
            const json = JSON.parse(FileLib.read(this.path, this.name));
            this.toggled = json.toggled;
            this.key = json.key;
            this.boxColor = json.boxColor;

            const binds = json.binds;
            const length = binds.length;
            this.binds.length = length;
            for (let i = 0; i < length; i++) {
                let bind = Bind.fromJsonObject(binds[i]);
                if (bind.slot0 === bind.slot1 || this.hasBind(bind)) continue; 
                this.binds[i] = bind;
            }
            return true;
        } catch (error) {
            console.log("error while loading slotbinding binds " + error);
            return false;
        }
    }

    hasBind(bind) {
        for (let b of this.binds) {
            if (bind.equals(b)) return true;
        }
        return false;
    }

    save() {
        try {
            const length = this.binds.length;
            const binds = new Array(length);
            for (let i = 0; i < length; i++) {
                binds[i] = this.binds[i].toJsonObject();
            }
            const json = {
                toggled: this.toggled,
                key: this.key,
                binds: binds,
                boxColor: this.boxColor,
            };
            FileLib.write(this.path, this.name, JSON.stringify(json, null, 2));
            return true;
        } catch (error) {
            console.log("error while saving slotbinding binds " + error);
            return false;
        }
        
    }

    getBind(slot) {
        for (let bind of this.binds) {
            if (bind.slot0 === slot || bind.slot1 === slot) return bind;
        }
        return null;
    }
}