import { Component, ElementRef, OnInit, ViewChild, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonGrid, IonRow, IonCol,
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
  IonItem, IonLabel, IonList, IonNote,
  IonIcon, IonButton, IonSpinner, IonBadge, IonText,
  IonInput, IonTextarea,
  IonAccordion, IonAccordionGroup,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  cloudUploadOutline, documentOutline, closeCircleOutline, extensionPuzzleOutline,
} from 'ionicons/icons';
import { PluginInstallService } from './plugin-install.service';
import { NotificationService } from 'src/app/core/services/notifications/notification.service';
import {
  PluginInstallJob, PluginInstallStatus, PluginMetadata
} from './plugin-install.service.types';

@Component({
  selector: 'app-plugins',
  templateUrl: './plugins.page.html',
  styleUrls: ['./plugins.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonGrid, IonRow, IonCol,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonItem, IonLabel, IonList, IonNote,
    IonIcon, IonButton, IonSpinner, IonBadge, IonText,
    IonInput, IonTextarea,
    IonAccordion, IonAccordionGroup,
    DatePipe,
  ],
})
export class PluginsPage implements OnInit {
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  private installService = inject(PluginInstallService);
  private notifications = inject(NotificationService);

  protected readonly PluginInstallStatus = PluginInstallStatus;

  selectedFile  = signal<File | null>(null);
  isDragOver    = signal(false);
  isInstalling  = signal(false);
  installedPlugin = signal<PluginMetadata | null>(null);

  installHistory   = signal<PluginInstallJob[]>([]);
  isLoadingHistory = signal(false);

  constructor() {
    addIcons({ cloudUploadOutline, documentOutline, closeCircleOutline, extensionPuzzleOutline });
  }

  ngOnInit(): void {
    this.loadHistory();
  }

  // ── Drop zone ───────────────────────────────────────────────────────────────

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(true);
  }

  onDragLeave(): void {
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(false);
    const file = event.dataTransfer?.files[0];
    if (file) this.setFile(file);
  }

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.setFile(file);
  }

  clearFile(event: Event): void {
    event.stopPropagation();
    this.selectedFile.set(null);
    this.installedPlugin.set(null);
    this.fileInputRef.nativeElement.value = '';
  }

  private setFile(file: File): void {
    if (!file.name.endsWith('.zip')) {
      this.notifications.showError('Only .zip plugin files are supported.');
      return;
    }
    this.selectedFile.set(file);
    this.installedPlugin.set(null);
  }

  // ── Install ─────────────────────────────────────────────────────────────────

  onInstall(): void {
    const file = this.selectedFile();
    if (!file) return;

    this.isInstalling.set(true);
    this.installService.install(file).subscribe({
      next: response => {
        this.installedPlugin.set(response.plugin);
        this.isInstalling.set(false);
        this.notifications.showSuccess(`Plugin "${response.plugin.name}" installed successfully.`);
        this.loadHistory();
      },
      error: err => {
        this.notifications.showError(err?.error?.message ?? 'Installation failed. Please try again.');
        this.isInstalling.set(false);
      },
    });
  }

  onCancel(): void {
    this.selectedFile.set(null);
    this.installedPlugin.set(null);
    this.fileInputRef.nativeElement.value = '';
  }

  // ── History ─────────────────────────────────────────────────────────────────

  loadHistory(): void {
    this.isLoadingHistory.set(true);
    this.installService.getInstallHistory().subscribe({
      next: response => {
        this.installHistory.set(response.jobs);
        this.isLoadingHistory.set(false);
      },
      error: () => this.isLoadingHistory.set(false),
    });
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  objectEntries(obj: Record<string, string>): [string, string][] {
    return Object.entries(obj);
  }

  formatArgs(args?: Record<string, string>): string {
    if (!args || Object.keys(args).length === 0) return '';
    return JSON.stringify(args, null, 2);
  }

  getStatusColor(status: PluginInstallStatus): string {
    const map: Record<PluginInstallStatus, string> = {
      [PluginInstallStatus.COMPLETED]: 'success',
      [PluginInstallStatus.RUNNING]:   'warning',
      [PluginInstallStatus.PENDING]:   'medium',
      [PluginInstallStatus.FAILED]:    'danger',
    };
    return map[status] ?? 'medium';
  }
}
