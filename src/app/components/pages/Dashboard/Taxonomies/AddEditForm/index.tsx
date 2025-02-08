import {
  Button,
  Input,
  Modal,
  Text,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useTaxonomiesStore } from "../state";
import { useState } from "react";

export const AddEditForm: React.FC = () => {
  const activeTab = useTaxonomiesStore((state) => state.type);
  const editItem = useTaxonomiesStore((state) => state.editItem);
  const setEditItem = useTaxonomiesStore((state) => state.setEditItem);
  const isItemModalOpen = useTaxonomiesStore((state) => state.isItemModalOpen);
  const setIsItemModalOpen = useTaxonomiesStore(
    (state) => state.setIsItemModalOpen
  );

  function handleSave(item: any) {
    console.log("Saving item:", item);
  }
  function dismissModal() {
    setIsItemModalOpen(false);
    setEditItem(null);
  }
  return (
    <Modal isOpen={isItemModalOpen} onClose={dismissModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {editItem ? "Edit" : "Add New"}{" "}
          {activeTab === "categories" ? "Category" : "Tag"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={4}>
            Enter the details below. The slug will be auto-generated.
          </Text>
          <Input placeholder="Name" defaultValue={editItem?.name || ""} />
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => handleSave({ name: "Example" })}>Save</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
