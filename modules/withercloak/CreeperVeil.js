/// <reference types="../../../CTAutocomplete" />
import { data, feed, Maindisplay } from '../../index';

const Memory = {
    witherCloakTimeLeft: 10,
    witherCloakClicked: false,
    avoidSpam: false
};

const COOLDOWN_WARNING_TIME = 3;

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

register('step', () => {
    if (Memory.witherCloakClicked) {
        Memory.witherCloakTimeLeft--;
        setTimer(Memory.witherCloakTimeLeft);
        if (Memory.witherCloakTimeLeft === COOLDOWN_WARNING_TIME) {
            Client.showTitle("&6&klol&r &6WITHER CLOAK EXPIRING SOON &6&klol&r", `Time Left : &a${COOLDOWN_WARNING_TIME} Seconds`, 0, 15, 5);
            feed(`&6WITHER CLOAK EXPIRING SOON !!! RIGHT CLICK TO REDUCE COOLDOWN!!\nTime Left : &a${COOLDOWN_WARNING_TIME} Seconds`);
        }

        if (Memory.witherCloakTimeLeft === 0) {
            Client.showTitle("&6&klol&r&a WITHER CLOAK DEACTIVATED &6&klol&r", "&aSkill Issue", 0, 15, 5);
            feed("&8REDUCE COOLDOWN TIME PERIOD FAILED");
            Memory.witherCloakClicked = false;
        }
    }
}).setFps(1);

function setTimer(number) {
    if (typeof number == "boolean") {
        Maindisplay.setLine(0,`&aCreeper Veil: &dREADY`)
    } else {
        let color = "&c"
        if(number >= COOLDOWN_WARNING_TIME) color = "&6"
        Maindisplay.setLine(0,`&aCreeper Veil: ${color}${(number!==0)?number : ""}`)
    }
}

function startCd(timer) {
    let zz = timer;
    let skibidi = register("step", () => {
        zz--;
        Maindisplay.setLine(0, `[&6ON COOLDOWN&r] &aCreeper Veil: &0${zz} seconds`);
        if(zz === 0) {
            skibidi.unregister();
            setTimer(true)
        }
    }).setFps(1);
}