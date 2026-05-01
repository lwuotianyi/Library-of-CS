import * as idb from "../inddb/inddb.js";

class FillBlanks {
    constructor(container, target= null) {
        this.container = container;
        this.count = target.length;
        this.target = target;
        this.inputs = [];

        this.init();
    }

    async init() {
        this.container.innerHTML = "";

        for (let i = 0; i < this.count; i++) {
            const input = document.createElement("input");
            input.type = "text";
            input.maxLength = 1;
            input.className = "fill-blanks";
            input.autocapitalize = "off";

            this.container.appendChild(input);
            this.inputs.push(input);
        }
        this.attachEvents();

        const savedValue = await idb.loadValue(this.container.id, "value", 3);
        const savedState = await idb.loadValue(this.container.id, "state", 3);
        if (savedValue) {
            this.inputs.forEach((input, i) => {
                input.value = savedValue[i] || "";
            });
        }
        if (savedState !== undefined) {
            this.container.dataset.state = savedState;
        } else {
            this.container.dataset.state ="unfilled";
        }
    }

    attachEvents() {
        this.inputs.forEach((input, index) => {
            input.addEventListener("input", async () => {
                if (input.value && index < this.inputs.length - 1) {
                    this.inputs[index + 1].focus();
                }
                if (index === this.inputs.length - 1) {
                    if (this.matches()) {
                        this.container.dataset.state = "correct";
                    } else {
                        this.container.dataset.state = "incorrect";
                    }
                    await idb.saveValue(this.container.id, this.container.dataset.state, "state", 3);
                }
                await idb.saveValue(this.container.id, this.getValue(), "value", 3);
            });

            input.addEventListener("keydown", async (e) => {
                if (e.key === "Backspace") {
                    this.container.dataset.state = "unfilled";
                    if(!input.value && index > 0) {
                        const prev = this.inputs[index - 1];
                        prev.focus();
                        const len = prev.value.length;
                        prev.setSelectionRange(len, len);
                    }
                    await idb.saveValue(this.container.id, this.container.dataset.state, "state", 3);
                }
                await idb.saveValue(this.container.id, this.getValue(), "value", 3);
            })
        })
    }

    getValue() {
        return this.inputs.map(i => i.value).join("");
    }

    matches() {
        return this.target ? this.getValue() === this.target : null;
    }
}

document.querySelectorAll(".fill-blanks").forEach(el => {
    new FillBlanks(el, el.dataset.target);
});