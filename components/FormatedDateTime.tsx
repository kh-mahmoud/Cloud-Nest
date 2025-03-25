import { cn, formatDateTime } from "@/lib/utils";


const FormatedDateTime = ({date,classes}:{date:string,classes?:string}) => {
  return (
    <p className={cn('body-1 text-light-200',classes)}>
        {formatDateTime(date)}
    </p>
  );
}

export default FormatedDateTime;
