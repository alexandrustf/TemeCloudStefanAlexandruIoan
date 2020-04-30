import { Component, AfterViewInit, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as atlas from 'azure-maps-control';
import * as atlasService from 'azure-maps-rest';
import { debounceTime, tap, take } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { Coordinate, GeoService } from './geo.service';

class PersonDetails {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
}

@Component({
    selector: 'app-delivery-form',
    templateUrl: './delivery-form.component.html',
    styleUrls: ['./delivery-form.component.scss']
})
export class DeliveryFormComponent implements OnInit, AfterViewInit {
    private map: atlas.Map;
    private pickupCoordinates: Coordinate;
    private deliveryCoordinates: Coordinate;
    private dataSource = new atlas.source.DataSource();

    public loading = false;
    public pickupAddressChannel: Subject<string> = new Subject<string>();
    public deliveryAddressChannel: Subject<string> = new Subject<string>();

    public sender: PersonDetails = new PersonDetails();
    public receiver: PersonDetails = new PersonDetails();


    private subscriptionKeyCredential = new atlasService.SubscriptionKeyCredential('i_1GFQ38GZ7hOzeRh_ZiiArkoY8Hel0o9YvelK7Zc5M');
    private pipeline = atlasService.MapsURL.newPipeline(this.subscriptionKeyCredential);
    private routeURL = new atlasService.RouteURL(this.pipeline);

    public constructor(private http: HttpClient, private geo: GeoService) {
    }

    public ngOnInit(): void {
        this.pickupAddressChannel.pipe(
            tap(() => this.loading = true),
            debounceTime(500),
            tap(x => this.updatePickupCoordinates(x))
        ).subscribe();
        this.deliveryAddressChannel.pipe(
            tap(() => this.loading = true),
            debounceTime(500),
            tap(x => this.updateDeliveryCoordinates(x))
        ).subscribe();
    }

    public ngAfterViewInit(): void {
        this.map = new atlas.Map('map', {
            center: [-122.33, 47.6],
            zoom: 12,
            language: 'en-US',
            authOptions: {
                authType: atlas.AuthenticationType.subscriptionKey,
                subscriptionKey: 'i_1GFQ38GZ7hOzeRh_ZiiArkoY8Hel0o9YvelK7Zc5M'
            }
        });
        this.map.events.add('ready', () => {
            this.map.sources.add(this.dataSource);
            this.map.layers.add(new atlas.layer.LineLayer(this.dataSource, null, {
                strokeColor: '#2272B9',
                strokeWidth: 5,
                lineJoin: 'round',
                lineCap: 'round'
            }), 'labels');

            this.map.layers.add(new atlas.layer.SymbolLayer(this.dataSource, null, {
                iconOptions: {
                    image: ['get', 'icon'],
                    allowOverlap: true
                },
                textOptions: {
                    textField: ['get', 'title'],
                    offset: [0, 1.2]
                },
                filter: ['any', ['==', ['geometry-type'], 'Point'], ['==', ['geometry-type'], 'MultiPoint']]
            }));
        });
    }

    public confirm(): void {
        this.http.post(`http://delivery-server.uksouth.azurecontainer.io/packages`, {
            sender: {
                lat: this.pickupCoordinates.latitude,
                lng: this.pickupCoordinates.longitude,
                phone: this.sender.phoneNumber,
                firstName: this.sender.firstName,
                lastName: this.sender.lastName,
                address: this.sender.address
            },
            receiver: {
                lat: this.deliveryCoordinates.latitude,
                lng: this.deliveryCoordinates.longitude,
                phone: this.receiver.phoneNumber,
                firstName: this.receiver.firstName,
                lastName: this.receiver.lastName,
                address: this.receiver.address
            },
            date: new Date()
        }).subscribe(() => {
            alert('Package request has been sent!');
        });
    }

    private updatePickupCoordinates(address: string): void {
        this.geo.addressToGeometry(address).pipe(
            take(1),
            tap(c => this.pickupCoordinates = c),
            tap(() => this.updatePins())
        ).subscribe();
    }

    private updateDeliveryCoordinates(address: string): void {
        this.geo.addressToGeometry(address).pipe(
            take(1),
            tap(c => this.deliveryCoordinates = c),
            tap(() => this.updatePins())
        ).subscribe();
    }

    private updatePins(): void {
        let startPoint, endPoint;

        console.log(this.loading);
        this.dataSource.clear();
        if (this.pickupCoordinates) {
            console.log('Pickup is ', this.pickupCoordinates);
            startPoint = new atlas.data.Feature(
                new atlas.data.Point([this.pickupCoordinates.longitude, this.pickupCoordinates.latitude]), {
                title: 'Pickup',
                icon: 'pin-blue'
            });
            this.dataSource.add(startPoint);
        }

        if (this.deliveryCoordinates) {
            console.log('Delivery is ', this.deliveryCoordinates);
            endPoint = new atlas.data.Feature(
                new atlas.data.Point([this.deliveryCoordinates.longitude, this.deliveryCoordinates.latitude]), {
                title: 'Delivery',
                icon: 'pin-round-blue'
            });
            this.dataSource.add(endPoint);
        }

        this.loading = false;
        this.map.setCamera({
            bounds: atlas.data.BoundingBox.fromData([startPoint, endPoint]),
            padding: 80
        });

        if (!startPoint || !endPoint) {
            return;
        }

        const coordinates = [
            [startPoint.geometry.coordinates[0], startPoint.geometry.coordinates[1]],
            [endPoint.geometry.coordinates[0], endPoint.geometry.coordinates[1]]
        ];

        this.routeURL.calculateRouteDirections(atlasService.Aborter.timeout(10000), coordinates).then((directions) => {
            const data = directions.geojson.getFeatures();
            this.dataSource.add(data);
        });
    }
}
