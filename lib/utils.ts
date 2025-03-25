import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import * as React from "react";
import { appwriteConfig } from "./appwrite/config";
import { Query } from "node-appwrite";
import { CreateQueriesProps, TotalSpace } from "@/types";



export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const parseStringify = (value: unknown) => JSON.parse(JSON.stringify(value))



export function useMediaQuery(query: string) {
  const [value, setValue] = React.useState(false);

  React.useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches);
    }

    const result = matchMedia(query);
    result.addEventListener("change", onChange);
    setValue(result.matches);

    return () => result.removeEventListener("change", onChange);
  }, [query]);

  return value;
}


export const getFileType = (fileName: string) => {

  const extension = fileName.split(".").pop()?.toLowerCase();

  if (!extension) return { filetype: "other", extension: "other" };

  const fileTypes: Record<string, string> = {
    // image Extensions
    jpg: "image",
    jpeg: "image",
    png: "image",
    gif: "image",
    svg: "image",
    webp: "image",
    bmp: "image",

    // video Extensions
    mp4: "video",
    avi: "video",
    mov: "video",
    mkv: "video",
    webm: "video",
    flv: "video",

    // audio Extensions
    mp3: "audio",
    wav: "audio",
    ogg: "audio",
    flac: "audio",
    aac: "audio",

    // document Extensions
    pdf: "document",
    doc: "document",
    docx: "document",
    txt: "document",
    xls: "document",
    xlsx: "document",
    ppt: "document",
    pptx: "document",
    csv: "document",

    // archive Extensions
    zip: "archive",
    rar: "archive",
    tar: "archive",
    gz: "archive",
    "7z": "archive",
  };

  return { filetype: fileTypes[extension] || "other", extension };
};

export const getFileIcon = (extension: string, type: string) => {
  switch (extension) {
    // document
    case "pdf":
      return "/assets/icons/file-pdf.svg";
    case "doc":
      return "/assets/icons/file-doc.svg";
    case "docx":
      return "/assets/icons/file-docx.svg";
    case "csv":
      return "/assets/icons/file-csv.svg";
    case "txt":
      return "/assets/icons/file-txt.svg";
    case "xls":
    case "xlsx":
      return "/assets/icons/file-document.svg";
    // image
    case "svg":
      return "/assets/icons/file-image.svg";
    // video
    case "mkv":
    case "mov":
    case "avi":
    case "wmv":
    case "mp4":
    case "flv":
    case "webm":
    case "m4v":
    case "3gp":
      return "/assets/icons/file-video.svg";
    // audio
    case "mp3":
    case "mpeg":
    case "wav":
    case "aac":
    case "flac":
    case "ogg":
    case "wma":
    case "m4a":
    case "aiff":
    case "alac":
      return "/assets/icons/file-audio.svg";
    // Other
    case "other":
      return "/assets/icons/file-other.svg";

    default:
      switch (type) {
        case "image":
          return "/assets/icons/file-image.svg";
        case "document":
          return "/assets/icons/file-document.svg";
        case "video":
          return "/assets/icons/file-video.svg";
        case "audio":
          return "/assets/icons/file-audio.svg";
        default:
          return "/assets/icons/file-other.svg";
      }
  }
};


export const convertFileToUrl = (file: File) => URL.createObjectURL(file);


export const constructFileUrl = (fileId: string) => {
  return {
    url: `${appwriteConfig.endpointUrl}/storage/buckets/${appwriteConfig.storageCollectionId}/files/${fileId}/view?project=${appwriteConfig.projectId}`,
  }
}

export const constructDownloadUrl = (fileId: string) => {
  return {
    url: `${appwriteConfig.endpointUrl}/storage/buckets/${appwriteConfig.storageCollectionId}/files/${fileId}/download?project=${appwriteConfig.projectId}`,
  }
}


export const createQueries = ({ currentUser, types, searchquery, sort, limit }: CreateQueriesProps) => {


  const queries = [
    Query.or(
      [Query.equal("owner", currentUser.$id),
      Query.contains("users", currentUser.email)]
    ),
  ];

  
  if (types &&  types.length > 0) queries.push(Query.equal("type", types));
  if (searchquery) queries.push(Query.or([Query.contains("name", searchquery), Query.contains("extension", searchquery)]));
  if (limit) queries.push(Query.limit(limit));

  if(sort){
    const [sortField, sortOrder] = sort.split("-")

    queries.push(sortOrder === "asc" ? Query.orderAsc(sortField) : Query.orderDesc(sortField));
  }


  const query = queries

  return query
}

export function convertFileSize(fileSize: number) {
  if (fileSize === 0) return "0 Bytes";

  const units = ["Bytes", "KB", "MB", "GB", "TB"];
  const unitIndex = Math.floor(Math.log(fileSize) / Math.log(1024));
  const size = (fileSize / Math.pow(1024, unitIndex)).toFixed(2);

  return `${size} ${units[unitIndex]}`;
}

export function formatDateTime(dateTimeString: string): string {
  const date = new Date(dateTimeString);
  const currentYear = new Date().getFullYear(); // Get the current year
  const inputYear = date.getFullYear(); // Get the year of the input date

  // Options for formatting the time
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true, // Use 12-hour format (e.g., 2:16 PM)
  };

  // Options for formatting the date
  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short", // Short month name (e.g., "Nov", "Jan")
    day: "numeric",
  };

  // If the input year is not the current year, include the year in the date
  if (inputYear !== currentYear) {
    dateOptions.year = "numeric"; // Add the year to the date format
  }

  // Format the time and date separately
  const time = new Intl.DateTimeFormat("en-US", timeOptions).format(date);
  const formattedDate = new Intl.DateTimeFormat("en-US", dateOptions).format(date);

  // Combine time and date
  return `${time}, ${formattedDate}`;
}


export const getFilesCategory = (type: string) => {
  const fileGroups: Record<string, string[]> = {
    documents: ["document"],
    images: ["image"],
    media: ["video", "audio"],
    others: ["other", "archive"],
  };

  return fileGroups[type] || ["other"];
};


export const getUsageSummary = (totalSpace: TotalSpace) => { 
  return [
    {
      title: "Documents",
      size: totalSpace.document.size,
      latestDate: totalSpace.document.latestDate,
      icon: "/assets/icons/file-document-light.svg",
      url: "/documents",
    },
    {
      title: "Images",
      size: totalSpace.image.size,
      latestDate: totalSpace.image.latestDate,
      icon: "/assets/icons/file-image-light.svg",
      url: "/images",
    },
    {
      title: "Media",
      size: totalSpace.video.size + totalSpace.audio.size,
      latestDate:
        totalSpace.video.latestDate > totalSpace.audio.latestDate
          ? totalSpace.video.latestDate
          : totalSpace.audio.latestDate,
      icon: "/assets/icons/file-video-light.svg",
      url: "/media",
    },
    {
      title: "Others",
      size: totalSpace.other.size,
      latestDate: totalSpace.other.latestDate,
      icon: "/assets/icons/file-other-light.svg",
      url: "/others",
    },
  ];
};

export const calculatePercentage = (sizeInBytes: number) => {
  const totalSizeInBytes = 2 * 1024 * 1024 * 1024; // 2GB in bytes
  const percentage = (sizeInBytes / totalSizeInBytes) * 100;
  return Number(percentage.toFixed(2));
};

