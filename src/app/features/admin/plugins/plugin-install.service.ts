import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api/api.service';
import { environment } from 'src/environments/environment';
import { InstallHistoryResponse, InstallPluginResponse } from './plugin-install.service.types';

@Injectable({ providedIn: 'root' })
export class PluginInstallService {
  private api = inject(ApiService).for(environment.analysisApiBaseUrl);

  install(file: File): Observable<InstallPluginResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.api.post<InstallPluginResponse, FormData>('plugins/install', formData);
  }

  getInstallHistory(): Observable<InstallHistoryResponse> {
    return this.api.get<InstallHistoryResponse>('plugins/install-jobs');
  }
}
