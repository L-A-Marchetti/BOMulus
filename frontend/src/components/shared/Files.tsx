import { useEffect, useState } from 'react';
import { workspaces } from '../../../wailsjs/go/models';
import { FileManagerStore } from '../../store/FileManagerStore';

type FilesProps = {
  file: workspaces.FileInfo;
};

export default function Files(file: FilesProps) {
  const [opacity, setOpacity] = useState(false);
  const FileManager = FileManagerStore();

  useEffect(() => {
    setOpacity(true)
  }, []);
  return (
    <div className={`w-full h-15 transition rounded-lg bg-neutral-800 border-3 border-neutral-700 hover:scale-95 group ${opacity ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`h-full flex items-center justify-center`}>
        <a
          className={`transition w-full h-full flex items-center justify-center px-3 ${FileManager.selectedFiles[0] === file.file || FileManager.selectedFiles[1] === file.file ? 'max-w-1/7 bg-blue-400/70 rounded-l' : ''}`}
        >
          v{file.file.version_tag}
        </a>
        {FileManager.selectedFiles[0] === file.file || FileManager.selectedFiles[1] === file.file ? <></> : <div className="h-5 border-l border-neutral-600 group-hover:border-l-0 transition" />}
        <a
          href="#"
          onClick={() => FileManager.selectFile(file.file)}
          className="transition w-full min-w-1/2 h-full flex items-center justify-center hover:bg-neutral-700 hover:w-full px-3"
        >
          {file.file.name}
        </a>
        {FileManager.selectedFiles[0] === file.file || FileManager.selectedFiles[1] === file.file ? <></> : (<><div className="h-5 border-l border-neutral-600 group-hover:border-l-0 transition" />
        <a
          href="#"
          onClick={() => {
            FileManager.moveFile('-', file.file);
          }}
          className="transition w-full h-full flex items-center justify-center hover:bg-neutral-700 hover:w-full px-3"
        >
          ▴
        </a>
        <div className="h-5 border-l border-neutral-600 group-hover:border-l-0 transition" />
        <a
          href="#"
          onClick={() => {
            FileManager.moveFile('+', file.file);
          }}
          className="transition w-full h-full flex items-center justify-center hover:bg-neutral-700 hover:w-full px-3"
        >
          ▾
        </a>
        <div className="h-5 border-l border-neutral-600 group-hover:border-l-0 transition" />
        <a
          href="#"
          onClick={() => FileManager.deleteFile(file.file)}
          className="transition w-full h-full flex items-center justify-center hover:bg-red-300 rounded-r-md hover:w-full px-3"
        >
          x
        </a></>)}
      </div>
    </div>
  );
}
