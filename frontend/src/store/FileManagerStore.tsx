import { create } from 'zustand';
import {
  OpenMultipleFilesDialog,
  AddFileToWorkspace,
  HeaderFiltersFileValidation,
  GetFilesInWorkspaceInfo,
} from '../../wailsjs/go/main/App';
import { Monitor } from '../types/global';
import { WSChooserStore } from './WSChooserStore';
import { workspaces } from '../../wailsjs/go/models';
type FileInfo = workspaces.FileInfo;

interface FileManagerProps {
  files: FileInfo[] | null;
  selectedFiles: [FileInfo, FileInfo] | null;
  monitor: Monitor;
  isVisible: boolean;
  toggleVisibility: () => void;
  loadFiles: () => void;
  uploadFiles: () => void;
}

export const FileManagerStore = create<FileManagerProps>((set) => ({
  files: null,
  selectedFiles: null,
  monitor: { isLoading: false, error: null },
  isVisible: false,
  toggleVisibility: () => set((state) => ({ isVisible: !state.isVisible })),
  loadFiles: async () => {
    set({ monitor: { isLoading: true, error: null } });
    const activeWorkspace = WSChooserStore.getState().activeWorkspace;
    if (!activeWorkspace)
      return set({
        monitor: { isLoading: false, error: 'No active workspace found.' },
      });
    try {
      const files: FileInfo[] = await GetFilesInWorkspaceInfo(activeWorkspace);
      set({ files: files, monitor: { isLoading: false, error: null } });
    } catch (err) {
      set({ monitor: { isLoading: false, error: String(err) } });
    }
  },
  uploadFiles: async () => {
    set({ monitor: { isLoading: true, error: null } });
    const activeWorkspace = WSChooserStore.getState().activeWorkspace;
    if (!activeWorkspace)
      return set({
        monitor: { isLoading: false, error: 'No active workspace found.' },
      });
    try {
      const filePaths: string[] = await OpenMultipleFilesDialog();
      if (!filePaths)
        return set({
          monitor: { isLoading: false, error: null },
        });
      for (const filePath of filePaths) {
        try {
          if (filePath) {
            const initialFile = await HeaderFiltersFileValidation(filePath);
            await AddFileToWorkspace(activeWorkspace, filePath, initialFile);
            FileManagerStore.getState().loadFiles();
          }
        } catch (err) {
          set({ monitor: { isLoading: false, error: String(err) } });
        }
      }
    } catch (err) {
      set({ monitor: { isLoading: false, error: String(err) } });
    }
  },
}));
