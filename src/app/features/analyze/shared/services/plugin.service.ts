import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api/api.service';
import { environment } from 'src/environments/environment';
import { ListPluginsResponse } from './analysis.service.types';

@Injectable({ providedIn: 'root' })
export class PluginService {
  private api = inject(ApiService).for(environment.analysisApiBaseUrl);

  getAll(): Observable<ListPluginsResponse> {
    return this.api.get<ListPluginsResponse>('plugins');
  }
}
