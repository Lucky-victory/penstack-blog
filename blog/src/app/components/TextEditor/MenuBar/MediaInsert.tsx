import { MediaResponse } from "@/src/types";
import {
  Modal,
  ModalOverlay,
  ModalHeader,
  Heading,
  ModalCloseButton,
  ModalContent,
  ModalBody,
  useDisclosure,
} from "@chakra-ui/react";
import { index } from "drizzle-orm/mysql-core";
import Medias from "../../Dashboard/Medias";
import { type Editor } from "@tiptap/react";

interface MediaInsertProps {
  editor: Editor;
  isOpen: boolean;
  onClose: () => void;
  maxSelection?: number;
}

export const MediaInsert = ({
  editor,
  isOpen,
  onClose,
  maxSelection,
}: MediaInsertProps) => {
  return (
    <>
      <Modal
        isOpen={isOpen}
        isCentered
        onClose={onClose}
        size={{ base: "md", md: "3xl", lg: "5xl", xl: "6xl" }}
        returnFocusOnClose={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading>Select Media</Heading>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody px={{ base: 0, md: undefined }}>
            <Medias
              maxSelection={maxSelection}
              onSelect={(media: MediaResponse | MediaResponse[]) => {
                if (Array.isArray(media)) {
                  media.forEach((media) => {
                    editor
                      .chain()
                      .focus()
                      .setImage({
                        src: media.url,
                        alt: media.name,
                        title: media.caption as string,
                      })
                      .run();
                  });
                } else {
                  editor
                    .chain()
                    .focus()
                    .setImage({
                      src: media.url,
                      alt: media.name,
                      title: media.caption as string,
                    })
                    .run();
                }
                onClose();
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
