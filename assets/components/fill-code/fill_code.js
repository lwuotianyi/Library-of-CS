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

        const savedValue = await loadValue(this.input.id);
        const savedState = await loadState(this.input.id);
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