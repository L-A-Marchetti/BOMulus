import { create } from 'zustand';
import {
  OpenMultipleFilesDialog,
  AddFileToWorkspace,
  HeaderFiltersFileValidation,
  GetFilesInWorkspaceInfo,
  DeleteBOMFile,
  UpdateVersionTags,
  BtnCompare,
  UpdateLastComparison,
} from '../../wailsjs/go/main/App';
import { Monitor } from '../types/global';
import { WSChooserStore } from './WSChooserStore';
import { workspaces } from '../../wailsjs/go/models';
import { core } from '../../wailsjs/go/models';
import { CompareViewStore } from './CompareViewStore';
import { CalculatorStore } from './CalculatorStore';
import { MonitorStore } from './MonitorStore';
type FileInfo = workspaces.FileInfo;
type XlsmFile = core.XlsmFile;

interface FileManagerProps {
  files: FileInfo[] | null;
  filesToValidate: XlsmFile[] | null;
  selectedFiles: [FileInfo, FileInfo] | [FileInfo, null] | [null, null];
  isVisible: boolean;
  toggleVisibility: () => void;
  loadFiles: () => void;
  uploadFiles: () => void;
  validationControl: (key: string, sign: string) => void;
  confirmValidation: () => void;
  cancelValidation: () => void;
  deleteFile: (file: FileInfo) => void;
  moveFile: (direction: string, file: FileInfo) => void;
  selectFile: (file: FileInfo) => void;
  compare: () => void;
  reset: () => void;
}

export const FileManagerStore = create<FileManagerProps>((set) => ({
  files: null,
  filesToValidate: null,
  selectedFiles: [null, null],
  isVisible: false,
  toggleVisibility: () => set((state) => ({ isVisible: !state.isVisible })),
  loadFiles: async () => {
    const Monitor = MonitorStore.getState();
    Monitor.setMonitor(true, 'File Manager', null);
    const activeWorkspace = WSChooserStore.getState().activeWorkspace;
    if (!activeWorkspace)
      return Monitor.setMonitor(
        false,
        'File Manager',
        'No active workspace found',
      );
    try {
      const files: FileInfo[] = await GetFilesInWorkspaceInfo(activeWorkspace);
      Monitor.setMonitor(false, 'File Manager', null);
      set({ files: files });
    } catch (err) {
      Monitor.setMonitor(true, 'File Manager', String(err));
    }
  },
  uploadFiles: async () => {
    const Monitor = MonitorStore.getState();
    Monitor.setMonitor(true, 'File Manager', null);
    const activeWorkspace = WSChooserStore.getState().activeWorkspace;
    if (!activeWorkspace)
      return Monitor.setMonitor(
        false,
        'File Manager',
        'No active workspace found',
      );
    try {
      const filePaths: string[] = await OpenMultipleFilesDialog();
      if (!filePaths)
        return Monitor.setMonitor(
          false,
          'File Manager',
          'No files to validate',
        );
      const filesToValidate: XlsmFile[] = [];
      for (const filePath of filePaths) {
        try {
          if (filePath) {
            const initialFile: XlsmFile =
              await HeaderFiltersFileValidation(filePath);
            if (initialFile) filesToValidate.push(initialFile);
          }
          Monitor.setMonitor(false, 'File Manager', null);
          set({ filesToValidate });
        } catch (err) {
          Monitor.setMonitor(false, 'File Manager', String(err));
        }
      }
    } catch (err) {
      Monitor.setMonitor(false, 'File Manager', String(err));
    }
  },
  validationControl: (key: string, sign: string) =>
    set((state) => {
      if (!state.filesToValidate || state.filesToValidate.length === 0) {
        return {};
      }
      const file = state.filesToValidate[0];
      if (key === 'Header')
        file.filters.header =
          sign === '+'
            ? file.filters.header + 1
            : Math.max(0, file.filters.header - 1);
      if (key === 'Quantity')
        file.filters.quantity =
          sign === '+'
            ? file.filters.quantity + 1
            : Math.max(0, file.filters.quantity - 1);
      if (key === 'MPN')
        file.filters.mpn =
          sign === '+'
            ? file.filters.mpn + 1
            : Math.max(0, file.filters.mpn - 1);
      if (key === 'Description')
        file.filters.description =
          sign === '+'
            ? file.filters.description + 1
            : Math.max(0, file.filters.description - 1);
      if (key === 'Designator')
        file.filters.designator =
          sign === '+'
            ? file.filters.designator + 1
            : Math.max(0, file.filters.designator - 1);
      if (key === 'Manufacturer')
        file.filters.manufacturer =
          sign === '+'
            ? file.filters.manufacturer + 1
            : Math.max(0, file.filters.manufacturer - 1);
      return { filesToValidate: [...state.filesToValidate] };
    }),
  confirmValidation: async () => {
    const Monitor = MonitorStore.getState();
    Monitor.setMonitor(true, 'File Manager', null);
    const activeWorkspace = WSChooserStore.getState().activeWorkspace;
    const filesToValidate = FileManagerStore.getState().filesToValidate;
    const file: XlsmFile | undefined = filesToValidate
      ? filesToValidate[0]
      : undefined;
    if (!file) {
      return Monitor.setMonitor(false, 'File Manager', 'No files to validate');
    }
    if (!activeWorkspace)
      return Monitor.setMonitor(
        false,
        'File Manager',
        'No active workspace found',
      );
    try {
      await AddFileToWorkspace(activeWorkspace, file);
      set((state) => {
        const updatedFiles = state.filesToValidate?.slice(1);
        return {
          filesToValidate: updatedFiles?.length === 0 ? null : updatedFiles,
        };
      });
      FileManagerStore.getState().loadFiles();
      Monitor.setMonitor(false, 'File Manager', null);
    } catch (err) {
      Monitor.setMonitor(true, 'File Manager', String(err));
    }
  },
  cancelValidation: () =>
    set((state) => {
      const updatedFiles = state.filesToValidate?.slice(1);
      return {
        filesToValidate: updatedFiles?.length === 0 ? null : updatedFiles,
      };
    }),
  deleteFile: async (file: FileInfo) => {
    const Monitor = MonitorStore.getState();
    Monitor.setMonitor(true, 'File Manager', null);
    const activeWorkspace = WSChooserStore.getState().activeWorkspace;
    if (!activeWorkspace)
      return Monitor.setMonitor(
        false,
        'File Manager',
        'No active workspace found',
      );
    try {
      await DeleteBOMFile(activeWorkspace, file);
      FileManagerStore.getState().loadFiles();
      Monitor.setMonitor(false, 'File Manager', null);
    } catch (err) {
      Monitor.setMonitor(false, 'File Manager', String(err));
    }
  },
  moveFile: async (direction: string, file: FileInfo) => {
    const Monitor = MonitorStore.getState();
    Monitor.setMonitor(true, 'File Manager', null);
    set((state) => {
      if (!state.files) return {};
      const currentIndex = state.files.indexOf(file);
      if (currentIndex === -1) return {};
      let newIndex = direction === '+' ? currentIndex + 1 : currentIndex - 1;
      if (newIndex < 0 || newIndex >= state.files.length) return {};
      const newFiles = [...state.files];
      [newFiles[currentIndex], newFiles[newIndex]] = [
        newFiles[newIndex],
        newFiles[currentIndex],
      ];
      newFiles.forEach((file, index) => {
        file.version_tag = index + 1;
      });
      return { files: newFiles };
    });
    const files = FileManagerStore.getState().files;
    const activeWorkspace = WSChooserStore.getState().activeWorkspace;
    if (!activeWorkspace || !files)
      return Monitor.setMonitor(
        false,
        'File Manager',
        'No active workspace found or no files to validate found',
      );
    try {
      await UpdateVersionTags(files);
      Monitor.setMonitor(false, 'File Manager', null);
    } catch (err) {
      Monitor.setMonitor(false, 'File Manager', String(err));
    }
  },
  selectFile: (file: FileInfo) =>
    set((state) => {
      const [file1, file2] = state.selectedFiles;
      if (file1 === file || file2 === file) {
        if (file === file1) {
          return { selectedFiles: [file2, null] };
        }
        return { selectedFiles: [file1, null] };
      }
      if (!file1) {
        return { selectedFiles: [file, null] };
      }
      if (!file2) {
        return { selectedFiles: [file1, file] };
      }
      return { selectedFiles: [file1, file] };
    }),
  compare: async () => {
    const Monitor = MonitorStore.getState();
    Monitor.setMonitor(true, 'File Manager', null);
    const activeWorkspace = WSChooserStore.getState().activeWorkspace;
    if (!activeWorkspace)
      return Monitor.setMonitor(
        false,
        'File Manager',
        'No active workspace found',
      );
    const filesToCompare = FileManagerStore.getState().selectedFiles;
    if (!filesToCompare[0] || !filesToCompare[1])
      return Monitor.setMonitor(false, 'File Manager', 'No files selected');
    try {
      console.log(filesToCompare[0].components);
      await BtnCompare(
        filesToCompare[0].components,
        filesToCompare[1].components,
      );
      /*await UpdateLastComparison(
        activeWorkspace,
        filesToCompare[0],
        filesToCompare[1],
      );*/
      Monitor.setMonitor(false, 'File Manager', null);
      FileManagerStore.getState().toggleVisibility();
      CompareViewStore.getState().loadComponents();
      CalculatorStore.getState().getProductionQuantity();
      if (!CompareViewStore.getState().isVisible)
        CompareViewStore.getState().toggleVisibility();
    } catch (err) {
      Monitor.setMonitor(true, 'File Manager', String(err));
    }
  },
  reset: () => {
    set({
      files: null,
      filesToValidate: null,
      selectedFiles: [null, null],
      isVisible: false,
    });
  },
}));
