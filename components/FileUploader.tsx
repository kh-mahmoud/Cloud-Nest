'use client'

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from './ui/button'
import { cn, convertFileToUrl, getFileType } from '@/lib/utils'
import Image from 'next/image'
import Thumbnail from './Thumbnail'
import { MAX_FILE_SIZE } from '@/constants'
import { useToast } from "@/hooks/use-toast"
import { uploadFile } from '@/lib/actions/file.action'
import { usePathname } from 'next/navigation'


type FileUploaderProps = {
  ownerId: string
  accountId: string
  classes?: string
}

export function FileUploader({ ownerId, accountId, classes }: FileUploaderProps) {

  const { toast } = useToast()
  const path = usePathname()
  const [files, setFiles] = useState<File[]>([])


  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setFiles(acceptedFiles)

    const uploadProcess = acceptedFiles.map(async (file) => {
      if (file.size > MAX_FILE_SIZE) {
        setFiles((prev) => prev.filter((f) => f.name !== file.name));
  
        return toast({
          description: (
            <p className='body-2 text-white'>
              <span className='font-semibold'>
                {file.name} is too large. Max file size is 50MB.
              </span>
            </p>
          ),
          className: 'error-toast',
          duration: 100,
        });
      }
  
      return uploadFile({ file, ownerId, accountId, path })
        .then((result) => {
          if (result) {
            setFiles((prev) => prev.filter((f) => f.name !== file.name));
          }
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
          toast({
            description: (
              <p className='body-2 text-white'>
                <span className='font-semibold'>
                  Failed to upload {file.name}.
                </span>
              </p>
            ),
            className: 'error-toast',
            duration: 100,
          });
        });
    });
  
    await Promise.all(uploadProcess);
    
  }, [ownerId,path,accountId])

  const { getRootProps, getInputProps } = useDropzone({ onDrop, maxSize: MAX_FILE_SIZE })

  const handleRemoveFile = (e: React.MouseEvent<HTMLImageElement>, fileName: string) => {
    e.stopPropagation()
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName))
  }


  return (
    <div {...getRootProps()} className='cursor-pointer'>
      <input {...getInputProps()} />
      <Button className={cn('uploader-button', classes)}>
        <Image
          src={'/assets/icons/upload.svg'}
          width={24}
          height={24}
          alt=''
        />
        <p>Upload</p>
      </Button>

      {files.length > 0 && (
        <ul className='uploader-preview-list'>
          <h4 className='h4 text-light-100'>Uploading</h4>
          {files.map((file, index) => {
            if (!file.name) {
              return null
            }

            const { extension, filetype } = getFileType(file.name)


            return (
              <li className='uploader-preview-item' key={`${file.name}-${index}`}>
                <div className='flex items-center gap-3'>
                  <Thumbnail type={filetype} extension={extension} url={convertFileToUrl(file)} />
                  <div className='preview-item-name'>
                    {file.name}
                    <Image
                      src="/assets/icons/file-loader.gif"
                      alt="loader"
                      width={200}
                      height={0}
                    />
                  </div>
                </div>

                <Image
                  src="/assets/icons/remove.svg"
                  alt="remove"
                  width={24}
                  height={24}
                  onClick={(e) => handleRemoveFile(e, file.name)}
                />
              </li>
            )
          })}
        </ul>
      )}

    </div>
  )
}