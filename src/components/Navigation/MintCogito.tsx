import {
  Button, Heading, IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay, Spacer, Textarea, useDisclosure, Wrap, WrapItem,
} from "@chakra-ui/react";
import {Trans} from "@lingui/macro";
import {useCurrentUser} from "../../hooks/useCurrentUser"
import {useRef, useState} from "react"
import {useNFTStorage} from "../../hooks/useNFTStorage";
import {AiFillFileAdd} from "react-icons/all";
import FIleItem from "./FIleItem";
import {Attachment} from "../../constants/interfaces";
import {PROCESSING} from "../../constants/status";
import parseIpfsCid from "../../utils/parseIpfsCid";
import checkMedia from "../../utils/checkMedia";

const MintCogito = () => {
  // mint Modal status
  const {isOpen, onOpen, onClose} = useDisclosure()

  const [text, setText] = useState("")
  const [files, setFiles] = useState([])

  // get user info
  const {user} = useCurrentUser()

  // content input ref
  const filesUpload = useRef(null)

  // upload nft storage hooks
  const storage = useNFTStorage()

  const initialFocusRef = useRef(null)

  // delete the attachment
  const handleDelete = (name: string) => {
    // @ts-ignore
    setFiles(files.filter(attachment => attachment.fileName !== name))
  }

  const handleUpdate = (fileName: string, newAttachment: Attachment) => {
    // @ts-ignore
    setFiles(files.map((attachment) => attachment.fileName === fileName ? newAttachment : attachment))
  }

  const handleReset = () => {
    setText("")
    setFiles([])
  }

  const getMetaData = () => {
    let metadata = {}

    if (user.loggedIn) {
      metadata = {...metadata, author: user.addr}
    }

    if (files.length > 0) {

      let attachment = {}

      // @ts-ignore
      const m = files.filter((file) => checkMedia(file.type))
      // @ts-ignore
      const f = files.filter((file) => !checkMedia(file.type))

      if (m.length > 0) {
        attachment = {...attachment, media: m}
      }

      if (f.length > 0) {
        attachment = {...attachment, files: f}
      }

      metadata = {
        ...metadata, attachment
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    metadata = {...metadata, create_at: Date.now()}

    if (text !== "") {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      metadata = {...metadata, text: text}
    }

    return metadata
  }

  return (
    <>
      <Button onClick={onOpen} fontWeight={"bold"}>
        <Trans>+ Cogito</Trans>
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered closeOnOverlayClick={false} scrollBehavior={"inside"}
             initialFocusRef={initialFocusRef}
             size={"lg"}>
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader>
            <Heading fontSize={"xl"}>
              <Trans>Cogito ergo sum</Trans>
            </Heading>
          </ModalHeader>
          <ModalCloseButton/>
          <ModalBody>
            <Textarea placeholder="What's happening?" resize={"none"} variant="filled" value={text}
                      onChange={(e) => setText(e.target.value)}/>
            <Wrap pt={2}>
              {files.map((attachment, index) => (
                <WrapItem key={index}>
                  <FIleItem attachment={attachment} onDelete={handleDelete} onUpdate={handleUpdate}/>
                </WrapItem>
              ))}
            </Wrap>

          </ModalBody>
          <ModalFooter>
            <input type={"file"} ref={filesUpload} style={{display: "none"}} onChange={(e) => {
              if (!e.target.files) {
                return
              }
              for (let i = 0; i < e.target.files.length; i++) {
                const f = e.target.files[i];
                // @ts-ignore
                setFiles([...files, {fileName: f.name, content: f as File, create_at: f.lastModified, size: f.size, type: f.type}]);
              }
            }}/>

            <IconButton aria-label={"files"} icon={<AiFillFileAdd/>} size={"md"} variant={"ghost"}
                        onClick={() => {
                          // @ts-ignore
                          filesUpload.current.click()
                        }}/>
            <Spacer/>
            <Button fontWeight={"bold"}
                    disabled={text === "" && files.length === 0}
                    isLoading={storage?.state === PROCESSING}
                    onClick={async () => {
                      console.log(JSON.stringify(getMetaData()))
                      await storage?.storeBlob(JSON.stringify(getMetaData())).then((cid)=>{
                        console.log(parseIpfsCid(cid))
                      })
                      handleReset()
                    }}>Mint</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default MintCogito