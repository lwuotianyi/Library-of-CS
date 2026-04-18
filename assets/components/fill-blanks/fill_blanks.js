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

        const saved = await loadValue(this.container.id);
        if (saved) {
            this.inputs.forEach((input, i) => {
                input.value = saved[i] || "";
            });
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
                }
                await saveValue(this.container.id, this.getValue());
            });

            input.addEventListener("keydown", async (e) => {
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
                await saveValue(this.container.id, this.getValue());
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

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("Kruskal1", 1);

        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            db.createObjectStore("answers");
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function saveValue(key, value) {
    const db = await openDB();
    const tx = db.transaction("answers", "readwrite");
    const store = tx.objectStore("answers");

    store.put(value, key);

    return tx.complete;
}

async function loadValue(key) {
    const db = await openDB();
    const tx = db.transaction("answers", "readonly");
    const store = tx.objectStore("answers");

    return new Promise((resolve) => {
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result);
    });
}

document.querySelectorAll(".fill-blanks").forEach(el => {
    new FillBlanks(el, el.dataset.target);
});