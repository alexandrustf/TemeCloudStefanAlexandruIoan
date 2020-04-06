import { Component, ViewChild, OnInit } from '@angular/core';
import { SwitchComponent } from './components/switch/switch.component';
import { interval, timer } from 'rxjs';
import { FridgeComponent } from './components/fridge/fridge.component';
import { DoorComponent } from './components/door/door.component';
import { TvComponent } from './components/tv/tv.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    @ViewChild(SwitchComponent, {
        static: true
    })
    private lights: SwitchComponent;

    @ViewChild(FridgeComponent, {
        static: true
    })
    private fridge: FridgeComponent;

    @ViewChild(DoorComponent, {
        static: true
    })
    private door: DoorComponent;

    @ViewChild(TvComponent, {
        static: true
    })
    private tv: TvComponent;

    public lightsOff = true;

    public ngOnInit(): void {
        this.lightsOff = false;
        this.lights.turnOn();
        setTimeout(() => {
        this.fridge.open();
        this.door.open();
        this.tv.open();
        }, 100);

        timer(2000).subscribe(() => {
            // this.lights.turnOff();
            this.fridge.close();
            this.door.close();
            this.tv.close();
            // this.lightsOff = true;
        });
    }
}
