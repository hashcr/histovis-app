import { Component, computed, inject, signal } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
  IonContent, IonList, IonItem, IonBadge, IonNote, IonText, IonInput,
  ModalController
} from '@ionic/angular/standalone';
import { Plugin } from 'src/app/core/models/analysis.model';

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

@Component({
  selector: 'app-plugin-drawer',
  templateUrl: './plugin-drawer.component.html',
  styleUrls: ['./plugin-drawer.component.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
    IonContent, IonList, IonItem, IonBadge, IonNote, IonText, IonInput
  ]
})
export class PluginDrawerComponent {
  private modalController = inject(ModalController);

  plugins = signal<Plugin[]>(MOCK_PLUGINS);
  selectedPlugin = signal<Plugin | null>(null);
  editableArgs = signal<Record<string, string>>({});

  argsEntries = computed(() =>
    Object.entries(this.editableArgs()).map(([key, value]) => ({ key, value }))
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

  runPlugin(plugin: Plugin): void {
    console.log({ pluginCode: plugin.code, args: this.editableArgs() });
  }

  close(): void {
    this.modalController.dismiss();
  }
}
