/// <reference types="../CTAutocomplete" />

export function k(msg) {
    ChatLib.chat("&3[&aFloor7Helper&3]&r: "+ msg)
}
import PogObject from "../PogData";
export const data = new PogObject("f7helper", {
    chatFD: true,
    creeperveilenabled: true,
    withercloakslot: undefined
});

register("worldUnload",()=>{
    data.save();
})

register("command", ()=> {

}).setName("f7creeperveil")

if(!data.creeperveilenabled) return;
import './CreeperVeil';
import './BozoStaff'