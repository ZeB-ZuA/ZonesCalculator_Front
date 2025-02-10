import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ZoneService } from '../service/zoneService';


@Component({
  selector: 'app-grafic',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './grafic.component.html',
  styleUrl: './grafic.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})export class GraficComponent {
  zoneForm: FormGroup;
  complianceZoneRadius: number = 0;
  occupationalZoneRadius: number = 0;
  horizontalComplianceZoneRadius: number = 0;
  horizontalOccupationalZoneRadius: number = 0;
  exclusionZoneRadius: number = 0;
  scaleFactor: number = 1;

  constructor(private fb: FormBuilder, private zoneService: ZoneService, private cd: ChangeDetectorRef) {
    this.zoneForm = this.fb.group({
      antennaPower: ['', Validators.required],
      antennaGain: ['', Validators.required],
      antennaHeight: ['', Validators.required],
      personHeight: [2, Validators.required]
    });
  }

  onSubmit() {
    if (this.zoneForm.valid) {
      const antenna = {
        antennaPower: this.zoneForm.value.antennaPower,
        antennaGain: this.zoneForm.value.antennaGain,
        antennaHeight: this.zoneForm.value.antennaHeight
      };

      const person = {
        personHeight: this.zoneForm.value.personHeight
      };

      this.zoneService.calculateZone(person, antenna).subscribe(
        (data: any) => {
          console.log("Zona calculada", data);
          this.updateZoneValues(data);
          this.calculateScaleFactor();
          this.cd.detectChanges();
        },
        error => {
          console.error("Error al calcular la zona", error);
        }
      );
    } else {
      console.warn("Formulario inválido", this.zoneForm.errors);
    }
  }

  updateZoneValues(data: any) {
    this.complianceZoneRadius = data.complianceZoneRadius;
    this.occupationalZoneRadius = data.occupationalZoneRadius;
    this.horizontalComplianceZoneRadius = data.horizontalComplianceZoneRadius;
    this.horizontalOccupationalZoneRadius = data.horizontalOccupationalZoneRadius;
    this.exclusionZoneRadius = data.horizontalOccupationalZoneRadius;
  }

  calculateScaleFactor() {
    const maxRadius = Math.max(
      this.complianceZoneRadius,
      this.occupationalZoneRadius,
      this.horizontalComplianceZoneRadius,
      this.horizontalOccupationalZoneRadius
    );

   
    const maxSvgSize = 400; 
    this.scaleFactor = maxSvgSize / maxRadius;
  }
  getMaxComplianceZoneRadius() {
    return Math.max(this.horizontalComplianceZoneRadius * this.scaleFactor, 400);
  }
}







