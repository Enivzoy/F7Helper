/// <reference types="../../../CTAutocomplete" />
import { data, k } from '../../index';
import { KeyBindingUtils } from '../KeybindUtil';

const Memory = {
    witherCloakTimeLeft: 10,
    witherCloakClicked: false,
    avoidSpam: false
};


const SPAM_DELAY_TICKS = 23;
const SPAM_RESET_TICKS = 25;
const COOLDOWN_WARNING_TIME = 3; // when should it tell you, you need to swap back
const CLICK_DELAY_MS = 112; // delay(human reaction time)

const CREEPER_VEIL_MESSAGE = "Creeper Veil Activated!"; // honestly no idea why these are here
const CREEPER_VEIL_DEACTIVATE ="Creeper Veil De-activated!"


const display = new Display();
display.setAlign(DisplayHandler.Align.CENTER)

display.setRenderLoc(Renderer.screen.getWidth() / 2, Renderer.screen.getHeight() / 2 - 10);
display.setBackgroundColor(Renderer.AQUA);

display.addLine("&aCreeper Veil: ");

let ticks = 0;
let alternateTick = 0;

const witherCloakKeybind = new KeyBind("Activate Wither Cloak", Keyboard.KEY_X, "Wither Cloak");

if (data.withercloakslot === undefined) {
    data.withercloakslot = -1;
}

register("command", (slot) => {
    const slotNum = parseInt(slot);

    if (isNaN(slotNum) || slotNum < 0 || slotNum > 8) {
        k("&cInvalid slot number! Please use a number between 0-8.");
        return;
    }

    data.withercloakslot = slotNum;
    k(`&aWither Cloak Sword slot set to: &6${slotNum}`);
    data.save();
}).setName("cloakslot").setAliases("cst")
    .setTabCompletions((args) => {
        if (args.length === 1) {
            return ["0", "1", "2", "3", "4", "5", "6", "7", "8"];
        }
        return [];
    });

register("tick", () => {
    
    if (witherCloakKeybind.isPressed()) {
        activateWitherCloak();
    }
});

function activateWitherCloak() {
    if (data.withercloakslot === -1) {
        k("&cFailed to activate Wither Cloak: please set your Wither Cloak Sword hotbar slot via the /cst command");
        return;
    }

    const currentSlot = Player.getHeldItemIndex();

    Player.setHeldItemIndex(data.withercloakslot);

    KeyBindingUtils.setRightClick(true);
    KeyBindingUtils.setRightClick(false);

    setTimeout(() => {
        setTimeout(() => {
            Player.setHeldItemIndex(currentSlot);

            if (data.chatFD) {
                k("&aWither Cloak activated with keybind, returned to original slot");
            }
        }, CLICK_DELAY_MS + Server.getPing());
    }, Server.getPing());
}

register("chat", (event) => {
    const message = ChatLib.removeFormatting(event);
    if (message.includes(CREEPER_VEIL_MESSAGE)) {

        if (data.withercloakslot === -1) {
            k("&cFailed to autocloak: please set your Wither Cloak Sword hotbar slot via the /cst command");
            return;
        }
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
                handleExpirationWarning();
            }

            if (Memory.witherCloakTimeLeft === 0) {
                Client.showTitle("&6&klol&r&a WITHER CLOAK DEACTIVATED &6&klol&r", "&aSkill Issue", 0, 15, 5);
                k("&8REDUCE COOLDOWN TIME PERIOD FAILED");
                Memory.witherCloakClicked = false;
                setTimer(0);
            }
        }
    }

    handleRightClick();
});

function handleExpirationWarning() {
    const swapBack = Player.getHeldItemIndex();

    if (data.withercloakslot !== -1) {
        Player.setHeldItemIndex(data.withercloakslot);
        KeyBindingUtils.setRightClick(true);
        setTimeout(() => {
            KeyBindingUtils.setRightClick(false);
        }, Server.getPing());
    } else {
        k("&cFailed to autocloak: please set your Wither Cloak Sword hotbar slot via the /cst command");
    }

    Client.showTitle("&6&klol&r &6WITHER CLOAK EXPIRING SOON &6&klol&r", "Time Left : &a3 Seconds", 0, 15, 5);
    k(`&6WITHER CLOAK EXPIRING SOON !!! RIGHT CLICK TO REDUCE COOLDOWN!!\nTime Left : &a3 Seconds`);

    if (data.withercloakslot !== -1) {
        setTimeout(() => {
            Player.setHeldItemIndex(swapBack);
        }, CLICK_DELAY_MS + Server.getPing());
    }
}

function handleRightClick() {
    if (!KeyBindingUtils.isRightClickDown() || Memory.avoidSpam) {
        return;
    }
    
    if (Memory.witherCloakClicked) {
        if (data.chatFD) {
            k(`Right Click detected - attempting to deactivate Wither Cloak`);
        }

        Memory.avoidSpam = true;
        Memory.witherCloakClicked = false;
    }
}

function setTimer(number) {
    let color = "&c"
    if(number >= COOLDOWN_WARNING_TIME) color = "&6"
    display.setLine(0,`&aCreeper Veil: ${color}${(number!==0)?number : ""}`)
}

// holy shit code