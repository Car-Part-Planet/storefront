import { PaperClipIcon } from '@heroicons/react/24/solid';

type Props = {
  fileUrl: string;
  displayName: string;
};

const FileDownloader = ({ displayName, fileUrl }: Props) => {
  return (
    <div className="flex items-center text-sm leading-6">
      <PaperClipIcon aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-gray-400" />
      <div className="ml-4 flex min-w-0 flex-1 gap-x-3">
        <span className="truncate font-medium">{displayName}</span>
        <a
          href={fileUrl}
          download={displayName}
          className="font-medium text-primary hover:text-primary/80"
          target="_blank"
          rel="nofollow noreferrer"
        >
          Download
        </a>
      </div>
    </div>
  );
};

export default FileDownloader;
