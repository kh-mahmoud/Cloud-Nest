import { Models } from 'node-appwrite';
import Thumbnail from './Thumbnail';
import FormatedDateTime from './FormatedDateTime';
import { convertFileSize, formatDateTime } from '@/lib/utils';
import { SharedInputProps } from '@/types';
import { Button } from './ui/button';
import Image from 'next/image';
import { Input } from './ui/input';


const ImageThumbnail = ({ file }: { file: Models.Document }) => (
    <div className="file-details-thumbnail ">
        <Thumbnail type={file.type} extension={file.extension} url={file.url} />
        <div className="flex flex-col flex-wrap overflow-hidden truncate">
            <p className="subtitle-2 mb-1 ">{file.name}</p>
            <FormatedDateTime date={file.$createdAt} classes="caption" />
        </div>
    </div>
);

const DetailRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex">
        <p className="file-details-label text-left">{label}</p>
        <p className="file-details-value text-left">{value}</p>
    </div>
);

export const FileDetails = ({ file }: { file: Models.Document }) => {
    return (
        <div className="space-y-4 px-2 pt-2 ">
            <ImageThumbnail file={file} />
            <DetailRow label="Format:" value={file.extension} />
            <DetailRow label="Size:" value={convertFileSize(file.size)} />
            <DetailRow label="Owner:" value={file.owner.fullName} />
            <DetailRow label="Last edit:" value={formatDateTime(file.$updatedAt)} />
        </div>
    );
}


export const SharedInput = ({ file, onInputChange, onRemove }: SharedInputProps) => {
    return (
        <>
            <ImageThumbnail file={file} />

            <div className="share-wrapper">
                <p className="subtitle-2 pl-1 text-light-100">
                    Share file with other users
                </p>
                <Input
                    type="email"
                    placeholder="Enter email address"
                    onChange={(e) => onInputChange(e.target.value.trim().split(","))}
                    className="share-input-field"
                />
                <div className="pt-4">
                    <div className="flex justify-between">
                        <p className="subtitle-2 text-light-100">Shared with</p>
                        <p className="subtitle-2 text-light-200">
                            {file.users.length} users
                        </p>
                    </div>

                    <ul className="pt-2">
                        {file.users.map((email: string) => (
                            <li
                                key={email}
                                className="flex items-center justify-between gap-2"
                            >
                                <p className="subtitle-2">{email}</p>
                                <Button
                                    onClick={() => onRemove(email)}
                                    className="share-remove-user"
                                >
                                    <Image
                                        src="/assets/icons/remove.svg"
                                        alt="Remove"
                                        width={24}
                                        height={24}
                                        className="remove-icon"
                                    />
                                </Button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}
