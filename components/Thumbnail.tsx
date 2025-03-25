import { cn, getFileIcon } from "@/lib/utils";
import Image from "next/image";



type ThumbnailProps = {
    type: string,
    extension: string,
    url: string,
    classes?: string,
    imageClasses?: string
}

const Thumbnail = ({ type, extension, url, classes, imageClasses }: ThumbnailProps) => {

    const isImage = type === "image" && extension !== "svg";

    return (
        <div>
            <figure className={cn("thumbnail", classes)}>
                <Image
                    src={isImage ? url : getFileIcon(extension, type)}
                    alt="thumbnail"
                    width={100}
                    height={100}
                    className={cn("size-8 object-contain",imageClasses,{"thumbnail-image":isImage})}
                />
            </figure>
        </div>
    );
}

export default Thumbnail;
