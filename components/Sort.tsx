'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { sortTypes } from "@/constants";
import { usePathname, useRouter } from "next/navigation";


const Sort = () => {
  const router= useRouter()
  const path = usePathname()


  const handleSort= (value:string)=>
  {
     router.push(`${path}?sort=${value}`)	
  }

  return (
    <div>
      <Select onValueChange={handleSort} defaultValue={sortTypes[0].value}>
        <SelectTrigger className="sort-select">
          <SelectValue placeholder={`${sortTypes[0].label}`} />
        </SelectTrigger>
        <SelectContent className="sort-select-content">
            {sortTypes.map((sort)=>(
               <SelectItem className="shad-select-item" key={sort.label} value={sort.value}>
                  {sort.label}
               </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default Sort;
