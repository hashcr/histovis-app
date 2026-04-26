import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
  IonContent, IonList, IonItem, IonItemDivider, IonLabel, IonBadge,
  IonNote, IonText, IonInput, IonChip, IonAccordion, IonAccordionGroup,
  IonSpinner, ModalController
} from '@ionic/angular/standalone';
import { Job, JobStatus, Plugin } from 'src/app/core/models/analysis.model';
import { PluginService } from '../shared/services/plugin.service';

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
    output: '{"cell_count":142,"mean_area":47.3,"processing_time":"3.2s"}',
    username: 'admin'
  },
  {
    id: 'aaaaaaaa-0000-0000-0000-000000000002',
    pluginCode: 'LLM_DESCRIBE',
    imageId: '00000000-0000-0000-0000-000000000099',
    imageUrl: '',
    args: { model: 'llava', lang: 'en' },
    status: JobStatus.COMPLETED,
    date: new Date().toISOString(),
    completedDate: new Date().toISOString(),
    output: 'The slide shows a moderately differentiated gastric adenocarcinoma with glandular structures embedded in a desmoplastic stroma. Tumor cells display enlarged hyperchromatic nuclei with prominent nucleoli. Scattered inflammatory infiltrate is present at the invasive front. The morphological pattern is consistent with an intestinal-type adenocarcinoma according to the Lauren classification. No signet ring cells are identified in the evaluated area. Overall cellularity is high with an estimated mitotic index of 4 per high power field.',
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
    IonNote, IonText, IonInput, IonChip, IonAccordion, IonAccordionGroup,
    IonSpinner
  ]
})
export class PluginDrawerComponent implements OnInit {
  private modalController = inject(ModalController);
  private pluginService = inject(PluginService);

  imageId = input<string>();

  protected readonly JobStatus = JobStatus;

  plugins = signal<Plugin[]>([]);
  isLoadingPlugins = signal<boolean>(false);
  pluginsError = signal<string | null>(null);
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

  runPlugin(plugin: Plugin): void {
    console.log({ pluginCode: plugin.code, args: this.editableArgs() });
  }

  close(): void {
    this.modalController.dismiss();
  }
}
