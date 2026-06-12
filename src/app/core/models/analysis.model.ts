export enum JobStatus {
  COMPLETED = 'COMPLETED',
  RUNNING   = 'RUNNING',
  PENDING   = 'PENDING',
  FAILED    = 'FAILED'
}

export interface Job {
  id: string;                     // UUID
  pluginCode: string;
  imageId: string;                // UUID
  imageUrl: string;
  args: Record<string, string>;
  status: JobStatus;
  date: string;                   // ISO date string (LocalDateTime)
  completedDate: string | null;   // null if not yet completed
  output: string | null;          // null if not yet available
  username: string;
}

export type PluginStatus = 'PENDING' | 'VERIFYING' | 'INSTALLED' | 'FAILED';

export interface Plugin {
  id: string;               // UUID serialized as string
  code: string;             // short unique identifier e.g. 'STARDIST_HE'
  name: string;             // display name
  description: string;
  queue: string;            // RabbitMQ queue name
  topic: string;            // RabbitMQ routing key e.g. 'stardist.he.detect'
  exampleArgs: Record<string, string>;  // default arg values, keys are arg names
  installedBy: string;      // username of admin who installed it
  installedDate: string;    // ISO date string (LocalDateTime serialized by Jackson)
  readme: string;           // markdown string
  status: PluginStatus;
}
