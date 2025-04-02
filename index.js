/// <reference types="../CTAutocomplete" />

/**
 * feedback
 * ChatLib.chat("&3[&aFloor7Helper&3]&r: "+ msg)
*/
export function feed(msg,hovermsg) {
    let msga;
    
    if(hovermsg) { msga = new TextComponent(`&3[&aFloor7Helper&3]&r: ${msg}`).setHoverValue(hovermsg)} else {
        msga = new TextComponent(`&3[&aFloor7Helper&3]&r: ${msg}`)
    }
    ChatLib.chat(msga)
}
import PogObject from "../PogData";

export const data = new PogObject("f7helper", {
    chatFD: true,
});

register("worldUnload",()=>{
    data.save();
})

//fix memory issuesz
export const Maindisplay = new Display();

Maindisplay.setAlign(DisplayHandler.Align.CENTER)

//fix windowed mode/ect
register('step', () => Maindisplay.setRenderLoc(Renderer.screen.getWidth() / 2, Renderer.screen.getHeight() / 2 - 10))
Maindisplay.setBackgroundColor(Renderer.AQUA);


import './modules/slotbinding/Slotbinding'
import './modules/withercloak/CreeperVeil'