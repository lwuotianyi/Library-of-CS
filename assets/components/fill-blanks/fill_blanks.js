class FillBlanks {
    constructor(container, target= null) {
        this.container = container;
        this.count = target.length;
        this.target = target;
        this.inputs = [];

        this.init();
    }

    init() {
        this.container.innerHTML = "";

        for(let i = 0; i < this.count; i++){
            const input = document.createElement("input");
            input.type = "text";
            input.maxLength = 1;
            input.className = "fill-blanks";

            this.container.appendChild(input);
            this.inputs.push(input);
        }
        this.attachEvents();
    }

    attachEvents() {
        this.inputs.forEach((input, index) => {
            input.addEventListener("input", () => {
                if (input.value && index < this.inputs.length - 1) {
                    this.inputs[index + 1].focus();
                }
                if(index === this.inputs.length-1){
                    if (this.matches()) {
                        this.container.dataset.state = "correct";
                    } else {
                        this.container.dataset.state = "incorrect";
                    }
                }
            });

            input.addEventListener("keydown", (e) => {
                if (e.key === "Backspace") {
                    this.container.dataset.state = "unfilled";
                    if(!input.value && index > 0) {
                        this.container.dataset.state = "unfilled";
                        const prev = this.inputs[index - 1];
                        prev.focus();
                        const len = prev.value.length;
                        prev.setSelectionRange(len, len);
                    }
                }
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