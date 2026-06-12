import { Component, ElementRef, OnDestroy, OnInit, ViewChild, computed, effect, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
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
import { interval, Subscription } from 'rxjs';
import { PluginInstallService } from './plugin-install.service';
import { PluginService } from 'src/app/features/analyze/shared/services/plugin.service';
import { NotificationService } from 'src/app/core/services/notifications/notification.service';
import { validatePluginZip } from 'src/app/core/utils/plugin-zip.utils';
import { Plugin, PluginStatus } from 'src/app/core/models/analysis.model';
import { PluginMetadata } from './plugin-install.service.types';

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
    ReactiveFormsModule,
  ],
})
export class PluginsPage implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  private installService = inject(PluginInstallService);
  private pluginService  = inject(PluginService);
  private notifications  = inject(NotificationService);
  private pollSub?: Subscription;

  selectedFile    = signal<File | null>(null);
  isDragOver      = signal(false);
  isInstalling    = signal(false);
  manifestPreview = signal<PluginMetadata | null>(null);
  installedPlugin = signal<PluginMetadata | null>(null);

  pluginDisplay = computed(() => this.manifestPreview() ?? this.installedPlugin());

  // Readonly form controls — updated via effect when pluginDisplay changes
  nameControl        = new FormControl('');
  codeControl        = new FormControl('');
  descriptionControl = new FormControl('');
  queueControl       = new FormControl('');
  topicControl       = new FormControl('');
  exampleArgsControl = new FormControl('');
  readmeControl      = new FormControl('');

  allPlugins       = signal<Plugin[]>([]);
  isLoadingPlugins = signal(false);

  constructor() {
    addIcons({ cloudUploadOutline, documentOutline, closeCircleOutline, extensionPuzzleOutline });

    effect(() => {
      const plugin = this.pluginDisplay();
      this.nameControl.setValue(plugin?.name ?? '');
      this.codeControl.setValue(plugin?.code ?? '');
      this.descriptionControl.setValue(plugin?.description ?? '');
      this.queueControl.setValue(plugin?.queue ?? '');
      this.topicControl.setValue(plugin?.topic ?? '');
      this.exampleArgsControl.setValue(plugin ? this.formatArgs(plugin.exampleArgs) : '');
      this.readmeControl.setValue(plugin?.readme ?? '');
    });
  }

  ngOnInit(): void {
    this.loadAllPlugins();
    this.pollSub = interval(10000).subscribe(() => this.loadAllPlugins());
  }

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
  }

  loadAllPlugins(): void {
    this.isLoadingPlugins.set(true);
    this.pluginService.getAll().subscribe({
      next: response => {
        this.allPlugins.set(response.plugins);
        this.isLoadingPlugins.set(false);
      },
      error: () => this.isLoadingPlugins.set(false),
    });
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
    this.manifestPreview.set(null);
    this.installedPlugin.set(null);
    this.fileInputRef.nativeElement.value = '';
  }

  private async setFile(file: File): Promise<void> {
    if (!file.name.endsWith('.zip')) {
      this.notifications.showError('Only .zip plugin files are supported.');
      return;
    }

    try {
      const result = await validatePluginZip(file);
      if (!result.valid) {
        this.notifications.showError(result.error!);
        return;
      }
      this.selectedFile.set(file);
      this.manifestPreview.set(result.manifest as unknown as PluginMetadata);
      this.installedPlugin.set(null);
    } catch {
      this.notifications.showError('Failed to read the zip file. Please try again.');
    }
  }

  // ── Install ─────────────────────────────────────────────────────────────────

  onInstall(): void {
    const file = this.selectedFile();
    if (!file) return;

    this.isInstalling.set(true);
    this.installService.install(file, this.manifestPreview()!).subscribe({
      next: response => {
        this.installedPlugin.set(response.plugin);
        this.manifestPreview.set(null);
        this.isInstalling.set(false);
        this.notifications.showSuccess(`Plugin "${response.plugin.name}" installed successfully.`);
      },
      error: err => {
        this.notifications.showError(err?.error?.message ?? 'Installation failed. Please try again.');
        this.isInstalling.set(false);
      },
    });
  }

  onCancel(): void {
    this.selectedFile.set(null);
    this.manifestPreview.set(null);
    this.installedPlugin.set(null);
    this.fileInputRef.nativeElement.value = '';
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

  getStatusColor(status: PluginStatus): string {
    const map: Record<PluginStatus, string> = {
      INSTALLED:  'success',
      VERIFYING:  'warning',
      PENDING:    'medium',
      FAILED:     'danger',
    };
    return map[status] ?? 'medium';
  }
}
