/// <reference types="../CTAutocomplete" />

/**
 * feedback
 * ChatLib.chat("&3[&aFloor7Helper&3]&r: "+ msg)
*/
export function feed(msg) {
    ChatLib.chat("&3[&aFloor7Helper&3]&r: "+ msg)
}
import PogObject from "../PogData";

export const data = new PogObject("f7helper", {
    chatFD: true,
});

register("worldUnload",()=>{
    data.save();
})

import './modules/slotbinding/Slotbinding'