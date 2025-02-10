import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ZoneService } from '../service/zoneService';

@Component({
  selector: 'app-grafic',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule,CommonModule ],
  templateUrl: './grafic.component.html',
  styleUrl: './grafic.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraficComponent {
  zoneForm: FormGroup;
  
  // Radios en ambas perspectivas
  complianceZoneRadius: number = 0;
  occupationalZoneRadius: number = 0;
  horizontalComplianceZoneRadius: number = 0;
  horizontalOccupationalZoneRadius: number = 0;
  
  // Variables que se mostrarán (se alternan con el botón)
  displayedComplianceZoneRadius: number = 0;
  displayedOccupationalZoneRadius: number = 0;
  
  scaleFactor: number = 1;
  isPlanView: boolean = true; // Estado de la vista

  isInfoCardVisible: boolean = false;

  constructor(private fb: FormBuilder, private zoneService: ZoneService, private cd: ChangeDetectorRef) {
    this.zoneForm = this.fb.group({
      antennaPower: ['', Validators.required],
      antennaGain: ['', Validators.required],
      antennaHeight: ['', Validators.required],
      antennaFrequency: ['', [Validators.required, Validators.min(0.003), Validators.max(300000)]],
      personHeight: [2, Validators.required]
    });
  }
  toggleInfoCard() {
    this.isInfoCardVisible = !this.isInfoCardVisible;
  }

  onSubmit() {
    if (this.zoneForm.valid) {
      const antenna = {
        antennaPower: this.zoneForm.value.antennaPower,
        antennaGain: this.zoneForm.value.antennaGain,
        antennaHeight: this.zoneForm.value.antennaHeight,
        antennaFrequency: this.zoneForm.value.antennaFrequency
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

    // Asignar valores iniciales según la vista por defecto (planta)
    this.displayedComplianceZoneRadius = this.complianceZoneRadius;
    this.displayedOccupationalZoneRadius = this.occupationalZoneRadius;
  }

  calculateScaleFactor() {
    const maxRadius = Math.max(
      this.displayedComplianceZoneRadius,
      this.displayedOccupationalZoneRadius
    );

    const maxSvgSize = 400; 
    this.scaleFactor = maxRadius > 0 ? maxSvgSize / maxRadius : 1;
  }

  toggleView() {
    this.isPlanView = !this.isPlanView;

    if (this.isPlanView) {
      // Cambiar a vista en planta
      this.displayedComplianceZoneRadius = this.complianceZoneRadius;
      this.displayedOccupationalZoneRadius = this.occupationalZoneRadius;
    } else {
      // Cambiar a vista horizontal (desde la antena)
      this.displayedComplianceZoneRadius = this.horizontalComplianceZoneRadius;
      this.displayedOccupationalZoneRadius = this.horizontalOccupationalZoneRadius;
    }

    this.calculateScaleFactor();
    this.cd.detectChanges();
  }
}
