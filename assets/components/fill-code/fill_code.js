import * as idb from "../inddb/inddb.js";

class FillCode {
    constructor(input, target = null) {
        this.input = input;
        this.target = target;
        this.length = target.length;

        this.init();
    }

    async init(){
        this.input.innerHTML = "";
        this.input.type = "text";
        this.input.maxLength = this.length;
        this.input.className = "fill-code";
        this.input.autocapitalize = "false";
        this.input.dataset.state = "unfilled";
        this.input.size = this.length;

        this.attachEvents();

        const savedValue = await idb.loadValue(this.input.id, "value", 3);
        const savedState = await idb.loadValue(this.input.id, "state", 3);
        if (savedValue) {
            this.input.value = savedValue;
        }
        if (savedState) {
            this.input.dataset.state = savedState;
        }
    }

    attachEvents() {
        this.input.addEventListener("input", async() => {
            if (this.input.maxLength === this.getValue().length) {
                if (this.matches()) {
                    this.input.dataset.state = "correct";
                } else {
                    this.input.dataset.state = "incorrect";
                }
                await idb.saveValue(this.input.id, this.input.dataset.state, "state", 3);
            }
            await idb.saveValue(this.input.id, this.getValue(), "value", 3);
        });
        this.input.addEventListener("keydown", async (e) => {
            if (e.key === "Backspace") {
                this.input.dataset.state = "unfilled";
                await idb.saveValue(this.input.id, this.input.dataset.state, "state", 3);
                await idb.saveValue(this.input.id, this.getValue(), "value", 3);
            }
        });
    }

    getValue() {
        return this.input.value;
    }

    matches() {
        return this.target === this.getValue();
    }
}

hljs.highlightAll()

document.querySelectorAll("pre code").forEach(block => {
    block.innerHTML = block.innerHTML.replace(
        /__FILL_(.*?)_(.*?)__/g,
        (_, target, id) => {
            return `<input class="fill-code" id="${id}" data-target="${target}" />`;
        }
    );
});

document.querySelectorAll(".fill-code").forEach(el => {
    new FillCode(el, el.dataset.target);
});