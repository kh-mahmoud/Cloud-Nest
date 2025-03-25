import { Models } from "node-appwrite";
import { Dispatch, SetStateAction } from "react";

export type FileType = "document" | "image" | "video" | "audio" | "other" | 'archive';

type SegmentParams = {
  type: string; // Dynamic segment
  id: string;   // Another dynamic segment
};

export type ActionType = {
  label: string;
  icon: string;
  value: string;
}

export type SearchParamProps = {
  params?: Promise<SegmentParams>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export type UploadProps = {
  file: File;
  ownerId: string;
  accountId: string;
  path: string;
}
export type GetFilesProps = {
  types?: FileType[];
  searchquery?: string;
  sort?: string ;
  limit?: number;
}

export type CreateQueriesProps = {
  currentUser:Models.Document
  types?: FileType[];
  searchquery?: string;
  sort?: string ;
  limit?: number;
}

export type RenameFileProps = {
  fileId: string;
  name: string;
  path: string;
}
export type UpdateFileUsersProps = {
  fileId: string;
  emails: string[];
  path: string;
}
export type DeleteFileProps = {
  fileId: string;
  bucketFileId: string;
  path: string;
}

export type FileUploaderProps = {
  ownerId: string;
  accountId: string;
  className?: string;
}

export type MobileNavigationProps = {
  ownerId: string;
  accountId: string;
  fullName: string;
  avatar: string;
  email: string;
}
export type SidebarProps = {
  fullName: string;
  avatar: string;
  email: string;
}

export type ThumbnailProps = {
  type: string;
  extension: string;
  url: string;
  className?: string;
  imageClassName?: string;
}

export type SharedInputProps = {
  file: Models.Document;
  onInputChange: Dispatch<SetStateAction<string[]>>;
  onRemove: (email: string) => void;
}

type FileCategory = {
  size: number;
  latestDate: string; // or Date if you prefer
};

export type TotalSpace = {
  image: FileCategory;
  document: FileCategory;
  video: FileCategory;
  audio: FileCategory;
  archive: FileCategory;
  other: FileCategory;
  used: number;
  all: number;
};
