import { Component, computed, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
  IonContent, IonList, IonItem, IonItemDivider, IonLabel, IonBadge,
  IonNote, IonText, IonInput, IonChip,
  ModalController
} from '@ionic/angular/standalone';
import { Job, JobStatus, Plugin } from 'src/app/core/models/analysis.model';

const MOCK_PLUGINS: Plugin[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    code: 'STARDIST_HE',
    name: 'Cell Detection H&E',
    description: 'Detects nuclei in H&E tiles using StarDist 2D.',
    queue: 'stardist.queue',
    topic: 'stardist.he.detect',
    exampleArgs: { prob_thresh: '0.479', nms_thresh: '0.3', tile_size: '512' },
    installedBy: 'admin',
    installedDate: '2025-01-10T10:00:00',
    readme: ''
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    code: 'IHC_COUNT',
    name: 'IHC Positive Count',
    description: 'Counts DAB-positive nuclei in IHC slides.',
    queue: 'stardist.queue',
    topic: 'ihc.dab.count',
    exampleArgs: { dab_thresh: '0.3', tile_size: '512' },
    installedBy: 'admin',
    installedDate: '2025-01-10T10:00:00',
    readme: ''
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    code: 'LLM_DESCRIBE',
    name: 'LLM Description',
    description: 'Generates a natural language description using LLaVA.',
    queue: 'ollama.queue',
    topic: 'llm.describe.wsi',
    exampleArgs: { model: 'llava', lang: 'en' },
    installedBy: 'admin',
    installedDate: '2025-01-10T10:00:00',
    readme: ''
  }
];

const MOCK_JOBS: Job[] = [
  {
    id: 'aaaaaaaa-0000-0000-0000-000000000001',
    pluginCode: 'STARDIST_HE',
    imageId: '00000000-0000-0000-0000-000000000099',
    imageUrl: '',
    args: { prob_thresh: '0.479', tile_size: '512' },
    status: JobStatus.COMPLETED,
    date: new Date(Date.now() - 120000).toISOString(),
    completedDate: new Date(Date.now() - 90000).toISOString(),
    output: null,
    username: 'admin'
  },
  {
    id: 'aaaaaaaa-0000-0000-0000-000000000002',
    pluginCode: 'LLM_DESCRIBE',
    imageId: '00000000-0000-0000-0000-000000000099',
    imageUrl: '',
    args: { model: 'llava', lang: 'en' },
    status: JobStatus.RUNNING,
    date: new Date().toISOString(),
    completedDate: null,
    output: null,
    username: 'admin'
  },
  {
    id: 'aaaaaaaa-0000-0000-0000-000000000003',
    pluginCode: 'STARDIST_HE',
    imageId: '00000000-0000-0000-0000-000000000099',
    imageUrl: '',
    args: { prob_thresh: '0.9', tile_size: '256' },
    status: JobStatus.FAILED,
    date: new Date(Date.now() - 1080000).toISOString(),
    completedDate: null,
    output: null,
    username: 'admin'
  },
  {
    id: 'aaaaaaaa-0000-0000-0000-000000000004',
    pluginCode: 'IHC_COUNT',
    imageId: '00000000-0000-0000-0000-000000000099',
    imageUrl: '',
    args: { dab_thresh: '0.3', tile_size: '512' },
    status: JobStatus.PENDING,
    date: new Date(Date.now() - 30000).toISOString(),
    completedDate: null,
    output: null,
    username: 'admin'
  }
];

@Component({
  selector: 'app-plugin-drawer',
  templateUrl: './plugin-drawer.component.html',
  styleUrls: ['./plugin-drawer.component.scss'],
  standalone: true,
  imports: [
    DatePipe,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
    IonContent, IonList, IonItem, IonItemDivider, IonLabel, IonBadge,
    IonNote, IonText, IonInput, IonChip
  ]
})
export class PluginDrawerComponent {
  private modalController = inject(ModalController);

  imageId = input<string>();

  // Expose JobStatus enum to template
  protected readonly JobStatus = JobStatus;

  plugins = signal<Plugin[]>(MOCK_PLUGINS);
  selectedPlugin = signal<Plugin | null>(null);
  editableArgs = signal<Record<string, string>>({});
  jobs = signal<Job[]>(MOCK_JOBS);
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

  runPlugin(plugin: Plugin): void {
    console.log({ pluginCode: plugin.code, args: this.editableArgs() });
  }

  close(): void {
    this.modalController.dismiss();
  }
}
