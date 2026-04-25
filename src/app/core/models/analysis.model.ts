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
}
