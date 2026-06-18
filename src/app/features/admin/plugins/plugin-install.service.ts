import { inject, Injectable } from '@angular/core';
import { Observable, from, switchMap, map } from 'rxjs';
import { ApiService } from 'src/app/core/services/api/api.service';
import { environment } from 'src/environments/environment';
import { InstallPluginResponse, PluginMetadata } from './plugin-install.service.types';
import { extractPyFile } from 'src/app/core/utils/plugin-zip.utils';

@Injectable({ providedIn: 'root' })
export class PluginInstallService {
  private api = inject(ApiService).for(environment.analysisApiBaseUrl);

  install(file: File, manifest: PluginMetadata): Observable<InstallPluginResponse> {
    return from(extractPyFile(file)).pipe(
      switchMap(scriptFile => {
        const formData = new FormData();
        formData.append('code', manifest.code);
        formData.append('name', manifest.name);
        if (manifest.description) formData.append('description', manifest.description);
        formData.append('queue', manifest.queue);
        formData.append('topic', manifest.topic);
        formData.append('exampleArgs', JSON.stringify(manifest.exampleArgs ?? {}));
        if (manifest.readme) formData.append('readme', manifest.readme);
        formData.append('scriptFile', scriptFile, scriptFile.name);
        return this.api.post<unknown, FormData>('plugins', formData);
      }),
      map(dto => ({ plugin: dto as unknown as PluginMetadata })),
    );
  }
}
