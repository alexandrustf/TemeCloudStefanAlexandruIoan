import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FridgeComponent } from './components/fridge/fridge.component';
import { SwitchComponent } from './components/switch/switch.component';
import { MicrowaveComponent } from './components/microwave/microwave.component';
import { TvComponent } from './components/tv/tv.component';
import { DoorComponent } from './components/door/door.component';
import { RecorderComponent } from './components/recorder/recorder.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    declarations: [
        AppComponent,
        FridgeComponent,
        SwitchComponent,
        MicrowaveComponent,
        TvComponent,
        DoorComponent,
        RecorderComponent
    ],
    imports: [BrowserModule, AppRoutingModule, HttpClientModule],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
