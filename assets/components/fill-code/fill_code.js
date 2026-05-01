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

        this.attachEvents();

        const savedValue = await idb.loadValue(this.container.id, "value", 3);
        const savedState = await idb.loadValue(this.container.id, "state", 3);
        if (savedValue) {
            this.input.value = savedValue.value();
        }
        if (savedState) {
            this.input.dataset.state = savedState.value();
        }
    }

    attachEvents() {
        this.input.addEventListener("input", async() => {
            if (this.input.maxLength === this.input.value.length) {

            }
        });
    }

    getValue() {
        return this.input.value();
    }

    matches() {
        return this.target === this.getValue();
    }
}

document.querySelectorAll(".fill-code").forEach(el => {
    new FillCode(el, el.dataset.target);
});