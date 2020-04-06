import { Component } from '@angular/core';
import { interval } from 'rxjs';
import { takeWhile, tap, finalize } from 'rxjs/operators';

@Component({
    selector: 'app-fridge',
    templateUrl: './fridge.component.html',
    styleUrls: ['./fridge.component.scss']
})
export class FridgeComponent {
    private angle = 0;

    private isOpening = false;
    private isClosing = false;

    public open(): void {
        if (this.isClosing) {
            return;
        }

        this.isOpening = true;
        interval(15).pipe(
            takeWhile(() => this.angle < 180),
            tap(() => this.angle++),
            finalize(() => this.isOpening = false)
        ).subscribe();
    }

    public close(): void {
        if (this.isOpening){
            return;
        }

        this.isClosing = true;
        interval(15).pipe(
            takeWhile(() => this.angle > 0),
            tap(() => this.angle--),
            finalize(() => this.isClosing = false)
        ).subscribe();
    }

    public getStyle() {
        return {
            '--rotation-angle': `${this.angle}deg`,
        };
    }
}
