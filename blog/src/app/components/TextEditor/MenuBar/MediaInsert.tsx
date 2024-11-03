import { FilterParams, MediaResponse } from "@/src/types";
import {
  Modal,
  ModalOverlay,
  ModalHeader,
  Heading,
  ModalCloseButton,
  ModalContent,
  ModalBody,
} from "@chakra-ui/react";
import Medias from "../../Dashboard/Medias";
import { type Editor } from "@tiptap/react";
import { FC, PropsWithChildren } from "react";

interface MediaInsertProps {
  editor: Editor;
  isOpen: boolean;
  onClose: () => void;
  maxSelection?: number;
  defaultFilters?: Partial<FilterParams>;
}

export const MediaInsert = ({
  editor,
  isOpen,
  onClose,
  maxSelection,
  defaultFilters = {},
}: MediaInsertProps) => {
  return (
    <>
      <MediaModal isOpen={isOpen} onClose={onClose}>
        <Medias
          maxSelection={maxSelection}
          defaultFilters={defaultFilters}
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
      </MediaModal>
    </>
  );
};
interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  maxSelection?: number;
  defaultFilters?: Partial<FilterParams>;
  onSelect?: (media: MediaResponse | MediaResponse[]) => void;
}
export const MediaModal: FC<PropsWithChildren<MediaModalProps>> = ({
  isOpen,
  onClose,
  maxSelection,
  children,
  defaultFilters = {},
  onSelect,
}) => {
  return (
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
          {children ? (
            children
          ) : (
            <>
              <Medias
                defaultFilters={defaultFilters}
                maxSelection={maxSelection}
                onSelect={(media: MediaResponse | MediaResponse[]) => {
                  onSelect?.(media);
                  onClose();
                }}
              />
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
