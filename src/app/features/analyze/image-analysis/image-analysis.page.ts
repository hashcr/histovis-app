import { AfterViewInit, Component, effect, ElementRef, inject, NgZone, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonItem, IonLabel, IonInput, IonButton, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import OpenSeadragon from 'openseadragon';
import { ActivatedRoute } from '@angular/router';
import { ImageService } from '../../shared/services/image.service';
import { ImageInfo } from 'src/app/core/models/image.model';
import { NotificationService } from 'src/app/core/services/notifications/notification.service';
import { ImageDetailsComponent } from '../image-details/image-details.component';
@Component({
  selector: 'app-image-analysis',
  templateUrl: './image-analysis.page.html',
  styleUrls: ['./image-analysis.page.scss'],
  standalone: true,
  imports: [ImageDetailsComponent, CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonItem, IonLabel, IonInput, IonButton, IonGrid, IonRow, IonCol ],
})
export class ImageAnalysisPage implements AfterViewInit, OnInit, OnDestroy {
  // Services
  private route = inject(ActivatedRoute);
  private imageService = inject(ImageService);
  private notifications = inject(NotificationService);
  private ngZone = inject(NgZone);

  // Signals
  imageId = signal<string | null>(null);
  imageInfo = signal<ImageInfo | null>(null);
  private viewerReady = signal(false);

  // OpenSeaDragon 
  private viewer: OpenSeadragon.Viewer | null = null;
  @ViewChild('osdViewer', { static: false }) viewerElement!: ElementRef<HTMLDivElement>;

  constructor() {

    effect(() => {
      const info = this.imageInfo();
      const ready = this.viewerReady();

      if (ready && info?.url) {
        this.initViewer(info.url);
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
        this.retrieveImage();
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
      })
    );
  }

  ngOnDestroy() {
    if (this.viewer) {
      this.viewer.destroy();
      this.viewer = null;
    }
  }
}
