import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Person } from "../entity/Person";
import { Antenna } from "../entity/Antenna";

@Injectable({
        providedIn: 'root'
    })

    export class ZoneService {
        private readonly _API = 'https://zonescalculatorback-b0b6dxb6dmbtb4gy.canadacentral-01.azurewebsites.net/zones/calculate';

        constructor(private http: HttpClient) {

        }

        calculateZone(person: Person, antenna: Antenna) {
            const body = {
                antenna: {
                    power: antenna.antennaPower,
                    gain: antenna.antennaGain,
                    height: antenna.antennaHeight
                },
                person: {
                    height: person.personHeight
                }
            };
            return this.http.post(this._API, body);
        }
        
    }