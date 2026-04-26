import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
  IonContent, IonList, IonItem, IonItemDivider, IonLabel, IonBadge,
  IonNote, IonText, IonInput, IonChip, IonAccordion, IonAccordionGroup,
  IonSpinner, ModalController
} from '@ionic/angular/standalone';
import { Job, JobStatus, Plugin } from 'src/app/core/models/analysis.model';
import { PluginService } from '../shared/services/plugin.service';
import { JobService } from '../shared/services/job.service';
import { SubmitJobRequest } from '../shared/services/analysis.service.types';
import { NotificationService } from 'src/app/core/services/notifications/notification.service';

@Component({
  selector: 'app-plugin-drawer',
  templateUrl: './plugin-drawer.component.html',
  styleUrls: ['./plugin-drawer.component.scss'],
  standalone: true,
  imports: [
    DatePipe,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
    IonContent, IonList, IonItem, IonItemDivider, IonLabel, IonBadge,
    IonNote, IonText, IonInput, IonChip, IonAccordion, IonAccordionGroup,
    IonSpinner
  ]
})
export class PluginDrawerComponent implements OnInit {
  private modalController = inject(ModalController);
  private pluginService = inject(PluginService);
  private jobService = inject(JobService);
  private notifications = inject(NotificationService);

  imageId?: string;
  imageUrl?: string;

  protected readonly JobStatus = JobStatus;

  plugins = signal<Plugin[]>([]);
  isLoadingPlugins = signal<boolean>(false);
  pluginsError = signal<string | null>(null);
  selectedPlugin = signal<Plugin | null>(null);
  editableArgs = signal<Record<string, string>>({});
  jobs = signal<Job[]>([]);
  isLoadingJobs = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  activeFilter = signal<JobStatus | 'ALL'>('ALL');

  argsEntries = computed(() =>
    Object.entries(this.editableArgs()).map(([key, value]) => ({ key, value }))
  );

  filteredJobs = computed(() =>
    this.activeFilter() === 'ALL'
      ? this.jobs()
      : this.jobs().filter(j => j.status === this.activeFilter())
  );

  selectPlugin(plugin: Plugin): void {
    this.selectedPlugin.set(plugin);
    this.editableArgs.set({ ...plugin.exampleArgs });
  }

  clearSelection(): void {
    this.selectedPlugin.set(null);
    this.editableArgs.set({});
  }

  updateArg(key: string, value: string): void {
    this.editableArgs.update(args => ({ ...args, [key]: value }));
  }

  getBadgeColor(code: string): string {
    if (code.startsWith('STARDIST')) return 'success';
    if (code.startsWith('IHC')) return 'warning';
    if (code.startsWith('LLM')) return 'tertiary';
    return 'medium';
  }

  getStatusColor(status: JobStatus): string {
    const map: Record<JobStatus, string> = {
      [JobStatus.COMPLETED]: 'success',
      [JobStatus.RUNNING]:   'warning',
      [JobStatus.FAILED]:    'danger',
      [JobStatus.PENDING]:   'medium',
    };
    return map[status] ?? 'medium';
  }

  formatOutput(raw: string): { text: string; isJson: boolean } {
    try {
      const parsed = JSON.parse(raw);
      return { text: JSON.stringify(parsed, null, 2), isJson: true };
    } catch {
      return { text: raw, isJson: false };
    }
  }

  viewFullOutput(text: string): void {
    window.alert(text);
  }

  ngOnInit(): void {
    this.loadPlugins();
    this.loadJobs();
  }

  loadPlugins(): void {
    this.isLoadingPlugins.set(true);
    this.pluginsError.set(null);
    this.pluginService.getAll().subscribe({
      next: response => {
        this.plugins.set(response.plugins);
        this.isLoadingPlugins.set(false);
      },
      error: err => {
        this.pluginsError.set(err?.message ?? 'Failed to load plugins');
        this.isLoadingPlugins.set(false);
      }
    });
  }

  loadJobs(): void {
    const imageId = this.imageId;
    if (!imageId) return;
    this.isLoadingJobs.set(true);
    this.jobService.getByImage(imageId).subscribe({
      next: response => {
        this.jobs.set(response.jobs);
        this.isLoadingJobs.set(false);
      },
      error: () => this.isLoadingJobs.set(false)
    });
  }

  submitJob(): void {
    const plugin = this.selectedPlugin();
    if (!plugin) return;

    this.isSubmitting.set(true);
    const request: SubmitJobRequest = {
      pluginCode: plugin.code,
      imageId: this.imageId ?? '',
      imageUrl: this.imageUrl ?? '',
      args: this.editableArgs()
    };
    this.jobService.submit(request).subscribe({
      next: () => {
        const imageId = this.imageId;
        if (imageId) {
          this.jobService.getByImage(imageId).subscribe({
            next: response => this.jobs.set(response.jobs)
          });
        }
        this.editableArgs.set({ ...plugin.exampleArgs });
        this.isSubmitting.set(false);
        this.notifications.showSuccess('Job submitted successfully');
      },
      error: () => {
        this.isSubmitting.set(false);
        this.notifications.showError('Failed to submit job. Please try again.');
      }
    });
  }

  close(): void {
    this.modalController.dismiss();
  }
}
