import JSZip from 'jszip';

const MANIFEST_REQUIRED_FIELDS = ['code', 'name', 'description', 'queue', 'topic', 'exampleArgs', 'readme'] as const;

export interface PluginZipValidationResult {
  valid: boolean;
  error?: string;
  manifest?: Record<string, unknown>;
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

  const manifestText = await zip.file('manifest.json')!.async('text');
  let manifest: Record<string, unknown>;
  try {
    manifest = JSON.parse(manifestText);
  } catch {
    return { valid: false, error: 'manifest.json contains invalid JSON.' };
  }

  const missing = MANIFEST_REQUIRED_FIELDS.filter(f => manifest[f] == null || manifest[f] === '');
  if (missing.length > 0) {
    return { valid: false, error: `manifest.json is missing required fields: ${missing.join(', ')}.` };
  }

  return { valid: true, manifest };
}

export async function extractPyFile(file: File): Promise<File> {
  const zip = await JSZip.loadAsync(file);
  const entry = Object.values(zip.files).find(f => !f.dir && f.name.endsWith('.py'))!;
  const blob = await entry.async('blob');
  return new File([blob], entry.name, { type: 'text/x-python' });
}
