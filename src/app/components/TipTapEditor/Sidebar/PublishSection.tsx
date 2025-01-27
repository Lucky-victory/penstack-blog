import { useCustomEditorContext } from "@/src/context/AppEditor";
import { SectionCard } from "../../Dashboard/SectionCard";
import { PublishActions } from "./components/PublishActions";
import { PublishMetadata } from "./components/PublishMetadata";
import { SaveStatus } from "./components/SaveStatus";
import { PublishSectionProps } from "./types";
import { useSidebarState } from "./hooks/useSidebarState";

export const PublishSection = ({
  isSaving,
  isPublishing,
  onDraft,
  onPublish,
  onDelete,
}: PublishSectionProps) => {
  const { activePost, editor } = useCustomEditorContext();
  const { editorMeta } = useSidebarState(editor);
  return (
    <SectionCard
      title="Publish"
      header={<SaveStatus isSaving={isSaving} />}
      footer={
        <PublishActions {...{ onDraft, onPublish, onDelete, isPublishing }} />
      }
    >
      <PublishMetadata activePost={activePost} editorMeta={editorMeta} />
    </SectionCard>
  );
};
