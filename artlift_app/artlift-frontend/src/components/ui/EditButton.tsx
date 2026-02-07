import { Button } from "@/components/ui/button";

type EditButtonProps = {
  onClick: () => void;
  isEditing: boolean;
};

export default function EditButton({ onClick, isEditing }: EditButtonProps) {
  return (
    <Button onClick={onClick} variant="secondary">
      {isEditing ? "Cancel" : "Edit"}
    </Button>
  );
}
