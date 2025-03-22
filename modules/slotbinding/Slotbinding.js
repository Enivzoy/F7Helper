import { feed } from "../..";
import { Bind } from "./bind";
import { ConfigObject } from "./ConfigObject";

const JavaInt = Java.type("java.lang.Integer");
const JavaChar = Java.type("java.lang.Character");
const MCSlot = Java.type("net.minecraft.inventory.Slot");
const GuiScreen = Java.type("net.minecraft.client.gui.GuiScreen");
const GuiContainer = Java.type("net.minecraft.client.gui.inventory.GuiContainer");
const GuiInventory = Java.type("net.minecraft.client.gui.inventory.GuiInventory");

const slotIndexField = MCSlot.class.getDeclaredField("field_75225_a");
slotIndexField.setAccessible(true);

const theSlotField = GuiContainer.class.getDeclaredField("field_147006_u");
theSlotField.setAccessible(true);
const keyTypedMethod = GuiContainer.class.getDeclaredMethod("func_73869_a", JavaChar.TYPE, JavaInt.TYPE);
keyTypedMethod.setAccessible(true);

const mouseClickedMethod = GuiScreen.class.getDeclaredMethod("func_73864_a", JavaInt.TYPE, JavaInt.TYPE, JavaInt.TYPE);
const mouseReleasedMethod = GuiScreen.class.getDeclaredMethod("func_146286_b", JavaInt.TYPE, JavaInt.TYPE, JavaInt.TYPE);
mouseClickedMethod.setAccessible(true);
mouseReleasedMethod.setAccessible(true);

const guiLeftField = GuiContainer.class.getDeclaredField("field_147003_i");
const guiTopField = GuiContainer.class.getDeclaredField("field_147009_r");
guiLeftField.setAccessible(true);
guiTopField.setAccessible(true);

const keyDownBufferField = Keyboard.class.getDeclaredField("keyDownBuffer");
keyDownBufferField.setAccessible(true);

const keyBindsHotbar = Client.getSettings().getSettings().field_151456_ac;

load();
const slotBindingKeyBind = new KeyBind("slotbinding", ConfigObject.key);
save();

function load() {
    ConfigObject.load();
}

function save() {
    ConfigObject.key = slotBindingKeyBind.getKeyCode();
    ConfigObject.save();
}

register("Command", () => {
    ConfigObject.toggled = !ConfigObject.toggled;
    feed(`&dSlotbinding: &6${ConfigObject.toggled}`)
    save();
}).setName("slotbinding");

let clicking = false;

const mainSlotBinding = register("GuiMouseClick", (x, y, button, gui, event) => {
    if (clicking) return;
    if (!ConfigObject.toggled) return;
    if (!Keyboard.isKeyDown(Keyboard.KEY_LSHIFT)) return;
    if (!(gui instanceof GuiInventory)) return;
    if (Player.getPlayer().field_71071_by.func_70445_o() !== null) return;
    const slot = theSlotField.get(gui);
    if (!slot) return;
    const slotIndex = slotIndexField.get(slot);
    const slots = gui.field_147002_h.field_75151_b;
    if (slots.indexOf(slot) < 5) return;
    const bind = ConfigObject.getBind(slotIndex);
    if (!bind) return;
    let slot0 = bind.slot0;
    let slot1 = bind.slot1;
    if (slot0 < 0 || slot0 > 8 || slot1 < 0 || slot1 > 39) return;
    if (slot1 < 9) slot1 += 36; // we dont want cheaters here
    // also if youre tryna do what i think ur doing dont, wd insta bans you
    /**
     * part, index, index of slots
     * helm, 39, 5
     * chest, 38, 6
     * leggings, 37, 7
     * boots, 38, 8
     * 
     * soo indexofslots = -index + 44
     * zzzzzzzzzz
     */
    else if (slot1 > 35) slot1 = -slot1 + 44;
    const slotToClick = slots[slot1];
    if (!slotToClick) return;
    let keyCode = keyBindsHotbar[bind.slot0]?.func_151463_i();
    if (!keyCode) return;

    // click
    cancel(event);
    clicking = true;
    theSlotField.set(gui, slotToClick);
    // if hotbar is bounded with mouse
    if (keyCode < 0) {
        keyCode += 100;
        clickSlotButton(gui, slotToClick, keyCode);
    } else {
        keyTypedMethod.invoke(gui, new JavaChar(Keyboard.getKeyName(keyCode)[0].toLowerCase()), new JavaInt(keyCode));
    }
    theSlotField.set(gui, slot);
    clicking = false;
}).unregister();

let bindingSlot = null;

const slotBinder = register("GuiKey", (char, key, gui, event) => {
    if (clicking) return;
    if (!ConfigObject.toggled) return;
    if (!(gui instanceof GuiInventory)) return;
    if (bindingSlot) return;
    if (key !== slotBindingKeyBind.getKeyCode()) return;
    const theSlot = theSlotField.get(gui);
    if (!theSlot) return;
    if (gui.field_147002_h.field_75151_b.indexOf(theSlot) < 5) return;
    const slotIndex = slotIndexField.get(theSlot);
    bindingSlot = slotIndex;
}).unregister();

const slotBindingRenderer = register("PostGuiRender", (mouseX, mouseY, gui) => {
    if (!ConfigObject.toggled) return;
    if (!(gui instanceof GuiInventory)) return;

    const theSlot = theSlotField.get(gui);
    const slots = gui.field_147002_h.field_75151_b;
    const guiLeft = guiLeftField.get(gui);
    const guiTop = guiTopField.get(gui);
    const binds = ConfigObject.binds;
    const width = 16;
    let borderDrawn = false;

    if (bindingSlot !== null) {
        if (Keyboard.isKeyDown(slotBindingKeyBind.getKeyCode())) {
            let slot = bindingSlot;
            if (slot < 9) slot += 36;
            else if (slot > 35) slot = -slot + 44;

            slot = slots[slot];
            const x0 = slot.field_75223_e + guiLeft;
            const y0 = slot.field_75221_f + guiTop;
            const half = width * 0.5;

            GlStateManager.func_179094_E(); // pushMatrix
            GlStateManager.func_179090_x(); // disableTexture2D
            GlStateManager.func_179147_l(); // enableBlend
            GL11.glEnable(GL11.GL_LINE_SMOOTH);

            drawSlot(x0, y0, width);
            GlStateManager.func_179097_i(); // disableDepth
            drawBorder(x0, y0, width);
            Renderer.drawLine(BORDER_COLOR, x0 + half, y0 + half, mouseX, mouseY, 1);
            GlStateManager.func_179126_j(); // enableDepth

            GL11.glDisable(GL11.GL_LINE_SMOOTH);
            GlStateManager.func_179084_k(); // disableBlend
            GlStateManager.func_179098_w(); // enableTexture2D
            GlStateManager.func_179121_F(); // popMatrix
        } else {
            const shouldRemove = () => {
                if (!theSlot || slots.indexOf(theSlot) < 5) return true;
                const slotIndex = slotIndexField.get(theSlot);
                if (slotIndex === bindingSlot) return true;
                const newBind = new Bind(slotIndex, bindingSlot);
                if (newBind.slot0 > 8 || ConfigObject.hasBind(newBind)) return true;
                binds.push(newBind);
                return false;
            }

            if (shouldRemove()) {
                removeBind(bindingSlot);
            }
            bindingSlot = null;
            save();
        }
        
        return;
    }

    const drawn = new Set();

    GlStateManager.func_179094_E(); // pushMatrix
    GlStateManager.func_179090_x(); // disableTexture2D
    GlStateManager.func_179147_l(); // enableBlend
    GL11.glEnable(GL11.GL_LINE_SMOOTH);
    for (let bind of binds) {
        let slot0i = bind.slot0;
        let slot1i = bind.slot1;
        if (slot0i < 9) slot0i += 36;
        if (slot1i < 9) slot1i += 36;
        else if (slot1i > 35) slot1i = -slot1i + 44;
        let slot0 = slots[slot0i];
        let slot1 = slots[slot1i];
        let x0 = slot0.field_75223_e;
        let y0 = slot0.field_75221_f;
        let x1 = slot1.field_75223_e;
        let y1 = slot1.field_75221_f;
        x0 += guiLeft;
        y0 += guiTop;
        x1 += guiLeft;
        y1 += guiTop;

        if (!drawn.has(slot0i)) {
            drawn.add(slot0i);
            drawSlot(x0, y0, width);
        }
        if (!drawn.has(slot1i)) {
            drawn.add(slot1i);
            drawSlot(x1, y1, width);
        }
        let border = !borderDrawn && (theSlot === slot0 || theSlot === slot1);
        if (border) {
            let half = width * 0.5;
            GlStateManager.func_179097_i(); // disableDepth
            drawBorder(x0, y0, width);
            drawBorder(x1, y1, width);
            Renderer.drawLine(BORDER_COLOR, x0 + half, y0 + half, x1 + half, y1 + half, 1);
            GlStateManager.func_179126_j(); // enableDepth
            borderDrawn = true;
        }
    }
    GL11.glDisable(GL11.GL_LINE_SMOOTH);
    GlStateManager.func_179084_k(); // disableBlend
    GlStateManager.func_179098_w(); // enableTexture2D
    GlStateManager.func_179121_F(); // popMatrix
}).unregister();

function removeBind(slotIndex) {
    const newbinds = ConfigObject.binds.filter(bind => bind.slot0 !== slotIndex && bind.slot1 !== slotIndex)
    ConfigObject.binds = newbinds;
}

function drawSlot(x, y, width) {
    Renderer.drawRect(BOX_COLOR, x, y, width, width);
}

function drawBorder(x, y, width) {
    GL11.glLineWidth(2);
    Renderer.drawShape(BORDER_COLOR, [[x, y], [x, y+width], [x+width, y+width], [x+width, y]], GL11.GL_LINE_LOOP);
    GL11.glLineWidth(2);
}

function clickSlotButton(screen, slot, button) {
    if (!(screen instanceof GuiContainer)) return;
    const x = slot.field_75223_e + 8 + guiLeftField.get(screen);
    const y = slot.field_75221_f + 8 + guiTopField.get(screen);
    const keyDownBuffer =  keyDownBufferField.get(null);
    const wasShiftDown = Keyboard.isKeyDown(42);
    keyDownBuffer.put(42, 0);
    mouseClickedMethod.invoke(screen, new JavaInt(x), new JavaInt(y), new JavaInt(button));
    mouseReleasedMethod.invoke(screen, new JavaInt(x), new JavaInt(y), new JavaInt(button));
    keyDownBuffer.put(42, wasShiftDown ? 1 : 0);
}

const BOX_COLOR = rgbaToArgb(255, 125, 125, 125);//r
const BORDER_COLOR = rgbaToArgb(255, 0, 0, 255);//customisble when??

function rgbaToArgb(r, g, b, a) {
    return (a << 24) | (r << 16) | (g << 8) | b | 0;
}

mainSlotBinding.register();
slotBindingRenderer.register();
slotBinder.register();

//has errors but will work