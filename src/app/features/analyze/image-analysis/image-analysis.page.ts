import { AfterViewInit, Component, effect, ElementRef, inject, NgZone, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PopoverController, IonToggle, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonItem, IonLabel, IonInput, IonButton, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import OpenSeadragon from 'openseadragon';
import { ActivatedRoute } from '@angular/router';
import { ImageService } from '../../shared/services/image.service';
import { ImageInfo } from 'src/app/core/models/image.model';
import { NotificationService } from 'src/app/core/services/notifications/notification.service';
import { ImageDetailsComponent } from '../image-details/image-details.component';
import { Pin } from 'src/app/core/models/image.model';
import { AuthService } from 'src/app/core/auth/auth.service';
import { PinPopoverComponent } from '../pin-popover/pin-popover.component';

@Component({
  selector: 'app-image-analysis',
  templateUrl: './image-analysis.page.html',
  styleUrls: ['./image-analysis.page.scss'],
  standalone: true,
  imports: [ImageDetailsComponent, CommonModule, FormsModule, IonToggle, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonItem, IonLabel, IonInput, IonButton, IonGrid, IonRow, IonCol, ReactiveFormsModule],
})
export class ImageAnalysisPage implements AfterViewInit, OnInit, OnDestroy {
  // Services
  private route = inject(ActivatedRoute);
  private imageService = inject(ImageService);
  private notifications = inject(NotificationService);
  private ngZone = inject(NgZone);
  private authService = inject(AuthService);
  private popoverController = inject(PopoverController);

  // Signals
  imageId = signal<string | null>(null);
  imageInfo = signal<ImageInfo | null>(null);
  private viewerReady = signal(false);
  dropPinMode = signal(false);
  imageLoaded = signal(false);
  showingPins = signal(false);
  pinsLoaded = false;

  // OpenSeaDragon 
  private viewer: OpenSeadragon.Viewer | null = null;
  @ViewChild('osdViewer', { static: false }) viewerElement!: ElementRef<HTMLDivElement>;

  // Data
  private pinMap = new Map<string, Pin>();
  private pinIdSequence = 0;

  // Form Controls
  searchImageId = new FormControl<string>('');

  constructor() {

    effect(() => {
      const id = this.imageId();
      if (id) {
        this.retrieveImage();
      }
    });

    effect(() => {
      const info = this.imageInfo();
      const ready = this.viewerReady();

      if (ready && info?.url) {
        this.initViewer(info.url);
      }
    });

    effect(() => {
      const showingPins = this.showingPins();
      if (showingPins) {
        if (!this.pinsLoaded) {
          this.loadPins();
          this.pinsLoaded = true;
        }
        this.showAllPins();
      } else {
        this.hideAllPins();
      }
    });
  }

  ngAfterViewInit() {
    this.viewerReady.set(true);
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.imageId.set(id);
      }
    });
  }

  async retrieveImage() {
    const id = this.imageId()?.trim();
    if (!id) return;

    this.imageService.get(id).subscribe({
      next: async (result) => {
        this.imageInfo.set(result.image);
      },
      error: async (err) => {
        await this.notifications.showError(err.error?.message || 'Could not fetch the image');
      }
    });
  }

  addPin(point: OpenSeadragon.Point | undefined, zoom: number, htmlId: string, sequenceId: number, text: string, isPublic: boolean = true, isTemporal: boolean = false, email: string = this.getCurrentUserEmail(), persisted: boolean = false) {
    if (!point) return;

    const myNewPin = this.createNativePin(htmlId);
    this.viewer?.addOverlay({
      element: myNewPin,
      location: point
    });
    const pinData = this.createPinData(htmlId, point.x, point.y, zoom, sequenceId, text, isPublic, isTemporal, email, persisted);
    this.pinMap.set(htmlId, pinData);
    this.disableDropPinMode();
  }

  loadPins() {
    const id = this.imageId();
    if (!id) return;

    this.imageService.getPins(id).subscribe({
      next: (response) => {
        response.pins.forEach(pin => {
          this.addPin(this.createOpenSeadragonPoint(pin.x, pin.y), pin.zoom, pin.id, pin.sequence_id, pin.text, pin.isPublic, pin.isTemporal, pin.email, true);
          this.setNewPinIdSequence(pin.sequence_id);
        });
      }
    });
  }

  showPinsToggle() {
    this.showingPins.set(!this.showingPins());
  }

  private hideAllPins() {
    if (!this.viewer) return;

    this.overlays.forEach(o => {
      o.style.display = 'none';
    });
  }

  private showAllPins() {
    if (!this.viewer) return;

    this.overlays.forEach(o => {
      o.style.display = 'block';
    });
  }

  private setNewPinIdSequence(seq: number) {
    if (seq > this.pinIdSequence) {
      this.pinIdSequence = seq;
    }
  }

  private incrementIdSequence() {
    this.pinIdSequence += 1;
  }

  private generatePindId(): string {
    this.incrementIdSequence();
    return `pin-id-${this.pinIdSequence}`;
  }

  private createPinData(id: string, x: number, y: number, zoom: number, sequenceId: number, text: string, isPublic: boolean, isTemporal: boolean, email: string, persisted: boolean): Pin {
    return {
      isPublic,
      isTemporal,
      email,
      id,
      sequence_id: sequenceId,
      x,
      y,
      zoom,
      text,
      persisted,
    };
  }

  private createOpenSeadragonPoint(x: number, y: number): OpenSeadragon.Point {
    return new OpenSeadragon.Point(x, y);
  }

  private getCurrentUserEmail(): string {
    const user = this.authService.user();
    return user?.username || '';
  }

  enableDropPinMode() {
    this.showingPins.set(true);
    setTimeout(() => {
      this.dropPinMode.set(true);      
    }, 500); // Delay in milliseconds
  }

  disableDropPinMode() {
    this.dropPinMode.set(false);
  }

  initViewer(url: string) {
    if (!url || !this.viewerElement?.nativeElement) return;

    if (this.viewer) {
      this.viewer.destroy();
      this.viewer = null;
    }

    this.viewer = this.ngZone.runOutsideAngular(() =>
      OpenSeadragon({
        element: this.viewerElement.nativeElement,
        prefixUrl: 'assets/openseadragon/images/',
        tileSources: { type: 'image', url },
        showNavigator: true,
        animationTime: 0.9,
        blendTime: 0.1,
        constrainDuringPan: true,
        maxZoomPixelRatio: 2,

        gestureSettingsMouse: {
          clickToZoom: false,
          dblClickToZoom: true,
        },
      })
    );

    this.viewer.addHandler("canvas-click", (event: OpenSeadragon.CanvasClickEvent) => {
      if (this.dropPinMode()) {
        if (!event.quick) return; // ignore dragging release.
        const viewportPoint = this.viewer?.viewport.pointFromPixel(event.position);
        const zoom = this.viewer?.viewport.getZoom();
        this.addPin(viewportPoint, zoom ?? 0, this.generatePindId(), this.pinIdSequence, '', false, false, this.getCurrentUserEmail(), false);
      }
    });

    this.imageLoaded.set(true);
  }

  ngOnDestroy() {
    if (this.viewer) {
      this.viewer.destroy();
      this.viewer = null;
    }
  }

  searchImage() {
    const id = this.searchImageId.value?.trim();
    if (id) {
      this.imageId.set(id);
    }
  }

  overlays: HTMLElement[] = [];

  private createNativePin(id: string) {
    const wrapper = document.createElement('div');
    wrapper.id = id;
    wrapper.innerHTML = `<img src="assets/orange_pin.png" width="20" height="20" style="object-fit: contain;" />`;
    wrapper.className = "pin-overlay";
    const tracker = this.createMouseTracker(wrapper);
    tracker.setTracking(true);
    this.overlays.push(wrapper);
    return wrapper;
  }

  private createMouseTracker(wrapper: HTMLElement): OpenSeadragon.MouseTracker {
    return new OpenSeadragon.MouseTracker({
      element: wrapper,

      clickHandler: (event) => {
        const id = wrapper.id;
        const data = this.pinMap.get(id);
        if (data) {
          this.moveToPin(data);
        }
      },
      dblClickHandler: (event) => {
        this.openPinDialog(wrapper.id, event.originalEvent);
      },
    });
  }

  private openPinDialog(pinId: string, event: Event) {
    const pinData = this.pinMap.get(pinId);
    if (!pinData) return;

    this.presentPopover(event, pinData);
  }

  async presentPopover(e: Event, pinData: Pin) {
    const popover = await this.popoverController.create({
      component: PinPopoverComponent,
      event: e,
      componentProps: {
        pinData: pinData
      },
    });

    await popover.present();

    const { data, role } = await popover.onDidDismiss();
    if (role === 'save') {
      this.persistPin(data.pinData);
    }
  }

  private moveToPin(data: Pin) {
    this.viewer?.viewport.panTo(this.createOpenSeadragonPoint(data.x, data.y));
    this.viewer?.viewport.zoomTo(data.zoom);
  }

  // Persist pin changes to backend
  private persistPin(pinData: Pin) {
    const id = this.imageId();
    if (!id) return;

    if (pinData.persisted) {
      if (pinData.isTemporal) {
        this.deletePin(id, pinData);
        return;
      }
      this.updatePin(id, pinData);
      return;
    }

    if (!pinData.isTemporal) {
      this.savePin(id, pinData);
    }
  }

  private updatePin(imageId: string, pinData: Pin) {
    this.imageService.updatePin(imageId, pinData).subscribe({
      next: (response) => {
        this.pinMap.set(pinData.id, pinData);
        this.notifications.showSuccess('Pin updated successfully');
      },
      error: (err) => {
        this.notifications.showError(err?.error?.message || 'Failed to update pin');
      }
    });
  }

  private deletePin(imageId: string, pinData: Pin) {
    this.imageService.deletePin(imageId, pinData.id).subscribe({
      next: (response) => {
        this.pinMap.set(pinData.id, pinData);
        this.notifications.showSuccess('Pin deleted successfully');
      },
      error: (err) => {
        this.notifications.showError(err?.error?.message || 'Failed to delete pin');
      }
    });
  }

  private savePin(imageId: string, pinData: Pin) {
    this.imageService.addPin(imageId, pinData).subscribe({
      next: (response) => {
        const oldHtmlId = pinData.id;
        const serverPin = response.pin;

        // Remap local html-id → server UUID
        pinData.id = serverPin.id;
        pinData.persisted = true;
        this.pinMap.delete(oldHtmlId);
        this.pinMap.set(serverPin.id, pinData);

        // Update the HTML element id so the mouse tracker keeps working
        const el = document.getElementById(oldHtmlId);
        if (el) el.id = serverPin.id;

        this.notifications.showSuccess('Pin saved successfully');
      },
      error: (err) => {
        this.notifications.showError(err?.error?.message || 'Failed to save pin');
      }
    });
  }
}
