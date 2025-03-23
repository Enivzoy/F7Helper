/// <reference types="../../../CTAutocomplete" />
import { data, k } from '../../index';

const Memory = {
    witherCloakTimeLeft: 10,
    witherCloakClicked: false,
    avoidSpam: false
};

const SPAM_DELAY_TICKS = 23;
const SPAM_RESET_TICKS = 25;
const COOLDOWN_WARNING_TIME = 3; // when should it tell you, you need to swap back

const CREEPER_VEIL_MESSAGE = "Creeper Veil Activated!"; // honestly no idea why these are here
const CREEPER_VEIL_DEACTIVATE ="Creeper Veil De-activated!"


const display = new Display();
display.setAlign(DisplayHandler.Align.CENTER)

display.setRenderLoc(Renderer.screen.getWidth() / 2, Renderer.screen.getHeight() / 2 - 10);
display.setBackgroundColor(Renderer.AQUA);

display.addLine("&aCreeper Veil: ");

let ticks = 0;
let alternateTick = 0;

register("chat", (event) => {
    const message = ChatLib.removeFormatting(event);
    if (message.includes(CREEPER_VEIL_MESSAGE)) {
        if (data.chatFD) k("Creeper Veil detected via chat!");
        Memory.witherCloakClicked = true;
        Memory.witherCloakTimeLeft = 10;
    }
    if(message.includes(CREEPER_VEIL_DEACTIVATE)) {
        Memory.witherCloakClicked = false;
        if(data.chatFD) k("Creeper Veil deactivated! Sucessfully Reduced Cooldown");
    }
}).setCriteria("${message}");

register("tick", () => {
    setTimer(Memory.witherCloakTimeLeft);
    if (!Memory.witherCloakClicked) {
        Memory.witherCloakTimeLeft = 10;
        ticks = 0;
    }

    if (Memory.witherCloakClicked) {
        ticks++;
    }

    alternateTick++;
    if (alternateTick >= SPAM_DELAY_TICKS) {
        Memory.avoidSpam = false;
    }

    if (alternateTick >= SPAM_RESET_TICKS && !Memory.avoidSpam) {
        alternateTick = 0;
    }

    if (ticks === 20) {
        ticks = 0;

        if (Memory.witherCloakClicked) {
            Memory.witherCloakTimeLeft--;
            if (data.chatFD) {
                k(`Wither cloak time Left: ${Memory.witherCloakTimeLeft}`);
            }
            if (Memory.witherCloakTimeLeft === COOLDOWN_WARNING_TIME) {
                Client.showTitle(`&6&klol&r &6WITHER CLOAK EXPIRING SOON &6&klol&r", "Time Left : &a${COOLDOWN_WARNING_TIME} Seconds`, 0, 15, 5);
                k(`&6WITHER CLOAK EXPIRING SOON !!! RIGHT CLICK TO REDUCE COOLDOWN!!\nTime Left : &a${COOLDOWN_WARNING_TIME} Seconds`);
            }

            if (Memory.witherCloakTimeLeft === 0) {
                Client.showTitle("&6&klol&r&a WITHER CLOAK DEACTIVATED &6&klol&r", "&aSkill Issue", 0, 15, 5);
                k("&8REDUCE COOLDOWN TIME PERIOD FAILED");
                Memory.witherCloakClicked = false;
                setTimer(0);
            }
        }
    }
});

function setTimer(number) {
    let color = "&c"
    if(number >= COOLDOWN_WARNING_TIME) color = "&6"
    display.setLine(0,`&aCreeper Veil: ${color}${(number!==0)?number : ""}`)
}
