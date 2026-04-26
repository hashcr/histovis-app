import { Job, JobStatus, Plugin } from 'src/app/core/models/analysis.model';

export interface ListPluginsResponse {
  plugins: Plugin[];
}

export interface ListJobsResponse {
  jobs: Job[];
}

export interface GetJobResponse {
  job: Job;
}

export interface SubmitJobRequest {
  pluginCode: string;
  imageId: string;
  imageUrl: string;
  args: Record<string, string>;
}

export interface SubmitJobResponse {
  id: string;
}

export interface UpdateJobResultRequest {
  status: JobStatus;
  output?: string;
}
