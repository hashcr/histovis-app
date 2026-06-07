export interface PluginMetadata {
  code: string;
  name: string;
  description: string;
  queue: string;
  topic: string;
  exampleArgs: Record<string, string>;
  readme: string;
}

export enum PluginInstallStatus {
  COMPLETED = 'COMPLETED',
  RUNNING   = 'RUNNING',
  PENDING   = 'PENDING',
  FAILED    = 'FAILED',
}

export interface PluginInstallJob {
  id: string;
  pluginCode: string;
  pluginName: string;
  status: PluginInstallStatus;
  installedBy: string;
  date: string;
  error?: string;
}

export interface InstallPluginResponse {
  plugin: PluginMetadata;
}

export interface InstallHistoryResponse {
  jobs: PluginInstallJob[];
}
