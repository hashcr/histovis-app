import JSZip from 'jszip';

export interface PluginZipValidationResult {
  valid: boolean;
  error?: string;
}

export async function validatePluginZip(file: File): Promise<PluginZipValidationResult> {
  const zip = await JSZip.loadAsync(file);
  const entries = Object.values(zip.files).filter(f => !f.dir);
  const names = entries.map(f => f.name);

  const hasManifest = names.includes('manifest.json');
  const pyFiles = names.filter(n => n.endsWith('.py'));

  if (entries.length !== 2 || !hasManifest || pyFiles.length !== 1) {
    return {
      valid: false,
      error: 'Invalid plugin package. The .zip must contain exactly manifest.json and one .py file.',
    };
  }
  return { valid: true };
}
