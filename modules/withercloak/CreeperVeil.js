/// <reference types="../../../CTAutocomplete" />
import { data, feed } from '../../index';

const Memory = {
    witherCloakTimeLeft: 10,
    witherCloakClicked: false,
    avoidSpam: false
};

const SPAM_DELAY_TICKS = 23;
const SPAM_RESET_TICKS = 25;
const COOLDOWN_WARNING_TIME = 3;


const display = new Display();
display.setAlign(DisplayHandler.Align.CENTER)

display.setRenderLoc(Renderer.screen.getWidth() / 2, Renderer.screen.getHeight() / 2 - 10);
display.setBackgroundColor(Renderer.AQUA);

display.addLine("&aCreeper Veil: ");

let ticks = 0;
let alternateTick = 0;

register("chat", (event) => {
    const message = ChatLib.removeFormatting(event);
    if (message == "Creeper Veil Activated!") {
        Memory.witherCloakClicked = true;
        Memory.witherCloakTimeLeft = 10;
    }
    if(message == "Creeper Veil De-activated!") {
        Memory.witherCloakClicked = false;
        Memory.witherCloakTimeLeft = 10;
        if(data.chatFD) feed("Creeper Veil deactivated! Sucessfully Reduced Cooldown");
        startCd(5)
    } else if (message == "Creeper Veil De-activated! (Expired)") {
        startCd(10)
    }
}).setCriteria("${message}");

register("tick", () => {
    
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
            setTimer(Memory.witherCloakTimeLeft);
            Memory.witherCloakTimeLeft--;
            if (Memory.witherCloakTimeLeft === COOLDOWN_WARNING_TIME) {
                Client.show
                Client.showTitle("&6&klol&r &6WITHER CLOAK EXPIRING SOON &6&klol&r", `Time Left : &a${COOLDOWN_WARNING_TIME} Seconds`, 0, 15, 5);
                feed(`&6WITHER CLOAK EXPIRING SOON !!! RIGHT CLICK TO REDUCE COOLDOWN!!\nTime Left : &a${COOLDOWN_WARNING_TIME} Seconds`);
            }

            if (Memory.witherCloakTimeLeft === 0) {
                Client.showTitle("&6&klol&r&a WITHER CLOAK DEACTIVATED &6&klol&r", "&aSkill Issue", 0, 15, 5);
                feed("&8REDUCE COOLDOWN TIME PERIOD FAILED");
                Memory.witherCloakClicked = false;
            }
        }
    }
});

function setTimer(number) {
    if (typeof number == "boolean") {
        display.setLine(0,`&aCreeper Veil: &dREADY`)
    } else {
        let color = "&c"
        if(number >= COOLDOWN_WARNING_TIME) color = "&6"
        display.setLine(0,`&aCreeper Veil: ${color}${(number!==0)?number : ""}`)
    }
}

function startCd(timer) {
    let zz = timer;
    let skibidi = register("step", () => {
        display.setLine(0, `[&6ON COOLDOWN&r] &aCreeper Veil: &0${zz} seconds`);
        zz--;
        if(zz <= 0) {
            skibidi.unregister();
            setTimer(true)
        }
    }).setFps(1);
}