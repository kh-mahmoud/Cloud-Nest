'use client'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { actionsDropdownItems } from "@/constants";
import { constructDownloadUrl } from "@/lib/utils";
import { ActionType } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Models } from "node-appwrite";
import { useState } from "react";
import { Button } from "./ui/button";
import { DeleteFile, RenameFile, UpdateFileUsers } from "@/lib/actions/file.action";
import { usePathname } from "next/navigation";
import { FileDetails, SharedInput } from "./ActionModal";
import { Input } from "./ui/input";

type ActionKey = "rename" | "delete" | "share";


const ActionDropDown = ({ file }: { file: Models.Document }) => {
  const [isModalOpen, setisModalOpen] = useState(false);
  const [isDropDownOpen, setisDropDownOpen] = useState(false);
  const [action, setAction] = useState<ActionType | null>(null);
  const [name, setName] = useState(file.name.split(".")[0])
  const [emails, setEmails] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const path = usePathname()


  const closeModals = () => {
    setisModalOpen(false);
    setisDropDownOpen(false);
    setName(file.name)
  }


  const handleActions = async () => {
    if (!action) return null

    setLoading(true)

    try {

      const actions = {
        rename: () => RenameFile({ fileId: file.$id, name, path: path }),
        share: () => UpdateFileUsers({ fileId: file.$id, emails, path: path }),
        delete: () => DeleteFile({ fileId: file.$id, bucketFileId: file.bucketField, path: path }),
      };

      const result = await actions[action.value as ActionKey]();


      if (result) closeModals()

      setLoading(false)
    } catch (error) {
      console.log(error)
    }

  }

  const handleShareRemove = async (email: string) => {
    const filteredEmails = emails.filter((item) => item !== email);

    const result = await UpdateFileUsers({ fileId: file.$id, emails: filteredEmails, path: path });

    if (result) setEmails(filteredEmails)
    closeModals()
  }


  //function return the dropdown dialogue content
  const RenderDailogue = () => {
    if (!action) return null
    return (
      <DialogContent className="shad-dialog  button">
        <DialogHeader className="flex max-w-[350px] flex-col w-full gap-3">
          <div>
            <DialogTitle className="text-center text-light-100">{action.label}</DialogTitle>

            {action.value === "rename" &&
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rename-input-field " />
            }
            {action.value === "details" && <FileDetails file={file} />}
            {action.value === "share" && <SharedInput file={file} onInputChange={setEmails} onRemove={handleShareRemove} />}
            {action.value === "delete" && (
              <p className="delete-confirmation overflow-hidden">
                Are you sure you want to delete{` `}
                <span className="delete-file-name">{file.name}</span>?
              </p>
            )}
          </div>
        </DialogHeader>

        {["delete", "rename", "share"].includes(action.value) && (
          <DialogFooter className="flex flex-col md:flex-row">
            <Button onClick={closeModals} className="modal-cancel-button">Cancel</Button>
            <Button onClick={handleActions} className="modal-submit-button">
              {loading ? (
                <Image src={'/assets/icons/loader.svg'} className="animate-spin" width={24} height={24} alt="loader" />
              ) : (
                <p>{action.label}</p>
              )
              }
            </Button>
          </DialogFooter>
        )
        }
      </DialogContent >
    );
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setisModalOpen}>
      <DropdownMenu open={isDropDownOpen} onOpenChange={setisDropDownOpen}>
        <DropdownMenuTrigger className="shad-no-focus">
          <Image
            src={'/assets/icons/dots.svg'}
            width={24}
            height={24}
            alt="dots"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="truncate max-w-[400px]">
            {file.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {actionsDropdownItems.map((item) => (
            <DropdownMenuItem
              className="cursor-pointer"
              key={item.value}
              onClick={() => {
                setAction(item);

                if (["delete", "rename", "details", "share"].includes(item.value)) {
                  setisModalOpen(true);
                }
              }}
            >
              {item?.value === "download" ? (
                <Link
                  href={constructDownloadUrl(file.bucketField).url}
                  className="flex items-center gap-2"
                  onClick={closeModals}
                >
                  <Image
                    width={30}
                    height={30}
                    alt={item.label}
                    src={item.icon}
                  />
                  {item.label}
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Image
                    width={30}
                    height={30}
                    alt={item.label}
                    src={item.icon}
                  />
                  <p className={`${item.value === "delete" ? "text-red" : ""}`}>
                    {item.label}
                  </p>
                </div>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {RenderDailogue()}
    </Dialog>
  );
};

export default ActionDropDown;