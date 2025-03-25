import Link from "next/link";
import { Models } from "node-appwrite";
import Thumbnail from "./Thumbnail";
import { convertFileSize } from "@/lib/utils";
import FormatedDateTime from "./FormatedDateTime";
import ActionDropDown from "./ActionDropDown";
import { getCurrentUser } from "@/lib/actions/user.action";



const Card = async ({ file }: { file: Models.Document }) => {

    const user = await getCurrentUser()

    return (
        <Link href={file.url} target="_blank" className="file-card">
            <div className="flex justify-between">
                <Thumbnail type={file.type} extension={file.extension} url={file.url} classes="!size-20" imageClasses="!size-11" />

                {file.owner.$id == user.$id && (
                    <div className="flex flex-col items-end justify-between">
                        <ActionDropDown file={file} />
                    </div>
                )}
            </div>

            <div className="file-card-details">
                <p className="subtitle-2 line-clamp-1">{file.name+"."+file.extension}</p>
                <FormatedDateTime date={file.$createdAt} />
                <div className="flex items-center justify-between w-full">
                    <p className="caption line-clamp-1 text-light-200">By : {file.owner.fullName}</p>
                    <p className="body-1">
                        {convertFileSize(file.size)}
                    </p>
                </div>
            </div>
        </Link>
    );
}

export default Card;
