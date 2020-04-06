import { Component } from '@angular/core';

@Component({
    selector: 'app-door',
    templateUrl: './door.component.html',
    styleUrls: ['./door.component.scss']
})
export class DoorComponent {
    public isOpen = false;

    public open() {
        this.isOpen = true;
    }

    public close() {
        this.isOpen = false;
    }
}
