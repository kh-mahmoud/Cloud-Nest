
import Card from '@/components/Card';
import Sort from '@/components/Sort';
import { getFiles, getTotalSpaceUsed } from '@/lib/actions/file.action';
import { convertFileSize, getFilesCategory, getUsageSummary } from '@/lib/utils';
import { FileType, SearchParamProps } from '@/types';
import { Models } from 'node-appwrite';
import React from 'react';

const page = async ({ params, searchParams }: SearchParamProps) => {

    const type = (await params)?.type
    const types = getFilesCategory(type as string) as FileType[]

    const searchquery = (await searchParams)?.query as string
    const sort = (await searchParams)?.sort as string


    const files = await getFiles({ types, searchquery, sort })

    const totalSpace = await getTotalSpaceUsed()

    // Get usage summary
    const usageSummary = getUsageSummary(totalSpace);

    const totalSize = ()=>
    {
        let  size = 0

        usageSummary.forEach((total) => {
            if (total.title.toLowerCase() == type) size=total.size
        })

        return convertFileSize(size) || "0 Mb"
    }


    return (

        <div className='page-container'>
            <section className='w-full'>
                <h1 className='h1 capitalize'>{type}</h1>
                <div className='total-size-section'>
                    <p className='body-1'>
                        Total: <span className='h5'>{totalSize()}</span>
                    </p>

                    <div className='sort-container'>
                        <p className='body-1 hidden sm:block text-light-200'>
                            Sort by:
                        </p>
                        <Sort />
                    </div>
                </div>
            </section>
            {files?.total > 0 ? (
                <section className='file-list'>
                    {files.documents.map((file: Models.Document) => (
                        <Card key={file.$id} file={file} />
                    ))}
                </section>
            ) : (
                <p className='empty-list'>
                    No files Uploaded
                </p>
            )}
        </div>
    );
}

export default page;
