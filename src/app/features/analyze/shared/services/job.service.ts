import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api/api.service';
import { environment } from 'src/environments/environment';
import {
  GetJobResponse,
  ListJobsResponse,
  SubmitJobRequest,
  SubmitJobResponse,
  UpdateJobResultRequest
} from './analysis.service.types';

@Injectable({ providedIn: 'root' })
export class JobService {
  private api = inject(ApiService).for(environment.analysisApiBaseUrl);

  getByImage(imageId: string): Observable<ListJobsResponse> {
    return this.api.get<ListJobsResponse, { imageId: string }>('jobs', { imageId });
  }

  getById(id: string): Observable<GetJobResponse> {
    return this.api.get<GetJobResponse>(`jobs/${id}`);
  }

  submit(request: SubmitJobRequest): Observable<SubmitJobResponse> {
    return this.api.post<SubmitJobResponse, SubmitJobRequest>('jobs', request);
  }

  updateResult(id: string, request: UpdateJobResultRequest): Observable<void> {
    return this.api.put<void, UpdateJobResultRequest>(`jobs/${id}/result`, request);
  }
}
