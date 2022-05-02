import { v4 as uuidv4 } from 'uuid';

export class Toast {
    uuid
    title
    text

    constructor(title, text) {
        this.title = title
        this.text = text
        this.uuid = uuidv4()
    }
}