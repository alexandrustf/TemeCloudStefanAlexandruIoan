import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface OpenCageResult {
    geometry: { lat: number, lng: number };
}

interface OpenCageResponse {
    results: OpenCageResult[];
}

export interface Coordinate {
    longitude: number;
    latitude: number;
}

@Injectable({
    providedIn: 'root',
})
export class GeoService {
    public constructor(private http: HttpClient) {
    }

    public addressToGeometry(address: string): Observable<Coordinate> {
        const openCage = {
            uri: 'https://api.opencagedata.com/geocode/v1',
            apiKey: 'a1179a2e9db340e092be9869ac51af1e',
        };

        const params = new HttpParams()
            .append('key', openCage.apiKey)
            .append('q', `${address} Romania`);
        return this.http.get<OpenCageResponse>(`${openCage.uri}/json`, { params }).pipe(
            map((r: OpenCageResponse) => r.results.length > 0 ? r.results[0] : null),
            map((x) => x ? ({ longitude: x.geometry.lng, latitude: x.geometry.lat }) : null),
        );
    }
}
